import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ComingSoonGun from "@/components/landing/ComingSoonGun";
import { isPrerendering } from "@/lib/isPrerendering";

const EASE = [0.16, 1, 0.3, 1];
const PRERENDER = isPrerendering();

/**
 * Coming Soon — a warm, punchy product teaser (NOT a centered text page).
 *
 * Asymmetric split: a bold left-aligned headline block on one side, the
 * rotating dark gun silhouette + oversized "COMING SOON" wordmark as a
 * showpiece on the other. Stacks to a compact column on mobile.
 */
export default function ComingSoonPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <div
            className="relative min-h-[100svh] w-full overflow-hidden text-[#1a1a1a]"
            style={{
                background:
                    "radial-gradient(120% 95% at 78% 8%, #FFF4E2 0%, #FCEAD3 45%, #F2DEC4 100%)",
            }}
        >
            {/* warm glow blobs for depth/energy */}
            <div className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-[#FFB867]/30 blur-[130px]" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-[#FF8A3D]/25 blur-[130px]" />

            {/* Top bar — logo (left) + launch badge (right) */}
            <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 sm:px-10">
                <Link
                    to="/"
                    className="font-instrument text-[26px] leading-none tracking-tight text-[#1a1a1a] sm:text-[30px]"
                >
                    SONIQ
                </Link>
                <span className="rounded-full border border-[#1a1a1a]/15 bg-white/50 px-3.5 py-1.5 font-inter text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1a1a1a]/60 backdrop-blur-sm">
                    Launching 2026
                </span>
            </header>

            {/* Split layout */}
            <main className="relative z-20 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center gap-4 px-6 pb-10 pt-24 md:flex-row md:gap-8 md:px-10 md:pb-0 md:pt-0">
                {/* LEFT — bold text block */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="flex w-full flex-col items-center text-center md:w-[52%] md:items-start md:text-left"
                >
                    <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#f97316]">
                        /// SONIQ Toys · Made in India
                    </span>

                    <h1 className="font-instrument mt-4 text-[clamp(46px,8.5vw,94px)] leading-[0.9] tracking-tight text-[#1a1a1a]">
                        Get ready to
                        <br className="hidden sm:block" /> get{" "}
                        <span className="text-[#f97316]">drenched.</span>
                    </h1>

                    <p className="mt-5 max-w-md font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 sm:text-[17px]">
                        Holi mornings, rooftop ambushes, backyard showdowns — a
                        whole new way to play is charging up, and every season just
                        got a lot wetter.
                    </p>

                    {/* Email capture */}
                    {submitted ? (
                        <p className="mt-8 font-inter text-[15px] font-medium text-[#f97316]">
                            You're in. We'll call you to the frontline the moment it drops. ✓
                        </p>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (email) setSubmitted(true);
                            }}
                            className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center"
                        >
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@email.com"
                                className="w-full flex-1 rounded-full border border-black/15 bg-white/70 px-6 py-3.5 font-inter text-[15px] text-[#1a1a1a] placeholder-[#1a1a1a]/35 outline-none backdrop-blur-sm transition-colors focus:border-[#f97316]"
                            />
                            <button
                                type="submit"
                                className="group relative shrink-0 overflow-hidden rounded-full bg-[#f97316] px-7 py-3.5 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                                />
                                <span className="relative">Get Early Access</span>
                            </button>
                        </form>
                    )}

                    {/* Pressure meter — keeps the "charging up" energy */}
                    <div className="mt-7 w-full max-w-[260px]">
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
                </motion.div>

                {/* RIGHT — gun showpiece + oversized wordmark */}
                <div className="relative h-[34vh] min-h-[240px] w-full md:h-[80vh] md:w-[48%]">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="font-instrument select-none text-center text-[clamp(64px,15vw,210px)] leading-[0.8] tracking-tight text-[#1a1a1a]/[0.10] scale-y-[1.6] sm:scale-y-[1.4] md:scale-y-100">
                            COMING
                            <br />
                            SOON
                        </h2>
                    </div>
                    {!PRERENDER && <ComingSoonGun />}
                </div>
            </main>

            {/* Editorial corner label */}
            <div className="pointer-events-none absolute bottom-5 left-6 z-20 hidden font-nokia text-[10px] uppercase tracking-[0.3em] text-[#1a1a1a]/30 sm:block sm:left-10">
                Sec · 00 / 01 · Teaser
            </div>
        </div>
    );
}
