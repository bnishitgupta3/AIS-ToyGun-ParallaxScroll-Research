import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import LandingCanvas from "@/components/scene/LandingCanvas";
import LandingNav from "@/components/landing/LandingNav";
import ArsenalSection from "@/components/landing/ArsenalSection";
import MissionSection from "@/components/landing/MissionSection";
import FieldTestSection from "@/components/landing/FieldTestSection";
import LandingFooter from "@/components/landing/LandingFooter";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
    /* ── 3D model refs – populated inside <Canvas> ── */
    const model1Ref = useRef();  // MP5K-UTG
    const model2Ref = useRef();  // M416
    const model3Ref = useRef();  // Crimson Blaster

    /* ── Shared mouse position for hero mouse-tracking ── */
    const mouseRef = useRef({ x: 0, y: 0 });

    /* ── Section refs for ScrollTrigger anchors ── */
    const heroRef    = useRef(null);
    const arsenalRef = useRef(null);
    const missionRef = useRef(null);

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
                   SECTION 2 — ARSENAL  (pinned horizontal model scroll)

                   Card-show thresholds are aligned with when each model
                   has FULLY arrived at centre (end of its slide window):

                   P1 stays put — show immediately until P1→P2 transition
                     is 71% complete  (≈ 0.38 of total scroll).
                   P2 arrives at 0.46 — show from 0.38 (71% through its
                     approach) until P3 is fully settled (0.82).
                   P3 arrives at 0.82 — show from 0.82 onward.

                   This means P2 card stays visible while P3 slides in,
                   then swaps to P3 card only once the gun is settled.
                ═══════════════════════════════════════════════════════ */
                const arsenalTl = gsap.timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: {
                        trigger: arsenalRef.current,
                        start: "top top",
                        end: "+=3200",
                        pin: true,
                        scrub: 1.8,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        onUpdate(self) {
                            const p = self.progress;
                            const c0 = document.getElementById("arsenal-card-0");
                            const c1 = document.getElementById("arsenal-card-1");
                            const c2 = document.getElementById("arsenal-card-2");
                            const d0 = document.getElementById("arsenal-dot-0");
                            const d1 = document.getElementById("arsenal-dot-1");
                            const d2 = document.getElementById("arsenal-dot-2");

                            if (p < 0.38) {
                                // Gun 1 centred
                                gsap.set(c0, { opacity: 1, y: 0,   pointerEvents: "auto" });
                                gsap.set(c1, { opacity: 0, y: 24,  pointerEvents: "none" });
                                gsap.set(c2, { opacity: 0, y: 24,  pointerEvents: "none" });
                                gsap.set(d0, { scale: 1.8, background: "#f97316" });
                                gsap.set(d1, { scale: 1,   background: "rgba(255,255,255,0.2)" });
                                gsap.set(d2, { scale: 1,   background: "rgba(255,255,255,0.2)" });
                            } else if (p < 0.82) {
                                // Gun 2 centred (and stays showing while gun 3 slides in)
                                gsap.set(c0, { opacity: 0, y: -24, pointerEvents: "none" });
                                gsap.set(c1, { opacity: 1, y: 0,   pointerEvents: "auto" });
                                gsap.set(c2, { opacity: 0, y: 24,  pointerEvents: "none" });
                                gsap.set(d0, { scale: 1,   background: "rgba(255,255,255,0.2)" });
                                gsap.set(d1, { scale: 1.8, background: "#3b82f6" });
                                gsap.set(d2, { scale: 1,   background: "rgba(255,255,255,0.2)" });
                            } else {
                                // Gun 3 fully settled at centre
                                gsap.set(c0, { opacity: 0, y: -24, pointerEvents: "none" });
                                gsap.set(c1, { opacity: 0, y: -24, pointerEvents: "none" });
                                gsap.set(c2, { opacity: 1, y: 0,   pointerEvents: "auto" });
                                gsap.set(d0, { scale: 1,   background: "rgba(255,255,255,0.2)" });
                                gsap.set(d1, { scale: 1,   background: "rgba(255,255,255,0.2)" });
                                gsap.set(d2, { scale: 1.8, background: "#ef4444" });
                            }
                        },
                    },
                });

                /*
                  Slide windows (wider = silkier):
                    P1→P2: 0.18–0.46  (28%)
                    P2→P3: 0.54–0.82  (28%)
                */
                arsenalTl
                    .to(g1.position, { x: -12, duration: 0.28 }, 0.18)
                    .to(g2.position, { x:   0, duration: 0.28 }, 0.18)
                    .to(g3.position, { x:  12, duration: 0.28 }, 0.18)
                    .to(g1.position, { x: -24, duration: 0.28 }, 0.54)
                    .to(g2.position, { x: -12, duration: 0.28 }, 0.54)
                    .to(g3.position, { x:   0, duration: 0.28 }, 0.54);

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
        <div className="relative overflow-x-hidden bg-black text-white">
            {/* ── FIXED GLOBAL 3D CANVAS (z: 0) ── */}
            <LandingCanvas
                model1Ref={model1Ref}
                model2Ref={model2Ref}
                model3Ref={model3Ref}
                mouseRef={mouseRef}
            />

            {/* ── SCROLLABLE HTML OVERLAY (z: 10+) ── */}
            <div className="relative z-10">
                <LandingNav />

                {/* ════════════════════════════════════════
                    SECTION 1 — HERO
                ════════════════════════════════════════ */}
                <section
                    ref={heroRef}
                    id="hero"
                    className="relative flex h-screen flex-col items-center justify-center overflow-hidden"
                >
                    {/* Radial accent glow at bottom */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(249,115,22,0.08) 0%, transparent 70%)",
                        }}
                    />

                    <span className="font-mono-tactical mb-6 text-xs font-bold uppercase tracking-[0.5em] text-orange-500">
                        /// UTG · Tactical Division · 2026
                    </span>

                    <h1 className="font-display select-none text-center text-[clamp(64px,16vw,220px)] leading-none text-white">
                        Redefine
                        <br />
                        <span className="text-zinc-600">the Backyard.</span>
                    </h1>

                    <div className="mt-6 flex items-center gap-4 font-mono-tactical text-xs uppercase tracking-[0.35em] text-zinc-500">
                        <span className="h-px w-10 bg-zinc-700" />
                        <span>Three weapons. Zero compromise.</span>
                        <span className="h-px w-10 bg-zinc-700" />
                    </div>

                    <a
                        href="#arsenal"
                        className="mt-12 inline-flex items-center gap-3 rounded-full border border-zinc-700 px-8 py-4 font-mono-tactical text-[12px] font-bold uppercase tracking-[0.25em] text-white transition-all hover:border-orange-500 hover:text-orange-500"
                    >
                        Explore the Arsenal
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                    </a>

                    <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
                        <span className="font-mono-tactical text-[10px] uppercase tracking-[0.35em] text-zinc-600">
                            Scroll to Engage
                        </span>
                        <div className="relative h-9 w-5 rounded-full border border-zinc-700">
                            <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-zinc-600" />
                        </div>
                    </div>

                    <div className="pointer-events-none absolute bottom-6 right-8 font-mono-tactical text-[10px] uppercase tracking-[0.32em] text-zinc-700">
                        Sec · 01 / 05 — Hero
                    </div>
                </section>

                {/* ════════════════════════════════════════
                    SECTION 2 — ARSENAL  (GSAP pins this)
                ════════════════════════════════════════ */}
                <ArsenalSection arsenalRef={arsenalRef} />

                {/* ════════════════════════════════════════
                    SECTION 3 — MISSION  (solid background)
                ════════════════════════════════════════ */}
                <MissionSection missionRef={missionRef} />

                {/* ════════════════════════════════════════
                    SECTION 4 — FIELD TEST
                ════════════════════════════════════════ */}
                <FieldTestSection />

                {/* ════════════════════════════════════════
                    SECTION 5 — FOOTER
                ════════════════════════════════════════ */}
                <LandingFooter />
            </div>
        </div>
    );
}
