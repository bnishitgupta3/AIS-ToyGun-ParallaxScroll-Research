import { Link } from "react-router-dom";

export const PRODUCTS = [
    {
        id: "p0",
        name: "MP5K-UTG",
        tagline: "Electric · Drum-Fed · Full Auto",
        price: "$89",
        link: "/product/mp5k",
        accent: "#f97316",
        sub: "Water Gun",
    },
    {
        id: "p1",
        name: "M416 Water X",
        tagline: "Long-Range · Drum Mag · Precision",
        price: "$119",
        link: "/product/m416",
        accent: "#0871E7",
        sub: "Water Gun",
    },
    {
        id: "p2",
        name: "Crimson Blaster",
        tagline: "Gel Blaster · High Velocity · Tactical",
        price: "$99",
        link: "/product/crimson",
        accent: "#ef4444",
        sub: "Gel Blaster",
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

            {/* ── BELOW the gun — button only (stacked; GSAP toggles opacity) ── */}
            <div className="absolute bottom-[26%] left-1/2 z-20 h-12 w-[260px] -translate-x-1/2">
                {PRODUCTS.map((p, i) => (
                    <div
                        key={p.id}
                        id={`arsenal-btn-${i}`}
                        className="absolute inset-x-0 top-0 flex justify-center transition-opacity duration-500"
                        style={{
                            opacity: i === activeIndex ? 1 : 0,
                            pointerEvents: i === activeIndex ? "auto" : "none",
                        }}
                    >
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
                Sec · 02 / 05 — Arsenal
            </div>
        </section>
    );
}
