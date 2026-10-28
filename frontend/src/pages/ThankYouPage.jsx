import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, PackageSearch, Mail, MessageCircle, ReceiptText } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { useCart } from "@/lib/cart";

/* ── Order confirmed (post-payment) ──
   Shopflo redirects here after a SUCCESSFUL payment (is_flash_redirect). We clear
   the local cart so the next visit starts fresh. The order number + full details
   go to the buyer by email; this page stays clean and doesn't surface them. */

const NEXT = [
    { icon: Mail, title: "Confirmation on the way", text: "Your order and payment receipt are in your inbox." },
    { icon: PackageSearch, title: "We're packing it", text: "You'll get a tracking link the moment it ships." },
    { icon: MessageCircle, title: "Updates everywhere", text: "Dispatch and delivery alerts by email, SMS and WhatsApp." },
];

/* Shopify customer-accounts portal — the shopper's order history, same URL as
   the nav account icon. Log in with the email used at checkout. */
const ACCOUNT_URL = "https://shopify.com/109663027486/account";

export default function ThankYouPage() {
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

            <main className="mx-auto max-w-3xl px-6 pb-24 pt-36 text-center sm:px-8 md:pt-44">
                {/* ── Hero ── */}
                <div className="reveal-up">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#F8290A] text-white shadow-[0_12px_34px_rgba(248,41,10,0.4)]">
                        <CheckCircle2 size={34} strokeWidth={2.4} />
                    </span>
                    <h1 className="font-instrument mt-6 text-[clamp(44px,8vw,84px)] leading-[0.9] tracking-tight text-[#F8290A]">
                        Order confirmed
                    </h1>
                    <p className="font-instrument mt-2 text-[clamp(22px,4vw,34px)] leading-tight text-[#1a1a1a]">
                        Thank you for your order.
                    </p>
                    <p className="mx-auto mt-5 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 sm:text-[16px]">
                        We got your payment and your order is confirmed. We've emailed you
                        the details, and your tracking link will arrive as soon as it ships.
                    </p>
                </div>

                {/* ── CTAs ── */}
                <div className="reveal-up mt-9 flex flex-wrap items-center justify-center gap-3">
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

                {/* ── Order history (account) ── */}
                <div className="reveal-up mt-4">
                    <a
                        href={ACCOUNT_URL}
                        className="inline-flex items-center gap-1.5 font-inter text-[13px] font-medium text-[#1a1a1a]/55 underline-offset-4 transition-colors hover:text-[#F8290A] hover:underline"
                    >
                        <ReceiptText size={15} strokeWidth={2} />
                        View your orders
                    </a>
                </div>

                {/* ── What happens next ── */}
                <div className="reveal-up mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
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
                <div className="reveal-up mx-auto mt-6 max-w-3xl rounded-2xl border border-black/10 bg-white/55 p-6 text-left font-inter text-[14px] leading-relaxed text-[#1a1a1a]/65 backdrop-blur-sm">
                    <p>
                        Need a hand with this order? Email{" "}
                        <a
                            href="mailto:hello@upyourplay.in?subject=Order%20help"
                            className="font-semibold text-[#F8290A] underline underline-offset-2"
                        >
                            hello@upyourplay.in
                        </a>{" "}
                        and we'll sort it out.
                    </p>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
