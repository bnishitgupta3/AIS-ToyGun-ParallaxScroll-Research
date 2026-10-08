import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, Mail, MessageCircle, Smartphone } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

/* ── Track your order (no-login) ──
   Headless storefront with no customer accounts. Tracking works two ways:
     1. The live tracking link we send by email, SMS and WhatsApp the moment an
        order ships — the canonical, no-login path.
     2. This page hands off to our Shiprocket branded tracking page, where the
        customer looks their order up by Order ID or AWB number.
   An inline order-ID + email lookup would need the Shopify Admin API (server
   side); that arrives with the Phase-2 serverless layer. */

const TRACKING_URL = "https://upyourplay.shiprocket.co/tracking";

const CHANNELS = [
    { icon: Mail, title: "Email", text: "Order and shipping confirmations carry your tracking link." },
    { icon: Smartphone, title: "SMS", text: "Dispatch and delivery updates sent to your phone." },
    { icon: MessageCircle, title: "WhatsApp", text: "Real-time order updates, right in your chats." },
];

export default function TrackOrderPage() {
    // Braces required — an implicit return hands scrollTo()'s value back as the
    // effect cleanup, which crashes on some mobiles (see no-implicit-return rule).
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="dot-grid relative min-h-screen overflow-x-hidden text-[#1a1a1a]">
            <LandingNav />

            <main className="mx-auto max-w-4xl px-6 pb-24 pt-36 sm:px-8 md:pt-44">
                {/* ── Hero ── */}
                <div className="reveal-up max-w-2xl">
                    <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#F8290A]">
                        /// Order tracking
                    </span>
                    <h1 className="font-instrument mt-4 text-[clamp(40px,7vw,76px)] leading-[0.95] tracking-tight text-[#1a1a1a]">
                        Track your order.
                    </h1>
                    <p className="mt-5 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 sm:text-[17px]">
                        No login needed. The fastest way is the live tracking link we
                        send you when your order ships. You can also look it up anytime
                        with your Order ID or AWB number.
                    </p>
                </div>

                {/* ── Look-up CTA → Shiprocket branded tracking page ── */}
                <div className="reveal-up mt-12 rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur-sm sm:p-8">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F8290A]/10 text-[#F8290A]">
                            <PackageSearch size={20} strokeWidth={2} />
                        </span>
                        <div>
                            <h2 className="font-instrument text-[22px] leading-tight text-[#1a1a1a]">
                                Look up your order
                            </h2>
                            <p className="font-inter text-[13px] text-[#1a1a1a]/55">
                                Search by your Order ID or AWB number on our live tracking page.
                            </p>
                        </div>
                    </div>
                    <a
                        href={TRACKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#F8290A] px-7 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                    >
                        Track my order
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>

                {/* ── Where your link arrives ── */}
                <div className="reveal-up mt-6 grid gap-4 sm:grid-cols-3">
                    {CHANNELS.map(({ icon: Icon, title, text }) => (
                        <div
                            key={title}
                            className="rounded-2xl border border-black/10 bg-white/55 p-5 backdrop-blur-sm"
                        >
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F8290A]/10 text-[#F8290A]">
                                <Icon size={18} strokeWidth={2} />
                            </span>
                            <h3 className="font-instrument mt-3 text-[18px] leading-tight text-[#1a1a1a]">
                                {title}
                            </h3>
                            <p className="mt-1 font-inter text-[13px] leading-relaxed text-[#1a1a1a]/55">
                                {text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Fallback / help ── */}
                <div className="reveal-up mt-6 rounded-2xl border border-black/10 bg-white/55 p-6 font-inter text-[14px] leading-relaxed text-[#1a1a1a]/65 backdrop-blur-sm">
                    <p>
                        Can't find your order, or no updates yet? Email{" "}
                        <a
                            href="mailto:support@upyourplay.in?subject=Order%20tracking%20help"
                            className="font-semibold text-[#F8290A] underline underline-offset-2"
                        >
                            support@upyourplay.in
                        </a>{" "}
                        with your order ID and we will track it down for you. More answers
                        live on our{" "}
                        <Link to="/faq" className="text-[#F8290A] underline-offset-2 hover:underline">
                            FAQ
                        </Link>{" "}
                        and{" "}
                        <Link to="/returns" className="text-[#F8290A] underline-offset-2 hover:underline">
                            Returns &amp; Shipping
                        </Link>{" "}
                        pages.
                    </p>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
