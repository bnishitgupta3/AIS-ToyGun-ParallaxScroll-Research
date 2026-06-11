import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useProgress } from "@react-three/drei";

import LandingCanvas, { HERO_GUN_X, GUN_SPACING } from "@/components/scene/LandingCanvas";
import LandingNav     from "@/components/landing/LandingNav";
import HeroSection    from "@/components/landing/HeroSection";
import ArsenalSection from "@/components/landing/ArsenalSection";
import MissionSection from "@/components/landing/MissionSection";
import FieldTestSection from "@/components/landing/FieldTestSection";
import LandingFooter  from "@/components/landing/LandingFooter";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ARSENAL_COUNT = 3;   // number of weapons

export default function LandingPage() {
    /* ── 3D model refs – populated inside <Canvas> ── */
    const model1Ref = useRef();  // MP5K-UTG
    const model2Ref = useRef();  // M416
    const model3Ref = useRef();  // Crimson Blaster

    /* ── Shared mouse position for hero mouse-tracking ── */
    const mouseRef = useRef({ x: 0, y: 0 });

    /* ── Section refs ── */
    const heroRef    = useRef(null);
    const arsenalRef = useRef(null);
    const missionRef = useRef(null);

    /* ── Arsenal ScrollTrigger handle (for thumbnail click-to-seek) ── */
    const arsenalST = useRef(null);

    /* ── Scroll progress shared with the 3D canvas ──
       GSAP writes here every scroll tick; the Canvas's useFrame reads it
       and damps the guns toward their targets — decoupling WebGL motion
       from scroll-event frequency for buttery 60fps interpolation. */
    const scrollRef = useRef({ entry: 0, arsenal: 0 });

    /* Smoothly scroll so the Arsenal lands EXACTLY centred on weapon `index`.
       Progress i/(n-1) maps 1:1 to the gun-centred points (0, 0.5, 1). */
    const seekToWeapon = (index) => {
        const st = arsenalST.current;
        if (!st) return;
        const t = index / (ARSENAL_COUNT - 1);          // 0 → 0.5 → 1
        const targetY = st.start + (st.end - st.start) * t;
        gsap.to(window, {
            scrollTo: { y: targetY, autoKill: false },
            duration: 1,
            ease: "power3.inOut",
        });
    };

    /* ── FOUC gate: reveal body only after all .glb assets are loaded ── */
    const { progress, active } = useProgress();
    useEffect(() => {
        if (progress >= 100 && !active) {
            gsap.to("body", {
                autoAlpha: 1,
                duration: 0.6,
                ease: "power2.inOut",
                onStart: () => document.body.classList.remove("loading"),
            });
        }
    }, [progress, active]);

    /* ── Mouse tracking ── */
    useEffect(() => {
        const onMove = (e) => {
            mouseRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
            mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    /* ── GSAP scroll orchestration ── */
    useEffect(() => {
        let cancelled = false;
        let raf;
        let ctx;

        const setup = () => {
            if (cancelled) return;
            const g1 = model1Ref.current;
            const g2 = model2Ref.current;
            const g3 = model3Ref.current;
            if (!g1 || !g2 || !g3) {
                raf = requestAnimationFrame(setup);
                return;
            }
            buildTimelines(g1, g2, g3);
        };
        raf = requestAnimationFrame(setup);

        function buildTimelines(g1, g2, g3) {
            /* ── Initial world positions ──
               First-frame seed only; the Canvas useFrame damps from here on.
               model1 sits at +HERO_GUN_X so it renders in the hero's right
               column with no overlap on the left-aligned text. */
            g1.position.set(HERO_GUN_X,                   0, 0);
            g2.position.set(GUN_SPACING + HERO_GUN_X,     0, 0);
            g3.position.set(2 * GUN_SPACING + HERO_GUN_X, 0, 0);
            g1.scale.setScalar(1);
            g2.scale.setScalar(1);
            g3.scale.setScalar(1);
            g1.rotation.set(0, 0, 0);

            ctx = gsap.context(() => {
                const ACCENTS = ["#f97316", "#0871E7", "#ef4444"];

                /* Toggle the centred info block + bottom thumbnail highlight.
                   idx is rounded so each weapon's "active" band is centred on
                   its gun-centred scroll point (0, 0.5, 1) — text and model
                   are therefore always in sync. */
                const updateActive = (p) => {
                    const idx = Math.round(p * (ARSENAL_COUNT - 1)); // 0 / 1 / 2
                    for (let i = 0; i < ARSENAL_COUNT; i++) {
                        const info = document.getElementById(`arsenal-info-${i}`);
                        if (info) gsap.set(info, {
                            opacity:       i === idx ? 1 : 0,
                            pointerEvents: i === idx ? "auto" : "none",
                        });
                        const thumb = document.getElementById(`arsenal-thumb-${i}`);
                        if (thumb) gsap.set(thumb, {
                            opacity:     i === idx ? 1 : 0.4,
                            borderColor: i === idx ? ACCENTS[i] : "rgba(0,0,0,0.10)",
                        });
                    }
                };

                /* ── HERO → ARSENAL entrance ──
                   Writes `entry` 0→1 as the section scrolls into view. No
                   attached tween — the Canvas reads `entry` and damps the
                   hero offset out. */
                ScrollTrigger.create({
                    trigger: arsenalRef.current,
                    start:   "top bottom",
                    end:     "top top",
                    onUpdate: (self) => { scrollRef.current.entry = self.progress; },
                });

                /* ── ARSENAL pin ──
                   Pins the section for a fixed scroll distance and writes
                   `arsenal` 0→1. NO scrub and NO attached tween: the gun
                   motion is interpolated frame-by-frame in the Canvas's
                   useFrame (THREE damp), which is what makes it buttery and
                   land exactly centred. raw self.progress keeps the math
                   1:1 so click-to-seek is pixel-accurate. */
                const st = ScrollTrigger.create({
                    trigger:             arsenalRef.current,
                    start:               "top top",
                    end:                 () => "+=" + Math.round(window.innerHeight * 2.4),
                    pin:                 true,
                    pinSpacing:          true,
                    anticipatePin:       1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        scrollRef.current.arsenal = self.progress;
                        updateActive(self.progress);
                    },
                    onRefresh: () => updateActive(scrollRef.current.arsenal || 0),
                });

                arsenalST.current = st;
            }); // end gsap.context

            requestAnimationFrame(() => ScrollTrigger.refresh());
        }

        return () => {
            cancelled = true;
            if (raf) cancelAnimationFrame(raf);
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        /*
         * dot-grid = #F3F4ED + 20px radial dot grid.
         * text-[#1a1a1a] = default dark text for all light-theme sections.
         * The fixed Canvas (z:1) floats between the page bg and the HTML
         * overlay (z:10), making the 3D guns visible through transparent areas.
         */
        <div className="dot-grid relative overflow-x-hidden text-[#1a1a1a]">

            {/* Film-grain texture layer (light, subtle on the bright bg) */}
            <div className="film-grain" style={{ opacity: 0.03 }} />

            {/* ── FIXED GLOBAL 3D CANVAS ── */}
            <LandingCanvas
                model1Ref={model1Ref}
                model2Ref={model2Ref}
                model3Ref={model3Ref}
                mouseRef={mouseRef}
                scrollRef={scrollRef}
            />

            {/* ── SCROLLABLE HTML OVERLAY ── */}
            <div className="relative z-10">
                <LandingNav />

                {/* 1 — HERO */}
                <HeroSection heroRef={heroRef} />

                {/* 2 — ARSENAL (GSAP pins this) */}
                <ArsenalSection arsenalRef={arsenalRef} onSelect={seekToWeapon} />

                {/* 3 — MISSION (dark contrast section) */}
                <MissionSection missionRef={missionRef} />

                {/* 4 — FIELD TEST */}
                <FieldTestSection />

                {/* 5 — FOOTER */}
                <LandingFooter />
            </div>
        </div>
    );
}
