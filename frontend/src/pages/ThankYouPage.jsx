import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, PackageSearch, Mail, MessageCircle } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { useCart } from "@/lib/cart";

/* ── Order confirmed (post-payment) ──
   Shopflo redirects here after a SUCCESSFUL payment (is_flash_redirect), with
   ?order_id=..&checkout_id=.. appended. We confirm the order and clear the local
   cart so the next visit starts fresh. If Shopflo didn't substitute a value, the
   param comes through as a literal "{placeholder}" — treat that as missing. */

function cleanParam(v) {
    if (!v) return "";
    const s = String(v).trim();
    if (s.startsWith("{") && s.endsWith("}")) return ""; // unsubstituted placeholder
    return s;
}

const NEXT = [
    { icon: Mail, title: "Confirmation on the way", text: "Your order and payment receipt are in your inbox." },
    { icon: PackageSearch, title: "We're packing it", text: "You'll get a tracking link the moment it ships." },
    { icon: MessageCircle, title: "Updates everywhere", text: "Dispatch and delivery alerts by email, SMS and WhatsApp." },
];

export default function ThankYouPage() {
    const [params] = useSearchParams();
    const orderId = cleanParam(params.get("order_id"));
    const { clearCart } = useCart();
    const cleared = useRef(false);

    // Braces required — an implicit return hands scrollTo()'s value back as the
    // effect cleanup, which crashes on some mobiles (see no-implicit-return rule).
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Order placed -> empty the cart once (guard against double-run/strict mode).
    useEffect(() => {
        if (!cleared.current) {
            cleared.current = true;
            clearCart();
        }
    }, [clearCart]);

    return (
        <div className="dot-grid relative min-h-screen overflow-x-hidden text-[#1a1a1a]">
            <LandingNav />

            <main className="mx-auto max-w-4xl px-6 pb-24 pt-36 sm:px-8 md:pt-44">
                {/* ── Hero ── */}
                <div className="reveal-up max-w-2xl">
                    <span className="inline-flex items-center gap-2 font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#F8290A]">
                        <CheckCircle2 size={16} strokeWidth={2.4} /> Order confirmed
                    </span>
                    <h1 className="font-instrument mt-4 text-[clamp(40px,7vw,76px)] leading-[0.95] tracking-tight text-[#1a1a1a]">
                        Thank you for your order.
                    </h1>
                    <p className="mt-5 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 sm:text-[17px]">
                        Your payment went through and your order is confirmed.
                        {orderId ? (
                            <>
                                {" "}Your order reference is{" "}
                                <span className="font-semibold text-[#1a1a1a]">#{orderId}</span>.
                            </>
                        ) : null}{" "}
                        We've sent the details to your email, and your tracking link
                        will follow the moment it ships.
                    </p>
                </div>

                {/* ── CTAs ── */}
                <div className="reveal-up mt-9 flex flex-wrap items-center gap-3">
                    <Link
                        to="/track"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F8290A] px-7 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                    >
                        Track my order
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/70 px-7 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-[#1a1a1a] backdrop-blur-sm transition-all hover:bg-white"
                    >
                        Continue shopping
                    </Link>
                </div>

                {/* ── What happens next ── */}
                <div className="reveal-up mt-10 grid gap-4 sm:grid-cols-3">
                    {NEXT.map(({ icon: Icon, title, text }) => (
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

                {/* ── Help ── */}
                <div className="reveal-up mt-6 rounded-2xl border border-black/10 bg-white/55 p-6 font-inter text-[14px] leading-relaxed text-[#1a1a1a]/65 backdrop-blur-sm">
                    <p>
                        Need a hand with this order? Email{" "}
                        <a
                            href="mailto:support@upyourplay.in?subject=Order%20help"
                            className="font-semibold text-[#F8290A] underline underline-offset-2"
                        >
                            support@upyourplay.in
                        </a>{" "}
                        {orderId ? <>with reference <span className="font-semibold">#{orderId}</span> </> : null}
                        and we'll sort it out.
                    </p>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
