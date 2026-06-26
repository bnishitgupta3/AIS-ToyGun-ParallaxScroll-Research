import { useCart, useCartItem } from "@/lib/cart";

/* Product-page CTA cluster: Buy Now (primary) + Add to Cart (secondary).
   First Add click turns the button into a − N + stepper at the same
   dimensions so the layout doesn't shift. Buy Now opens the single global
   "checkout coming soon" sheet (mounted in App.js) via the cart context.

   `accent` themes the buttons per product. `variant` switches between the
   light variant used in the SpecsPanel and the dark variant used in the
   Footer CTA section.

   ─── SHOPIFY SWAP ──────────────────────────────────────────────────────────
   The component already reads/writes through useCart hooks. To wire Shopify:
     • The Add to Cart counter calls set()/inc()/dec() — point those at
       cartLinesAdd / cartLinesUpdate.
     • Buy Now calls openDrawer(product) to show the review sheet. To skip
       the sheet and go straight to Shopify-hosted checkout, replace the
       onClick with a window.location.href to cart.checkoutUrl. */
export default function ProductActions({
    product,
    accent = "#f97316",
    variant = "light",
}) {
    const { openDrawer } = useCart();
    // Cart key = product link; required for the global cart to track this item.
    const { qty, inc, dec, set } = useCartItem(product?.link || product?.currentLink || "");

    const isDark = variant === "dark";
    const baseInk = isDark ? "#ffffff" : "#1a1a1a";

    return (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
            {/* Buy Now — primary, filled in accent color */}
            <button
                type="button"
                onClick={() => openDrawer(product)}
                className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-inter text-[13px] font-semibold uppercase tracking-[0.2em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)] transition-all hover:brightness-110"
                style={{ background: accent }}
            >
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-white/40 to-transparent transition-transform duration-200 group-hover:scale-x-105"
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="relative">
                    <path d="M13 2L4.5 13h6L11 22l8.5-11h-6L13 2z" />
                </svg>
                <span className="relative">Buy Now</span>
            </button>

            {/* Add to Cart — secondary. Outline at qty=0; same-size accent
                stepper once qty>0 so the cluster never reflows. */}
            {qty === 0 ? (
                <button
                    type="button"
                    onClick={() => set(1)}
                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-7 py-3.5 font-inter text-[13px] font-semibold uppercase tracking-[0.2em] transition-all"
                    style={{
                        borderColor: `${baseInk}40`,
                        color: baseInk,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = baseInk;
                        e.currentTarget.style.color = isDark ? "#1a1a1a" : "#ffffff";
                        e.currentTarget.style.borderColor = baseInk;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = baseInk;
                        e.currentTarget.style.borderColor = `${baseInk}40`;
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
                        <path d="M2 3h2.5l2.2 12.2a1.5 1.5 0 0 0 1.5 1.3h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
                    </svg>
                    <span>Add to Cart</span>
                </button>
            ) : (
                <div
                    className="flex flex-1 items-center justify-between rounded-full pl-1.5 pr-1.5 text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)]"
                    style={{ background: accent }}
                >
                    <button
                        type="button"
                        aria-label="Remove one from cart"
                        onClick={dec}
                        className="grid h-10 w-10 place-items-center rounded-full text-2xl leading-none transition hover:bg-white/20"
                    >
                        −
                    </button>
                    <span className="flex-1 text-center font-inter text-[16px] font-bold tabular-nums">
                        {qty}
                    </span>
                    <button
                        type="button"
                        aria-label="Add one to cart"
                        onClick={inc}
                        className="grid h-10 w-10 place-items-center rounded-full text-2xl leading-none transition hover:bg-white/20"
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    );
}
