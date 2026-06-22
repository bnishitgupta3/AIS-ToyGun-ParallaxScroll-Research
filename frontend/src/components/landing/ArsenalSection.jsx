import { useState } from "react";
import { Link } from "react-router-dom";

/* Themed "Add to Cart" with a quantity counter.
   First click adds 1 and turns into a −  N  + stepper so the user can pick
   how many of that gun to buy. Decrementing back to 0 reverts to the button.
   (No cart backend yet — local quantity state only.) */
function AddToCartButton() {
    const [qty, setQty] = useState(0);

    if (qty === 0) {
        return (
            <button
                type="button"
                onClick={() => setQty(1)}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-7 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.2em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)] transition-all hover:brightness-110"
            >
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="relative">
                    <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
                    <path d="M2 3h2.5l2.2 12.2a1.5 1.5 0 0 0 1.5 1.3h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
                </svg>
                <span className="relative">Add to Cart</span>
            </button>
        );
    }

    return (
        <div className="inline-flex items-center gap-1 rounded-full bg-[#f97316] py-1.5 pl-1.5 pr-1.5 text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)]">
            <button
                type="button"
                aria-label="Remove one"
                onClick={() => setQty((q) => Math.max(0, q - 1))}
                className="grid h-8 w-8 place-items-center rounded-full text-2xl leading-none transition hover:bg-white/20"
            >
                −
            </button>
            <span className="min-w-[2ch] text-center font-inter text-[15px] font-bold tabular-nums">
                {qty}
            </span>
            <button
                type="button"
                aria-label="Add one"
                onClick={() => setQty((q) => q + 1)}
                className="grid h-8 w-8 place-items-center rounded-full text-2xl leading-none transition hover:bg-white/20"
            >
                +
            </button>
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
            <div className="absolute bottom-[15.5rem] left-1/2 z-20 h-12 -translate-x-1/2">
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

                        {/* Add to Cart — themed orange */}
                        <AddToCartButton />
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
                        {/* Aero / Apple "liquid glass" tile */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-b from-white/55 to-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_46px_-16px_rgba(0,0,0,0.4)] backdrop-blur-xl backdrop-saturate-150">
                            {/* glossy top sheen */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/55 to-transparent"
                            />
                            <div className="relative z-10 flex items-stretch divide-x divide-[#1a1a1a]/10 px-1 py-2.5">
                                {p.stats.map((s) => (
                                    <div
                                        key={s.label}
                                        className="flex flex-col items-center px-3 sm:px-5"
                                    >
                                        <span className="font-instrument text-[18px] leading-none text-[#1a1a1a] sm:text-[23px]">
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
        </section>
    );
}
