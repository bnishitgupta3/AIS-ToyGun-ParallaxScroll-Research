import { useEffect, useState } from "react";
import DottedArrow from "@/components/landing/DottedArrow";

/**
 * Hero — video background (behind the canvas) with the headline + 3-D gun on top.
 * Entrance is a plain opacity/translate TRANSITION gated on a JS `start` timer
 * (fires ~950ms in, just after the FOUC body reveal). We use a transition rather
 * than a keyframe animation on purpose: the shown state is a normal class
 * (`opacity-100`), so it can never get "stuck" invisible if the animation is
 * interrupted. framer-motion was removed site-wide; this is its replacement.
 * Mobile spacing is tightened so the CTA doesn't crowd the 3-D gun on small screens.
 */
export default function HeroSection({ heroRef }) {
    const [start, setStart] = useState(false);
    useEffect(() => {
        // The body reveals within ~900ms; begin the hero reveal just after.
        const t = setTimeout(() => setStart(true), 950);
        return () => clearTimeout(t);
    }, []);

    // Shared entrance transition. `start` flips hidden -> shown; per-element
    // transitionDelay (inline) staggers them.
    const rise =
        "transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
        (start ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6");

    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden px-6 pt-[10vh] text-center sm:px-8 sm:pt-[12vh]"
        >
            <div className="relative z-20 flex flex-col items-center">
                {/* Hidden (visibility) but keeps its box + margin so the heading
                    stays put — the line is intentionally not shown. */}
                <span
                    aria-hidden="true"
                    className="invisible mb-4 font-inter text-[10px] font-semibold uppercase tracking-[0.4em] text-[#DA0213] sm:mb-5 sm:text-[12px]"
                >
                    /// SONIQ Toys · Made for Sunlit Days, All Year
                </span>

                <h1
                    className={`${rise} font-instrument !font-bold text-[clamp(36px,8.6vw,92px)] leading-[0.9] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] sm:leading-[0.88]`}
                    style={{ transitionDelay: "0ms" }}
                >
                    {/* Multi-tone + motion: 'Holi' sways in sunshine yellow,
                        and the payoff line runs an animated colour gradient. */}
                    <span className="sway inline-block text-[#f5b301]">Holi</span>{" "}
                    to high-noon,
                    <br />
                    <span className="text-shimmer">soak every moment.</span>
                </h1>

                <p
                    className={`${rise} mt-4 max-w-2xl font-inter text-[13.5px] leading-relaxed text-white/75 sm:mt-6 sm:text-[17px]`}
                    style={{ transitionDelay: "140ms" }}
                >
                    Precision water blasters built for Holi mornings, sunny
                    weekends and every splash in between: beaches, water parks,
                    society lawns, farmhouse pools, rooftops and your own
                    backyard. Whenever the sun's out, play harder.
                </p>

                <div
                    className={`${rise} relative mt-6 inline-flex flex-col items-center sm:mt-9`}
                    style={{ transitionDelay: "280ms" }}
                >
                    <a
                        href="#arsenal"
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#DA0213] px-7 py-3 font-inter text-[13px] font-semibold text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                        />
                        <span className="relative">Explore the Arsenal</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                    </a>
                    {/* Playful dotted arrow nudging toward the CTA — desktop only
                        (kept off mobile to avoid crowding the centered layout). */}
                    <div className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 items-center gap-1 md:flex">
                        <DottedArrow className="text-[#f5b301]" />
                        <span className="font-instrument -rotate-6 whitespace-nowrap text-[15px] font-bold text-[#f5b301] drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
                            psst, start here
                        </span>
                    </div>
                </div>
            </div>

            {/* Scroll cue — bottom-centre */}
            <div
                className={`pointer-events-none absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 transition-opacity duration-700 ${start ? "opacity-100" : "opacity-0"}`}
                style={{ transitionDelay: "550ms" }}
            >
                <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/55">
                    Scroll to explore
                </span>
                <div className="relative h-8 w-4 rounded-full border border-white/40">
                    <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-0.5 -translate-x-1/2 rounded-full bg-white/60" />
                </div>
            </div>
        </section>
    );
}
