import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

/* "Coming soon" panel — slides in from the RIGHT on desktop (md+) and from
   the BOTTOM as a partial sheet on mobile (~70% of viewport). Mobile gets a
   sheet (not a full takeover) so the underlying page context stays visible
   behind a dim backdrop, and the panel is dismissible by tapping the
   backdrop, the close button, or pressing ESC.

   Used by the Arsenal "Buy Now" button and the product-page Buy Now CTAs
   until Shopify checkout is wired up. */
export default function BuyNowSheet({ open, product, onClose }) {
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
                    <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f97316]">
                        /// Almost here
                    </span>

                    <h2 className="font-instrument mt-3 text-[clamp(34px,6vw,52px)] leading-[0.95] tracking-tight text-[#1a1a1a]">
                        Checkout is loading up.
                    </h2>

                    <p className="mt-5 font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 sm:text-[16px]">
                        We're plumbing in payments and dispatch right now. The {product?.name || "blaster"} will be one tap from your door very soon.
                    </p>

                    {/* Visual flourish — animated pressure meter, mirrors the
                        teaser's anticipation language. */}
                    <div className="mt-8 w-full max-w-[260px]">
                        <div className="mb-2 flex items-center justify-between font-nokia text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/45">
                            <span>Pressure building</span>
                            <span>2026</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a1a]/10">
                            <div className="buy-now-charge h-full rounded-full bg-[#f97316]" />
                        </div>
                    </div>

                    <ul className="mt-9 space-y-3 font-inter text-[14px] text-[#1a1a1a]/75">
                        <li className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f97316]" />
                            Early-access pricing for everyone on the list
                        </li>
                        <li className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f97316]" />
                            Free shipping across India on launch week
                        </li>
                        <li className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f97316]" />
                            First refills bundled, while stocks last
                        </li>
                    </ul>

                    <div className="mt-auto pt-10">
                        <Link
                            to="/coming-soon"
                            onClick={onClose}
                            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-7 py-3.5 font-inter text-[13px] font-semibold uppercase tracking-[0.18em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                            />
                            <span className="relative">Notify me at launch</span>
                        </Link>
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
