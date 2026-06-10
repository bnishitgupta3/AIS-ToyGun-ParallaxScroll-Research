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
 * Arsenal — Jetour UI paradigm.
 *
 *   ┌──────────────────────────────────────────────┐
 *   │  /// The Arsenal              (eyebrow, top)   │
 *   │                                                │
 *   │            [ centered 3D gun ]                 │  ← fixed canvas
 *   │                                                │
 *   │              M416 Water X      (name)          │  ← info block
 *   │              [ View Details ]  (outline btn)   │
 *   │                                                │
 *   │     [thumb0]  [thumb1]  [thumb2]   (nav row)   │  ← bottom thumbs
 *   └──────────────────────────────────────────────┘
 *
 * The pinned-scroll mechanism still lives in `.arsenal-container` (3 spacer
 * panels). GSAP (in LandingPage) drives:
 *   • the 3D models' world-X off the eased container transform (buttery)
 *   • the active info block's opacity
 *   • the active thumbnail's highlight
 * Clicking a thumbnail calls `onSelect(i)` → GSAP scroll-seek to that section.
 */
export default function ArsenalSection({ arsenalRef, onSelect }) {
    return (
        <section
            ref={arsenalRef}
            id="arsenal"
            className="arsenal-track relative w-full overflow-hidden"
            style={{ height: "100vh" }}
        >
            {/* ── Eyebrow (top-center) ── */}
            <div className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2 text-center">
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.4em] text-[#f97316]">
                    /// The Arsenal
                </span>
            </div>

            {/* ── Centered model info (name + outline button) ──
                3 versions stacked at the same spot; GSAP toggles opacity. */}
            {PRODUCTS.map((p, i) => (
                <div
                    key={p.id}
                    id={`arsenal-info-${i}`}
                    className="absolute left-1/2 bottom-[24%] z-20 flex -translate-x-1/2 flex-col items-center text-center"
                    style={{
                        opacity: i === 0 ? 1 : 0,
                        pointerEvents: i === 0 ? "auto" : "none",
                    }}
                >
                    <span
                        className="font-inter mb-3 inline-block rounded-full border px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[0.3em]"
                        style={{ borderColor: p.accent, color: p.accent }}
                    >
                        {p.sub}
                    </span>

                    {/* Model name — font-instrument text-3xl mb-4 (per spec) */}
                    <h3 className="font-instrument mb-4 text-3xl leading-none text-[#1a1a1a] md:text-4xl">
                        {p.name}
                    </h3>

                    {/* Clean outline action button */}
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
                            opacity: i === 0 ? 1 : 0.4,
                            borderColor: i === 0 ? p.accent : "rgba(0,0,0,0.10)",
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

            {/* ── SCROLLING STRIP (pure spacers — drive the pin distance) ── */}
            <div className="arsenal-container flex h-screen w-max flex-nowrap">
                {PRODUCTS.map((p) => (
                    <div
                        key={p.id}
                        className="h-screen w-screen shrink-0"
                        aria-hidden="true"
                    />
                ))}
            </div>

            {/* Section label */}
            <div className="pointer-events-none absolute bottom-6 right-8 z-20 font-nokia text-[10px] uppercase tracking-[0.32em] text-[#1a1a1a]/25">
                Sec · 02 / 05 — Arsenal
            </div>
        </section>
    );
}
