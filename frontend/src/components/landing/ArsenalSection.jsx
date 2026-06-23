import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

/* "Coming soon" panel — slides in from the RIGHT on desktop (md+) and from
   the BOTTOM as a partial sheet on mobile (~70% of viewport). Mobile gets a
   sheet (not a full takeover) so the gun + context stay visible behind a
   dim backdrop, and the panel is dismissible by tapping the backdrop or the
   close button. ESC also closes it. */
function BuyNowSheet({ open, product, onClose }) {
    // Lock body scroll while open; close on ESC.
    useEffect(() => {
        if (!open) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    return (
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
        </div>
    );
}

export const PRODUCTS = [
    {
        id: "p0",
        name: "MP5K",
        tagline: "Electric · Drum-Fed · Full Auto",
        price: "$89",
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
        price: "$119",
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
        price: "$99",
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
    // Which product (if any) opened the Buy Now sheet — null = closed.
    const [buyNowProduct, setBuyNowProduct] = useState(null);

    return (
        <section
            ref={arsenalRef}
            id="arsenal"
            className="arsenal-track relative w-full overflow-hidden"
            style={{ height: "100vh" }}
        >
            {/* ── TOP heading area — eyebrow + product name (ABOVE the gun) ── */}
            <div className="pointer-events-none absolute left-1/2 top-20 z-20 flex -translate-x-1/2 flex-col items-center text-center md:top-24">
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
            <div className="absolute bottom-[12.75rem] left-1/2 z-20 h-12 -translate-x-1/2">
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
                        <BuyNowButton onClick={() => setBuyNowProduct(p)} />
                    </div>
                ))}
            </div>

            {/* ── Spec strip — translucent glass with key numbers (per weapon),
                   sits below the buttons and above the thumbnail tiles ── */}
            <div className="pointer-events-none absolute bottom-32 left-1/2 z-20 -translate-x-1/2">
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
            <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 sm:gap-4">
                {PRODUCTS.map((p, i) => (
                    <button
                        key={p.id}
                        id={`arsenal-thumb-${i}`}
                        type="button"
                        onClick={() => onSelect?.(i)}
                        className="group relative flex h-20 w-28 shrink-0 flex-col justify-between overflow-hidden rounded-xl border-2 bg-white/70 p-2.5 text-left backdrop-blur-md transition-all duration-300 sm:w-32"
                        style={{
                            opacity: i === activeIndex ? 1 : 0.4,
                            borderColor: i === activeIndex ? p.accent : "rgba(0,0,0,0.10)",
                        }}
                    >
                        {/* Accent swatch */}
                        <span
                            className="h-1.5 w-6 rounded-full"
                            style={{ background: p.accent }}
                        />
                        <div>
                            <div className="font-instrument text-[15px] leading-tight text-[#1a1a1a]">
                                {p.name}
                            </div>
                            <div className="font-inter text-[8px] font-medium uppercase tracking-[0.15em] text-[#1a1a1a]/45">
                                {p.sub}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Section label */}
            <div className="pointer-events-none absolute bottom-6 right-8 z-20 font-nokia text-[10px] uppercase tracking-[0.32em] text-[#1a1a1a]/25">
                Sec · 02 / 05 · Arsenal
            </div>

            {/* Buy Now sheet — single instance, opens for whichever weapon was tapped */}
            <BuyNowSheet
                open={!!buyNowProduct}
                product={buyNowProduct}
                onClose={() => setBuyNowProduct(null)}
            />
        </section>
    );
}
