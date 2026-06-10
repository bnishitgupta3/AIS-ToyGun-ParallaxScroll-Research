import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useProgress } from "@react-three/drei";

import LandingCanvas  from "@/components/scene/LandingCanvas";
import LandingNav     from "@/components/landing/LandingNav";
import HeroSection    from "@/components/landing/HeroSection";
import ArsenalSection from "@/components/landing/ArsenalSection";
import MissionSection from "@/components/landing/MissionSection";
import FieldTestSection from "@/components/landing/FieldTestSection";
import LandingFooter  from "@/components/landing/LandingFooter";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ARSENAL_COUNT = 3;       // number of weapons / panels
const HERO_GUN_X     = 2.4;    // world-X that renders model1 in the hero right column

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

    /* Smoothly scroll the page so the Arsenal timeline lands exactly on
       weapon `index`. Driven by the thumbnail nav. */
    const seekToWeapon = (index) => {
        const st = arsenalST.current;
        if (!st) return;
        const t = index / (ARSENAL_COUNT - 1);          // 0 → 0.5 → 1
        const targetY = st.start + (st.end - st.start) * t;
        gsap.to(window, {
            scrollTo: { y: targetY, autoKill: true },
            duration: 1.1,
            ease: "power2.inOut",
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
               During the HERO, model1 sits at +HERO_GUN_X so it renders in
               the right column (no overlap with the left-aligned text).
               Models 2 & 3 wait further right. The entrance tween below
               glides them to 0 / 12 / 24 as the Arsenal scrolls into view,
               so the pin begins with model1 already perfectly centred. */
            g1.position.set(HERO_GUN_X,      0, 0);
            g2.position.set(12 + HERO_GUN_X, 0, 0);
            g3.position.set(24 + HERO_GUN_X, 0, 0);
            g1.scale.setScalar(1);
            g2.scale.setScalar(1);
            g3.scale.setScalar(1);
            g1.rotation.set(0, 0, 0);

            ctx = gsap.context(() => {

                /* ── HERO → ARSENAL entrance ──
                   As the Arsenal section scrolls up into view, slide the
                   guns from their hero offset to the centred arsenal start.
                   Ends exactly when the pin begins (top top). */
                gsap.to([g1.position, g2.position, g3.position], {
                    x: (i) => [0, 12, 24][i],
                    ease: "none",
                    scrollTrigger: {
                        trigger: arsenalRef.current,
                        start: "top bottom",
                        end:   "top top",
                        scrub: 1.5,
                    },
                });

                /* ═══════════════════════════════════════════════════════
                   SECTION 2 — ARSENAL
                   GSAP translates the .arsenal-container flex strip on X.
                   The 3D canvas models are kept in sync via onUpdate.
                ═══════════════════════════════════════════════════════ */
                /*
                 * ── Arsenal GSAP math ──────────────────────────────────
                 * Strip = 3 × 100vw panels (no extra padding) = 300vw total.
                 * Desired translation: -(300vw − 100vw) = −200vw.
                 * Scroll end must equal the translation distance so that
                 * scrub progress 0→1 maps exactly to x 0→−200vw.
                 *
                 * Previous bug: end used offsetWidth (300vw) instead of
                 * (scrollWidth − innerWidth) (200vw), making the pin hold
                 * 100vw longer than the animation needed — the "sticky" feel.
                 */
                const ACCENTS = ["#f97316", "#0871E7", "#ef4444"];

                const getTranslation = () => {
                    const c = document.querySelector(".arsenal-container");
                    return c ? c.scrollWidth - window.innerWidth : 0;
                };

                const arsenalTween = gsap.to(".arsenal-container", {
                    x: () => -getTranslation(),
                    ease: "none",
                    scrollTrigger: {
                        trigger:             arsenalRef.current,
                        start:               "top top",
                        end:                 () => "+=" + getTranslation(),
                        pin:                 true,
                        /* scrub: 1.5 → ScrollTrigger eases the strip's X over a
                           1.5s window, so the WebGL guns (driven off that eased
                           X below) interpolate at a buttery 60fps instead of
                           snapping to raw scroll. */
                        scrub:               1.5,
                        anticipatePin:       1,
                        invalidateOnRefresh: true,
                        onUpdate() {
                            /* ── Drive 3D guns off the EASED container X ──
                               Reading the live (scrub-eased) transform — not the
                               raw scroll progress — means the meshes track the
                               same smoothed curve as the visible strip. Pure ref
                               mutation; no React state, no re-render. */
                            const container = document.querySelector(".arsenal-container");
                            const xNow = Number(gsap.getProperty(container, "x")) || 0;
                            const translation = getTranslation() || 1;
                            const eased = Math.min(1, Math.max(0, -xNow / translation));

                            const shift = 24 * eased;
                            g1.position.x = 0  - shift;
                            g2.position.x = 12 - shift;
                            g3.position.x = 24 - shift;

                            /* ── Active weapon index from eased progress ── */
                            const activeIdx =
                                eased < 0.34 ? 0 : eased < 0.67 ? 1 : 2;

                            /* Centered info block (name + button) */
                            for (let i = 0; i < ARSENAL_COUNT; i++) {
                                const info = document.getElementById(`arsenal-info-${i}`);
                                gsap.set(info, {
                                    opacity:       i === activeIdx ? 1 : 0,
                                    pointerEvents: i === activeIdx ? "auto" : "none",
                                });

                                /* Bottom thumbnail highlight */
                                const thumb = document.getElementById(`arsenal-thumb-${i}`);
                                gsap.set(thumb, {
                                    opacity:     i === activeIdx ? 1 : 0.4,
                                    borderColor: i === activeIdx ? ACCENTS[i] : "rgba(0,0,0,0.10)",
                                });
                            }
                        },
                    },
                });

                /* Expose the ScrollTrigger so thumbnail clicks can seek to it. */
                arsenalST.current = arsenalTween.scrollTrigger;

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
