/* ── Shopflo headless checkout handoff ──
   IMPORTANT: Shopflo does NOT automatically take over our checkout. Our cart
   uses the Storefront API, whose `checkoutUrl` points at Shopify's OWN native
   checkout (verified 2026-10-16: it 302s to /checkouts/cn/... on the shop
   domain). Shopflo only intercepts the *theme* checkout button via an injected
   script-tag — and a headless storefront has no theme. So to route a headless
   cart through Shopflo we must drive Shopflo's SDK ourselves.

   Flow (per Shopflo's "Token API" + "Custom Shopify" docs):
     1. Shopflo enables THIS store for a custom/headless storefront and gives us:
          - the SDK script URL              -> REACT_APP_SHOPFLO_SDK_URL
          - the Merchant ID (merchant_key)  -> REACT_APP_SHOPFLO_MERCHANT_KEY
          - a secret API key                -> stays ONLY on our serverless
     2. Load the SDK script -> window.Shopflo
     3. sid = window.Shopflo.getSessionId()
     4. Exchange sid (+ the Shopify cart) for a Shopflo checkout URL via the
        Token API (POST https://api.shopflo.com/public/api/v2/tokens). That call
        needs the SECRET api key, so it MUST go through our own serverless proxy
        (REACT_APP_SHOPFLO_TOKEN_ENDPOINT) — never the browser.
     5. window.Shopflo.openFloCheckout(checkoutUrl)  (overlay), else redirect.

   The exact token payload (how line items + discounts are passed) comes from
   Shopflo's Postman collection "[V2-NEW] Shopflo Checkout Integration with
   Shopify" — adjust the fetch body below to match once we have it.

   Until Shopflo enables headless AND the token endpoint is deployed, this throws
   a clear, catchable Error so the cart shows a friendly message instead of a
   broken redirect. Switch provider on with REACT_APP_CHECKOUT_PROVIDER=shopflo. */

import { createShopifyCart } from "@/lib/shopify";

const SDK_URL = process.env.REACT_APP_SHOPFLO_SDK_URL || "";
const MERCHANT_KEY = process.env.REACT_APP_SHOPFLO_MERCHANT_KEY || "";
const TOKEN_ENDPOINT = process.env.REACT_APP_SHOPFLO_TOKEN_ENDPOINT || "";

let sdkPromise = null;

/* Inject the Shopflo SDK <script> once; resolve with window.Shopflo. */
function loadSdk() {
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
        if (typeof window !== "undefined" && window.Shopflo) {
            resolve(window.Shopflo);
            return;
        }
        if (!SDK_URL) {
            reject(new Error("Shopflo SDK URL is not set."));
            return;
        }
        const s = document.createElement("script");
        s.src = SDK_URL;
        s.async = true;
        if (MERCHANT_KEY) s.setAttribute("data-shopflo-merchant-key", MERCHANT_KEY);
        s.onload = () => resolve(window.Shopflo);
        s.onerror = () => reject(new Error("Could not load the Shopflo checkout."));
        document.head.appendChild(s);
    });
    return sdkPromise;
}

/* Start a Shopflo checkout for the site cart `items`.
   Returns { handled: true } once Shopflo's overlay is open, or { redirectUrl }
   if the SDK isn't present and we fall back to a plain redirect. */
export async function startShopfloCheckout(items) {
    if (!SDK_URL || !TOKEN_ENDPOINT) {
        throw new Error("Shopflo checkout isn't switched on yet. Please try again shortly.");
    }

    // Build the Shopify cart first (applies our bundle discount code + validates
    // stock); Shopflo reads this cart by id to carry the line items + discount.
    const cart = await createShopifyCart(items);

    const sdk = await loadSdk();
    const sessionId = sdk && sdk.getSessionId ? sdk.getSessionId() : undefined;

    // Secret-key Token API exchange, proxied by our serverless endpoint.
    const res = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, cartId: cart.id, merchantKey: MERCHANT_KEY }),
    });
    if (!res.ok) {
        throw new Error("Could not start Shopflo checkout. Please try again.");
    }
    const data = await res.json();
    const checkoutUrl = data && (data.checkoutUrl || data.checkout_url);
    if (!checkoutUrl) {
        throw new Error("Could not start Shopflo checkout. Please try again.");
    }

    if (sdk && sdk.openFloCheckout) {
        sdk.openFloCheckout(checkoutUrl);
        return { handled: true };
    }
    return { redirectUrl: checkoutUrl };
}
