/* ── Checkout provider switch ──
   One seam, two backends. REACT_APP_CHECKOUT_PROVIDER selects:
     • "shopflo" (default) — headless handoff to Shopflo's one-click checkout.
     • "shopify"           — legacy Storefront API cart -> Shopify hosted checkout.
   Shopflo is now the default so the Cloudflare preview uses it without build-time
   env. The cart UI never changes. This is separate from REACT_APP_CHECKOUT_LIVE
   (which HIDES checkout entirely on prod until go-live) — so even though prod
   also defaults to shopflo, prod shows the waitlist, not this checkout, until
   that gate is lifted. */

import { createShopifyCart } from "@/lib/shopify";
import { startShopfloCheckout } from "@/lib/shopflo";

export const CHECKOUT_PROVIDER =
    (process.env.REACT_APP_CHECKOUT_PROVIDER || "shopflo").toLowerCase();

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
