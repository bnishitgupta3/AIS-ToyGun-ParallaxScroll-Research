import { useEffect } from "react";
import { motion } from "framer-motion";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Shared wrapper for long-form content pages (privacy, terms, returns).
 * Branded dot-grid theme + global navbar + footer.
 */
export default function LegalLayout({ eyebrow, title, updated, children }) {
    useEffect(() => window.scrollTo(0, 0), []);

    return (
        <div className="dot-grid relative min-h-screen overflow-x-hidden text-[#1a1a1a]">
            <LandingNav />

            <main className="mx-auto max-w-3xl px-6 pb-24 pt-36 sm:px-8 md:pt-44">
                <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#f97316]"
                >
                    {eyebrow}
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="font-instrument mt-4 text-[clamp(34px,6vw,60px)] leading-[0.95] tracking-tight text-[#1a1a1a]"
                >
                    {title}
                </motion.h1>

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
