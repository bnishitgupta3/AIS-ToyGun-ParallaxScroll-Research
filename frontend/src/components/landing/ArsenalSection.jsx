import { Link } from "react-router-dom";

const PRODUCTS = [
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
 * Horizontal-scroll Arsenal — Premium Light theme.
 *
 * Architecture:
 *  <section  .arsenal-track   overflow:hidden h:100vh>    ← GSAP pins this
 *    [Absolute overlays — stay fixed while strip scrolls]
 *    │  Header "Choose Your Weapon"
 *    │  Product cards 0/1/2  (opacity toggled by GSAP onUpdate)
 *    │  Progress dots
 *    └  Section label
 *
 *    <div .arsenal-container  flex w-max h-screen>        ← GSAP translates on X
 *      <panel 0 />  w-screen h-screen (pure spacer — no text content)
 *      <panel 1 />
 *      <panel 2 />
 *    </div>
 *  </section>
 *
 * Why spacer panels?
 *   The product UI lives in the absolute overlays, not inside the scrolling
 *   strip. This eliminates the center-clutter and lets GSAP drive both the
 *   CSS translation AND the 3D model positions from a single onUpdate source.
 *
 * GSAP translation math (no extra padding):
 *   Strip width = 3 × 100vw = 300vw
 *   Total translation = -(300vw - 100vw) = -200vw
 *   Scroll end = "+=(300vw - 100vw)" = "+=200vw"
 *   → scroll-progress and tween-progress are 1-to-1 ✓
 */
export default function ArsenalSection({ arsenalRef }) {
    return (
        <section
            ref={arsenalRef}
            id="arsenal"
            className="arsenal-track relative w-full overflow-hidden"
            style={{ height: "100vh" }}
        >
            {/* ── STATIC OVERLAYS ─────────────────────────────────── */}

            {/* Section header */}
            <div className="pointer-events-none absolute left-6 top-24 z-20 md:left-14">
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.4em] text-[#f97316]">
                    /// The Arsenal
                </span>
                <h2 className="font-instrument mt-3 text-[clamp(32px,4.5vw,60px)] leading-none text-[#1a1a1a]">
                    Choose Your
                    <br />
                    <span className="text-[#1a1a1a]/35">Weapon.</span>
                </h2>
            </div>

            {/* Product info cards — absolutely positioned below the header.
                All three share the same screen position; GSAP toggles opacity. */}
            {PRODUCTS.map((p, i) => (
                <div
                    key={p.id}
                    id={`arsenal-card-${i}`}
                    className="absolute left-6 z-20 flex flex-col items-start gap-3 md:left-14"
                    style={{
                        top: "clamp(240px, 35vh, 340px)",
                        opacity: i === 0 ? 1 : 0,
                        pointerEvents: i === 0 ? "auto" : "none",
                    }}
                >
                    {/* Sub-type badge */}
                    <span
                        className="font-inter inline-block rounded-full border px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[0.3em]"
                        style={{ borderColor: p.accent, color: p.accent }}
                    >
                        {p.sub}
                    </span>

                    {/* Product name */}
                    <h3 className="font-instrument text-[clamp(28px,4vw,56px)] leading-none text-[#1a1a1a]">
                        {p.name}
                    </h3>

                    {/* Tagline */}
                    <p className="font-inter text-[11px] font-medium uppercase tracking-[0.28em] text-[#1a1a1a]/50">
                        {p.tagline}
                    </p>

                    {/* CTA + Price in a single row */}
                    <div className="mt-1 flex flex-row items-center gap-6">
                        <Link
                            to={p.link}
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:brightness-110"
                            style={{ background: p.accent }}
                        >
                            {/* Glint */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-white/30 to-transparent transition-transform duration-200 group-hover:scale-x-105"
                            />
                            <span className="relative">View Details</span>
                            <svg
                                width="13" height="13"
                                viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5"
                                className="relative"
                            >
                                <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                        </Link>

                        <span className="font-instrument text-[28px] text-[#1a1a1a]">
                            {p.price}
                        </span>
                    </div>
                </div>
            ))}

            {/* Progress dots */}
            <div className="absolute right-8 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3">
                {PRODUCTS.map((_, i) => (
                    <div
                        key={i}
                        id={`arsenal-dot-${i}`}
                        className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                        style={{
                            background: i === 0 ? "#f97316" : "rgba(0,0,0,0.18)",
                        }}
                    />
                ))}
            </div>

            {/* ── SCROLLING STRIP (pure spacers — no text content) ── */}
            <div className="arsenal-container flex h-screen w-max flex-nowrap">
                {PRODUCTS.map((p) => (
                    /* Each panel is exactly 100vw — no extra padding.
                       Strip total = 3 × 100vw = 300vw.
                       Translation = -(300vw - 100vw) = -200vw.
                       Scroll end   = "+=(300vw - 100vw)" = "+=200vw".
                       Both sides equal, so progress and position are 1-to-1. */
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
