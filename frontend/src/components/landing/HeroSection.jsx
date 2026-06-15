import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

/* Stagger container — children animate in sequence on load */
const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
};
const rise = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1, ease: EASE },
    },
};

/**
 * Hero — Spyra-style. Full-bleed background video (rendered behind the 3-D
 * canvas in LandingPage) with a dark tint; the headline + 3-D gun sit on top.
 * Text is centred in the upper area (white, over the video) and animates in on
 * load; the gun (fixed canvas) is centred lower so it doesn't collide.
 */
export default function HeroSection({ heroRef }) {
    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden px-6 pt-[16vh] text-center sm:px-8"
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-20 flex flex-col items-center"
            >
                <motion.span
                    variants={rise}
                    className="mb-5 font-inter text-[10px] font-semibold uppercase tracking-[0.45em] text-[#f97316] sm:text-[12px]"
                >
                    /// UTG Tactical · Tactical Division · 2026
                </motion.span>

                <motion.h1
                    variants={rise}
                    className="font-instrument text-[clamp(44px,10vw,104px)] leading-[0.92] tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
                >
                    Zero compromises.
                    <br />
                    <span className="text-white/55">Absolute precision.</span>
                </motion.h1>

                <motion.p
                    variants={rise}
                    className="mt-6 max-w-xl font-inter text-[15px] leading-relaxed text-white/75 sm:text-[17px]"
                >
                    Engineered for backyard domination. Three precision weapons —
                    zero compromises on range, capacity, or fire rate.
                </motion.p>

                <motion.a
                    variants={rise}
                    href="#arsenal"
                    className="group relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                    />
                    <span className="relative">Explore the Arsenal</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                </motion.a>
            </motion.div>

            {/* Scroll cue — bottom-centre */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                className="pointer-events-none absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5"
            >
                <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/55">
                    Scroll to explore
                </span>
                <div className="relative h-8 w-4 rounded-full border border-white/40">
                    <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-0.5 -translate-x-1/2 rounded-full bg-white/60" />
                </div>
            </motion.div>
        </section>
    );
}
