import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNav from "@/components/landing/LandingNav";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Branded 404 — on-theme, playful, water-fight flavoured.
 */
export default function NotFoundPage() {
    useEffect(() => window.scrollTo(0, 0), []);

    return (
        <div className="dot-grid relative flex min-h-[100svh] flex-col overflow-hidden text-[#1a1a1a]">
            <LandingNav />

            {/* soft accent blobs */}
            <div className="pointer-events-none absolute left-[15%] top-[25%] h-48 w-48 rounded-full bg-[#f97316]/12 blur-3xl" />
            <div className="pointer-events-none absolute right-[18%] bottom-[20%] h-56 w-56 rounded-full bg-[#0871E7]/10 blur-3xl" />

            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
                <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="font-inter text-[11px] font-semibold uppercase tracking-[0.45em] text-[#f97316]"
                >
                    /// Error 404
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.1, ease: EASE }}
                    className="font-instrument mt-5 text-[clamp(64px,16vw,170px)] leading-[0.85] tracking-tight text-[#1a1a1a]"
                >
                    All washed out.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.25, ease: EASE }}
                    className="mt-6 max-w-md font-inter text-[15px] leading-relaxed text-[#1a1a1a]/60 md:text-[17px]"
                >
                    This page slipped away like water through your fingers. The
                    page you're after doesn't exist — but the arsenal is just a
                    click away. Reload, regroup, re-engage.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    <Link
                        to="/"
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                        />
                        <span className="relative">Back to Base</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <Link
                        to="/about"
                        className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a]/25 px-7 py-3 font-inter text-[13px] font-semibold text-[#1a1a1a] transition-all hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"
                    >
                        About UTG
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
