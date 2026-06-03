import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WaterGunScene from "@/components/scene/WaterGunScene";
import HeroOverlay from "@/components/showcase/HeroOverlay";
import SpecsPanel from "@/components/showcase/SpecsPanel";
import ParallaxBackground from "@/components/showcase/ParallaxBackground";
import FooterCTA from "@/components/showcase/FooterCTA";
import FireEffects from "@/components/showcase/FireEffects";

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const modelRef = useRef(null);
    const fireResetTimerRef = useRef(null);
    const [isFiring, setIsFiring] = useState(false);

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
                    defaults: { ease: "none" },
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

                // PHASE A — gun zooms in to center (0 → 0.28)
                tl.to(group.scale, { x: 1, y: 1, z: 1, duration: 0.28 }, 0)
                    .to(group.position, { y: 0, duration: 0.28 }, 0)
                    .to("#scroll-hint", { opacity: 0, duration: 0.08 }, 0)
                    .to(
                        "#hero-eyebrow",
                        { opacity: 0, y: -20, duration: 0.18 },
                        0.05,
                    )
                    .to(
                        "#hero-subline",
                        { opacity: 0, y: -20, duration: 0.18 },
                        0.08,
                    );

                // PHASE B — hero wordmark fades & lifts (0.12 → 0.3)
                tl.to(
                    "#hero-wordmark",
                    { opacity: 0, y: -160, scale: 0.86, duration: 0.18 },
                    0.12,
                );

                // PHASE C — 360 spin (0.32 → 0.72)
                tl.to(
                    group.rotation,
                    { y: Math.PI * 2, duration: 0.4 },
                    0.32,
                );

                // PHASE D — settle to the right (0.55 → 0.85)
                tl.to(
                    group.position,
                    { x: 1.55, duration: 0.3 },
                    0.55,
                ).to(
                    group.scale,
                    { x: 0.95, y: 0.95, z: 0.95, duration: 0.3 },
                    0.55,
                );

                // PHASE E — specs panel reveal (0.78 → 1.0)
                tl.to(
                    "#specs-panel",
                    { opacity: 1, x: 0, duration: 0.22 },
                    0.78,
                );

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

    const handleFire = () => {
        if (typeof window !== "undefined") {
            window.__lastFire = { clickedAt: Date.now(), wasFiring: isFiring };
        }
        if (isFiring) return;
        setIsFiring(true);
        if (fireResetTimerRef.current)
            clearTimeout(fireResetTimerRef.current);
        fireResetTimerRef.current = setTimeout(() => {
            if (typeof window !== "undefined") {
                window.__lastFireReset = Date.now();
            }
            setIsFiring(false);
        }, 2400);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.__isFiring = isFiring;
            window.__isFiringChangedAt = Date.now();
        }
    }, [isFiring]);

    useEffect(() => () => clearTimeout(fireResetTimerRef.current), []);

    return (
        <main
            data-testid="product-showcase"
            className="relative w-full bg-[color:var(--bg)] text-[color:var(--ink)]"
        >
            {/* Top nav bar */}
            <header
                data-testid="top-nav"
                className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12"
            >
                <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                    <span className="font-mono-tactical text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-700">
                        UTG · Tactical
                    </span>
                </div>
                <nav className="hidden items-center gap-8 md:flex">
                    {["Models", "Specs", "Loadout", "Dealers"].map((n) => (
                        <a
                            key={n}
                            href={`#${n.toLowerCase()}`}
                            data-testid={`nav-${n.toLowerCase()}`}
                            className="font-mono-tactical text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-600 transition-colors hover:text-[color:var(--accent)]"
                        >
                            {n}
                        </a>
                    ))}
                </nav>
                <a
                    href="#preorder"
                    data-testid="nav-cta"
                    className="hidden rounded-full border border-zinc-900/80 px-5 py-2 font-mono-tactical text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-900 transition-all hover:bg-[color:var(--ink)] hover:text-white md:inline-block"
                >
                    Pre-Order
                </a>
            </header>

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
                        <WaterGunScene modelRef={modelRef} isFiring={isFiring} />
                    </div>

                    <HeroOverlay />

                    <SpecsPanel onFire={handleFire} isFiring={isFiring} />

                    {/* Side gutter labels */}
                    <div className="pointer-events-none absolute bottom-6 right-8 z-30 hidden font-mono-tactical text-[10px] uppercase tracking-[0.32em] text-zinc-500 md:block">
                        Sec · 01 / 02 — Showcase
                    </div>
                </div>
            </section>

            {/* Fixed-position fire effects overlay — sits outside the pinned
                section so its conditional inline-style changes can't trigger
                a ScrollTrigger refresh. */}
            <FireEffects active={isFiring} />

            <FooterCTA />
        </main>
    );
}
