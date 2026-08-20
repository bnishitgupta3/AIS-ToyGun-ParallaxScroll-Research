import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useCart, PRODUCT_LOOKUP, CATALOG } from "@/lib/cart";
import NotifyMe from "@/components/showcase/NotifyMe";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

/* "Coming soon" + cart-review panel — slides in from the RIGHT on desktop
   (md+) and from the BOTTOM as a partial sheet on mobile (~70% of viewport).
   Mobile gets a sheet (not a full takeover) so the underlying page context
   stays visible behind a dim backdrop, dismissible by backdrop tap, close
   button, or ESC.

   Single global instance mounted in App. Opened from anywhere by calling
   useCart().openDrawer(product?).

   ─── SHOPIFY SWAP ──────────────────────────────────────────────────────────
   When Shopify is integrated:
     • The line-item list below stays — only the data source changes (read
       from the Shopify cart query instead of our local items map).
     • The qty +/- buttons currently hit useCartItem(key); swap those calls
       for cartLinesUpdate mutations on the Shopify cart.
     • "Notify me at launch" (the placeholder CTA) becomes "Checkout" and
       redirects to `cart.checkoutUrl`. */
export default function BuyNowSheet({ open, product, onClose }) {
    const { items, setQty, total, subtotal } = useCart();
    const hasItems = total > 0;
    // Build a render list of { key, name, qty } from the items map.
    const lines = Object.entries(items).map(([key, qty]) => ({
        key,
        qty,
        ...(PRODUCT_LOOKUP[key] || { name: key.replace(/^\//, ""), sub: "" }),
    }));
    // Cross-sell — every catalogue product NOT already in the cart. Standard
    // D2C mini-cart upsell (Away / Warby Parker / Allbirds): let the shopper
    // build their loadout without leaving the drawer, lifting AOV + conversion.
    const crossSell = CATALOG.filter((p) => !(items[p.key] > 0));
    // Lock body scroll while open; close on ESC. Adding "sheet-open" to body
    // lets global chrome (nav, section dots) hide itself via CSS.
    useEffect(() => {
        if (!open) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.body.classList.add("sheet-open");
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.classList.remove("sheet-open");
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    /* Keep the sheet mounted-but-hidden when fully closed. On Android the
       translate-off-screen alone left a white sliver/rectangle peeking at the
       bottom (dynamic-viewport quirk); once the slide-out finishes we also flag
       it `visibility: hidden` so it's guaranteed gone. */
    const [visible, setVisible] = useState(open);
    useEffect(() => {
        if (open) {
            setVisible(true);
            return;
        }
        const t = setTimeout(() => setVisible(false), 350); // after slide-out
        return () => clearTimeout(t);
    }, [open]);

    // Portal into <body> so `position: fixed` escapes any ancestor that creates
    // a containing block (e.g. SpecsPanel uses `transform: translateX(-24px)`
    // for its slide-in; any transformed ancestor traps fixed-positioned
    // descendants and made the sheet appear on initial load in the middle of
    // the SpecsPanel column instead of being off-screen to the right).
    if (typeof document === "undefined") return null;
    return createPortal(
        <div
            aria-hidden={!open}
            className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                }`}
            />

            {/* Panel — bottom sheet on mobile, right drawer on md+ */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Buy Now"
                className={`absolute left-0 right-0 bottom-0 max-h-[78vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out
                    md:left-auto md:right-0 md:top-0 md:bottom-0 md:h-full md:max-h-none md:w-[440px] md:rounded-l-3xl md:rounded-tr-none
                    ${!visible ? "invisible" : ""}
                    ${
                        open
                            ? "translate-y-0 md:translate-x-0"
                            : "translate-y-full md:translate-y-0 md:translate-x-full"
                    }`}
            >
                {/* Mobile grab handle */}
                <div className="flex justify-center pt-3 md:hidden">
                    <span className="h-1.5 w-12 rounded-full bg-zinc-300" />
                </div>

                {/* Close button */}
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>

                <div className="flex h-full flex-col px-7 pb-10 pt-10 md:px-10 md:pt-16">
                    <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.35em] text-[#DA0213]">
                        {hasItems ? "/// Your cart" : "/// Almost here"}
                    </span>

                    <h2 className="font-instrument mt-3 text-[clamp(28px,5.5vw,46px)] leading-[0.95] tracking-tight text-[#1a1a1a]">
                        {hasItems
                            ? total === 1
                                ? "1 blaster ready."
                                : `${total} blasters ready.`
                            : "Checkout is loading up."}
                    </h2>

                    <p className="mt-4 font-inter text-[14px] leading-relaxed text-[#1a1a1a]/65 sm:text-[15px]">
                        {hasItems
                            ? "We're plumbing in payments and dispatch right now. The moment checkout opens, you'll get a one-tap link to pay for everything in your cart."
                            : `We're plumbing in payments and dispatch right now. The ${
                                  product?.name || "blaster"
                              } will be one tap from your door very soon.`}
                    </p>

                    {/* ── Cart line items (when present). On Shopify swap, replace
                          this list with Shopify cart-line nodes and call
                          cartLinesUpdate instead of setQty. ── */}
                    {hasItems && (
                        <ul className="mt-7 divide-y divide-[#1a1a1a]/10 rounded-2xl border border-[#1a1a1a]/10">
                            {lines.map((line) => (
                                <li
                                    key={line.key}
                                    className="flex items-center justify-between gap-3 px-4 py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        {/* Name links to the product's experience
                                            page; closing the drawer as we go so it
                                            doesn't linger over the new route. */}
                                        {line.contents ? (
                                            /* Bundle: the pack has no page of its own, so the
                                               name is plain text and each blaster inside links
                                               through to that gun's product (experience) page. */
                                            <>
                                                <div className="truncate font-instrument text-[17px] leading-tight text-[#1a1a1a]">
                                                    {line.name}
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-inter text-[10px] font-semibold uppercase tracking-[0.16em]">
                                                    {line.contents.map((c, i) => (
                                                        <span key={c.link} className="inline-flex items-center gap-1">
                                                            {i > 0 && <span className="text-[#1a1a1a]/25">·</span>}
                                                            <span className="tabular-nums text-[#1a1a1a]/45">{c.qty}×</span>
                                                            <Link
                                                                to={c.link}
                                                                onClick={onClose}
                                                                className="text-[#DA0213] underline-offset-2 transition hover:underline"
                                                            >
                                                                {c.name}
                                                            </Link>
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to={line.key}
                                                    onClick={onClose}
                                                    className="block truncate font-instrument text-[17px] leading-tight text-[#1a1a1a] underline-offset-2 transition hover:underline"
                                                >
                                                    {line.name}
                                                </Link>
                                                {line.sub && (
                                                    <div className="font-inter text-[10px] font-medium uppercase tracking-[0.2em] text-[#1a1a1a]/45">
                                                        {line.sub}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {line.price != null && (
                                            <div className="mt-1 font-inter text-[13px] font-bold tabular-nums text-[#DA0213]">
                                                {inr(line.price * line.qty)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="inline-flex items-center gap-0.5 rounded-full bg-[#1a1a1a]/[0.06] pl-0.5 pr-0.5">
                                        <button
                                            type="button"
                                            aria-label={`Remove one ${line.name}`}
                                            onClick={() => setQty(line.key, line.qty - 1)}
                                            className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none text-[#1a1a1a]/70 transition hover:bg-[#1a1a1a]/10 hover:text-[#1a1a1a]"
                                        >
                                            −
                                        </button>
                                        <span className="min-w-[1.5ch] text-center font-inter text-[13px] font-bold tabular-nums text-[#1a1a1a]">
                                            {line.qty}
                                        </span>
                                        <button
                                            type="button"
                                            aria-label={`Add one ${line.name}`}
                                            onClick={() => setQty(line.key, line.qty + 1)}
                                            className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none text-[#1a1a1a]/70 transition hover:bg-[#1a1a1a]/10 hover:text-[#1a1a1a]"
                                        >
                                            +
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Subtotal — real blaster count + price sum. */}
                    {hasItems && (
                        <div className="mt-5 border-t border-[#1a1a1a]/10 pt-4">
                            <div className="flex items-baseline justify-between">
                                <div className="font-inter text-[13px] font-semibold text-[#1a1a1a]/70">
                                    Subtotal
                                    <span className="ml-1.5 text-[#1a1a1a]/40">
                                        · {total} blaster{total === 1 ? "" : "s"}
                                    </span>
                                </div>
                                <div className="font-inter text-[22px] font-extrabold tabular-nums text-[#DA0213]">
                                    {inr(subtotal)}
                                </div>
                            </div>
                            <p className="mt-1.5 font-inter text-[11px] text-[#1a1a1a]/40">
                                Inclusive of all taxes. Shipping shown at checkout.
                            </p>
                        </div>
                    )}

                    {/* ── Anticipation flourish (only when cart is empty —
                          when there ARE items the focus belongs on the list) ── */}
                    {!hasItems && (
                        <>
                            <div className="mt-8 w-full max-w-[260px]">
                                <div className="mb-2 flex items-center justify-between font-nokia text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/45">
                                    <span>Pressure building</span>
                                    <span>2026</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a1a]/10">
                                    <div className="buy-now-charge h-full rounded-full bg-[#DA0213]" />
                                </div>
                            </div>

                            <ul className="mt-9 space-y-3 font-inter text-[14px] text-[#1a1a1a]/75">
                                <li className="flex items-start gap-2.5">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DA0213]" />
                                    Early-access pricing for everyone on the list
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DA0213]" />
                                    Free shipping across India on launch week
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DA0213]" />
                                    First refills bundled, while stocks last
                                </li>
                            </ul>
                        </>
                    )}

                    {/* ── Cross-sell / "you might also like" quick-add ──
                          Add the OTHER blasters straight from the cart. A
                          launched product gets a one-tap "+ Add"; the pre-launch
                          one shows a "Soon" tag (no buy path yet). Mirrors the
                          Arsenal tiles so the flow feels consistent. */}
                    {crossSell.length > 0 && (
                        <div className="mt-8">
                            <div className="font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1a1a1a]/50">
                                {hasItems ? "Complete your loadout" : "You might also like"}
                            </div>
                            <ul className="mt-3 space-y-2.5">
                                {crossSell.map((p) => (
                                    <li
                                        key={p.key}
                                        className="flex items-center gap-3 rounded-2xl border border-[#1a1a1a]/10 p-2.5"
                                    >
                                        <span
                                            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                                            style={{ background: `${p.accent}14` }}
                                            aria-hidden="true"
                                        >
                                            <span
                                                className="h-2.5 w-6 rounded-full"
                                                style={{ background: p.accent }}
                                            />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                to={p.key}
                                                onClick={onClose}
                                                className="block truncate font-instrument text-[16px] leading-tight text-[#1a1a1a] underline-offset-2 transition hover:underline"
                                            >
                                                {p.name}
                                            </Link>
                                            <div className="font-inter text-[10px] font-medium uppercase tracking-[0.2em] text-[#1a1a1a]/45">
                                                {p.sub}
                                            </div>
                                        </div>
                                        {p.comingSoon ? (
                                            <span
                                                className="shrink-0 rounded-full px-3 py-1.5 font-inter text-[10px] font-bold uppercase tracking-[0.18em]"
                                                style={{ background: `${p.accent}1a`, color: p.accent }}
                                            >
                                                Soon
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                aria-label={`Add ${p.name} to cart`}
                                                onClick={() => setQty(p.key, 1)}
                                                className="inline-flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 font-inter text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:brightness-95"
                                                style={{ background: `${p.accent}14`, color: p.accent }}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                                                    <path d="M12 5v14M5 12h14" />
                                                </svg>
                                                Add
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-auto pt-10">
                        {/* Inline email capture — collects the launch/checkout
                            waitlist straight into Formspree (no redirect to the
                            coming-soon page). SHOPIFY SWAP: once checkout ships,
                            swap this for a "Checkout" button that sends
                            window.location to `cart.checkoutUrl` when hasItems. */}
                        <NotifyMe
                            productName={product?.name || (hasItems ? "checkout" : "launch")}
                            source={hasItems ? "checkout-launch" : "buy-now-launch"}
                            accent="#DA0213"
                        />
                        <p className="mt-3 text-center font-inter text-[11px] uppercase tracking-[0.22em] text-[#1a1a1a]/40">
                            Powered by SONIQ · India · 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
