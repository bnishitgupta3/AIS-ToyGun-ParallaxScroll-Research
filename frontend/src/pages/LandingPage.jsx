import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProgress } from "@react-three/drei";

import LandingCanvas  from "@/components/scene/LandingCanvas";
import LandingNav     from "@/components/landing/LandingNav";
import HeroSection    from "@/components/landing/HeroSection";
import ArsenalSection from "@/components/landing/ArsenalSection";
import MissionSection from "@/components/landing/MissionSection";
import FieldTestSection from "@/components/landing/FieldTestSection";
import LandingFooter  from "@/components/landing/LandingFooter";

gsap.registerPlugin(ScrollTrigger);

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
            /* ── Initial world positions ── */
            g1.position.set(0,  0, 0);
            g2.position.set(12, 0, 0);
            g3.position.set(24, 0, 0);
            g1.scale.setScalar(1);
            g2.scale.setScalar(1);
            g3.scale.setScalar(1);
            g1.rotation.set(0, 0, 0);

            ctx = gsap.context(() => {

                /* ═══════════════════════════════════════════════════════
                   SECTION 2 — ARSENAL
                   GSAP translates the .arsenal-container flex strip on X.
                   The 3D canvas models are kept in sync via onUpdate.
                ═══════════════════════════════════════════════════════ */
                gsap.to(".arsenal-container", {
                    x: () =>
                        -(
                            document.querySelector(".arsenal-container").scrollWidth -
                            window.innerWidth
                        ),
                    ease: "none",
                    scrollTrigger: {
                        trigger:          arsenalRef.current,
                        start:            "top top",
                        end:              () =>
                            "+=" + document.querySelector(".arsenal-container").offsetWidth,
                        pin:              true,
                        scrub:            1,
                        anticipatePin:    1,
                        invalidateOnRefresh: true,
                        onUpdate(self) {
                            const p = self.progress;

                            /* Keep the active gun centred at world x = 0 */
                            const shift = 24 * p;
                            g1.position.x = 0  - shift;
                            g2.position.x = 12 - shift;
                            g3.position.x = 24 - shift;

                            /* Progress dot colours */
                            const d0 = document.getElementById("arsenal-dot-0");
                            const d1 = document.getElementById("arsenal-dot-1");
                            const d2 = document.getElementById("arsenal-dot-2");

                            const on  = (el, c) => gsap.set(el, { scale: 1.8, background: c });
                            const off = (el)    => gsap.set(el, { scale: 1,   background: "rgba(0,0,0,0.18)" });

                            if      (p < 0.34) { on(d0, "#f97316"); off(d1); off(d2); }
                            else if (p < 0.67) { off(d0); on(d1, "#0871E7"); off(d2); }
                            else               { off(d0); off(d1); on(d2, "#ef4444"); }
                        },
                    },
                });

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
                <ArsenalSection arsenalRef={arsenalRef} />

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
