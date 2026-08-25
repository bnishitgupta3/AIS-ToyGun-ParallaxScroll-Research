import { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

/**
 * Shared wrapper for long-form content pages (privacy, terms, returns).
 * Branded dot-grid theme + global navbar + footer.
 *
 * NOTE: framer-motion (motion.span / motion.h1) was removed here. On some real
 * mobile browsers accessing `motion.<tag>` threw "o is not a function" at render,
 * which crashed the whole page (the error never reproduced in desktop testing).
 * The entrance animation is now a lightweight CSS fade-up (`.reveal-up`), so
 * there is no framer-motion code left to fail. Do NOT reintroduce motion.* here.
 */
export default function LegalLayout({ eyebrow, title, updated, children }) {
    useEffect(() => window.scrollTo(0, 0), []);

    return (
        <div className="dot-grid relative min-h-screen overflow-x-hidden text-[#1a1a1a]">
            <LandingNav />

            <main className="mx-auto max-w-3xl px-6 pb-24 pt-36 sm:px-8 md:pt-44">
                <span className="reveal-up font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#DA0213]">
                    {eyebrow}
                </span>

                <h1 className="reveal-up font-instrument mt-4 text-[clamp(34px,6vw,60px)] leading-[0.95] tracking-tight text-[#1a1a1a]">
                    {title}
                </h1>

                {updated && (
                    <p className="mt-4 font-inter text-[12px] uppercase tracking-[0.2em] text-[#1a1a1a]/40">
                        Last updated · {updated}
                    </p>
                )}

                <div className="legal-body mt-10 space-y-7 font-inter text-[15px] leading-relaxed text-[#1a1a1a]/75">
                    {children}
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}

/* Small section helper for consistent headings inside legal pages */
export function Section({ heading, children }) {
    return (
        <section>
            <h2 className="font-instrument text-[22px] leading-tight text-[#1a1a1a]">
                {heading}
            </h2>
            <div className="mt-3 space-y-3">{children}</div>
        </section>
    );
}
