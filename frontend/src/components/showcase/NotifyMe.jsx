import { useState } from "react";

/* Pre-launch "Notify me at launch" capture.
   Used anywhere a product is flagged `comingSoon` in place of the Buy Now /
   Add to Cart actions.

   ─── CAPTURE SWAP POINT ─────────────────────────────────────────────────────
   There is no backend yet, so submit falls back to a prefilled mailto — the
   same zero-backend pattern the Contact page uses. To store addresses
   properly (build a real launch list), replace ONLY the body of handleSubmit
   with a POST to your form service — Formspree, a Mailchimp/Klaviyo signup
   endpoint, or a serverless function. Keep the input + success-state UI; only
   the transport changes.
   ──────────────────────────────────────────────────────────────────────────── */

const NOTIFY_TO = "hello@soniqtoys.in";

export default function NotifyMe({
    productName = "this drop",
    accent = "#ef4444",
    variant = "light",
}) {
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);

    const dark = variant === "dark";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;

        // SWAP POINT: replace this mailto with a POST to a real list service.
        const subject = encodeURIComponent(`Notify me at launch — ${productName}`);
        const body = encodeURIComponent(
            `Please add me to the ${productName} launch list.\n\nEmail: ${email}`,
        );
        window.location.href = `mailto:${NOTIFY_TO}?subject=${subject}&body=${body}`;

        setDone(true);
    };

    if (done) {
        return (
            <div
                className={`rounded-2xl border px-5 py-4 ${
                    dark ? "border-white/15 bg-white/5" : "border-black/10 bg-black/[0.03]"
                }`}
            >
                <div
                    className="font-mono-tactical text-[11px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: accent }}
                >
                    You're on the list
                </div>
                <p
                    className={`mt-1.5 text-sm leading-relaxed ${
                        dark ? "text-white/70" : "text-zinc-600"
                    }`}
                >
                    We'll email you the moment the {productName} drops. No spam —
                    just the launch.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <label
                className={`font-mono-tactical mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] ${
                    dark ? "text-white/60" : "text-zinc-500"
                }`}
            >
                Get notified at launch
            </label>
            <div className="flex flex-col gap-2.5 sm:flex-row">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={`w-full flex-1 rounded-full border px-5 py-3 font-inter text-[14px] outline-none transition-colors ${
                        dark
                            ? "border-white/20 bg-white/10 text-white placeholder-white/40"
                            : "border-black/15 bg-white text-[#1a1a1a] placeholder-[#1a1a1a]/35"
                    }`}
                    style={{ minWidth: 0 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                    onBlur={(e) =>
                        (e.currentTarget.style.borderColor = dark
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(0,0,0,0.15)")
                    }
                />
                <button
                    type="submit"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 font-inter text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.28)] transition-all hover:brightness-110"
                    style={{ background: accent }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    Notify Me
                </button>
            </div>
        </form>
    );
}
