import { motion } from "framer-motion";

const EASE_SPRING = [0.16, 1, 0.3, 1];

/**
 * Hero — responsive 2-column split.
 *   • Desktop: text left, 3D gun right, scroll cue pinned bottom-centre.
 *   • Mobile : text stacks on top, gun renders lower (handled responsively
 *     in LandingCanvas), scroll cue still bottom-centre.
 *
 * The gun is the fixed full-screen <LandingCanvas> behind the page.
 */
export default function HeroSection({ heroRef }) {
    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative w-full overflow-hidden"
        >
            <div className="mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center px-6 sm:px-8 md:grid-cols-2">

                {/* ── LEFT COLUMN — text, strictly left-aligned ── */}
                <div className="relative z-20 pt-28 text-left md:pt-0">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE_SPRING }}
                        className="mb-4 font-inter text-[10px] font-semibold uppercase tracking-[0.35em] text-[#f97316] sm:text-[11px] sm:tracking-[0.4em]"
                    >
                        /// UTG · Tactical Division · 2026
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: EASE_SPRING }}
                        className="font-instrument text-[clamp(38px,9vw,76px)] leading-[0.95] tracking-tight text-[#1a1a1a]"
                    >
                        Zero compromises.
                        <br />
                        <span className="text-[#1a1a1a]/50">Absolute precision.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: EASE_SPRING }}
                        className="mt-5 max-w-[44ch] font-inter text-[14px] leading-relaxed text-[#1a1a1a]/60 sm:mt-6 sm:text-[16px] md:text-[17px]"
                    >
                        Engineered for backyard domination. Three precision
                        weapons — zero compromises on range, capacity, or fire rate.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8, ease: EASE_SPRING }}
                        className="mt-8 sm:mt-10"
                    >
                        <a
                            href="#arsenal"
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-6 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110 sm:px-7"
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
                    </motion.div>
                </div>

                {/* ── RIGHT COLUMN — 3D viewport (gun renders here) ── */}
                <div className="relative h-[42vh] w-full md:h-[80vh]">
                    {/* Optional video overlay — shows only if the file exists. */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-0 [&[src]]:opacity-100"
                        src="/assets/hero-video.mp4"
                    />
                </div>
            </div>

            {/* Scroll cue — pinned BOTTOM-CENTRE of the hero */}
            <div className="pointer-events-none absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5">
                <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#1a1a1a]/40">
                    Scroll to explore
                </span>
                <div className="relative h-8 w-4 rounded-full border border-black/20">
                    <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-0.5 -translate-x-1/2 rounded-full bg-[#1a1a1a]/40" />
                </div>
            </div>

            {/* Corner telemetry label — hidden on small screens to avoid clutter */}
            <div className="pointer-events-none absolute bottom-6 right-6 hidden font-nokia text-[10px] uppercase tracking-[0.32em] text-[#1a1a1a]/25 sm:block">
                Sec · 01 / 05 — Hero
            </div>
        </section>
    );
}
