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
            // Initial state (defensive — also set declaratively in JSX)
            group.scale.setScalar(0.12);
            group.position.set(0, -2.5, 0);
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

                // PHASE A — weighted zoom-in (snap, then settle). Hero text
                // fades out FASTER than the gun grows so they never overlap
                // (gun hits full scale at 0.28; text is gone by ~0.14).
                tl.to(group.scale,    { x: 1, y: 1, z: 1, duration: 0.28, ease: "expo.out" }, 0)
                  .to(group.position, { y: 0,            duration: 0.28, ease: "expo.out" }, 0)
                  .to("#scroll-hint", { opacity: 0,       duration: 0.06, ease: "power2.out" }, 0)
                  .to("#hero-eyebrow",{ opacity: 0, y: -16, duration: 0.10, ease: "power3.in" }, 0)
                  .to("#hero-subline",{ opacity: 0, y: -16, duration: 0.10, ease: "power3.in" }, 0)
                  .to("#hero-wordmark",
                    { opacity: 0, y: -120, scale: 0.86, duration: 0.12, ease: "power4.in" },
                    0);

                // PHASE C — 360° spin (mechanical inOut)
                tl.to(group.rotation,
                    { y: Math.PI * 2, duration: 0.4, ease: "power4.inOut" },
                    0.32);

                // PHASE D — settle to the right (precise, weighted)
                tl.to(group.position,
                    { x: 1.55, duration: 0.3, ease: "expo.inOut" }, 0.55)
                  .to(group.scale,
                    { x: 0.95, y: 0.95, z: 0.95, duration: 0.3, ease: "expo.inOut" }, 0.55);

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
