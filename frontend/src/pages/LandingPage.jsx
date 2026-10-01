import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "@/lib/scrollToSection";

import LandingNav     from "@/components/landing/LandingNav";
import HeroCarousel   from "@/components/landing/HeroCarousel";
import ArsenalGrid    from "@/components/landing/ArsenalGrid";
import BuildYourSquad from "@/components/landing/BuildYourSquad";
import MissionSection from "@/components/landing/MissionSection";
// Hidden until real UGC videos are ready.
// import FieldTestSection from "@/components/landing/FieldTestSection";
import LandingFooter  from "@/components/landing/LandingFooter";
import SectionDots    from "@/components/landing/SectionDots";

/* Homepage. The hero is now a shoppable PRODUCT CAROUSEL (HeroCarousel) instead
   of the old video background + fixed 3-D gun — far lighter (three ~0.06 MB
   WebP cutouts vs a multi-MB video), product-led, and fully prerender-friendly.
   Everything sits in normal flow on the light dot-grid background, so the hero
   now flows straight into the Arsenal grid below with no dark-to-light seam. */
export default function LandingPage() {
    const heroRef    = useRef(null);
    const arsenalRef = useRef(null);
    const missionRef = useRef(null);

    /* Cross-page section nav. Sections sit at their natural offsets (no pin
       spacer to wait for), so we scroll straight to the target after a short
       settle once ScrollToTop's reset lands. */
    const location = useLocation();
    useEffect(() => {
        const target = location.state?.scrollTo;
        if (!target) {
            return undefined;
        }
        const id = setTimeout(() => {
            scrollToSection(target);
            window.history.replaceState({}, "");
        }, 260);
        return () => clearTimeout(id);
    }, [location.state]);

    return (
        <div className="dot-grid relative overflow-x-hidden text-[#1a1a1a]">
            <div className="relative z-10">
                <LandingNav />
                <SectionDots />

                {/* 1 — HERO (shoppable product carousel) */}
                <HeroCarousel heroRef={heroRef} />

                {/* 2 — ARSENAL (shoppable photo grid) */}
                <ArsenalGrid arsenalRef={arsenalRef} />

                {/* 2b — BUILD YOUR SQUAD (interactive volume-bundle builder) */}
                <BuildYourSquad />

                {/* 3 — MISSION (dark contrast section) */}
                <MissionSection missionRef={missionRef} />

                {/* 5 — FOOTER */}
                <LandingFooter />
            </div>
        </div>
    );
}
