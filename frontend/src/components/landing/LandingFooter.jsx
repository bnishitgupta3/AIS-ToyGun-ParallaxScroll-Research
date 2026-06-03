import { useState } from "react";

const NAV_LINKS = {
    Products: ["MP5K-UTG", "M416 Water X", "Crimson Blaster", "Accessories"],
    Company: ["About", "Careers", "Press", "Dealers"],
    Support: ["FAQ", "Warranty", "Returns", "Contact"],
    Legal: ["Privacy", "Terms", "Cookies"],
};

const SOCIALS = ["TK", "IG", "YT", "X"];

export default function LandingFooter() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <footer id="footer" className="relative z-10 w-full border-t border-zinc-800 bg-zinc-950">
            <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
                {/* Brand + Newsletter */}
                <div className="grid grid-cols-1 gap-14 md:grid-cols-2">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full bg-orange-500" />
                            <span className="font-mono-tactical text-sm font-bold uppercase tracking-[0.3em] text-white">
                                UTG · Tactical
                            </span>
                        </div>
                        <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-zinc-400">
                            Engineering precision-grade water guns and gel blasters
                            for players who demand more than plastic.
                        </p>
                        <div className="mt-8 flex items-center gap-3">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 font-mono-tactical text-[10px] font-bold text-zinc-500 transition-all hover:border-orange-500 hover:text-orange-500"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="font-mono-tactical text-[11px] font-bold uppercase tracking-[0.3em] text-orange-500">
                            /// Drop Alerts
                        </span>
                        <p className="mt-2 text-sm text-zinc-500">
                            New drops, limited colorways, and early access — first in your inbox.
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (email) setSubmitted(true);
                            }}
                            className="mt-5 flex gap-3"
                        >
                            {submitted ? (
                                <p className="font-mono-tactical text-sm text-orange-400">
                                    You're on the list. ✓
                                </p>
                            ) : (
                                <>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 font-mono-tactical text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-orange-500"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-full bg-orange-500 px-6 py-3 font-mono-tactical text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-orange-400"
                                    >
                                        Join
                                    </button>
                                </>
                            )}
                        </form>
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
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-sm text-zinc-400 transition-colors hover:text-orange-400"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-zinc-800 pt-8 font-mono-tactical text-[10px] uppercase tracking-[0.3em] text-zinc-700 md:flex-row md:items-center">
                    <span>© 2026 UTG Tactical · All rights reserved</span>
                    <span>Built · React · R3F · GSAP</span>
                </div>
            </div>
        </footer>
    );
}
