import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ComingSoonGun from "@/components/landing/ComingSoonGun";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Coming Soon — robustly responsive teaser.
 *
 * Layout is a normal flowing column (eyebrow/headline → gun stage → copy →
 * signup). The rotating dark silhouette and the big "COMING SOON" wordmark
 * live INSIDE a self-contained, overflow-hidden "stage" box, so they can
 * never bleed into and overlap the text on any screen size. Fonts use clamp()
 * so they scale smoothly from small phones to desktop.
 */
export default function ComingSoonPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <div
            className="relative min-h-[100svh] w-full overflow-x-hidden text-[#1a1a1a]"
            style={{
                background:
                    "radial-gradient(80% 60% at 50% 30%, #FFF7EC 0%, #FCEAD3 55%, #F4E5D2 100%)",
            }}
        >
            {/* warm sun glow up top */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(40% 26% at 50% 4%, rgba(255,193,110,0.45) 0%, transparent 70%)",
                }}
            />

            {/* Logo */}
            <header className="absolute left-1/2 top-6 z-30 -translate-x-1/2">
                <Link to="/" className="font-instrument text-[26px] leading-none tracking-tight text-[#1a1a1a] sm:text-[28px]">
                    SONIQ
                </Link>
            </header>

            <main className="relative z-20 mx-auto flex min-h-[100svh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center sm:gap-8 sm:py-28">
                {/* ── Eyebrow + hook ── */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="flex flex-col items-center"
                >
                    <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.4em] text-[#f97316] sm:text-[11px] sm:tracking-[0.45em]">
                        /// SONIQ Toys · Made in India · 2026
                    </span>
                    <h1 className="font-instrument mt-3 text-[clamp(30px,7vw,64px)] leading-[1.0] tracking-tight text-[#1a1a1a]">
                        Get ready to get
                        <span className="text-[#f97316]"> drenched.</span>
                    </h1>
                </motion.div>

                {/* ── GUN STAGE — wordmark + rotating silhouette, fully contained ── */}
                <div className="relative h-[36vh] min-h-[240px] w-full overflow-hidden sm:h-[46vh]">
                    {/* Wordmark behind the gun (clipped to this box) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="font-instrument select-none text-center text-[clamp(58px,16vw,230px)] leading-[0.82] tracking-tight text-[#1a1a1a]/[0.12] scale-y-[1.8] sm:scale-y-[1.4] md:scale-y-100">
                            COMING
                            <br /> <br /> <br />
                            SOON
                        </h2>
                    </div>
                    {/* Rotating dark silhouette (fills + fits this box) */}
                    <ComingSoonGun />
                </div>

                {/* ── Anticipation copy + pressure meter + signup ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: EASE }}
                    className="flex w-full flex-col items-center"
                >
                    <p className="max-w-xl font-inter text-[14px] leading-relaxed text-[#1a1a1a]/65 sm:text-[16px]">
                        Holi mornings. Farmhouse pools. Water parks, society lawns
                        and sun-soaked backyard showdowns. A whole new way to play is
                        charging up, and this summer will never be dry again.
                    </p>

                    {/* "Pressure building" charge meter */}
                    <div className="mt-6 w-full max-w-xs">
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
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (email) setSubmitted(true);
                        }}
                        className="mt-7 flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center"
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
                                    className="w-full flex-1 rounded-full border border-black/15 bg-white/70 px-6 py-3 font-inter text-[14px] text-[#1a1a1a] placeholder-[#1a1a1a]/35 outline-none backdrop-blur-sm transition-colors focus:border-[#f97316]"
                                />
                                <button
                                    type="submit"
                                    className="group relative w-full shrink-0 overflow-hidden rounded-full bg-[#f97316] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110 sm:w-auto"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                                    />
                                    <span className="relative">Get Early Access</span>
                                </button>
                            </>
                        )}
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
