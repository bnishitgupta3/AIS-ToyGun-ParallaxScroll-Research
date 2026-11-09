/* ── Shopflo headless checkout handoff (Token API + redirect) ──
   Flow (validated against Shopflo's V2 Token API, 2026-10-23):
     1. get/reuse an sf_session_id (UUID, valid ~30 min) for attribution
     2. POST the cart STRUCTURE + session id to our serverless endpoint
        (AWS Lambda checkout/lambda.mjs), which holds the SECRET api key and calls
        Shopflo's Token API to mint a checkout_url
     3. redirect the browser to that checkout_url (Shopflo hosted checkout)
   After payment Shopflo returns to /thank-you?order_id=..&checkout_id=..; on
   exit/back it returns to our home. No secret ever touches the browser.

   Config: REACT_APP_SHOPFLO_CHECKOUT_ENDPOINT = the deployed checkout endpoint
   URL (an AWS Lambda Function URL).
   Switch on with REACT_APP_CHECKOUT_PROVIDER=shopflo. Until the endpoint is set,
   this throws a friendly, catchable Error so the cart shows the message. */

import { PRODUCT_LOOKUP } from "@/lib/cart";

// Checkout endpoint resolver. The checkout API runs on AWS Lambda Function URLs,
// one per environment; resolved at call time so it reads the live host.
// Precedence:
//   1. REACT_APP_SHOPFLO_CHECKOUT_ENDPOINT build env  — prod deploy sets this.
//   2. Cloudflare preview (*.workers.dev) + local dev  — the preview Lambda (us-east-1).
//   3. Everything else (prod upyourplay.in)            — the prod Lambda (ap-south-1).
const PREVIEW_LAMBDA = "https://doefelwugi3ikb34itzoknxdhq0qfllb.lambda-url.us-east-1.on.aws/";
const PROD_LAMBDA = "https://ga3cr7rkculakq5w2tilfminyq0zrwlj.lambda-url.ap-south-1.on.aws/";

function resolveCheckoutEndpoint() {
    if (process.env.REACT_APP_SHOPFLO_CHECKOUT_ENDPOINT) {
        return process.env.REACT_APP_SHOPFLO_CHECKOUT_ENDPOINT;
    }
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    if (host.endsWith(".workers.dev") || host === "localhost" || host === "127.0.0.1") {
        return PREVIEW_LAMBDA;
    }
    return PROD_LAMBDA;
}

const SESSION_KEY = "uyp_sf_session";
const SESSION_TTL_MS = 30 * 60 * 1000; // Shopflo session id is valid ~30 min

function uuid() {
    try {
        if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    } catch {
        /* fall through to manual */
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// One session id per ~30 min window, reused across checkout attempts so Shopflo
// can aggregate the funnel.
function getSessionId() {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (raw) {
            const s = JSON.parse(raw);
            if (s && s.id && s.at && Date.now() - s.at < SESSION_TTL_MS) return s.id;
        }
    } catch {
        /* storage blocked (private mode) — fall through */
    }
    const id = uuid();
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, at: Date.now() }));
    } catch {
        /* ignore */
    }
    return id;
}

// "/product/mp5k" -> "mp5k" (the Worker/checkout-core keys are bare).
const strip = (key) => String(key).replace(/^\/product\//, "").replace(/^\//, "");

/* Site cart ({ "/product/mp5k": qty, "/bundle/custom-X": qty }) -> the trusted
   lines the Worker expects ([{product,qty} | {bundle:[{product,qty}]}]). Only
   STRUCTURE is sent; the Worker owns prices + the discount. */
function toTrustedCart(items) {
    // Collapse the cart to total units per product (expanding any bundle contents).
    const units = {};
    for (const [key, qty] of Object.entries(items || {})) {
        if (qty <= 0) continue;
        const info = PRODUCT_LOOKUP[key];
        if (info && info.bundle && Array.isArray(info.contents)) {
            for (const c of info.contents) {
                const p = strip(c.link);
                units[p] = (units[p] || 0) + c.qty * qty;
            }
        } else {
            const p = strip(key);
            units[p] = (units[p] || 0) + qty;
        }
    }
    const entries = Object.entries(units).filter(([, q]) => q > 0);
    if (!entries.length) throw new Error("Your cart has no items ready for checkout yet.");
    // 2+ blasters qualify for a squad tier — send them as ONE bundle so the Worker
    // prices the whole order with the matching SQUAD code. A lone blaster goes
    // through as a plain line (no discount).
    const totalUnits = entries.reduce((s, [, q]) => s + q, 0);
    if (totalUnits >= 2) {
        return [{ bundle: entries.map(([product, qty]) => ({ product, qty })) }];
    }
    return entries.map(([product, qty]) => ({ product, qty }));
}

/* Start a Shopflo checkout for the site cart `items`.
   Returns { redirectUrl } for the caller to navigate to. */
export async function startShopfloCheckout(items) {
    const endpoint = resolveCheckoutEndpoint();
    if (!endpoint) {
        throw new Error("Shopflo checkout isn't switched on yet. Please try again shortly.");
    }
    const lines = toTrustedCart(items);
    const sf_session_id = getSessionId();

    let res;
    try {
        res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sf_session_id, lines }),
        });
    } catch (e) {
        throw new Error("Could not reach checkout. Please try again.");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data || !data.checkoutUrl) {
        throw new Error((data && data.error) || "Could not start Shopflo checkout. Please try again.");
    }
    return { redirectUrl: data.checkoutUrl };
}
