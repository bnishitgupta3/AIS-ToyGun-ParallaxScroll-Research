import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "@/lib/scrollToSection";

import LandingCanvas from "@/components/scene/LandingCanvas";
import LandingNav     from "@/components/landing/LandingNav";
import HeroVideo      from "@/components/landing/HeroVideo";
import HeroSection    from "@/components/landing/HeroSection";
import ArsenalGrid    from "@/components/landing/ArsenalGrid";
import MissionSection from "@/components/landing/MissionSection";
// Hidden until real UGC videos are ready.
// import FieldTestSection from "@/components/landing/FieldTestSection";
import LandingFooter  from "@/components/landing/LandingFooter";
import SectionDots    from "@/components/landing/SectionDots";
import { isPrerendering } from "@/lib/isPrerendering";

const PRERENDER = isPrerendering();

/* Homepage. The Arsenal is now a shoppable photo GRID (ArsenalGrid) rather than
   a pinned 3-D carousel — lighter, faster, more conversion-focused. A single
   cinematic 3-D gun still anchors the hero for brand; it fades out as you scroll
   past so the grid below sits on a clean background. */
export default function LandingPage() {
    /* Hero gun ref (populated inside <Canvas>). model2/3 are kept only so the
       LandingCanvas prop shape is unchanged; the two Arsenal-only guns are no
       longer mounted (no carousel), which drops ~14 MB from the homepage. */
    const model1Ref = useRef();
    const model2Ref = useRef();
    const model3Ref = useRef();

    const mouseRef  = useRef({ x: 0, y: 0 });
    /* The Canvas reads this; with no carousel it stays at the hero pose. */
    const scrollRef = useRef({ entry: 0, arsenal: 0 });

    const heroRef    = useRef(null);
    const arsenalRef = useRef(null);
    const missionRef = useRef(null);

    /* Fade the fixed hero canvas out over the first viewport of scroll, so the
       3-D gun owns the hero and disappears cleanly before the Arsenal grid. */
    const [canvasOpacity, setCanvasOpacity] = useState(1);
    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                setCanvasOpacity(1 - Math.min(1, window.scrollY / (window.innerHeight * 0.85)));
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    /* Mouse tracking for the hero gun tilt */
    useEffect(() => {
        const onMove = (e) => {
            mouseRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
            mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    /* Cross-page section nav. Sections now sit at their natural offsets (no pin
       spacer to wait for), so we scroll straight to the target after a short
       settle once ScrollToTop's reset lands. */
    const location = useLocation();
    useEffect(() => {
        const target = location.state?.scrollTo;
        if (!target) return;
        const id = setTimeout(() => {
            scrollToSection(target);
            window.history.replaceState({}, "");
        }, 260);
        return () => clearTimeout(id);
    }, [location.state]);

    return (
        <div className="dot-grid relative overflow-x-hidden text-[#1a1a1a]">
            {!PRERENDER && (
                <>
                    {/* ── HERO BACKGROUND VIDEO (behind the 3-D canvas) ── */}
                    <HeroVideo />

                    {/* ── FIXED 3-D HERO GUN — fades out past the hero ── */}
                    <div
                        style={{
                            opacity: canvasOpacity,
                            transition: "opacity 120ms linear",
                            visibility: canvasOpacity <= 0.02 ? "hidden" : "visible",
                        }}
                    >
                        <LandingCanvas
                            model1Ref={model1Ref}
                            model2Ref={model2Ref}
                            model3Ref={model3Ref}
                            mouseRef={mouseRef}
                            scrollRef={scrollRef}
                        />
                    </div>
                </>
            )}

            {/* ── SCROLLABLE HTML OVERLAY ── */}
            <div className="relative z-10">
                <LandingNav />
                <SectionDots />

                {/* 1 — HERO */}
                <HeroSection heroRef={heroRef} />

                {/* 2 — ARSENAL (shoppable photo grid) */}
                <ArsenalGrid arsenalRef={arsenalRef} />

                {/* 3 — MISSION (dark contrast section) */}
                <MissionSection missionRef={missionRef} />

                {/* 5 — FOOTER */}
                <LandingFooter />
            </div>
        </div>
    );
}
