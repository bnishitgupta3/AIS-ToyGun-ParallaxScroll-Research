import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const EASE = [0.16, 1, 0.3, 1];

const STATS = [
    { value: "2026", label: "Founded" },
    { value: "25m", label: "Max Range" },
    { value: "3", label: "Flagship Models" },
    { value: "100%", label: "Electric Drive" },
];

const VALUES = [
    {
        title: "Precision over plastic",
        body: "Every component is CNC-checked and stress-tested. We refuse the throwaway-toy mindset; these are instruments, not novelties.",
    },
    {
        title: "Engineered to dominate",
        body: "Drum-fed magazines, electric drives and calibrated pressure systems deliver range and fire-rate that cheap blasters can't touch.",
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
                <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#f97316]"
                >
                    /// About SONIQ Toys
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.3, ease: EASE }}
                    className="font-instrument mt-5 text-[clamp(40px,8vw,84px)] leading-[0.95] tracking-tight text-[#1a1a1a]"
                >
                    We build the blasters
                    <br />
                    <span className="text-[#1a1a1a]/50">every sunlit day deserves.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
                    className="mt-8 max-w-2xl font-inter text-[16px] leading-relaxed text-[#1a1a1a]/65 md:text-[18px]"
                >
                    SONIQ Toys began with a very Indian frustration: every Holi
                    and every sunny weekend, our water fights deserved better
                    than leaky, short-range plastic. So we brought serious
                    engineering to the fun: precision barrels, electric drives
                    and drum-fed capacity, built for beaches, water parks,
                    society lawns, farmhouse pools, rooftops and the backyards
                    where the best memories get made, the year round.
                </motion.p>

                {/* ── Stats ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: EASE }}
                    className="mt-16 grid grid-cols-2 gap-8 border-t border-black/10 pt-10 md:grid-cols-4"
                >
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
                </motion.div>

                {/* ── Values ── */}
                <div className="mt-24">
                    <h2 className="font-instrument text-[clamp(28px,4vw,48px)] leading-none text-[#1a1a1a]">
                        What we stand for
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {VALUES.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                                className="rounded-2xl border border-black/10 bg-white/50 p-7 backdrop-blur-sm"
                            >
                                <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f97316]">
                                    0{i + 1}
                                </span>
                                <h3 className="font-instrument mt-3 text-2xl text-[#1a1a1a]">
                                    {v.title}
                                </h3>
                                <p className="mt-3 font-inter text-[14px] leading-relaxed text-[#1a1a1a]/60">
                                    {v.body}
                                </p>
                            </motion.div>
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
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
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
