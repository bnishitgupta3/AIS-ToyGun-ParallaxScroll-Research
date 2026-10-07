/* ── Shopify checkout (v1: Storefront API cart -> hosted checkout, NO backend) ──
   The React cart hands its line items to Shopify's Storefront Cart API, we
   apply the Build-Your-Squad tier discount code, and redirect to the
   Shopify-hosted checkout (`cart.checkoutUrl`) where Razorpay + COD live.

   The Storefront access token is PUBLIC by design (Shopify ships it to run in
   the browser), so it is safe to embed here. Prices and discount eligibility
   are enforced server-side by Shopify, so the browser can't tamper with either
   — the client only chooses which pre-created code to try; Shopify validates
   the minimum-quantity gate before honouring it.

   Phase 2 (Shopflo) will replace `createCheckout` with a call to our serverless
   endpoint instead; the cart UI and useCart surface don't change. */

import { PRODUCT_LOOKUP } from "@/lib/cart";

const DOMAIN = process.env.REACT_APP_SHOPIFY_DOMAIN || "ad0eqh-ma.myshopify.com";
const TOKEN =
    process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN || "39a624fbcdf5344b64a8273d89c4b8c6";
const API_VERSION = process.env.REACT_APP_SHOPIFY_API_VERSION || "2026-01";
const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

/* Cart key -> Shopify variant GID (live store ad0eqh-ma). Keep in sync with the
   products in Shopify; crimson is coming-soon and intentionally omitted. */
const VARIANT_BY_KEY = {
    "/product/mp5k": "gid://shopify/ProductVariant/60140951798046",
    "/product/m416": "gid://shopify/ProductVariant/60140951830814",
};

/* Build-Your-Squad tiers -> the discount CODE created in Shopify admin. Highest
   tier the bundle earns wins; Shopify enforces the real min-quantity gate. */
const TIER_CODES = [
    { units: 6, code: "SQUAD16" },
    { units: 4, code: "SQUAD13" },
    { units: 2, code: "SQUAD10" },
];

async function storefront(query, variables) {
    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) {
        throw new Error("Checkout service error (" + res.status + "). Please try again.");
    }
    const json = await res.json();
    if (json.errors && json.errors.length) {
        throw new Error(json.errors[0].message || "Checkout service error.");
    }
    return json.data;
}

const CART_CREATE = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

/* Turn the site cart ({ "/product/mp5k": qty, "/bundle/custom-X": qty }) into
   Storefront line items (merged by variant) plus the bundle discount code. */
function buildCartInput(items) {
    const qtyByVariant = {};
    let bundleUnits = 0;

    const add = (key, qty) => {
        const variantId = VARIANT_BY_KEY[key];
        if (!variantId || qty <= 0) return;
        qtyByVariant[variantId] = (qtyByVariant[variantId] || 0) + qty;
    };

    for (const [key, qty] of Object.entries(items || {})) {
        if (qty <= 0) continue;
        const info = PRODUCT_LOOKUP[key];
        if (info && info.bundle && Array.isArray(info.contents)) {
            for (const c of info.contents) {
                add(c.link, c.qty * qty);
                bundleUnits += c.qty * qty;
            }
        } else {
            add(key, qty);
        }
    }

    const lines = Object.entries(qtyByVariant).map(([merchandiseId, quantity]) => ({
        merchandiseId,
        quantity,
    }));
    if (!lines.length) {
        throw new Error("Your cart has no items ready for checkout yet.");
    }

    const tier = TIER_CODES.find((t) => bundleUnits >= t.units);
    const discountCodes = tier ? [tier.code] : [];

    return { lines, discountCodes };
}

/* Create a Shopify cart from the site cart and resolve the hosted checkout URL.
   Throws a human-readable Error on failure (shown in the cart sheet). */
export async function createCheckout(items) {
    const input = buildCartInput(items);
    const data = await storefront(CART_CREATE, { input });
    const result = data && data.cartCreate;
    if (result && result.userErrors && result.userErrors.length) {
        throw new Error(result.userErrors[0].message || "Could not start checkout.");
    }
    const url = result && result.cart && result.cart.checkoutUrl;
    if (!url) {
        throw new Error("Could not start checkout. Please try again.");
    }
    return url;
}
