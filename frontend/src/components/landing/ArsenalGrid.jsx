import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, useCartItem } from "@/lib/cart";
import NotifyMe from "@/components/showcase/NotifyMe";
import PriceTag from "@/components/PriceTag";
import { PRODUCTS } from "@/components/landing/ArsenalSection";
import { asset } from "@/lib/asset";
import { trackEvent } from "@/lib/analytics";

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
function AddToCart({ accent, cartKey, name, price }) {
    const { qty, inc, dec, set } = useCartItem(cartKey);
    const { notifyAdded } = useCart();
    const add = () => {
        set(1);
        trackEvent("add_to_cart", {
            currency: "INR",
            value: price || 0,
            items: [{ item_id: cartKey, item_name: name }],
        });
        notifyAdded(name);
    };
    if (qty === 0) {
        return (
            <button
                type="button"
                onClick={add}
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
            <button type="button" aria-label="Add one" onClick={() => { inc(); notifyAdded(name); }} className="grid h-9 w-9 place-items-center rounded-full text-2xl leading-none transition hover:bg-white/20">+</button>
        </div>
    );
}

function ProductCard({ p }) {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [hoverFailed, setHoverFailed] = useState(false);
    const main = p.image ? asset("/assets/products/" + p.image) : null;
    const hoverSrc = p.image
        ? asset("/assets/products/" + p.image.replace(/\.(jpe?g|png|webp)$/i, "-hover.$1"))
        : null;

    // Card photo SLIDER: the main photo + the hover photo. Arrows / swipe cycle
    // through the shots WITHOUT leaving the card (#5); clicking the image, name
    // or anywhere else on the card opens the product details page (#6).
    const images = main && !imgError ? (hoverSrc && !hoverFailed ? [main, hoverSrc] : [main]) : [];
    const n = images.length;
    const [idx, setIdx] = useState(0);
    const cur = n ? (((idx % n) + n) % n) : 0;
    const touchX = useRef(null);
    const swiped = useRef(false);
    const arrow = (e, d) => { e.stopPropagation(); e.preventDefault(); setIdx(cur + d); };
    const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; swiped.current = false; };
    const onTouchEnd = (e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40 && n > 1) { swiped.current = true; setIdx(cur + (dx < 0 ? 1 : -1)); }
    };

    // Navigate to the PDP when the card is clicked anywhere that isn't an actual
    // control (arrows, dots, Add to cart, links, the notify input).
    const onCardClick = (e) => {
        if (swiped.current) { swiped.current = false; return; }
        if (e.target.closest("a, button, input, label")) return;
        navigate(p.link);
    };

    return (
        <div
            onClick={onCardClick}
            className="brutal-accent group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-[#18181b] transition-transform duration-200 hover:-translate-y-1.5"
            style={{ "--accent": p.accent }}
        >
            {/* Photo slider — edge-to-edge across the top of the card. */}
            <div
                className="relative aspect-[5/3] overflow-hidden bg-[#f1f0ed]"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {p.comingSoon && (
                    <span
                        className="absolute right-3 top-3 z-20 rounded-full px-3 py-1 font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm"
                        style={{ background: p.accent }}
                    >
                        Coming Soon
                    </span>
                )}
                {n > 0 ? (
                    images.map((src, i) => (
                        <img
                            key={src}
                            src={src}
                            alt={i === 0 ? p.name : ""}
                            aria-hidden={i === cur ? undefined : "true"}
                            loading="lazy"
                            decoding="async"
                            onError={() => (i === 0 ? setImgError(true) : setHoverFailed(true))}
                            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${i === cur ? "opacity-100" : "opacity-0"}`}
                        />
                    ))
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ color: p.accent }}>
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.25em] opacity-50">
                            Photo coming
                        </span>
                    </div>
                )}

                {n > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous photo"
                            onClick={(e) => arrow(e, -1)}
                            className="absolute left-2 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#1a1a1a] opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 max-md:opacity-100"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M15 5l-7 7 7 7" /></svg>
                        </button>
                        <button
                            type="button"
                            aria-label="Next photo"
                            onClick={(e) => arrow(e, 1)}
                            className="absolute right-2 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#1a1a1a] opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 max-md:opacity-100"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center gap-1.5">
                            {images.map((src, i) => (
                                <button
                                    key={src}
                                    type="button"
                                    aria-label={`Photo ${i + 1}`}
                                    onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                                    className={`h-1.5 rounded-full transition-all ${i === cur ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thin accent line marks the photo → panel seam. */}
            <div className="h-[3px] w-full" style={{ background: p.accent }} />

            {/* Name + specs — white on the dark card, so they stay crisp and the
                accent is spent only where it aids conversion (chip, name, CTA). */}
            <div className="flex flex-1 flex-col px-4 pt-4">
                <span
                    className="font-inter self-start rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.24em] text-white"
                    style={{ background: p.accent }}
                >
                    {p.sub}
                </span>
                <h3
                    className="font-instrument mt-2 text-[clamp(26px,3vw,36px)] leading-[0.92]"
                    style={{ color: p.accent }}
                >
                    {p.name}
                </h3>

                {/* Specs at a glance — white values on dark, always legible. */}
                <div className="mt-3.5 flex flex-wrap gap-x-6 gap-y-2">
                    {p.stats.slice(0, 3).map((s) => (
                        <div key={s.label} className="flex flex-col leading-none">
                            <span
                                className="font-instrument text-[20px] text-white"
                                style={p.comingSoon ? { filter: "blur(4px)" } : undefined}
                            >
                                {s.value}
                            </span>
                            <span className="mt-1 font-inter text-[8px] font-semibold uppercase tracking-[0.2em] text-white/45">
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Price — brand pop on the dark card: yellow sale price, struck
                    MRP, discount chip. Anchored to the bottom, next to the CTA. */}
                <PriceTag mrp={p.mrp} price={p.price} variant="dark" size="md" className="mt-auto pt-4" />
            </div>

            {/* Action row — Add to Cart is the primary CTA; "Experience it" is a
                quiet ghost link through to the immersive 3-D product page. */}
            <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 px-4 pb-4 pt-4">
                {p.comingSoon ? (
                    <NotifyMe compact productName={p.name} source={launchSource(p.name)} accent={p.accent} />
                ) : (
                    <>
                        <div className="flex-1">
                            <AddToCart accent={p.accent} cartKey={p.link} name={p.name} price={p.price} />
                        </div>
                        <Link
                            to={p.link}
                            aria-label={`View ${p.name} details`}
                            className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border-2 border-white/25 px-4 font-inter text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-[#18181b]"
                        >
                            View details
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
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
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.4em] text-[#F8290A]">
                    /// The Arsenal
                </span>
                <h2 className="font-instrument mt-4 text-[clamp(40px,7vw,84px)] leading-[0.9] text-[#1a1a1a]">
                    Pick your <span className="text-shimmer">weapon</span>.
                </h2>
                <p className="mt-4 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/60">
                    Fully electric, trigger-only soakers engineered for Holi mornings
                    and every sunlit day. Zero pumping, zero priming.
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-4xl">
                    {PRODUCTS.filter((p) => p.link !== "/product/crimson").map((p) => (
                        <ProductCard key={p.id} p={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
