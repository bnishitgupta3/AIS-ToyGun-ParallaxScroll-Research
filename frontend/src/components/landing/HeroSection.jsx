import { useEffect, useState } from "react";
import { motion } from "@/lib/motionShim";
import DottedArrow from "@/components/landing/DottedArrow";

const EASE = [0.16, 1, 0.3, 1];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};
const rise = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1.05, ease: EASE },
    },
};

/**
 * Hero — Spyra-style video background (rendered behind the canvas) with the
 * headline + 3-D gun on top. The text reveal is GATED behind a short timer so
 * it begins AFTER the page-load FOUC fade — otherwise the animation finishes
 * while the body is still hidden and the text just appears static.
 */
export default function HeroSection({ heroRef }) {
    const [start, setStart] = useState(false);
    useEffect(() => {
        // The body reveals within ~900ms; start the hero reveal just after.
        const t = setTimeout(() => setStart(true), 950);
        return () => clearTimeout(t);
    }, []);

    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden px-6 pt-[12vh] text-center sm:px-8"
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate={start ? "show" : "hidden"}
                className="relative z-20 flex flex-col items-center"
            >
                {/* Hidden (visibility) but keeps its box + mb-5 so the heading
                    stays exactly where it was — user wanted the line gone, not
                    the layout to shift up. */}
                <motion.span
                    variants={rise}
                    aria-hidden="true"
                    className="invisible mb-5 font-inter text-[10px] font-semibold uppercase tracking-[0.4em] text-[#DA0213] sm:text-[12px]"
                >
                    /// SONIQ Toys · Made for Sunlit Days, All Year
                </motion.span>

                <motion.h1
                    variants={rise}
                    className="font-instrument !font-bold text-[clamp(40px,8.6vw,92px)] leading-[0.88] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]"
                >
                    {/* Multi-tone + motion: 'Holi' sways in sunshine yellow,
                        and the payoff line runs an animated colour gradient. */}
                    <span className="sway inline-block text-[#f5b301]">Holi</span>{" "}
                    to high-noon,
                    <br />
                    <span className="text-shimmer">soak every moment.</span>
                </motion.h1>

                <motion.p
                    variants={rise}
                    className="mt-6 max-w-2xl font-inter text-[15px] leading-relaxed text-white/75 sm:text-[17px]"
                >
                    Precision water blasters built for Holi mornings, sunny
                    weekends and every splash in between: beaches, water parks,
                    society lawns, farmhouse pools, rooftops and your own
                    backyard. Whenever the sun's out, play harder.
                </motion.p>

                <motion.div variants={rise} className="relative mt-9 inline-flex flex-col items-center">
                    <a
                        href="#arsenal"
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#DA0213] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                        />
                        <span className="relative">Explore the Arsenal</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                    </a>
                    {/* Playful dotted arrow nudging toward the CTA — desktop only
                        (kept off mobile to avoid crowding the centered layout). */}
                    <div className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 items-center gap-1 md:flex">
                        <DottedArrow className="text-[#f5b301]" />
                        <span className="font-instrument -rotate-6 whitespace-nowrap text-[15px] font-bold text-[#f5b301] drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
                            psst, start here
                        </span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll cue — bottom-centre */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: start ? 1 : 0 }}
                transition={{ delay: start ? 0.8 : 0, duration: 0.8 }}
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
