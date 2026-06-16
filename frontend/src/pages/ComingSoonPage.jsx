import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

/* Floating droplet accents — purely decorative, theme-tinted blurs. */
const DROPS = [
    { left: "12%", top: "22%", size: 120, color: "rgba(249,115,22,0.16)", dur: 7, delay: 0 },
    { left: "78%", top: "18%", size: 90,  color: "rgba(8,113,231,0.12)",  dur: 9, delay: 1 },
    { left: "68%", top: "70%", size: 150, color: "rgba(249,115,22,0.12)", dur: 8, delay: 0.5 },
    { left: "20%", top: "72%", size: 80,  color: "rgba(8,113,231,0.10)",  dur: 10, delay: 1.5 },
];

/**
 * Coming Soon — standalone, on-theme teaser. Reveals nothing about the
 * products. Reachable now via a navbar link; can later be served on its own
 * as a holding page before the live site goes up.
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

            {/* Minimal logo (links home for now) */}
            <header className="absolute left-1/2 top-7 z-20 -translate-x-1/2">
                <Link
                    to="/"
                    className="font-instrument text-[28px] leading-none tracking-tight text-[#1a1a1a]"
                >
                    UTG
                </Link>
            </header>

            {/* Centered content */}
            <main className="relative z-10 mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 text-center">
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
                    className="font-instrument mt-6 text-[clamp(44px,10.5vw,104px)] leading-[0.92] tracking-tight text-[#1a1a1a]"
                >
                    Redefining
                    <br />
                    <span className="text-[#1a1a1a]/45">how India plays.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                    className="mt-8 max-w-xl font-inter text-[16px] leading-relaxed text-[#1a1a1a]/60 md:text-[18px]"
                >
                    Something big is filling up. We're reimagining the water fight —
                    from Holi to high-noon, beaches to backyards — with blasters
                    engineered to thrill. Less plastic toy, more pure adrenaline.
                    The drop is coming. Be the first to make a splash.
                </motion.p>

                {/* Notify signup */}
                <motion.form
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.55, ease: EASE }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (email) setSubmitted(true);
                    }}
                    className="mt-12 flex w-full max-w-md items-center gap-3"
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
                                className="flex-1 rounded-full border border-black/15 bg-white/60 px-6 py-3 font-inter text-[14px] text-[#1a1a1a] placeholder-[#1a1a1a]/35 outline-none backdrop-blur-sm transition-colors focus:border-[#f97316]"
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

                {/* Coming-soon tag */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className="mt-14 flex items-center gap-3"
                >
                    <span className="h-px w-10 bg-[#1a1a1a]/20" />
                    <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#1a1a1a]/40">
                        Coming Soon · 2026
                    </span>
                    <span className="h-px w-10 bg-[#1a1a1a]/20" />
                </motion.div>
            </main>
        </div>
    );
}
