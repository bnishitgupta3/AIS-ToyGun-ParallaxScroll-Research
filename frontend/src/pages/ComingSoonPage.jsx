import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ComingSoonGun from "@/components/landing/ComingSoonGun";

const EASE = [0.16, 1, 0.3, 1];

/* Floating droplet accents — purely decorative, theme-tinted blurs. */
const DROPS = [
    { left: "12%", top: "22%", size: 120, color: "rgba(249,115,22,0.16)", dur: 7, delay: 0 },
    { left: "78%", top: "18%", size: 90,  color: "rgba(8,113,231,0.12)",  dur: 9, delay: 1 },
    { left: "68%", top: "70%", size: 150, color: "rgba(249,115,22,0.12)", dur: 8, delay: 0.5 },
    { left: "20%", top: "72%", size: 80,  color: "rgba(8,113,231,0.10)",  dur: 10, delay: 1.5 },
];

/**
 * Coming Soon — standalone teaser. A slowly auto-rotating all-black MP5K
 * sits behind the copy (top headline + bottom signup frame it). Reveals
 * nothing concrete — pure tease. Can later be served on its own.
 */
export default function ComingSoonPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="dot-grid relative min-h-[100svh] overflow-hidden text-[#1a1a1a]">
            {/* Floating droplet field */}
            {DROPS.map((d, i) => (
                <motion.div
                    key={i}
                    aria-hidden="true"
                    className="pointer-events-none absolute rounded-full blur-2xl"
                    style={{ left: d.left, top: d.top, width: d.size, height: d.size, background: d.color }}
                    animate={{ y: [0, -22, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}

            {/* Rotating dark teaser gun (behind everything) */}
            <ComingSoonGun />

            {/* Minimal logo */}
            <header className="absolute left-1/2 top-7 z-20 -translate-x-1/2">
                <Link
                    to="/"
                    className="font-instrument text-[28px] leading-none tracking-tight text-[#1a1a1a]"
                >
                    UTG
                </Link>
            </header>

            {/* Content frames the gun: headline on top, signup at the bottom */}
            <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-between px-6 pb-10 pt-24 text-center md:pt-28">
                {/* TOP block */}
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
                        transition={{ duration: 1.4, ease: EASE }}
                        className="font-instrument mt-5 text-[clamp(40px,9vw,92px)] leading-[0.92] tracking-tight text-[#1a1a1a]"
                    >
                        Redefining
                        <br />
                        <span className="text-[#1a1a1a]/45">how India plays.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                        className="mt-5 max-w-lg font-inter text-[15px] leading-relaxed text-[#1a1a1a]/55 md:text-[16px]"
                    >
                        Something big is filling up. We're reimagining the water
                        fight — from Holi to high-noon, beaches to backyards. Less
                        plastic toy, more pure adrenaline.
                    </motion.p>
                </div>

                {/* BOTTOM block */}
                <div className="flex w-full flex-col items-center">
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
                                    className="flex-1 rounded-full border border-black/15 bg-white/70 px-6 py-3 font-inter text-[14px] text-[#1a1a1a] placeholder-[#1a1a1a]/35 outline-none backdrop-blur-sm transition-colors focus:border-[#f97316]"
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
                        className="mt-8 flex items-center gap-3"
                    >
                        <span className="h-px w-10 bg-[#1a1a1a]/20" />
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#1a1a1a]/40">
                            Coming Soon · 2026
                        </span>
                        <span className="h-px w-10 bg-[#1a1a1a]/20" />
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
