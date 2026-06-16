import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ComingSoonGun from "@/components/landing/ComingSoonGun";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Coming Soon — a dark, spotlit teaser focused entirely on the slowly
 * rotating all-black MP5K. Deliberately distinct from the site's light
 * dot-grid theme: the gun is the hero, the copy stays minimal.
 */
export default function ComingSoonPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="relative min-h-[100svh] overflow-hidden bg-[#0a0a0b] text-white">
            {/* Focused spotlight backdrop (lighter centre → fades to black edges) */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(60% 55% at 50% 48%, #232427 0%, #141416 45%, #0a0a0b 100%)",
                }}
            />
            {/* warm floor glow under the gun */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                style={{
                    background:
                        "radial-gradient(50% 100% at 50% 100%, rgba(249,115,22,0.16) 0%, transparent 70%)",
                }}
            />

            {/* Rotating dark gun — the centrepiece */}
            <ComingSoonGun />

            {/* Logo */}
            <header className="absolute left-1/2 top-7 z-20 -translate-x-1/2">
                <Link to="/" className="font-instrument text-[28px] leading-none tracking-tight text-white">
                    UTG
                </Link>
            </header>

            {/* Minimal copy framing the gun */}
            <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-between px-6 pb-9 pt-24 text-center md:pt-28">
                {/* Top — eyebrow + short headline */}
                <div className="flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE }}
                        className="font-inter text-[11px] font-semibold uppercase tracking-[0.45em] text-[#f97316]"
                    >
                        /// UTG Tactical · Est. 2026
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.3, ease: EASE }}
                        className="font-instrument mt-4 text-[clamp(38px,8vw,80px)] leading-[0.95] tracking-tight text-white"
                    >
                        Redefining
                        <span className="text-white/40"> how India plays.</span>
                    </motion.h1>
                </div>

                {/* Bottom — signup + tag */}
                <div className="flex w-full flex-col items-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="mb-6 max-w-md font-inter text-[14px] leading-relaxed text-white/55"
                    >
                        Something is loading. The water fight, reimagined — built
                        to thrill. Be the first to make a splash.
                    </motion.p>

                    <motion.form
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.55, ease: EASE }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (email) setSubmitted(true);
                        }}
                        className="flex w-full max-w-md items-center gap-3"
                    >
                        {submitted ? (
                            <p className="mx-auto font-inter text-[15px] font-medium text-[#f97316]">
                                You're on the list — we'll let you know the moment it drops. ✓
                            </p>
                        ) : (
                            <>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@email.com"
                                    className="flex-1 rounded-full border border-white/15 bg-white/10 px-6 py-3 font-inter text-[14px] text-white placeholder-white/40 outline-none backdrop-blur-sm transition-colors focus:border-[#f97316]"
                                />
                                <button
                                    type="submit"
                                    className="group relative shrink-0 overflow-hidden rounded-full bg-[#f97316] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                                    />
                                    <span className="relative">Notify Me</span>
                                </button>
                            </>
                        )}
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.9 }}
                        className="mt-7 flex items-center gap-3"
                    >
                        <span className="h-px w-10 bg-white/20" />
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-white/45">
                            Coming Soon · 2026
                        </span>
                        <span className="h-px w-10 bg-white/20" />
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
