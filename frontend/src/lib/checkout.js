/* ── Checkout provider switch ──
   One seam, two backends. REACT_APP_CHECKOUT_PROVIDER selects:
     • "shopify" (default) — Storefront API cart -> Shopify's hosted checkout.
     • "shopflo"           — headless handoff to Shopflo's one-click checkout.
   The cart UI never changes; flipping provider is a single env var. This is
   separate from REACT_APP_CHECKOUT_LIVE (which hides checkout entirely on prod
   until go-live) — provider only matters once checkout is live. */

import { createShopifyCart } from "@/lib/shopify";
import { startShopfloCheckout } from "@/lib/shopflo";

export const CHECKOUT_PROVIDER =
    (process.env.REACT_APP_CHECKOUT_PROVIDER || "shopify").toLowerCase();

/* Start checkout for the current cart `items`.
   Returns either:
     { redirectUrl }   -> caller navigates the browser there (hosted checkout), or
     { handled: true } -> the provider already opened checkout (e.g. Shopflo overlay).
   Throws a human-readable Error on failure (shown in the cart sheet). */
export async function startCheckout(items) {
    if (CHECKOUT_PROVIDER === "shopflo") {
        return startShopfloCheckout(items);
    }
    const { checkoutUrl } = await createShopifyCart(items);
    return { redirectUrl: checkoutUrl };
}
