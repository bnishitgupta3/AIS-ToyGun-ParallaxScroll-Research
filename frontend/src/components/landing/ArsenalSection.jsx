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
 * Horizontal-scroll arsenal — light dot-theme variant.
 *
 * Structure:
 *   <section .arsenal-track  overflow:hidden, h:100vh>     ← pinned by GSAP
 *     <div   .arsenal-container  flex w-max h-screen>      ← translated on X
 *       <panel 0 />  (100vw wide)
 *       <panel 1 />
 *       <panel 2 />  (+ extra right padding so gun 3 settles cleanly)
 *     </div>
 *   </section>
 */
export default function ArsenalSection({ arsenalRef }) {
    return (
        <section
            ref={arsenalRef}
            id="arsenal"
            className="arsenal-track relative w-full overflow-hidden"
            style={{ height: "100vh" }}
        >
            {/* Sticky section header — sits above the panels */}
            <div className="pointer-events-none absolute left-6 top-24 z-20 md:left-14">
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.4em] text-[#f97316]">
                    /// The Arsenal
                </span>
                <h2 className="font-instrument mt-3 text-[clamp(36px,5vw,72px)] leading-none text-[#1a1a1a]">
                    Choose Your
                    <br />
                    <span className="text-[#1a1a1a]/40">Weapon.</span>
                </h2>
            </div>

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

            {/* ── THE TRANSLATED STRIP — GSAP targets `.arsenal-container` ── */}
            <div className="arsenal-container flex h-screen w-max flex-nowrap">
                {PRODUCTS.map((p, i) => (
                    <div
                        key={p.id}
                        id={`arsenal-card-${i}`}
                        className="arsenal-panel relative flex h-screen w-screen shrink-0 items-end justify-center"
                        style={{
                            paddingRight: i === PRODUCTS.length - 1 ? "60vw" : 0,
                        }}
                    >
                        <div className="mb-16 w-full max-w-lg px-6 text-center">
                            {/* Sub-type badge */}
                            <span
                                className="font-inter inline-block rounded-full border px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[0.3em]"
                                style={{ borderColor: p.accent, color: p.accent }}
                            >
                                {p.sub}
                            </span>

                            {/* Product name */}
                            <h3 className="font-instrument mt-3 text-[clamp(32px,5.5vw,72px)] leading-none text-[#1a1a1a]">
                                {p.name}
                            </h3>

                            {/* Tagline */}
                            <p className="mt-2 font-inter text-[11px] font-medium uppercase tracking-[0.28em] text-[#1a1a1a]/50">
                                {p.tagline}
                            </p>

                            {/* CTA row */}
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <Link
                                    to={p.link}
                                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-3.5 font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:brightness-110"
                                    style={{ background: p.accent }}
                                >
                                    {/* Glint */}
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-white/30 to-transparent transition-transform duration-200 group-hover:scale-x-105"
                                    />
                                    <span className="relative">View Details</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative">
                                        <path d="M5 12h14M13 5l7 7-7 7" />
                                    </svg>
                                </Link>
                                <span className="font-instrument text-3xl text-[#1a1a1a]">
                                    {p.price}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Section label */}
            <div className="pointer-events-none absolute bottom-6 right-8 z-20 font-nokia text-[10px] uppercase tracking-[0.32em] text-[#1a1a1a]/30">
                Sec · 02 / 05 — Arsenal
            </div>
        </section>
    );
}
