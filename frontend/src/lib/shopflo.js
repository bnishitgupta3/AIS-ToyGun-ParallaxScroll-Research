/* ── Shopflo headless checkout handoff (Token API + redirect) ──
   Flow (validated against Shopflo's V2 Token API, 2026-10-23):
     1. get/reuse an sf_session_id (UUID, valid ~30 min) for attribution
     2. POST the cart STRUCTURE + session id to our serverless Worker
        (checkout/worker.mjs), which holds the SECRET api key and calls Shopflo's
        Token API to mint a checkout_url
     3. redirect the browser to that checkout_url (Shopflo hosted checkout)
   After payment Shopflo returns to /thank-you?order_id=..&checkout_id=..; on
   exit/back it returns to our home. No secret ever touches the browser.

   Config: REACT_APP_SHOPFLO_CHECKOUT_ENDPOINT = the deployed Worker URL.
   Switch on with REACT_APP_CHECKOUT_PROVIDER=shopflo. Until the endpoint is set,
   this throws a friendly, catchable Error so the cart shows the message. */

import { PRODUCT_LOOKUP } from "@/lib/cart";

// Falls back to the deployed Cloudflare Worker so the Cloudflare preview uses
// Shopflo with no build-time env. At prod go-live, override this via env to the
// AWS Lambda endpoint. Prod never hits this fallback while REACT_APP_CHECKOUT_LIVE
// keeps checkout gated.
const CHECKOUT_ENDPOINT =
    process.env.REACT_APP_SHOPFLO_CHECKOUT_ENDPOINT ||
    "https://upyourplay-checkout.nishitguptaai.workers.dev";

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
    const lines = [];
    for (const [key, qty] of Object.entries(items || {})) {
        if (qty <= 0) continue;
        const info = PRODUCT_LOOKUP[key];
        if (info && info.bundle && Array.isArray(info.contents)) {
            lines.push({ bundle: info.contents.map((c) => ({ product: strip(c.link), qty: c.qty * qty })) });
        } else {
            lines.push({ product: strip(key), qty });
        }
    }
    if (!lines.length) throw new Error("Your cart has no items ready for checkout yet.");
    return lines;
}

/* Start a Shopflo checkout for the site cart `items`.
   Returns { redirectUrl } for the caller to navigate to. */
export async function startShopfloCheckout(items) {
    if (!CHECKOUT_ENDPOINT) {
        throw new Error("Shopflo checkout isn't switched on yet. Please try again shortly.");
    }
    const lines = toTrustedCart(items);
    const sf_session_id = getSessionId();

    let res;
    try {
        res = await fetch(CHECKOUT_ENDPOINT, {
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

/* Fetch a NON-PII order summary (name UYP1xxx + items + totals) from our Worker,
   for the /thank-you page. The URL only carries Shopify's numeric order id; this
   resolves the friendly name and line items. Returns null if unavailable so the
   page degrades gracefully (e.g. before the Admin token is set on the Worker). */
export async function fetchOrderSummary(orderId) {
    if (!orderId || !CHECKOUT_ENDPOINT) return null;
    try {
        const res = await fetch(
            CHECKOUT_ENDPOINT.replace(/\/+$/, "") + "/order?id=" + encodeURIComponent(orderId),
        );
        if (!res.ok) return null;
        const data = await res.json().catch(() => null);
        if (!data || data.error || !data.name) return null;
        return data;
    } catch {
        return null;
    }
}
