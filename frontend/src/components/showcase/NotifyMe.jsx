import { useState } from "react";

/* Pre-launch "Notify me at launch" capture.
   Used anywhere a product is flagged `comingSoon` in place of the Buy Now /
   Add to Cart actions.

   Posts to the SAME Formspree form the standalone coming-soon teaser uses, so
   every early-access signup lands in one place. The `source` field tells the
   submissions apart (the coming-soon teaser sends "coming-soon"; the product
   teasers send e.g. "launch-crimson-blaster"). */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvjgyor";

export default function NotifyMe({
    productName = "this drop",
    source = "product-launch",
    accent = "#ef4444",
    variant = "light",
}) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | submitting | success | error
    const [errorMsg, setErrorMsg] = useState("");

    const dark = variant === "dark";

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email || status === "submitting") return;
        setStatus("submitting");
        setErrorMsg("");
        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, source, product: productName }),
            });
            if (res.ok) {
                setStatus("success");
            } else {
                const data = await res.json().catch(() => ({}));
                const msg =
                    data && data.errors && data.errors[0] && data.errors[0].message;
                setErrorMsg(msg || "Something went wrong. Please try again.");
                setStatus("error");
            }
        } catch (_) {
            setErrorMsg("Network error. Please check your connection and try again.");
            setStatus("error");
        }
    }

    if (status === "success") {
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
                    We'll email you the moment the {productName} drops — with
                    early-access offers first. ✓
                </p>
            </div>
        );
    }

    const submitting = status === "submitting";

    return (
        <form onSubmit={handleSubmit} className="w-full" noValidate>
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
                    disabled={submitting}
                    className={`w-full flex-1 rounded-full border px-5 py-3 font-inter text-[14px] outline-none transition-colors disabled:opacity-60 ${
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
                    disabled={submitting}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 font-inter text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.28)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ background: accent }}
                >
                    {submitting ? (
                        "Sending…"
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                            Notify Me
                        </>
                    )}
                </button>
            </div>
            {status === "error" && (
                <p className="mt-2 font-inter text-[12px] text-red-500">{errorMsg}</p>
            )}
        </form>
    );
}
