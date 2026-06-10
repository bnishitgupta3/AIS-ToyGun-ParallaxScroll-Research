import { motion } from "framer-motion";
import TelemetryTyping from "./TelemetryTyping";

const EASE_SPRING = [0.16, 1, 0.3, 1];

/**
 * Hero section — light theme with video background.
 *
 * Drop a video file at /assets/hero-video.mp4 to activate the background.
 * Falls back to the page dot-grid if the file is absent.
 */
export default function HeroSection({ heroRef }) {
    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-24 md:pt-32"
        >
            {/* ── Video background ── */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                    src="/assets/hero-video.mp4"
                />
                {/* Slight page-color tint so dot-grid shows through if no video */}
                <div className="absolute inset-0 bg-[#F3F4ED]/20" />
            </div>

            {/* ── Telemetry typing — overlaid on video subject ── */}
            <TelemetryTyping />

            {/* ── Hero text ── */}
            <div className="relative z-20 pointer-events-none text-center">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: EASE_SPRING }}
                    className="font-instrument mb-6 text-[38px] leading-[0.85] tracking-tight text-[#1a1a1a] md:text-[56px] lg:text-[72px]"
                >
                    Zero compromises.
                    <br />
                    Absolute precision.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: EASE_SPRING }}
                    className="mx-auto max-w-xl font-inter text-[16px] leading-relaxed text-[#1a1a1a]/70 md:text-[18px]"
                >
                    Engineered for backyard domination.
                </motion.p>

                {/* Scroll cue */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="pointer-events-auto mt-14 flex flex-col items-center gap-2"
                >
                    <a
                        href="#arsenal"
                        className="font-inter text-[13px] font-medium tracking-[0.15em] text-[#1a1a1a]/50 uppercase transition-opacity hover:opacity-80"
                    >
                        Scroll to explore
                    </a>
                    <div className="relative h-9 w-5 rounded-full border border-black/20">
                        <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-[#1a1a1a]/40" />
                    </div>
                </motion.div>
            </div>

            {/* Corner telemetry */}
            <div className="pointer-events-none absolute bottom-6 right-8 font-nokia text-[10px] uppercase tracking-[0.32em] text-[#1a1a1a]/30">
                Sec · 01 / 05 — Hero
            </div>
        </section>
    );
}
