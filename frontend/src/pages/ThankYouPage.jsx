import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, PackageSearch, Mail, MessageCircle } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { useCart } from "@/lib/cart";
import { fetchOrderSummary } from "@/lib/shopflo";

/* ── Order confirmed (post-payment) ──
   Shopflo redirects here after a SUCCESSFUL payment (is_flash_redirect), with the
   order id + checkout id appended. Shopflo's docs disagree on the order-id
   placeholder name, so the worker sends both spellings (order_id + shopify_order_id);
   we read whichever one resolved. The URL only carries Shopify's NUMERIC id, so we
   look the order up through our Worker to show the friendly name (UYP1xxx) + items.
   We clear the local cart so the next visit starts fresh. An unsubstituted value
   arrives as a literal "{placeholder}" — treat it as missing. */

function cleanParam(v) {
    if (!v) return "";
    const s = String(v).trim();
    if (s.startsWith("{") && s.endsWith("}")) return ""; // unsubstituted placeholder
    return s;
}

// ₹ with Indian grouping; show paise only when the amount isn't whole.
function inr(n) {
    const v = Number(n) || 0;
    const opts = v % 1 === 0 ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return "₹" + v.toLocaleString("en-IN", opts);
}

const NEXT = [
    { icon: Mail, title: "Confirmation on the way", text: "Your order and payment receipt are in your inbox." },
    { icon: PackageSearch, title: "We're packing it", text: "You'll get a tracking link the moment it ships." },
    { icon: MessageCircle, title: "Updates everywhere", text: "Dispatch and delivery alerts by email, SMS and WhatsApp." },
];

export default function ThankYouPage() {
    const [params] = useSearchParams();
    const orderId = cleanParam(params.get("order_id")) || cleanParam(params.get("shopify_order_id"));
    const { clearCart } = useCart();
    const cleared = useRef(false);
    const [order, setOrder] = useState(null);

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

    // Resolve the real order (name + items + totals) from our Worker.
    useEffect(() => {
        let alive = true;
        if (orderId) {
            fetchOrderSummary(orderId).then((o) => {
                if (alive && o) setOrder(o);
            });
        }
        return () => {
            alive = false;
        };
    }, [orderId]);

    const orderRef = order && order.name ? order.name : "";

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

                    {orderRef ? (
                        <div className="mt-6">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#F8290A]/25 bg-[#F8290A]/10 px-5 py-2 font-inter text-[14px] font-semibold text-[#1a1a1a]">
                                Order <span className="text-[#F8290A]">#{orderRef}</span>
                            </span>
                        </div>
                    ) : null}

                    <p className="mx-auto mt-5 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 sm:text-[16px]">
                        Your payment went through and your order is confirmed. We've sent
                        the details to your email, and your tracking link will follow the
                        moment it ships.
                    </p>
                </div>

                {/* ── Order summary ── */}
                {order && order.items && order.items.length ? (
                    <div className="reveal-up mx-auto mt-10 max-w-md rounded-2xl border border-black/10 bg-white/70 p-6 text-left backdrop-blur-sm">
                        <h2 className="font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1a1a1a]/50">
                            Order summary
                        </h2>
                        <ul className="mt-4 space-y-3">
                            {order.items.map((it, i) => (
                                <li
                                    key={i}
                                    className="flex items-start justify-between gap-4 font-inter text-[14px]"
                                >
                                    <span className="text-[#1a1a1a]">
                                        {it.title}
                                        <span className="text-[#1a1a1a]/45"> × {it.quantity}</span>
                                    </span>
                                    <span className="shrink-0 font-semibold text-[#1a1a1a]">
                                        {inr(it.lineTotal)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 space-y-2 border-t border-black/10 pt-4 font-inter text-[13px]">
                            {order.discount > 0 ? (
                                <div className="flex justify-between text-[#1a1a1a]/60">
                                    <span>Discount</span>
                                    <span className="font-semibold text-[#1a8a3a]">−{inr(order.discount)}</span>
                                </div>
                            ) : null}
                            <div className="flex justify-between text-[#1a1a1a]/60">
                                <span>Shipping</span>
                                <span>{order.shipping > 0 ? inr(order.shipping) : "Free"}</span>
                            </div>
                            <div className="mt-1 flex justify-between border-t border-black/10 pt-3 text-[15px] font-bold text-[#1a1a1a]">
                                <span>Total paid</span>
                                <span>{inr(order.total)}</span>
                            </div>
                        </div>
                    </div>
                ) : null}

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
                        {orderRef ? <>with reference <span className="font-semibold">#{orderRef}</span> </> : null}
                        and we'll sort it out.
                    </p>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
