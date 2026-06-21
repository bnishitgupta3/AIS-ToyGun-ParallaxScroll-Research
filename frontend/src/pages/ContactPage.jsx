import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, Briefcase, PhoneCall, Send } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const EASE = [0.16, 1, 0.3, 1];

const CHANNELS = [
    {
        icon: Mail,
        title: "Customer support",
        blurb: "Orders, shipping, returns and product help.",
        value: "support@soniqtoys.in",
        href: "mailto:support@soniqtoys.in",
    },
    {
        icon: ShieldCheck,
        title: "Grievance officer",
        blurb: "Formal complaints, acknowledged within 24 hours.",
        value: "grievance@soniqtoys.in",
        href: "mailto:grievance@soniqtoys.in",
    },
    {
        icon: Briefcase,
        title: "Business & partnerships",
        blurb: "Wholesale, dealerships, media and collaborations.",
        value: "hello@soniqtoys.in",
        href: "mailto:hello@soniqtoys.in",
    },
    {
        icon: PhoneCall,
        title: "Consumer helpline",
        blurb: "Government of India National Consumer Helpline.",
        value: "1915",
        href: "tel:1915",
    },
];

export default function ContactPage() {
    useEffect(() => window.scrollTo(0, 0), []);

    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent(
            `Website enquiry from ${form.name || "a visitor"}`,
        );
        const body = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
        );
        window.location.href = `mailto:support@soniqtoys.in?subject=${subject}&body=${body}`;
    };

    return (
        <div className="dot-grid relative min-h-screen overflow-x-hidden text-[#1a1a1a]">
            <LandingNav />

            <main className="mx-auto max-w-6xl px-6 pb-24 pt-36 sm:px-8 md:pt-44">
                {/* ── Hero ── */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="max-w-2xl"
                >
                    <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#f97316]">
                        /// We're listening
                    </span>
                    <h1 className="font-instrument mt-4 text-[clamp(40px,7vw,76px)] leading-[0.95] tracking-tight text-[#1a1a1a]">
                        Let's talk.
                    </h1>
                    <p className="mt-5 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 sm:text-[17px]">
                        Got a question about a blaster, an order on its way, or a
                        partnership in mind? Pick a channel below or send us a note,
                        we read every message.
                    </p>
                </motion.div>

                {/* ── Two-column: channels + form ── */}
                <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                    {/* Channel cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        {CHANNELS.map(({ icon: Icon, title, blurb, value, href }) => (
                            <a
                                key={title}
                                href={href}
                                className="group flex flex-col rounded-2xl border border-black/10 bg-white/55 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f97316]/50 hover:bg-white/80 hover:shadow-[0_12px_30px_-12px_rgba(249,115,22,0.35)]"
                            >
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f97316]/10 text-[#f97316] transition-colors group-hover:bg-[#f97316] group-hover:text-white">
                                    <Icon size={20} strokeWidth={2} />
                                </span>
                                <h2 className="font-instrument mt-4 text-[20px] leading-tight text-[#1a1a1a]">
                                    {title}
                                </h2>
                                <p className="mt-1 font-inter text-[13px] leading-relaxed text-[#1a1a1a]/55">
                                    {blurb}
                                </p>
                                <span className="mt-3 font-inter text-[14px] font-semibold text-[#f97316]">
                                    {value}
                                </span>
                            </a>
                        ))}
                    </motion.div>

                    {/* Message form */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                        className="rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur-sm sm:p-8"
                    >
                        <h2 className="font-instrument text-[26px] leading-tight text-[#1a1a1a]">
                            Send us a message
                        </h2>
                        <p className="mt-2 font-inter text-[13px] text-[#1a1a1a]/55">
                            Opens in your email app, prefilled and ready to send.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={set("name")}
                                    placeholder="Your name"
                                    className="w-full flex-1 rounded-xl border border-black/15 bg-white/70 px-4 py-3 font-inter text-[14px] text-[#1a1a1a] placeholder-[#1a1a1a]/35 outline-none transition-colors focus:border-[#f97316]"
                                />
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={set("email")}
                                    placeholder="you@email.com"
                                    className="w-full flex-1 rounded-xl border border-black/15 bg-white/70 px-4 py-3 font-inter text-[14px] text-[#1a1a1a] placeholder-[#1a1a1a]/35 outline-none transition-colors focus:border-[#f97316]"
                                />
                            </div>
                            <textarea
                                required
                                rows={5}
                                value={form.message}
                                onChange={set("message")}
                                placeholder="How can we help?"
                                className="w-full resize-none rounded-xl border border-black/15 bg-white/70 px-4 py-3 font-inter text-[14px] text-[#1a1a1a] placeholder-[#1a1a1a]/35 outline-none transition-colors focus:border-[#f97316]"
                            />
                            <button
                                type="submit"
                                className="group relative inline-flex items-center justify-center gap-2 self-start overflow-hidden rounded-full bg-[#f97316] px-7 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                                />
                                <Send size={15} strokeWidth={2.4} className="relative" />
                                <span className="relative">Send message</span>
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* ── Footer note ── */}
                <p className="mt-12 font-inter text-[13px] text-[#1a1a1a]/45">
                    Prefer self-serve? Most answers live on our{" "}
                    <Link to="/faq" className="text-[#f97316] underline-offset-2 hover:underline">
                        FAQ
                    </Link>{" "}
                    and{" "}
                    <Link to="/returns" className="text-[#f97316] underline-offset-2 hover:underline">
                        Returns &amp; Shipping
                    </Link>{" "}
                    pages. We typically reply within one business day.
                </p>
            </main>

            <LandingFooter />
        </div>
    );
}
