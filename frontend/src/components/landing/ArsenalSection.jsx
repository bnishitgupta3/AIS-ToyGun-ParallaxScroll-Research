import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart, useCartItem } from "@/lib/cart";

/* Per-tile cart counter. Sits in the tile's bottom action row (replacing the
   redundant sub-label — the gun's category/tagline already live in the
   heading area above the gun). Always enabled on all 3 tiles for friction-
   free multi-add. stopPropagation on every click prevents the tile's
   gun-switch from firing.

   Reads/writes through the global cart context (useCartItem) so the nav
   badge and BuyNowSheet stay in sync. */
function TileCartCounter({ accent, cartKey }) {
    const { qty, inc, dec, set } = useCartItem(cartKey);
    const stop = (fn) => (e) => {
        e.stopPropagation();
        e.preventDefault();
        fn();
    };

    if (qty === 0) {
        return (
            <button
                type="button"
                aria-label="Add to cart"
                onClick={stop(() => set(1))}
                className="flex h-7 w-full items-center justify-center gap-1 rounded-full font-inter text-[10px] font-semibold uppercase tracking-[0.18em] transition"
                style={{
                    background: `${accent}1a`, // ~10% alpha tint
                    color: accent,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${accent}33`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${accent}1a`;
                }}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Add</span>
            </button>
        );
    }

    return (
        <div
            className="flex h-7 w-full items-center justify-between rounded-full pl-0.5 pr-0.5 text-white shadow-sm"
            style={{ background: accent }}
        >
            <button
                type="button"
                aria-label="Remove one from cart"
                onClick={stop(dec)}
                className="grid h-6 w-6 place-items-center rounded-full text-base leading-none transition hover:bg-white/20"
            >
                −
            </button>
            <span className="flex-1 text-center font-inter text-[12px] font-bold tabular-nums">
                {qty}
            </span>
            <button
                type="button"
                aria-label="Add one to cart"
                onClick={stop(inc)}
                className="grid h-6 w-6 place-items-center rounded-full text-base leading-none transition hover:bg-white/20"
            >
                +
            </button>
        </div>
    );
}

/* Buy Now button — opens a "checkout coming soon" panel.
   Shopify integration lands later; this is the placeholder UI. */
function BuyNowButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-7 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.2em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)] transition-all hover:brightness-110"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="relative">
                <path d="M13 2L4.5 13h6L11 22l8.5-11h-6L13 2z" />
            </svg>
            <span className="relative">Buy Now</span>
        </button>
    );
}

export const PRODUCTS = [
    {
        id: "p0",
        name: "MP5K",
        tagline: "Electric · Drum-Fed · Full Auto",
        link: "/product/mp5k",
        accent: "#f97316",
        sub: "Water Gun",
        stats: [
            { label: "Range", value: "9 m" },
            { label: "Shots / Refill", value: "220" },
            { label: "Fire Rate", value: "8 /s" },
            { label: "Battery", value: "45 min" },
        ],
    },
    {
        id: "p1",
        name: "M416 Water X",
        tagline: "Long-Range · Drum Mag · Precision",
        link: "/product/m416",
        accent: "#0871E7",
        sub: "Water Gun",
        stats: [
            { label: "Range", value: "12 m" },
            { label: "Shots / Refill", value: "300" },
            { label: "Fire Rate", value: "10 /s" },
            { label: "Battery", value: "60 min" },
        ],
    },
    {
        id: "p2",
        name: "Crimson Blaster",
        tagline: "Gel Blaster · High Velocity · Tactical",
        link: "/product/crimson",
        accent: "#ef4444",
        sub: "Gel Blaster",
        stats: [
            { label: "Range", value: "18 m" },
            { label: "Shots / Refill", value: "350" },
            { label: "Fire Rate", value: "11 /s" },
            { label: "Battery", value: "50 min" },
        ],
    },
];

/**
 * Arsenal — Jetour UI paradigm (heading ABOVE the gun, button BELOW it).
 *
 *   ┌──────────────────────────────────────────────┐
 *   │  /// The Arsenal              (eyebrow)        │
 *   │  [badge]  M416 Water X  tagline   (heading)   │  ← ABOVE gun
 *   │                                                │
 *   │            [ centered 3D gun ]                 │  ← fixed canvas
 *   │                                                │
 *   │              [ View Details ]   (button only)  │  ← BELOW gun
 *   │     [thumb0]  [thumb1]  [thumb2]   (nav row)   │  ← bottom thumbs
 *   └──────────────────────────────────────────────┘
 *
 * The section is pinned by GSAP (LandingPage) for a fixed scroll distance.
 * GSAP's onUpdate toggles the active name + button + thumbnail by opacity.
 * Clicking a thumbnail calls `onSelect(i)` → GSAP scroll-seek to that section.
 */
export default function ArsenalSection({ arsenalRef, onSelect, activeIndex = 0 }) {
    // Buy Now opens the single global drawer (mounted in App.js) via the cart
    // context. No per-section sheet instance — that caused multiple sheets in
    // the DOM and was the source of the earlier "drawer auto-show" bug.
    const { openDrawer } = useCart();

    // True once the section is pinned at the top of the viewport — at which
    // point the gun's entry animation has settled. Gates the HTML overlay so
    // the buttons + spec strip don't briefly overlap the in-flight gun on
    // initial scroll into the section.
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        const section = arsenalRef?.current;
        if (!section) return;
        const update = () => {
            const top = section.getBoundingClientRect().top;
            if (top <= 0) setEntered(true);
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, [arsenalRef]);

    return (
        <section
            ref={arsenalRef}
            id="arsenal"
            className="arsenal-track relative w-full overflow-hidden"
            style={{ height: "100vh" }}
        >
            {/* ── TOP heading area — eyebrow + product name (ABOVE the gun) ── */}
            <div
                className="pointer-events-none absolute left-1/2 top-20 z-20 flex -translate-x-1/2 flex-col items-center text-center transition-opacity duration-500 md:top-24"
                style={{ opacity: entered ? 1 : 0 }}
            >
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.4em] text-[#f97316]">
                    /// The Arsenal
                </span>

                {/* Stacked product names — GSAP toggles opacity */}
                <div className="relative mt-5 h-[120px] w-[320px]">
                    {PRODUCTS.map((p, i) => (
                        <div
                            key={p.id}
                            id={`arsenal-name-${i}`}
                            className="absolute inset-x-0 top-0 flex flex-col items-center transition-opacity duration-500"
                            style={{ opacity: i === activeIndex ? 1 : 0 }}
                        >
                            <span
                                className="font-inter mb-3 inline-block rounded-full border px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[0.3em]"
                                style={{ borderColor: p.accent, color: p.accent }}
                            >
                                {p.sub}
                            </span>
                            <h3 className="font-instrument text-[clamp(28px,5vw,44px)] leading-none text-[#1a1a1a]">
                                {p.name}
                            </h3>
                            <p className="mt-2 font-inter text-[11px] font-medium uppercase tracking-[0.28em] text-[#1a1a1a]/50">
                                {p.tagline}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── BELOW the gun — View Details + Add to Cart (stacked per weapon).
                   Fixed offset (not %) so it stays just above the spec strip with
                   a small, consistent gap on any viewport height. ── */}
            <div
                className="absolute bottom-[12.75rem] left-1/2 z-20 h-12 -translate-x-1/2 transition-opacity duration-500"
                style={{ opacity: entered ? 1 : 0 }}
            >
                {PRODUCTS.map((p, i) => (
                    <div
                        key={p.id}
                        id={`arsenal-btn-${i}`}
                        className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap transition-opacity duration-500"
                        style={{
                            opacity: i === activeIndex ? 1 : 0,
                            pointerEvents: i === activeIndex ? "auto" : "none",
                        }}
                    >
                        {/* View Details — clean dark outline */}
                        <Link
                            to={p.link}
                            className="group inline-flex items-center gap-2 rounded-full border border-[#1a1a1a]/30 px-7 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a] transition-all hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"
                        >
                            View Details
                            <svg
                                width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5"
                                className="transition-transform group-hover:translate-x-0.5"
                            >
                                <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                        </Link>

                        {/* Buy Now — themed orange. Opens the "coming soon"
                            sheet (right drawer on desktop, bottom sheet on mobile). */}
                        <BuyNowButton onClick={() => openDrawer(p)} />
                    </div>
                ))}
            </div>

            {/* ── Spec strip — translucent glass with key numbers (per weapon),
                   sits below the buttons and above the thumbnail tiles ── */}
            <div
                className="pointer-events-none absolute bottom-32 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500"
                style={{ opacity: entered ? 1 : 0 }}
            >
                {PRODUCTS.map((p, i) => (
                    <div
                        key={p.id}
                        id={`arsenal-stats-${i}`}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-opacity duration-500"
                        style={{ opacity: i === activeIndex ? 1 : 0 }}
                    >
                        {/* Apple "liquid glass" tile — translucent material, bright
                            specular rim, inner refraction glow, layered float shadow */}
                        <div className="relative overflow-hidden rounded-[26px] bg-white/40 backdrop-blur-2xl backdrop-saturate-[1.2] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(255,255,255,0.5),inset_0_-14px_22px_-14px_rgba(255,255,255,0.8),0_12px_28px_-10px_rgba(0,0,0,0.22),0_30px_60px_-24px_rgba(0,0,0,0.42)]">
                            {/* specular sheen + bright top rim */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-white/55 via-white/12 to-transparent"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white/90"
                            />
                            <div className="relative z-10 flex items-stretch divide-x divide-[#1a1a1a]/10 px-1 py-2.5">
                                {p.stats.map((s) => (
                                    <div
                                        key={s.label}
                                        className="flex flex-col items-center px-3 sm:px-5"
                                    >
                                        <span className="whitespace-nowrap font-instrument text-[18px] leading-none text-[#1a1a1a] sm:text-[23px]">
                                            {s.value}
                                        </span>
                                        <span className="mt-1 whitespace-nowrap font-inter text-[8px] font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]/55 sm:text-[9px]">
                                            {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Bottom thumbnail navigation ── */}
            <div
                className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 transition-opacity duration-500 sm:gap-4"
                style={{ opacity: entered ? 1 : 0 }}
            >
                {PRODUCTS.map((p, i) => (
                    /* The tile itself acts as a clickable surface (gun switch).
                       It's a div (not a button) so the cart counter buttons can
                       legally nest inside. Keyboard support kept via role + key
                       handlers. */
                    <div
                        key={p.id}
                        id={`arsenal-thumb-${i}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelect?.(i)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onSelect?.(i);
                            }
                        }}
                        className="group relative flex h-20 w-28 shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-xl border-2 p-2 text-left backdrop-blur-md transition-all duration-300 sm:w-32"
                        style={{
                            /* Active vs inactive expressed via bg + border —
                               NOT root opacity — so the cart counter stays
                               fully opaque and never reads as disabled on
                               inactive tiles. */
                            background: i === activeIndex ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                            borderColor: i === activeIndex ? p.accent : "rgba(0,0,0,0.10)",
                        }}
                    >
                        {/* Top row: accent swatch + product name. Sub-label
                            dropped intentionally — it lives in the heading
                            above the gun, which freed this space for the
                            cart action below. Info dims (not tile root) when
                            inactive so the counter stays fully enabled. */}
                        <div
                            className="flex flex-col transition-opacity duration-300"
                            style={{ opacity: i === activeIndex ? 1 : 0.45 }}
                        >
                            <span
                                className="h-1.5 w-5 rounded-full"
                                style={{ background: p.accent }}
                            />
                            <div className="mt-1.5 font-instrument text-[14px] leading-tight text-[#1a1a1a]">
                                {p.name}
                            </div>
                        </div>

                        {/* Bottom action row: full-width cart counter, always
                            at full opacity so it reads as enabled on every
                            tile (which it is — clicks don't switch the gun). */}
                        <TileCartCounter accent={p.accent} cartKey={p.link} />
                    </div>
                ))}
            </div>

            {/* Section label */}
            <div className="pointer-events-none absolute bottom-6 right-8 z-20 font-nokia text-[10px] uppercase tracking-[0.32em] text-[#1a1a1a]/25">
                Sec · 02 / 05 · Arsenal
            </div>

        </section>
    );
}
