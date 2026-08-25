import { useEffect } from "react";
import { Link } from "react-router-dom";

import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

/* framer-motion removed: motion.* threw "o is not a function" on some real
   mobile browsers and crashed the page. Entrance animation is now the CSS
   `.reveal-up` class (index.css). Do NOT reintroduce motion.* here. */

const STATS = [
    { value: "2026", label: "Founded" },
    { value: "10m", label: "Max Range" },
    { value: "3", label: "Flagship Models" },
    { value: "100%", label: "Electric Drive" },
];

const VALUES = [
    {
        title: "Precision engineering",
        body: "Every component is CNC-checked and stress-tested. We build instruments of play, designed to last, designed to delight.",
    },
    {
        title: "Engineered to thrill",
        body: "Drum-fed magazines, electric drives and calibrated pressure systems deliver the range, accuracy and fire-rate that turn a splash into an experience.",
    },
    {
        title: "Built for the field",
        body: "Weather-sealed shells, fast-charge Li-Po cores and zero-jam geometry mean you spend the afternoon playing, not fixing.",
    },
];

export default function AboutPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="dot-grid relative min-h-screen overflow-x-hidden text-[#1a1a1a]">
            <LandingNav />

            <main className="mx-auto max-w-5xl px-6 pb-24 pt-36 sm:px-8 md:pt-44">
                {/* ── Hero ── */}
                <span className="reveal-up font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#DA0213]">
                    /// About SONIQ Toys
                </span>

                <h1 className="reveal-up font-instrument mt-5 text-[clamp(40px,8vw,84px)] leading-[0.95] tracking-tight text-[#1a1a1a]">
                    We build the blasters
                    <br />
                    <span className="text-[#1a1a1a]/50">every sunlit day deserves.</span>
                </h1>

                <p className="reveal-up mt-8 max-w-2xl font-inter text-[16px] leading-relaxed text-[#1a1a1a]/65 md:text-[18px]">
                    SONIQ Toys was born from a love of play. Every Holi and
                    every sunny weekend deserves a blaster that's a joy to
                    hold and a thrill to fire. So we brought serious
                    engineering to the fun: precision barrels, electric drives
                    and drum-fed capacity, built for beaches, water parks,
                    society lawns, farmhouse pools, rooftops and the backyards
                    where the best memories get made, the year round.
                </p>

                {/* ── Stats ── */}
                <div className="reveal-up mt-16 grid grid-cols-2 gap-8 border-t border-black/10 pt-10 md:grid-cols-4">
                    {STATS.map((s) => (
                        <div key={s.label}>
                            <div className="font-instrument text-4xl text-[#1a1a1a] md:text-5xl">
                                {s.value}
                            </div>
                            <div className="mt-2 font-inter text-[11px] uppercase tracking-[0.25em] text-[#1a1a1a]/45">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Values ── */}
                <div className="mt-24">
                    <h2 className="font-instrument text-[clamp(28px,4vw,48px)] leading-none text-[#1a1a1a]">
                        What we stand for
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {VALUES.map((v, i) => (
                            <div
                                key={v.title}
                                className="reveal-up rounded-2xl border border-black/10 bg-white/50 p-7 backdrop-blur-sm"
                            >
                                <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.25em] text-[#DA0213]">
                                    0{i + 1}
                                </span>
                                <h3 className="font-instrument mt-3 text-2xl text-[#1a1a1a]">
                                    {v.title}
                                </h3>
                                <p className="mt-3 font-inter text-[14px] leading-relaxed text-[#1a1a1a]/60">
                                    {v.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CTA ── */}
                <div className="mt-24 flex flex-col items-start gap-6 rounded-3xl border border-black/10 bg-white/50 p-10 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="font-instrument text-[clamp(26px,3.5vw,40px)] leading-none text-[#1a1a1a]">
                            Ready to gear up?
                        </h2>
                        <p className="mt-3 font-inter text-[15px] text-[#1a1a1a]/60">
                            Explore the arsenal and find your weapon.
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#DA0213] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                        />
                        <span className="relative">Explore the Arsenal</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative">
                            <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
