import { useState } from "react";
import { motion } from "framer-motion";
import ComingSoonGun from "@/components/landing/ComingSoonGun";

const EASE = [0.16, 1, 0.3, 1];

/* Formspree endpoint that collects early-access signups.
   Get yours at https://formspree.io → create a form → copy its endpoint
   (looks like https://formspree.io/f/abcdwxyz) and paste it below. */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvjgyor";

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
    const [status, setStatus] = useState("idle"); // idle | submitting | success | error
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email || status === "submitting") return;
        setStatus("submitting");
        setErrorMsg("");
        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ email, source: "coming-soon" }),
            });
            if (res.ok) {
                setStatus("success");
            } else {
                const data = await res.json().catch(() => ({}));
                const msg = data && data.errors && data.errors[0] && data.errors[0].message;
                setErrorMsg(msg || "Something went wrong. Please try again.");
                setStatus("error");
            }
        } catch (_) {
            setErrorMsg("Network error. Please check your connection and try again.");
            setStatus("error");
        }
    }

    return (
        <div
            className="relative h-[100svh] w-full overflow-hidden text-[#1a1a1a]"
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

            {/* Logo — inert on the standalone teaser; clicking it stays here */}
            <header className="absolute left-1/2 top-6 z-30 -translate-x-1/2">
                <span className="font-instrument select-none text-[26px] leading-none tracking-tight text-[#1a1a1a] sm:text-[28px]">
                    SONIQ
                </span>
            </header>

            <main className="relative z-20 mx-auto flex h-[100svh] max-w-2xl flex-col items-center px-6 pb-5 pt-16 text-center sm:pb-10 sm:pt-24">
                {/* ── Eyebrow + hook ── */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="flex shrink-0 flex-col items-center"
                >
                    <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.4em] text-[#f97316] sm:text-[11px] sm:tracking-[0.45em]">
                        /// SONIQ Toys · Made in India · 2026
                    </span>
                    <h1 className="font-instrument mt-3 text-[clamp(30px,7vw,64px)] leading-[1.0] tracking-tight text-[#1a1a1a]">
                        Get ready to get
                        <span className="text-[#f97316]"> drenched.</span>
                    </h1>
                </motion.div>

                {/* ── GUN STAGE — wordmark + rotating silhouette, fully contained.
                    flex-1 so it absorbs whatever vertical space is left between the
                    fixed headline and the fixed signup block → the page always fits
                    exactly one screen (no scroll) on any height. ── */}
                <div className="relative my-2 w-full flex-1 min-h-0 overflow-hidden sm:my-4">
                    {/* Wordmark behind the gun (clipped to this box) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="font-instrument select-none text-center text-[clamp(46px,14vw,230px)] leading-[0.82] tracking-tight text-[#1a1a1a]/[0.12] scale-y-[1.6] sm:scale-y-[1.5] md:scale-y-100">
                            COMING
                            <br />
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
                    className="flex w-full shrink-0 flex-col items-center"
                >
                    <p className="max-w-xl font-inter text-[13px] leading-relaxed text-[#1a1a1a]/65 sm:text-[16px]">
                        Holi mornings. Rooftop ambushes. Farmhouse pools, society
                        lawns and backyard showdowns. A whole new way to play is
                        charging up, and no day, in any season, stays dry again.
                    </p>

                    {/* "Pressure building" charge meter */}
                    <div className="mt-3 w-full max-w-xs sm:mt-5">
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

                    {status === "success" ? (
                        <p className="mt-4 mx-auto max-w-md font-inter text-[15px] font-medium text-[#f97316]">
                            You're in. We'll call you to the frontline the moment it drops, with early-access offers first. ✓
                        </p>
                    ) : (
                        <>
                            <form
                                onSubmit={handleSubmit}
                                className="mt-4 flex w-full max-w-md flex-col items-stretch gap-2.5 sm:mt-6 sm:flex-row sm:items-center sm:gap-3"
                            >
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@email.com"
                                    disabled={status === "submitting"}
                                    className="w-full flex-1 rounded-full border border-black/15 bg-white/70 px-6 py-3 font-inter text-[14px] text-[#1a1a1a] placeholder-[#1a1a1a]/35 outline-none backdrop-blur-sm transition-colors focus:border-[#f97316] disabled:opacity-60"
                                />
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="group relative w-full shrink-0 overflow-hidden rounded-full bg-[#f97316] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                                    />
                                    <span className="relative">
                                        {status === "submitting" ? "Joining…" : "Get Early Access"}
                                    </span>
                                </button>
                            </form>

                            {status === "error" && (
                                <p className="mt-3 font-inter text-[13px] text-red-600">{errorMsg}</p>
                            )}

                            <p className="mt-3 max-w-md font-inter text-[11px] leading-relaxed text-[#1a1a1a]/40">
                                We'll only email you about the launch and early-access offers. No spam, unsubscribe anytime.
                            </p>
                        </>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
