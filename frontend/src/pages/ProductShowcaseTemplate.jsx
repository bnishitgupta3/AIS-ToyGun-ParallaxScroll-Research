/**
 * ProductShowcaseTemplate
 * ─────────────────────────────────────────────────────────────────────────
 * Reusable full-page product showcase. Premium pass:
 *   • FOUC gate via drei `useProgress` → GSAP autoAlpha fade-in
 *   • Weighted easings on every scroll tween (expo / power4)
 *   • Dark radial stage + film-grain overlay
 *   • Suspense boundary owned by the page (Canvas mounts; assets stream in)
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import LandingNav from "@/components/landing/LandingNav";
import GenericGunScene from "@/components/scene/GenericGunScene";
import ParallaxBackground from "@/components/showcase/ParallaxBackground";
import ProductActions from "@/components/showcase/ProductActions";
import AlsoInArsenal from "@/components/showcase/AlsoInArsenal";
import { useGLTF } from "@react-three/drei";
import { asset } from "@/lib/asset";
import { isPrerendering } from "@/lib/isPrerendering";

const PRERENDER = isPrerendering();

/* Preload all product models so switching pages feels instant */
useGLTF.preload(asset("/assets/watergun.glb"));
useGLTF.preload(asset("/assets/m416-watergun.glb"));
useGLTF.preload(asset("/assets/crimson-blaster.glb"));

gsap.registerPlugin(ScrollTrigger);

const DEFAULTS = {
    modelUrl:          asset("/assets/watergun.glb"),
    name:              "SONIQ Toys",
    code:              "SONIQ·001",
    tagline:           "Electric Water Gun",
    eyebrow:           "/// SONIQ Toys · 2026",
    accentColor:       "#ff5a1f",
    accentDeep:        "#d63f0a",
    specs: [
        { label: "RANGE",        value: "10–12m" },
        { label: "CAPACITY",     value: "500 Beads" },
        { label: "RATE OF FIRE", value: "8 r/s" },
        { label: "BATTERY",      value: "7.4V Li-Po" },
        { label: "WEIGHT",       value: "1.42 kg" },
        { label: "MODE",         value: "Semi · Burst · Auto" },
    ],
    specsTitle:        ["Built for", "The Backyard", "Battle."],
    specsDescription:  "Drum-fed, electric drive, full-auto rated.",
    version:           "v1.0.0 · SONIQ-001",
    unitLabel:         "7B-001 · In stock",
    homeLink:          "/",
};

export default function ProductShowcaseTemplate({ product: rawProduct }) {
    const product = { ...DEFAULTS, ...rawProduct };

    const sectionRef        = useRef(null);
    const modelRef          = useRef(null);
    /* FOUC handled globally via body.loading + <BodyReveal /> in App.js */

    /* ── GSAP scroll timeline ───────────────────────────────────────── */
    useEffect(() => {
        let cancelled = false;
        let raf;
        let mm;

        const setup = () => {
            if (cancelled) return;
            const group = modelRef.current;
            if (!group) { raf = requestAnimationFrame(setup); return; }
            buildTimeline(group);
        };
        raf = requestAnimationFrame(setup);

        function buildTimeline(group) {
            group.scale.setScalar(0.12);
            group.position.set(0, -2.5, 0);
            group.rotation.set(0, 0, 0);

            gsap.set("#specs-panel",   { opacity: 0, x: -24 });
            gsap.set("#hero-overlay",  { opacity: 1 });
            gsap.set("#hero-wordmark", { opacity: 1, y: 0, scale: 1 });
            gsap.set("#hero-subline",  { opacity: 1 });
            gsap.set("#hero-eyebrow",  { opacity: 1 });
            gsap.set("#scroll-hint",   { opacity: 1 });

            /* Responsive scene params. On mobile (portrait phone), a full-
               scale gun overlaps the SpecsPanel content — render it smaller
               and push it further off-screen at settle so it clears the
               spec rows entirely. gsap.matchMedia auto-rebuilds + reverts
               when the viewport class changes. */
            mm = gsap.matchMedia();
            mm.add(
                { isDesktop: "(min-width: 768px)" },
                (mmCtx) => {
                    const { isDesktop } = mmCtx.conditions;
                    const peakScale = isDesktop ? 1.0 : 0.55;
                    const settleX = isDesktop ? 1.55 : 3.4;
                    const settleScale = isDesktop ? 0.95 : 0.35;

                    /* Scrub timeline — per-tween easing still applies to its
                       own normalised window, giving each phase weight. */
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start:  "top top",
                            end:    "+=3200",
                            pin:    true,
                            scrub:  1,
                            anticipatePin:    1,
                            invalidateOnRefresh: true,
                        },
                    });

                    /* Phase A — heavy zoom-in: snaps fast, settles slow. Hero
                       wordmark + sub fade out FASTER than the gun grows so
                       they never overlap (gun hits peak scale at 0.28; text
                       gone by ~0.14). */
                    tl.to(group.scale,    { x: peakScale, y: peakScale, z: peakScale, duration: 0.28, ease: "expo.out" }, 0)
                      .to(group.position, { y: 0,                                      duration: 0.28, ease: "expo.out" }, 0)
                      .to("#scroll-hint",  { opacity: 0,                               duration: 0.06, ease: "power2.out" }, 0)
                      .to("#hero-eyebrow", { opacity: 0, y: -16,                       duration: 0.10, ease: "power3.in" }, 0)
                      .to("#hero-subline", { opacity: 0, y: -16,                       duration: 0.10, ease: "power3.in" }, 0)
                      .to("#hero-wordmark",
                        { opacity: 0, y: -120, scale: 0.86, duration: 0.12, ease: "power4.in" },
                        0);

                    /* Phase C — 360° showcase spin: power4.inOut = mechanical */
                    tl.to(group.rotation,
                        { y: Math.PI * 2, duration: 0.4, ease: "power4.inOut" },
                        0.32);

                    /* Phase D — settle off to the right; mobile pushes further */
                    tl.to(group.position,
                        { x: settleX, duration: 0.3, ease: "expo.inOut" }, 0.55)
                      .to(group.scale,
                        { x: settleScale, y: settleScale, z: settleScale, duration: 0.3, ease: "expo.inOut" }, 0.55);

                    /* Phase E — specs panel snaps in */
                    tl.to("#specs-panel",
                        { opacity: 1, x: 0, duration: 0.22, ease: "expo.out" },
                        0.78);

                    /* Parallax shapes — kept linear; scroll-bound depth only */
                    gsap.utils.toArray(".parallax-shape").forEach((el) => {
                        const depth = parseFloat(el.dataset.parallax || "0.4");
                        gsap.to(el, {
                            yPercent: -120 * depth,
                            xPercent: (Math.random() - 0.5) * 40 * depth,
                            rotate:   (Math.random() - 0.5) * 60 * depth,
                            ease:     "none",
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start:  "top top",
                                end:    "+=3200",
                                scrub:  1.4,
                            },
                        });
                    });
                },
            );

            requestAnimationFrame(() => ScrollTrigger.refresh());
        }

        return () => {
            cancelled = true;
            if (raf) cancelAnimationFrame(raf);
            if (mm) mm.revert();
        };
    }, []);

    const cssVars = {
        "--accent":      product.accentColor,
        "--accent-deep": product.accentDeep,
    };

    return (
        <main
            className="relative w-full bg-[color:var(--bg)] text-[color:var(--ink)]"
            style={cssVars}
        >
            <div>
                {/* ── Global navbar ── */}
                <LandingNav />

                {/* ── Pinned scroll section ── */}
                <section
                    ref={sectionRef}
                    id="scroll-section"
                    className="relative w-full"
                    style={{ height: "100vh" }}
                >
                    <div className="relative h-screen w-full overflow-hidden">
                        <ParallaxBackground />

                        {/* 3-D canvas layer (skipped during prerender) */}
                        <div className="absolute inset-0 z-10">
                            {!PRERENDER && (
                                <GenericGunScene
                                    key={product.modelUrl}
                                    modelRef={modelRef}
                                    modelUrl={product.modelUrl}
                                    isFiring={false}
                                />
                            )}
                        </div>

                        {/* Hero overlay */}
                        <div
                            id="hero-overlay"
                            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
                        >
                            <span
                                id="hero-eyebrow"
                                className="font-mono-tactical mb-6 text-xs font-bold uppercase tracking-[0.5em]"
                                style={{ color: product.accentColor }}
                            >
                                {product.eyebrow}
                            </span>

                            <h1
                                id="hero-wordmark"
                                className="font-display select-none text-[clamp(72px,18vw,300px)] text-zinc-900"
                                style={{ lineHeight: 0.78 }}
                            >
                                {product.code.split("·").map((part, i, arr) => (
                                    <span key={i}>
                                        {part.trim()}
                                        {i < arr.length - 1 && (
                                            <span
                                                className="inline-block translate-y-[0.08em]"
                                                style={{ color: product.accentColor }}
                                            >
                                                ·
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </h1>

                            <div
                                id="hero-subline"
                                className="mt-4 flex items-center gap-4 font-mono-tactical text-xs uppercase tracking-[0.32em] text-zinc-700"
                            >
                                <span className="h-px w-12 bg-zinc-900/30" />
                                <span>{product.tagline}</span>
                                <span className="h-px w-12 bg-zinc-900/30" />
                            </div>

                            <div
                                id="scroll-hint"
                                className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
                            >
                                <span className="font-mono-tactical text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                                    Scroll to Engage
                                </span>
                                <div className="relative h-9 w-5 rounded-full border border-zinc-400/70">
                                    <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-zinc-700" />
                                </div>
                            </div>
                        </div>

                        {/* Specs panel */}
                        <aside
                            id="specs-panel"
                            className="pointer-events-auto absolute left-0 top-0 z-30 h-full w-full max-w-[440px] px-6 pt-24 md:px-10 md:pt-28 lg:px-14"
                            /* Match GSAP's initial state declaratively so the
                               panel renders hidden from frame 1. */
                            style={{ opacity: 0, transform: "translateX(-24px)" }}
                        >
                            <div className="flex h-full flex-col">
                                <span
                                    className="telemetry-label"
                                    style={{ color: product.accentColor, opacity: 1 }}
                                >
                                    /// Field Spec Sheet
                                </span>
                                <h2 className="font-display mt-4 text-4xl text-zinc-900 sm:text-5xl">
                                    {product.specsTitle[0]}
                                    <br />
                                    {product.specsTitle[1]}
                                    <br />
                                    <span style={{ color: product.accentColor }}>
                                        {product.specsTitle[2]}
                                    </span>
                                </h2>
                                <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-zinc-600">
                                    {product.specsDescription}
                                </p>

                                <ul className="mt-8 space-y-0">
                                    {product.specs.map((s) => (
                                        <li
                                            key={s.label}
                                            className="spec-row flex items-baseline justify-between py-3.5"
                                        >
                                            <span className="telemetry-label text-zinc-500">
                                                {s.label}
                                            </span>
                                            <span className="telemetry-value text-lg text-zinc-900">
                                                {s.value}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Primary conversion cluster — replaces the
                                    old Fire Test button. Sits right after the
                                    user has finished reading the spec sheet. */}
                                <div className="mt-8">
                                    <ProductActions
                                        product={product}
                                        accent={product.accentColor}
                                    />
                                </div>

                                <div className="mt-auto pt-10">
                                    <div className="telemetry-label text-zinc-400">
                                        Unit · {product.unitLabel}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <div className="pointer-events-none absolute bottom-6 right-8 z-30 hidden telemetry-label text-zinc-500 md:block">
                            Sec · 01 / 02 · Showcase
                        </div>
                    </div>
                </section>

                {/* Cross-sell — show the other two products */}
                <AlsoInArsenal currentLink={product.currentLink} />

                {/* ── Footer / CTA (dark) ── */}
                <section className="relative w-full bg-[color:var(--ink)] text-white">
                    <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                            <div className="md:col-span-7">
                                <span
                                    className="telemetry-label"
                                    style={{ color: product.accentColor, opacity: 1 }}
                                >
                                    /// Deploy · 2026
                                </span>
                                <h2 className="font-display mt-5 text-5xl text-white sm:text-6xl">
                                    Ready for every
                                    <br />
                                    <span
                                        className="text-tactical-stroke"
                                        style={{ WebkitTextStrokeColor: "#fff" }}
                                    >
                                        sunlit
                                    </span>{" "}
                                    day.
                                </h2>
                                <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400">
                                    {product.specsDescription} Built for Holi
                                    mornings, weekend pool runs, and every
                                    bright afternoon in between, the year round.
                                </p>
                            </div>

                            <div className="md:col-span-5 md:flex md:items-end md:pl-10">
                                {/* Closing CTAs — Buy Now + Add to Cart. Pricing
                                    block was removed pre-launch; swap in a
                                    price row here once checkout ships. */}
                                <div className="w-full">
                                    <ProductActions
                                        product={product}
                                        accent={product.accentColor}
                                        variant="dark"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 flex items-center justify-between telemetry-label text-zinc-500">
                            <span>© 2026 SONIQ Toys</span>
                            <span>{product.version}</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
