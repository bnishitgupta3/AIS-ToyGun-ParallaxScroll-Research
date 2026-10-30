import { useState } from "react";
import { Link } from "react-router-dom";
import { postSignup, isEmail } from "@/lib/notify";
import DottedArrow from "@/components/landing/DottedArrow";
import { asset } from "@/lib/asset";

const NAV_LINKS = {
    Products: [
        { label: "MP5K", to: "/product/mp5k" },
        { label: "M416 Water X", to: "/product/m416" },
        { label: "Crimson Blaster", to: "/product/crimson" },
    ],
    Company: [
        { label: "About", to: "/about" },
        { label: "Careers", to: "/careers" },
    ],
    Support: [
        { label: "Track Order", to: "/track" },
        { label: "FAQ", to: "/faq" },
        { label: "Contact", to: "/contact" },
    ],
    Legal: [
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms & Conditions", to: "/terms" },
        { label: "Returns & Shipping", to: "/returns" },
    ],
};

const SOCIALS = ["TK", "IG", "YT", "X"];

// Payment methods accepted (processed via Cashfree). Shown as the footer "We
// accept" row. Text badges for now — to use the official brand marks, drop the
// logo files into /assets/payments/ and render <img> here instead (brand logos
// shouldn't be hand-reproduced in code).
const PAYMENTS = ["UPI", "Visa", "Mastercard", "RuPay", "Amex", "Net Banking"];

export default function LandingFooter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | submitting | success | error
    const [errorMsg, setErrorMsg] = useState("");

    async function handleDropAlerts(e) {
        e.preventDefault();
        if (status === "submitting") return;
        if (!isEmail(email)) {
            setErrorMsg("Please enter a valid email address.");
            setStatus("error");
            return;
        }
        setStatus("submitting");
        setErrorMsg("");
        try {
            await postSignup({ email, source: "footer-drops" });
            setStatus("success");
        } catch (err) {
            setErrorMsg(err.message || "Network error. Please try again.");
            setStatus("error");
        }
    }

    return (
        <footer id="footer" className="relative z-10 w-full border-t border-zinc-800 bg-zinc-950">
            <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
                {/* Brand + Newsletter */}
                <div className="grid grid-cols-1 gap-14 md:grid-cols-2">
                    <div>
                        <img
                            src={asset("/assets/logo.png?v=2")}
                            alt="Up Your Play"
                            draggable="false"
                            loading="lazy"
                            decoding="async"
                            className="h-8 w-auto"
                        />
                        <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-zinc-400">
                            Engineering precision-grade water guns and gel blasters
                            for players who love serious play.
                        </p>
                        <div className="mt-8 flex items-center gap-3">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 font-mono-tactical text-[10px] font-bold text-zinc-500 transition-all hover:border-[#F8290A] hover:text-[#F8290A]"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="font-mono-tactical text-[11px] font-bold uppercase tracking-[0.3em] text-[#F8290A]">
                            /// Drop Alerts
                        </span>
                        <p className="mt-2 text-sm text-zinc-500">
                            New drops, limited colorways, and early access. First in your inbox.
                        </p>
                        {status !== "success" && (
                            /* Dotted arrow nudging toward the signup field — large
                               screens only, points down at the form below. */
                            <div className="pointer-events-none mt-3 hidden flex-col items-start pl-6 text-[#f5b301] lg:flex">
                                <span className="font-instrument -rotate-2 text-[15px] font-bold">
                                    get on the list
                                </span>
                                <DottedArrow down className="-mt-1 ml-7" />
                            </div>
                        )}
                        {status === "success" ? (
                            <p className="mt-5 font-mono-tactical text-sm text-[#F8290A]">
                                You're on the list. ✓
                            </p>
                        ) : (
                            <form onSubmit={handleDropAlerts} className="mt-5 flex gap-3" noValidate>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    disabled={status === "submitting"}
                                    className="flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 font-mono-tactical text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-[#F8290A] disabled:opacity-60"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="rounded-full bg-[#F8290A] px-6 py-3 font-mono-tactical text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-[#F8290A] disabled:opacity-70"
                                >
                                    {status === "submitting" ? "…" : "Join"}
                                </button>
                            </form>
                        )}
                        {status === "error" && (
                            <p className="mt-2 font-inter text-[12px] text-red-400">{errorMsg}</p>
                        )}
                        {status !== "success" && (
                            <p className="mt-2 font-inter text-[11px] leading-snug text-zinc-600">
                                No spam. See our{" "}
                                <Link to="/privacy" className="text-zinc-500 underline underline-offset-2 hover:text-[#F8290A]">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        )}
                    </div>
                </div>

                {/* Link columns */}
                <div className="mt-16 grid grid-cols-2 gap-8 border-t border-zinc-800 pt-12 md:grid-cols-4">
                    {Object.entries(NAV_LINKS).map(([cat, items]) => (
                        <div key={cat}>
                            <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                                {cat}
                            </span>
                            <ul className="mt-4 space-y-3">
                                {items.map((item) => (
                                    <li key={item.label}>
                                        {item.to === "#" ? (
                                            <span className="text-sm text-zinc-500">
                                                {item.label}
                                            </span>
                                        ) : (
                                            <Link
                                                to={item.to}
                                                className="text-sm text-zinc-400 transition-colors hover:text-[#F8290A]"
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* We accept — payment methods processed via Cashfree */}
                <div className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-zinc-800 pt-8">
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                        We accept
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        {PAYMENTS.map((p) => (
                            <span
                                key={p}
                                className="rounded-md bg-white px-2.5 py-1.5 font-inter text-[11px] font-bold tracking-tight text-[#1a1a1a] shadow-sm"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 flex flex-col items-start justify-between gap-4 font-mono-tactical text-[10px] uppercase tracking-[0.3em] text-zinc-700 md:flex-row md:items-center">
                    <span>© 2026 Up Your Play · All rights reserved</span>
                    <div className="flex items-center gap-5">
                        <Link to="/404" className="text-zinc-700 transition-colors hover:text-[#F8290A]">
                            404
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
