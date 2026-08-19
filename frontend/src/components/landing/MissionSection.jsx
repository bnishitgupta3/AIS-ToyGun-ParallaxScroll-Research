import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Funky statement — warm festival palette (yellow/orange/red) plus a single
   water-blue accent, the closing word runs the animated gradient shimmer.
   Deliberately warm-dominant so it reads as summer/Holi, not a rainbow. */
/* Brand red + yellow, alternating for rhythm. On this dark section the deep
   brand red (#990505) would disappear, so the reds here are the brighter brand
   red (#e11414) and the yellow is the brand yellow (#F8F31A); "engineering." is
   a solid brand yellow rather than the shimmer (the shimmer is tuned for the
   light pages and reads too dark here). */
const WORDS = [
    { text: "Every" },
    { text: "Holi,", color: "#F8F31A" },
    { text: "every" },
    { text: "sunny", color: "#e11414" },
    { text: "day,", color: "#F8F31A" },
    { text: "every" },
    { text: "splash", color: "#e11414" },
    { text: "deserves" },
    { text: "serious", color: "#e11414" },
    { text: "engineering.", color: "#F8F31A" },
];

/* Alternating brand red / yellow so the stat row reads as a vibrant set. */
const STAT_COLORS = ["#F8F31A", "#e11414", "#F8F31A", "#e11414"];
const STATS = [
    { value: "25m", label: "Max Range" },
    { value: "11 r/s", label: "Peak Fire Rate" },
    { value: "3×", label: "More Capacity" },
    { value: "100%", label: "Electric Drive" },
];

export default function MissionSection({ missionRef }) {
    const innerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".mission-word",
                { opacity: 0, y: 28 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    stagger: 0.06,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: missionRef.current,
                        start: "top 70%",
                        end: "top 20%",
                        toggleActions: "play none none reverse",
                    },
                },
            );

            gsap.fromTo(
                ".mission-stat",
                { opacity: 0, x: -24 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: missionRef.current,
                        start: "top 50%",
                        toggleActions: "play none none reverse",
                    },
                },
            );
        }, innerRef);

        return () => ctx.revert();
    }, [missionRef]);

    return (
        <section
            ref={missionRef}
            id="mission"
            className="relative z-10 w-full bg-zinc-950 px-6 py-32 md:px-20 md:py-44"
        >
            <div ref={innerRef} className="mx-auto max-w-6xl">
                <span className="font-mono-tactical text-xs font-bold uppercase tracking-[0.4em] text-[#e11414]">
                    /// The Mission
                </span>

                <div className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                    {WORDS.map(({ text, color, shimmer }, i) => (
                        <span
                            key={i}
                            className={`mission-word font-display inline-block text-[clamp(36px,6vw,88px)] leading-[1.0] ${
                                shimmer ? "text-shimmer" : color ? "" : "text-white"
                            }`}
                            style={{ opacity: 0, ...(color ? { color } : {}) }}
                        >
                            {text}
                        </span>
                    ))}
                </div>

                <p className="mt-12 max-w-[54ch] text-base leading-relaxed text-zinc-400 md:text-lg">
                    From Holi mornings with the whole mohalla to lazy weekend
                    afternoons by the farmhouse pool, we engineered blasters that
                    reach farther, last longer and never run dry. Built for every
                    sunlit day, all year round, made for memories that get
                    gloriously, joyfully wet.
                </p>

                <div className="mt-16 grid grid-cols-2 gap-8 border-t border-zinc-800 pt-12 md:grid-cols-4">
                    {STATS.map((stat, i) => (
                        <div key={stat.label} className="mission-stat" style={{ opacity: 0 }}>
                            <div
                                className="font-display text-5xl"
                                style={{ color: STAT_COLORS[i % STAT_COLORS.length] }}
                            >
                                {stat.value}
                            </div>
                            <div className="mt-2 font-mono-tactical text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
