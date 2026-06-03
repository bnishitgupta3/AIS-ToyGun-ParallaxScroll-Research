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
        accent: "#3b82f6",
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

export default function ArsenalSection({ arsenalRef }) {
    return (
        <section
            ref={arsenalRef}
            id="arsenal"
            className="relative w-full"
            style={{ height: "100vh" }}
        >
            <div className="relative flex h-screen flex-col">

                {/* Section header */}
                <div className="absolute left-6 top-24 z-20 md:left-14">
                    <span className="font-mono-tactical text-xs font-bold uppercase tracking-[0.4em] text-orange-500">
                        /// The Arsenal
                    </span>
                    <h2 className="font-display mt-3 text-[clamp(36px,5vw,72px)] leading-none text-white">
                        Choose Your
                        <br />
                        <span className="text-zinc-600">Weapon.</span>
                    </h2>
                </div>

                {/* Progress dots */}
                <div className="absolute right-8 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3">
                    {PRODUCTS.map((_, i) => (
                        <div
                            key={i}
                            id={`arsenal-dot-${i}`}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: i === 0 ? "#f97316" : "rgba(255,255,255,0.2)" }}
                        />
                    ))}
                </div>

                {/*
                  Product cards — all three absolutely positioned at the same spot.
                  GSAP drives opacity. `pointerEvents` is also set by GSAP so the
                  invisible cards never intercept clicks (which caused the wrong product
                  page bug where the last card in DOM order always won).
                */}
                {PRODUCTS.map((p, i) => (
                    <div
                        key={p.id}
                        id={`arsenal-card-${i}`}
                        className="absolute bottom-16 left-1/2 w-full max-w-lg -translate-x-1/2 px-6 text-center"
                        style={{
                            opacity: i === 0 ? 1 : 0,
                            pointerEvents: i === 0 ? "auto" : "none",
                        }}
                    >
                        {/* Sub-type badge */}
                        <span
                            className="font-mono-tactical inline-block rounded-full border px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.3em]"
                            style={{ borderColor: p.accent, color: p.accent }}
                        >
                            {p.sub}
                        </span>

                        {/* Name */}
                        <h3 className="font-display mt-3 text-[clamp(32px,5.5vw,72px)] leading-none text-white">
                            {p.name}
                        </h3>

                        {/* Tagline */}
                        <p className="mt-2 font-mono-tactical text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                            {p.tagline}
                        </p>

                        {/* CTA */}
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <Link
                                to={p.link}
                                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-mono-tactical text-[11px] font-bold uppercase tracking-[0.22em] text-black transition-opacity hover:opacity-90"
                                style={{ background: p.accent }}
                            >
                                View Details
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M13 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <span className="font-display text-3xl text-white">{p.price}</span>
                        </div>
                    </div>
                ))}

                {/* Scroll cue */}
                <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
                    <span className="font-mono-tactical text-[9px] uppercase tracking-[0.4em] text-zinc-700">
                        Keep scrolling
                    </span>
                </div>

                {/* Section label */}
                <div className="pointer-events-none absolute bottom-6 right-8 z-20 font-mono-tactical text-[10px] uppercase tracking-[0.32em] text-zinc-700">
                    Sec · 02 / 06 — Arsenal
                </div>
            </div>
        </section>
    );
}
