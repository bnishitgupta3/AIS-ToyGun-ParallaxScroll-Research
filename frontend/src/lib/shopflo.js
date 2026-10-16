/* ── Shopflo headless checkout handoff (redirect model) ──
   Shopflo does NOT auto-intercept our checkout: our Storefront API checkoutUrl
   goes to Shopify's OWN native checkout (verified 2026-10-16 - it renders the
   native Shopify checkout, not Shopflo). To use Shopflo from our headless cart
   we POST the cart to our serverless endpoint (checkout/worker.mjs), which
   rebuilds the TRUSTED cart (checkout/checkout-core.mjs) and asks Shopflo's
   Checkout API for a hosted checkout URL; then we redirect to it.

   Config: REACT_APP_SHOPFLO_CHECKOUT_ENDPOINT = our deployed Worker URL.
   The secret Shopflo API key + Merchant ID live ONLY on the Worker, never here.
   Until the endpoint is set (and Shopflo has enabled headless + we've put the
   secrets on the Worker), this throws a friendly, catchable Error so the cart
   shows the message. Switch on with REACT_APP_CHECKOUT_PROVIDER=shopflo. */

import { PRODUCT_LOOKUP } from "@/lib/cart";

const CHECKOUT_ENDPOINT = process.env.REACT_APP_SHOPFLO_CHECKOUT_ENDPOINT || "";

// "/product/mp5k" -> "mp5k" (checkout-core's PRODUCTS keys are bare).
const strip = (key) => String(key).replace(/^\/product\//, "").replace(/^\//, "");

/* Site cart ({ "/product/mp5k": qty, "/bundle/custom-X": qty }) -> the trusted
   cart shape checkout-core.buildCart expects: { lines: [{product,qty}|{bundle}] }.
   Only STRUCTURE is sent; the Worker owns prices + the Build-Your-Squad discount
   so the browser can never tamper with either. */
function toTrustedCart(items) {
    const lines = [];
    for (const [key, qty] of Object.entries(items || {})) {
        if (qty <= 0) continue;
        const info = PRODUCT_LOOKUP[key];
        if (info && info.bundle && Array.isArray(info.contents)) {
            lines.push({
                bundle: info.contents.map((c) => ({ product: strip(c.link), qty: c.qty * qty })),
            });
        } else {
            lines.push({ product: strip(key), qty });
        }
    }
    if (!lines.length) throw new Error("Your cart has no items ready for checkout yet.");
    return { lines };
}

/* Start a Shopflo checkout for the site cart `items`.
   Returns { redirectUrl } for the caller to navigate to. */
export async function startShopfloCheckout(items) {
    if (!CHECKOUT_ENDPOINT) {
        throw new Error("Shopflo checkout isn't switched on yet. Please try again shortly.");
    }
    const cart = toTrustedCart(items);

    let res;
    try {
        res = await fetch(CHECKOUT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cart),
        });
    } catch (e) {
        throw new Error("Could not reach checkout. Please try again.");
    }
    if (!res.ok) {
        throw new Error("Could not start Shopflo checkout. Please try again.");
    }
    const data = await res.json();
    const url = data && (data.checkoutUrl || data.checkout_url);
    if (!url) {
        throw new Error("Could not start Shopflo checkout. Please try again.");
    }
    return { redirectUrl: url };
}
