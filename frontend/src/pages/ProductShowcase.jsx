import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandingNav from "@/components/landing/LandingNav";
import WaterGunScene from "@/components/scene/WaterGunScene";
import HeroOverlay from "@/components/showcase/HeroOverlay";
import SpecsPanel from "@/components/showcase/SpecsPanel";
import ParallaxBackground from "@/components/showcase/ParallaxBackground";
import FooterCTA from "@/components/showcase/FooterCTA";
import AlsoInArsenal from "@/components/showcase/AlsoInArsenal";
import SectionDots from "@/components/landing/SectionDots";
import { isPrerendering } from "@/lib/isPrerendering";

gsap.registerPlugin(ScrollTrigger);

const PRERENDER = isPrerendering();

export default function ProductShowcase() {
    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const modelRef = useRef(null);
    /* FOUC handled globally via body.loading + <BodyReveal /> in App.js */

    useEffect(() => {
        let cancelled = false;
        let raf;

        const setup = () => {
            if (cancelled) return;
            const group = modelRef.current;
            if (!group) {
                raf = requestAnimationFrame(setup);
                return;
            }
            buildTimeline(group);
        };
        raf = requestAnimationFrame(setup);

        let ctx;
        function buildTimeline(group) {
            // Responsive fit. The gun is sized for desktop; on narrow/portrait
            // phones it overflowed both edges (and, pushed right at rest, peeked
            // past the specs panel). Shrink to fit the viewport, and on mobile
            // keep it CENTRED at rest — the full-width opaque panel covers it.
            const aspect  = window.innerWidth / Math.max(1, window.innerHeight);
            const fit     = Math.min(1, Math.max(0.55, aspect * 1.15));
            const settleX = window.innerWidth < 768 ? 0 : 1.55;

            // Park the gun just below the frame at rest so the hero stays clean
            // and the "Scroll to Engage" hint isn't covered by it.
            group.scale.setScalar(0.3 * fit);
            group.position.set(0, -2.45, 0);
            group.rotation.set(0, 0, 0);

            gsap.set("#specs-panel", { opacity: 0, x: -24 });
            gsap.set("#hero-overlay", { opacity: 1 });
            gsap.set("#hero-wordmark", { opacity: 1, y: 0, scale: 1 });
            gsap.set("#hero-subline", { opacity: 1 });
            gsap.set("#hero-eyebrow", { opacity: 1 });
            gsap.set("#scroll-hint", { opacity: 1 });

            ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=3200",
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                // PHASE A — smooth zoom-in. power2.out spreads the growth
                // evenly across the scroll (expo.out front-loaded ~63% of the
                // motion into the first 10%, which popped). Hero text fades
                // out FAST and early so it's clear before the gun reaches
                // centre (text gone by ~0.09; gun hits full scale at 0.30).
                tl.to(group.scale,    { x: fit, y: fit, z: fit, duration: 0.30, ease: "power2.out" }, 0)
                  .to(group.position, { y: 0,            duration: 0.30, ease: "power2.out" }, 0)
                  .to("#hero-eyebrow",{ opacity: 0, y: -16, duration: 0.08, ease: "power2.in" }, 0)
                  .to("#hero-subline",{ opacity: 0, y: -16, duration: 0.08, ease: "power2.in" }, 0)
                  .to("#hero-wordmark",
                    { opacity: 0, y: -120, scale: 0.86, duration: 0.09, ease: "power2.in" },
                    0);

                // Keep the "Scroll to Engage" hint visible through the whole
                // demo and only fade it just before the spec sheet slides in.
                tl.to("#scroll-hint", { opacity: 0, duration: 0.06, ease: "power2.in" }, 0.72);

                // PHASE C — 360° spin (mechanical inOut)
                tl.to(group.rotation,
                    { y: Math.PI * 2, duration: 0.4, ease: "power4.inOut" },
                    0.32);

                // PHASE D — settle (right on desktop; centred on mobile)
                tl.to(group.position,
                    { x: settleX, duration: 0.3, ease: "expo.inOut" }, 0.55)
                  .to(group.scale,
                    { x: 0.95 * fit, y: 0.95 * fit, z: 0.95 * fit, duration: 0.3, ease: "expo.inOut" }, 0.55);

                // PHASE E — specs panel snaps in
                tl.to("#specs-panel",
                    { opacity: 1, x: 0, duration: 0.22, ease: "expo.out" },
                    0.78);

                // PARALLAX shapes — scroll-tied tweens with per-element depth
                gsap.utils.toArray(".parallax-shape").forEach((el) => {
                    const depth = parseFloat(el.dataset.parallax || "0.4");
                    gsap.to(el, {
                        yPercent: -120 * depth,
                        xPercent: (Math.random() - 0.5) * 40 * depth,
                        rotate: (Math.random() - 0.5) * 60 * depth,
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "+=3200",
                            scrub: 1.4,
                        },
                    });
                });
            }, sectionRef);

            requestAnimationFrame(() => ScrollTrigger.refresh());
        }

        return () => {
            cancelled = true;
            if (raf) cancelAnimationFrame(raf);
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <main
            data-testid="product-showcase"
            className="relative w-full bg-[color:var(--bg)] text-[color:var(--ink)]"
        >
            <div>
            {/* Global navbar */}
            <LandingNav />

            {/* Right-edge section dots (hidden over the showcase, appear at the
                cross-sell + deploy sections). */}
            <SectionDots variant="product" />

            {/* PINNED SCROLL SECTION */}
            <section
                ref={sectionRef}
                id="scroll-section"
                data-testid="scroll-container"
                className="relative w-full"
                style={{ height: "100vh" }}
            >
                <div
                    ref={stageRef}
                    id="pinned-stage"
                    data-testid="pinned-stage"
                    className="relative h-screen w-full overflow-hidden"
                >
                    <ParallaxBackground />

                    <div className="absolute inset-0 z-10">
                        {!PRERENDER && (
                            <WaterGunScene modelRef={modelRef} isFiring={false} />
                        )}
                    </div>

                    <HeroOverlay />

                    <SpecsPanel />

                    {/* Side gutter labels */}
                    <div className="pointer-events-none absolute bottom-6 right-8 z-30 hidden font-mono-tactical text-[10px] uppercase tracking-[0.32em] text-zinc-500 md:block">
                        Sec · 01 / 02 · Showcase
                    </div>
                </div>
            </section>

            <AlsoInArsenal currentLink="/product/mp5k" />

            <FooterCTA />
            </div>
        </main>
    );
}
