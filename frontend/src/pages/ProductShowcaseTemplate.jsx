/**
 * ProductShowcaseTemplate
 * ─────────────────────────────────────────────────────────────────────────
 * Reusable full-page product showcase. Premium pass:
 *   • FOUC gate via drei `useProgress` → GSAP autoAlpha fade-in
 *   • Weighted easings on every scroll tween (expo / power4)
 *   • Dark radial stage + film-grain overlay
 *   • Suspense boundary owned by the page (Canvas mounts; assets stream in)
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import LandingNav from "@/components/landing/LandingNav";
import GenericGunScene from "@/components/scene/GenericGunScene";
import ParallaxBackground from "@/components/showcase/ParallaxBackground";
import FireEffects from "@/components/showcase/FireEffects";
import { useGLTF } from "@react-three/drei";
import { asset } from "@/lib/asset";

/* Preload all product models so switching pages feels instant */
useGLTF.preload(asset("/assets/watergun.glb"));
useGLTF.preload(asset("/assets/m416-watergun.glb"));
useGLTF.preload(asset("/assets/crimson-blaster.glb"));

gsap.registerPlugin(ScrollTrigger);

const DEFAULTS = {
    modelUrl:          asset("/assets/watergun.glb"),
    name:              "UTG Tactical",
    code:              "UTG·001",
    tagline:           "Electric Water Gun",
    eyebrow:           "/// UTG · Tactical Division · 2026",
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
    price:             "$89.00",
    squadPrice:        "$299.00",
    version:           "v1.0.0 · UTG-001",
    unitLabel:         "7B-001 · In stock",
    homeLink:          "/",
};

export default function ProductShowcaseTemplate({ product: rawProduct }) {
    const product = { ...DEFAULTS, ...rawProduct };

    const sectionRef        = useRef(null);
    const modelRef          = useRef(null);
    const fireResetTimerRef = useRef(null);
    const [isFiring, setIsFiring] = useState(false);
    /* FOUC handled globally via body.loading + <BodyReveal /> in App.js */

    /* ── GSAP scroll timeline ───────────────────────────────────────── */
    useEffect(() => {
        let cancelled = false;
        let raf;
        let ctx;

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

            ctx = gsap.context(() => {
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

                /* Phase A — heavy zoom-in: snaps fast, settles slow */
                tl.to(group.scale,    { x: 1, y: 1, z: 1, duration: 0.28, ease: "expo.out" }, 0)
                  .to(group.position, { y: 0,            duration: 0.28, ease: "expo.out" }, 0)
                  .to("#scroll-hint",  { opacity: 0,      duration: 0.08, ease: "power2.out" }, 0)
                  .to("#hero-eyebrow", { opacity: 0, y: -20, duration: 0.18, ease: "power3.in" }, 0.05)
                  .to("#hero-subline", { opacity: 0, y: -20, duration: 0.18, ease: "power3.in" }, 0.08);

                /* Phase B — wordmark fades & lifts */
                tl.to("#hero-wordmark",
                    { opacity: 0, y: -160, scale: 0.86, duration: 0.18, ease: "power4.in" },
                    0.12);

                /* Phase C — 360° showcase spin: power4.inOut = mechanical */
                tl.to(group.rotation,
                    { y: Math.PI * 2, duration: 0.4, ease: "power4.inOut" },
                    0.32);

                /* Phase D — settle to the right (precise, weighted) */
                tl.to(group.position,
                    { x: 1.55, duration: 0.3, ease: "expo.inOut" }, 0.55)
                  .to(group.scale,
                    { x: 0.95, y: 0.95, z: 0.95, duration: 0.3, ease: "expo.inOut" }, 0.55);

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
            }, sectionRef);

            requestAnimationFrame(() => ScrollTrigger.refresh());
        }

        return () => {
            cancelled = true;
            if (raf) cancelAnimationFrame(raf);
            if (ctx) ctx.revert();
        };
    }, []);

    /* ── Fire handler ───────────────────────────────────────────────── */
    const handleFire = () => {
        if (isFiring) return;
        setIsFiring(true);
        clearTimeout(fireResetTimerRef.current);
        fireResetTimerRef.current = setTimeout(() => setIsFiring(false), 2400);
    };
    useEffect(() => () => clearTimeout(fireResetTimerRef.current), []);

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

                        {/* 3-D canvas layer */}
                        <div className="absolute inset-0 z-10">
                            <GenericGunScene
                                key={product.modelUrl}
                                modelRef={modelRef}
                                modelUrl={product.modelUrl}
                                isFiring={isFiring}
                            />
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

                                <div className="mt-8 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleFire}
                                        disabled={isFiring}
                                        className="btn-pill group inline-flex items-center gap-3 rounded-full bg-[color:var(--ink)] px-7 py-3.5 text-white"
                                    >
                                        <span
                                            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isFiring ? "flicker-fast" : ""}`}
                                            style={{ background: product.accentColor }}
                                        />
                                        <span className="font-mono-tactical text-sm font-bold uppercase tracking-[0.22em]">
                                            {isFiring ? "Firing…" : "Fire Test"}
                                        </span>
                                        <svg
                                            width="16" height="16" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2.5"
                                            strokeLinecap="square" strokeLinejoin="miter"
                                            className="-mr-1 transition-transform group-hover:translate-x-0.5"
                                        >
                                            <path d="M5 12h14M13 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    <div className="telemetry-label text-zinc-400">
                                        Hold trigger
                                        <br />
                                        for full auto
                                    </div>
                                </div>

                                <div className="mt-auto pt-10">
                                    <div className="telemetry-label text-zinc-400">
                                        Unit · {product.unitLabel}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <div className="pointer-events-none absolute bottom-6 right-8 z-30 hidden telemetry-label text-zinc-500 md:block">
                            Sec · 01 / 02 — Showcase
                        </div>
                    </div>
                </section>

                {/* Fire effects portal */}
                <FireEffects active={isFiring} />

                {/* ── Footer / CTA (dark) ── */}
                <section className="relative w-full bg-[color:var(--ink)] text-white">
                    <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                            <div className="md:col-span-7">
                                <span
                                    className="telemetry-label"
                                    style={{ color: product.accentColor, opacity: 1 }}
                                >
                                    /// Deploy · Q1 2026
                                </span>
                                <h2 className="font-display mt-5 text-5xl text-white sm:text-6xl">
                                    Ready when
                                    <br />
                                    <span
                                        className="text-tactical-stroke"
                                        style={{ WebkitTextStrokeColor: "#fff" }}
                                    >
                                        summer
                                    </span>{" "}
                                    is.
                                </h2>
                                <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400">
                                    {product.specsDescription}
                                </p>
                            </div>

                            <div className="md:col-span-5 md:pl-10">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                                        <span className="telemetry-label text-zinc-400">
                                            Retail
                                        </span>
                                        <span className="telemetry-value text-2xl text-white">
                                            {product.price}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                                        <span className="telemetry-label text-zinc-400">
                                            Squad Pack (×4)
                                        </span>
                                        <span
                                            className="telemetry-value text-2xl"
                                            style={{ color: product.accentColor }}
                                        >
                                            {product.squadPrice}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-pill mt-4 inline-flex items-center justify-between rounded-full px-7 py-4 text-black"
                                        style={{ background: product.accentColor }}
                                    >
                                        <span className="font-mono-tactical text-sm font-bold uppercase tracking-[0.22em]">
                                            Pre-Order Now
                                        </span>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M5 12h14M13 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 flex items-center justify-between telemetry-label text-zinc-500">
                            <span>© 2026 UTG Tactical</span>
                            <span>{product.version}</span>
                            <span>Built · React · R3F · GSAP</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
