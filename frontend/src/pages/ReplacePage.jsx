import { useEffect } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, PackageSearch, CheckCircle2, Truck } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

/* ── Request a replacement (self-serve) ──
   Replacements only, no cash refunds, within 6 days of delivery. The actual
   returns engine is Eshopbox's branded self-service portal (Eshopbox enforces
   the 6-day window + exchange-only resolution, set under Settings > Customer
   Portal > Manage your return policy). This page is the branded entry point
   that hands the shopper to that portal, same pattern as /track.

   RETURNS_URL: the Eshopbox returns/exchange portal. Defaults to the branded
   customer portal (which also handles tracking); confirm the exact returns URL
   in Eshopbox and update here if it differs. */

const RETURNS_URL = "https://track.upyourplay.in";

const STEPS = [
    { icon: PackageSearch, title: "Look up your order", text: "Enter your Order ID and mobile number to pull up what you bought." },
    { icon: RefreshCw, title: "Pick the item & reason", text: "Choose the blaster to replace and tell us what went wrong." },
    { icon: CheckCircle2, title: "We approve it", text: "We review the request, usually within a day." },
    { icon: Truck, title: "Pickup & replacement", text: "We arrange a free pickup and ship your replacement with fresh tracking." },
];

export default function ReplacePage() {
    // Braces required — an implicit return hands scrollTo()'s value back as the
    // effect cleanup, which crashes on some mobiles (see no-implicit-return rule).
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="dot-grid relative min-h-screen overflow-x-hidden text-[#1a1a1a]">
            <LandingNav />

            <main className="mx-auto max-w-4xl px-6 pb-24 pt-36 sm:px-8 md:pt-44">
                {/* ── Hero ── */}
                <div className="reveal-up max-w-2xl">
                    <h1 className="font-instrument text-[clamp(40px,7vw,76px)] leading-[0.95] tracking-tight text-[#1a1a1a]">
                        Need a replacement?
                    </h1>
                    <p className="mt-5 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 sm:text-[17px]">
                        If your blaster arrived damaged, defective, or not as described,
                        we will replace it. We do replacements, not cash refunds, so you
                        end up with a working blaster, fast. Just start a request within
                        6 days of delivery.
                    </p>
                </div>

                {/* ── Start CTA → Eshopbox returns portal ── */}
                <div className="reveal-up mt-12 rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur-sm sm:p-8">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F8290A]/10 text-[#F8290A]">
                            <RefreshCw size={20} strokeWidth={2} />
                        </span>
                        <div>
                            <h2 className="font-instrument text-[22px] leading-tight text-[#1a1a1a]">
                                Start a replacement
                            </h2>
                            <p className="font-inter text-[13px] text-[#1a1a1a]/55">
                                Look up your order and raise a request in a couple of taps.
                            </p>
                        </div>
                    </div>
                    <a
                        href={RETURNS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#F8290A] px-7 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                    >
                        Start a replacement
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>

                {/* ── How it works ── */}
                <div className="reveal-up mt-10">
                    <h3 className="font-instrument text-[24px] leading-tight text-[#1a1a1a]">How it works</h3>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {STEPS.map(({ icon: Icon, title, text }, i) => (
                            <div
                                key={title}
                                className="rounded-2xl border border-black/10 bg-white/55 p-5 backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F8290A]/10 text-[#F8290A]">
                                        <Icon size={18} strokeWidth={2} />
                                    </span>
                                    <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1a1a1a]/40">
                                        Step {i + 1}
                                    </span>
                                </div>
                                <h4 className="font-instrument mt-3 text-[18px] leading-tight text-[#1a1a1a]">
                                    {title}
                                </h4>
                                <p className="mt-1 font-inter text-[13px] leading-relaxed text-[#1a1a1a]/55">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Eligibility + help ── */}
                <div className="reveal-up mt-6 rounded-2xl border border-black/10 bg-white/55 p-6 font-inter text-[14px] leading-relaxed text-[#1a1a1a]/65 backdrop-blur-sm">
                    <p>
                        <span className="font-semibold text-[#1a1a1a]">Good to know:</span>{" "}
                        replacements are within 6 days of delivery, for items that are
                        damaged, defective, or not as described. The product should be
                        unused and in its original packaging with all accessories. Used
                        gel beads and refills are not eligible unless they were defective
                        on arrival. Full details are on our{" "}
                        <Link to="/returns" className="font-semibold text-[#F8290A] underline underline-offset-2">
                            Returns &amp; Shipping
                        </Link>{" "}
                        page.
                    </p>
                    <p className="mt-3">
                        Stuck, or past the window? Email{" "}
                        <a
                            href="mailto:hello@upyourplay.in?subject=Replacement%20help"
                            className="font-semibold text-[#F8290A] underline underline-offset-2"
                        >
                            hello@upyourplay.in
                        </a>{" "}
                        with your order ID and clear photos or a video of the issue, and
                        we will sort it out.
                    </p>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
