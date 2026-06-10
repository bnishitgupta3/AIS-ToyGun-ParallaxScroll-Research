import { motion } from "framer-motion";
import TelemetryTyping from "./TelemetryTyping";

const EASE_SPRING = [0.16, 1, 0.3, 1];

/**
 * Hero — 2-column layout on desktop.
 * Left: text block (left-aligned).
 * Right: video / 3D canvas area with TelemetryTyping anchored bottom-left.
 *
 * The fixed LandingCanvas (z:1) is visible through the transparent right
 * column — no background on the media div means the 3D model shines through.
 * The <video> element overlays when a file exists at /assets/hero-video.mp4.
 */
export default function HeroSection({ heroRef }) {
    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative flex min-h-screen items-center overflow-hidden pt-24 md:pt-32"
        >
            {/* ── 2-column container ── */}
            <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 md:flex-row md:items-center md:justify-between md:px-10 lg:gap-20">

                {/* LEFT: Text block ── strictly left-aligned */}
                <div className="w-full md:w-1/2">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE_SPRING }}
                        className="mb-4 font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#f97316]"
                    >
                        /// UTG · Tactical Division · 2026
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: EASE_SPRING }}
                        className="font-instrument text-[clamp(38px,5.5vw,72px)] leading-[0.9] tracking-tight text-[#1a1a1a]"
                    >
                        Zero compromises.
                        <br />
                        <span className="text-[#1a1a1a]/50">Absolute precision.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: EASE_SPRING }}
                        className="mt-5 max-w-[42ch] font-inter text-[15px] leading-relaxed text-[#1a1a1a]/60 md:text-[17px]"
                    >
                        Engineered for backyard domination. Three precision
                        weapons — zero compromises on range, capacity, or fire rate.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8, ease: EASE_SPRING }}
                        className="mt-10 flex items-center gap-6"
                    >
                        <a
                            href="#arsenal"
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#0871E7] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#DEF0FC] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                            />
                            <span className="relative">Explore the Arsenal</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative">
                                <path d="M12 5v14M5 12l7 7 7-7" />
                            </svg>
                        </a>

                        <div className="flex flex-col items-center gap-1">
                            <span className="font-inter text-[11px] uppercase tracking-[0.15em] text-[#1a1a1a]/40">
                                Scroll
                            </span>
                            <div className="relative h-8 w-4 rounded-full border border-black/20">
                                <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-0.5 -translate-x-1/2 rounded-full bg-[#1a1a1a]/40" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT: Media / 3D canvas area */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    className="relative h-[50vh] w-full md:h-[80vh] md:w-1/2"
                >
                    {/* Video (shows when /assets/hero-video.mp4 exists) */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 h-full w-full rounded-2xl object-cover"
                        src="/assets/hero-video.mp4"
                    />
                    {/* Subtle tint — allows 3D canvas to show through when no video */}
                    <div className="absolute inset-0 rounded-2xl bg-[#F3F4ED]/10" />

                    {/* TelemetryTyping — anchored to bottom-left of media container */}
                    <div className="absolute bottom-4 left-5 z-10 min-h-[1.8em] min-w-[110px]">
                        <TelemetryTyping />
                    </div>
                </motion.div>
            </div>

            {/* Corner telemetry label */}
            <div className="pointer-events-none absolute bottom-6 right-8 font-nokia text-[10px] uppercase tracking-[0.32em] text-[#1a1a1a]/25">
                Sec · 01 / 05 — Hero
            </div>
        </section>
    );
}
