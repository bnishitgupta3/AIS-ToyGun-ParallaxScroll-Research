import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ComingSoonGun from "@/components/landing/ComingSoonGun";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Coming Soon — a sunny teaser built around a rotating DARK SILHOUETTE of the
 * MP5K (shape only, no detail). A big semi-transparent "COMING SOON" sits
 * behind the gun; the copy leans into Indian summer play (Holi, farmhouse
 * pools, water parks, backyards) and builds anticipation.
 */
export default function ComingSoonPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <div
            className="relative min-h-[100svh] overflow-hidden text-[#1a1a1a]"
            style={{
                background:
                    "radial-gradient(75% 65% at 50% 38%, #FFF7EC 0%, #FCEAD3 55%, #F4E5D2 100%)",
            }}
        >
            {/* warm sun glow up top */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(40% 30% at 50% 6%, rgba(255,193,110,0.45) 0%, transparent 70%)",
                }}
            />

            {/* Big "COMING SOON" wordmark — BEHIND the gun, faded */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                <h2 className="font-instrument select-none text-center text-[clamp(64px,19vw,290px)] leading-[0.8] tracking-tight text-[#1a1a1a]/[0.09]">
                    COMING
                    <br />
                    SOON
                </h2>
            </div>

            {/* Rotating dark silhouette (z-1, over the wordmark) */}
            <ComingSoonGun />

            {/* Logo */}
            <header className="absolute left-1/2 top-7 z-20 -translate-x-1/2">
                <Link to="/" className="font-instrument text-[28px] leading-none tracking-tight text-[#1a1a1a]">
                    UTG
                </Link>
            </header>

            {/* Copy frames the gun: hook on top, anticipation + signup at the bottom */}
            <main className="relative z-20 flex min-h-[100svh] flex-col items-center justify-between px-6 pb-9 pt-24 text-center md:pt-28">
                {/* TOP — eyebrow + hook */}
                <div className="flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE }}
                        className="font-inter text-[11px] font-semibold uppercase tracking-[0.45em] text-[#f97316]"
                    >
                        /// UTG Tactical · Made in India · 2026
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: EASE }}
                        className="font-instrument mt-4 text-[clamp(34px,6.5vw,68px)] leading-[0.95] tracking-tight text-[#1a1a1a]"
                    >
                        Get ready to get
                        <span className="text-[#f97316]"> drenched.</span>
                    </motion.h1>
                </div>

                {/* BOTTOM — anticipation copy + pressure meter + signup */}
                <div className="flex w-full flex-col items-center">
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.35, ease: EASE }}
                        className="mb-6 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 md:text-[16px]"
                    >
                        Holi mornings. Farmhouse pools. Water parks, society lawns and
                        sun-soaked backyard showdowns. A whole new way to play is
                        charging up — and this summer will never be dry again.
                    </motion.p>

                    {/* "Pressure building" anticipation meter (on-theme charge bar) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mb-7 w-full max-w-xs"
                    >
                        <div className="mb-2 flex items-center justify-between font-nokia text-[10px] uppercase tracking-[0.25em] text-[#1a1a1a]/45">
                            <span>Pressure building</span>
                            <span>2026</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a1a]/10">
                            <motion.div
                                className="h-full rounded-full bg-[#f97316]"
                                animate={{ width: ["8%", "92%", "8%"] }}
                                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: EASE }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (email) setSubmitted(true);
                        }}
                        className="flex w-full max-w-md items-center gap-3"
                    >
                        {submitted ? (
                            <p className="mx-auto font-inter text-[15px] font-medium text-[#f97316]">
                                You're in. We'll call you to the frontline the moment it drops. ✓
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
                                    <span className="relative">Get Early Access</span>
                                </button>
                            </>
                        )}
                    </motion.form>
                </div>
            </main>
        </div>
    );
}
