import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartItem } from "@/lib/cart";
import NotifyMe from "@/components/showcase/NotifyMe";
import { PRODUCTS } from "@/components/landing/ArsenalSection";
import { asset } from "@/lib/asset";

/* ── Redesigned Arsenal — a fast, shoppable D2C product grid ──
   Replaces the pinned 3-D carousel: high-end studio photos, clear names,
   specs, and a prominent add-to-cart on every card. Conversion-first, and far
   lighter than streaming three ~7 MB GLBs. Vibrancy carries over from the rest
   of the site: Hinato display type, accent-coloured names, neo-brutalist cards.

   Product photos live in /assets/products/<image>. Until they're added the card
   falls back to a styled accent placeholder, so the layout is never broken. */

const launchSource = (name) =>
    "launch-" + (name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-");

/* Per-card add-to-cart: an "Add" button that becomes a − N + stepper, wired to
   the shared cart so the nav badge + drawer stay in sync. */
function AddToCart({ accent, cartKey }) {
    const { qty, inc, dec, set } = useCartItem(cartKey);
    if (qty === 0) {
        return (
            <button
                type="button"
                onClick={() => set(1)}
                className="brutal flex h-11 w-full items-center justify-center gap-2 rounded-full font-inter text-[12px] font-bold uppercase tracking-[0.18em] text-white transition hover:brightness-105"
                style={{ background: accent }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                Add to Cart
            </button>
        );
    }
    return (
        <div
            className="brutal flex h-11 w-full items-center justify-between rounded-full pl-1 pr-1 text-white"
            style={{ background: accent }}
        >
            <button type="button" aria-label="Remove one" onClick={dec} className="grid h-9 w-9 place-items-center rounded-full text-2xl leading-none transition hover:bg-white/20">−</button>
            <span className="flex-1 text-center font-inter text-[15px] font-bold tabular-nums">{qty}</span>
            <button type="button" aria-label="Add one" onClick={inc} className="grid h-9 w-9 place-items-center rounded-full text-2xl leading-none transition hover:bg-white/20">+</button>
        </div>
    );
}

function ProductCard({ p }) {
    // Show the photo by default; fall back to the placeholder only if it errors
    // (missing file). Gating on onLoad is unreliable — an eager/cached image can
    // already be `complete` before React attaches the handler, so onLoad never
    // fires and the card gets stuck on the placeholder.
    const [imgError, setImgError] = useState(false);
    const img = p.image ? asset("/assets/products/" + p.image) : null;
    const showImg = img && !imgError;

    return (
        <div className="brutal group flex flex-col overflow-hidden rounded-3xl bg-white transition-transform duration-200 hover:-translate-y-1.5">
            {/* DOMINANT product image — the toy is the hero. Gun sits toward the
                top; the name + specs-at-a-glance overlay a tinted band across the
                bottom of the photo (dogggystyle), so nothing is stacked as plain
                text and the image stays big. */}
            <div
                className="relative aspect-[5/4] overflow-hidden"
                style={{ background: `linear-gradient(155deg, ${p.accent}22 0%, ${p.accent}0c 55%, #ffffff 100%)` }}
            >
                {p.comingSoon && (
                    <span
                        className="absolute right-3 top-3 z-20 rounded-full px-3 py-1 font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm"
                        style={{ background: p.accent }}
                    >
                        Coming Soon
                    </span>
                )}

                {showImg && (
                    /* No loading="lazy" (a lazy image in a below-the-fold or
                       display:none container may never trigger), and no onLoad
                       gating (an eager/cached image can be `complete` before
                       React attaches the handler, so onLoad never fires). Just
                       show it; fall back to the placeholder only on error. */
                    <img
                        src={img}
                        alt={p.name}
                        onError={() => setImgError(true)}
                        className="absolute inset-0 h-full w-full object-contain object-top p-3 pb-16 transition-transform duration-300 group-hover:scale-[1.06]"
                    />
                )}
                {!showImg && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ color: p.accent }}>
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.25em] opacity-50">
                            Photo coming
                        </span>
                    </div>
                )}

                {/* Tinted band across the bottom — carries the name + specs. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-3/5 bg-gradient-to-t from-black/82 via-black/45 to-transparent" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4">
                    <span
                        className="font-inter inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.24em] text-white"
                        style={{ background: p.accent }}
                    >
                        {p.sub}
                    </span>
                    <h3
                        className="font-instrument mt-1.5 text-[clamp(28px,3.2vw,40px)] leading-[0.88]"
                        style={{ color: p.accent }}
                    >
                        {p.name}
                    </h3>

                    {/* Specs at a glance */}
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                        {p.stats.slice(0, 3).map((s) => (
                            <div key={s.label} className="flex flex-col leading-none">
                                <span
                                    className="font-instrument text-[17px] text-white"
                                    style={p.comingSoon ? { filter: "blur(4px)" } : undefined}
                                >
                                    {s.value}
                                </span>
                                <span className="mt-1 font-inter text-[8px] font-semibold uppercase tracking-[0.18em] text-white/55">
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Slim action bar — the image stays the star; minimal text below. */}
            <div className="flex items-center gap-2.5 border-t-2 border-[#1a1a1a] p-3">
                {p.comingSoon ? (
                    <NotifyMe compact productName={p.name} source={launchSource(p.name)} accent={p.accent} />
                ) : (
                    <>
                        <AddToCart accent={p.accent} cartKey={p.link} />
                        <Link
                            to={p.link}
                            aria-label={`${p.name} details`}
                            className="brutal grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ArsenalGrid({ arsenalRef }) {
    return (
        <section
            ref={arsenalRef}
            id="arsenal"
            className="relative z-10 w-full px-6 py-24 md:px-12 md:py-32"
        >
            <div className="mx-auto max-w-7xl">
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.4em] text-[#f97316]">
                    /// The Arsenal
                </span>
                <h2 className="font-instrument mt-4 text-[clamp(40px,7vw,84px)] leading-[0.9] text-[#1a1a1a]">
                    Pick your <span className="text-shimmer">weapon</span>.
                </h2>
                <p className="mt-4 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/60">
                    Fully electric, trigger-only soakers engineered for Holi mornings
                    and every sunlit day. Zero pumping, zero priming.
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {PRODUCTS.map((p) => (
                        <ProductCard key={p.id} p={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
