import { motion } from "framer-motion";
import TelemetryTyping from "./TelemetryTyping";

const EASE_SPRING = [0.16, 1, 0.3, 1];

/**
 * Hero — strict 2-column split (Jetour paradigm).
 *
 *   ┌───────────────────────────┬───────────────────────────┐
 *   │ LEFT  (text, left-align)   │ RIGHT (3D viewport)        │
 *   │  headline + sub-headline   │  gun model lives here      │
 *   │                            │  TelemetrySpecs bottom-left │
 *   └───────────────────────────┴───────────────────────────┘
 *
 * The gun model is the fixed full-screen <LandingCanvas> behind the page.
 * In LandingPage the hero positions model1 at world x ≈ +2.4 so it renders
 * inside THIS right column — never under the left text.
 */
export default function HeroSection({ heroRef }) {
    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative w-full overflow-hidden"
        >
            <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center px-8 md:grid-cols-2">

                {/* ── LEFT COLUMN — text, strictly left-aligned ── */}
                <div className="relative z-20 pt-28 text-left md:pt-0">
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
                        className="font-instrument text-[clamp(40px,5.5vw,76px)] leading-[0.95] tracking-tight text-[#1a1a1a]"
                    >
                        Zero compromises.
                        <br />
                        <span className="text-[#1a1a1a]/50">Absolute precision.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: EASE_SPRING }}
                        className="mt-6 max-w-[44ch] font-inter text-[15px] leading-relaxed text-[#1a1a1a]/60 md:text-[17px]"
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

                {/* ── RIGHT COLUMN — 3D viewport (gun renders here) ── */}
                <div className="relative h-[50vh] w-full md:h-[80vh]">
                    {/* Optional video overlay — shows only if the file exists.
                        With no file the transparent area lets the fixed 3D
                        canvas (the gun) shine through. */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-0 [&[src]]:opacity-100"
                        src="/assets/hero-video.mp4"
                    />

                    {/* TelemetrySpecs — bottom-left of the 3D viewport, font-nokia */}
                    <div className="absolute bottom-8 left-4 z-10 min-h-[1.8em] min-w-[120px]">
                        <TelemetryTyping />
                    </div>
                </div>
            </div>

            {/* Corner telemetry label */}
            <div className="pointer-events-none absolute bottom-6 right-8 font-nokia text-[10px] uppercase tracking-[0.32em] text-[#1a1a1a]/25">
                Sec · 01 / 05 — Hero
            </div>
        </section>
    );
}
