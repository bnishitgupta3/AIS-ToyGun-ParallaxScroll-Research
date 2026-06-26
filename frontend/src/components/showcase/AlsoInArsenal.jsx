import { useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "@/components/landing/ArsenalSection";

/* Cross-sell strip on every product page. Lists the OTHER two weapons from
   the Arsenal so a visitor can jump straight to another product or add it
   to cart from here, without bouncing back to the homepage. */

/* Small cart counter — qty=0 shows ghost "+ Add", qty>0 shows -/+ stepper.
   Each click stops propagation so the surrounding card stays a clean
   visual unit (the View Product link is a separate target). */
function MiniCounter({ accent }) {
    const [qty, setQty] = useState(0);
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
                onClick={stop(() => setQty(1))}
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 font-inter text-[11px] font-semibold uppercase tracking-[0.18em] transition"
                style={{ background: `${accent}1a`, color: accent }}
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
            className="inline-flex h-9 items-center gap-0.5 rounded-full pl-1 pr-1 text-white shadow-sm"
            style={{ background: accent }}
        >
            <button
                type="button"
                aria-label="Remove one from cart"
                onClick={stop(() => setQty((q) => Math.max(0, q - 1)))}
                className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none transition hover:bg-white/20"
            >
                −
            </button>
            <span className="min-w-[1.5ch] text-center font-inter text-[13px] font-bold tabular-nums">
                {qty}
            </span>
            <button
                type="button"
                aria-label="Add one to cart"
                onClick={stop(() => setQty((q) => q + 1))}
                className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none transition hover:bg-white/20"
            >
                +
            </button>
        </div>
    );
}

export default function AlsoInArsenal({ currentLink }) {
    const others = PRODUCTS.filter((p) => p.link !== currentLink);

    return (
        <section className="relative w-full bg-[#F3F4ED] py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-6 md:px-12">
                <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="font-mono-tactical text-xs font-bold uppercase tracking-[0.4em] text-[#f97316]">
                            /// Also in the Arsenal
                        </span>
                        <h2 className="font-display mt-4 text-4xl text-[#1a1a1a] sm:text-5xl">
                            Don't stop at one.
                        </h2>
                    </div>
                    <Link
                        to="/#arsenal"
                        className="font-mono-tactical text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a]/55 transition hover:text-[#f97316]"
                    >
                        Browse the full arsenal →
                    </Link>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {others.map((p) => (
                        <div
                            key={p.id}
                            className="group relative flex flex-col gap-5 rounded-3xl border border-black/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-9"
                            style={{ borderTop: `4px solid ${p.accent}` }}
                        >
                            {/* Category badge */}
                            <span
                                className="font-inter inline-block self-start rounded-full border px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[0.3em]"
                                style={{ borderColor: p.accent, color: p.accent }}
                            >
                                {p.sub}
                            </span>

                            {/* Name + tagline */}
                            <div>
                                <h3 className="font-instrument text-[clamp(28px,4vw,40px)] leading-tight text-[#1a1a1a]">
                                    {p.name}
                                </h3>
                                <p className="mt-2 font-inter text-[11px] font-medium uppercase tracking-[0.25em] text-[#1a1a1a]/50">
                                    {p.tagline}
                                </p>
                            </div>

                            {/* Top stats — pull two key ones from the Arsenal data */}
                            {p.stats && (
                                <div className="flex items-baseline gap-6 border-t border-black/5 pt-4">
                                    {p.stats.slice(0, 2).map((s) => (
                                        <div key={s.label}>
                                            <span className="font-instrument text-[20px] leading-none text-[#1a1a1a]">
                                                {s.value}
                                            </span>
                                            <span className="ml-1 font-inter text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/45">
                                                {s.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Actions — view product (primary text link) + quick add */}
                            <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                                <Link
                                    to={p.link}
                                    className="inline-flex items-center gap-1 font-inter text-[12px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a] transition hover:gap-2"
                                    style={{ color: p.accent }}
                                >
                                    View product
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M13 5l7 7-7 7" />
                                    </svg>
                                </Link>
                                <MiniCounter accent={p.accent} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
