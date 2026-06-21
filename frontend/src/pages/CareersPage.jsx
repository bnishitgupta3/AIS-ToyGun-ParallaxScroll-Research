import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Hammer, MapPin, Heart, ArrowRight } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const EASE = [0.16, 1, 0.3, 1];

const VALUES = [
    {
        icon: Rocket,
        title: "Early-stage upside",
        blurb: "Join before the launch and help shape the brand, the product and the culture from day one.",
    },
    {
        icon: Hammer,
        title: "Build, ship, repeat",
        blurb: "A tiny team means real ownership. What you make goes live fast, no endless layers of approval.",
    },
    {
        icon: MapPin,
        title: "Made in India",
        blurb: "We design and engineer premium toys here, for here, and for the world after that.",
    },
    {
        icon: Heart,
        title: "Play is the point",
        blurb: "We take fun seriously. Expect water fights in the name of research, Mondays included.",
    },
];

const TEAMS = [
    "Design",
    "Engineering",
    "Operations & Supply",
    "Growth & Marketing",
    "Community",
    "Customer Experience",
];

export default function CareersPage() {
    useEffect(() => window.scrollTo(0, 0), []);

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
                        /// Careers
                    </span>
                    <h1 className="font-instrument mt-4 text-[clamp(40px,7.5vw,80px)] leading-[0.92] tracking-tight text-[#1a1a1a]">
                        Come make a <span className="text-[#f97316]">splash.</span>
                    </h1>
                    <p className="mt-5 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65 sm:text-[17px]">
                        We're building India's most-loved water blaster brand from the
                        ground up, small team, big ambitions, and a genuine obsession
                        with making play better. If that sounds like your kind of
                        mischief, let's talk.
                    </p>
                </motion.div>

                {/* ── Values ── */}
                <div className="mt-16">
                    <h2 className="font-inter text-[12px] font-semibold uppercase tracking-[0.3em] text-[#1a1a1a]/40">
                        Why SONIQ
                    </h2>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {VALUES.map(({ icon: Icon, title, blurb }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.05 * i, ease: EASE }}
                                className="flex flex-col rounded-2xl border border-black/10 bg-white/55 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f97316]/50 hover:bg-white/80 hover:shadow-[0_12px_30px_-12px_rgba(249,115,22,0.35)]"
                            >
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f97316]/10 text-[#f97316]">
                                    <Icon size={20} strokeWidth={2} />
                                </span>
                                <h3 className="font-instrument mt-4 text-[20px] leading-tight text-[#1a1a1a]">
                                    {title}
                                </h3>
                                <p className="mt-1.5 font-inter text-[13px] leading-relaxed text-[#1a1a1a]/55">
                                    {blurb}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Teams ── */}
                <div className="mt-16">
                    <h2 className="font-inter text-[12px] font-semibold uppercase tracking-[0.3em] text-[#1a1a1a]/40">
                        Where we hire
                    </h2>
                    <div className="mt-5 flex flex-wrap gap-3">
                        {TEAMS.map((team) => (
                            <span
                                key={team}
                                className="rounded-full border border-black/10 bg-white/50 px-5 py-2.5 font-inter text-[14px] font-medium text-[#1a1a1a]/75 backdrop-blur-sm"
                            >
                                {team}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Open application CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                    className="relative mt-16 overflow-hidden rounded-3xl border border-[#f97316]/20 bg-gradient-to-br from-[#FFF4E6] to-[#FCEAD3] p-8 sm:p-12"
                >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#FF8A3D]/20 blur-[80px]" />
                    <div className="relative max-w-2xl">
                        <h2 className="font-instrument text-[clamp(26px,4vw,40px)] leading-tight text-[#1a1a1a]">
                            No open role that fits? Tell us anyway.
                        </h2>
                        <p className="mt-3 font-inter text-[15px] leading-relaxed text-[#1a1a1a]/65">
                            We hire for sharpness and spark over tidy résumés. Tell us
                            who you are and what you'd build at SONIQ, and we'll find a
                            way to talk.
                        </p>
                        <a
                            href="mailto:careers@soniqtoys.in?subject=I%20want%20to%20work%20at%20SONIQ"
                            className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-7 py-3.5 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                            />
                            <span className="relative">careers@soniqtoys.in</span>
                            <ArrowRight
                                size={15}
                                strokeWidth={2.6}
                                className="relative transition-transform group-hover:translate-x-0.5"
                            />
                        </a>
                    </div>
                </motion.div>

                <p className="mt-10 font-inter text-[13px] text-[#1a1a1a]/45">
                    Curious about the brand first? Read our{" "}
                    <Link to="/about" className="text-[#f97316] underline-offset-2 hover:underline">
                        story
                    </Link>
                    .
                </p>
            </main>

            <LandingFooter />
        </div>
    );
}
