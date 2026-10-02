import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart, useCartItem } from "@/lib/cart";
import { asset } from "@/lib/asset";
import { trackEvent } from "@/lib/analytics";
import { scrollToSection } from "@/lib/scrollToSection";
import { PRODUCTS } from "@/components/landing/ArsenalSection";

/**
 * Hero — a shoppable PRODUCT CAROUSEL (Up&Run style) that replaces the old
 * video-background + 3-D-gun hero. Each slide is a split layout: a rotated
 * neo-brutalist sticker badge + heavy headline + price + CTA on the left, and
 * the gun floating at a dynamic angle over a coloured burst on the right.
 *
 * Why this over the video:
 *   • Weight — three transparent WebP cutouts total ~0.18 MB vs the video's
 *     multi-MB payload (and no autoplay/decode fragility on mobile).
 *   • It's product-led and prerender-friendly (plain <img> + text), so react-snap
 *     captures real headlines for SEO and the LCP image paints immediately.
 *
 * Slides CROSSFADE (opacity), not a translateX track — a fade has no "rewind"
 * glitch when it loops from the last slide back to the first. Autoplay pauses on
 * hover/touch, when the tab is hidden, and under prefers-reduced-motion. Mobile
 * is swipeable; desktop gets edge arrows. The initial (active) slide renders in
 * its shown state so nothing can get "stuck" invisible.
 */

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

/* Transparent cutout for a product image: mp5k.jpg -> /cutout/mp5k.webp */
const cutout = (img) =>
    asset("/assets/products/cutout/" + img.replace(/\.(jpg|jpeg|png)$/i, ".webp"));

/* Hero marketing copy per product id. Kept here (not in the shared PRODUCTS
   data) so the headline voice lives in one place. No long dashes in copy. */
const COPY = {
    p0: {
        badge: "Bestseller",
        lead: "Full-auto water power,",
        emph: "zero pumping.",
        desc: "Trigger-only electric blaster with a 300ml drum-fed tank that soaks up to 10 metres.",
    },
    p1: {
        badge: "Crowd favourite",
        lead: "Rapid-fire splashes,",
        emph: "all summer long.",
        desc: "Electric auto-fire and a 300ml drum, built for backyard battles and Holi mornings.",
    },
    p2: {
        badge: "Coming soon",
        lead: "The Crimson",
        emph: "hits different.",
        desc: "High-velocity gel blaster. 18m range, 11 shots a second. Be first in line.",
    },
};

/* High-CTA upsell slide for the Build Your Squad bundle builder. Not a product
   (no single SKU or price) — it shows the two blasters together and routes down
   to the #squad-packs builder. Appended after the real products. */
const SQUAD_SLIDE = {
    id: "squad",
    type: "squad",
    name: "Squad",
    accent: "#F8290A",
    badge: "Extra 16% off",
    sub: "Bundle",
    lead: "Bigger squad,",
    emph: "bigger savings.",
    desc: "Your bundle discount stacks on top of our launch prices, so you save EXTRA. The more blasters you add, the bigger it gets, up to 16% off plus free shipping on 6 or more.",
    perks: ["Up to 16% EXTRA off", "On top of sale prices", "Free shipping on 6+"],
};

const SLIDES = [
    ...PRODUCTS.map((p) => ({ ...p, ...(COPY[p.id] || {}) })),
    SQUAD_SLIDE,
];
const COUNT = SLIDES.length;

/* ── Bottom marquee ── a second scrolling bar under the carousel leaning on
   "Made in India" plus the key specs. Reuses the global .marquee / .marquee-track
   mechanics (two identical reels, a seamless 0 -> -50% loop) but runs SLOWER than
   the top announcement bar (60s vs 38s) and sits in a dark bar, so the two read
   as distinct. It pauses on hover and respects reduced-motion (the track's
   animation is gated on it in index.css; the inline duration only overrides the
   speed). "India" lines are highlighted in brand yellow. */
const MARQUEE_ITEMS = [
    { t: "Proudly Made in India", hot: true },
    { t: "Buy more, save more", hot: true },
    { t: "Full-auto, zero pumping" },
    { t: "300ml drum-fed tank" },
    { t: "Bundle up for an extra discount" },
    { t: "8-10m soak range" },
    { t: "Up to 45 min play time" },
    { t: "Free shipping across India", hot: true },
    { t: "Built for Holi and every sunlit day" },
];
const MARQUEE_REEL = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

function MarqueeReel({ hidden }) {
    return (
        <div
            className="flex shrink-0 items-center whitespace-nowrap"
            aria-hidden={hidden ? "true" : undefined}
        >
            {MARQUEE_REEL.map((it, i) => (
                <span key={i} className="flex items-center">
                    <span
                        className={`px-6 font-instrument text-[15px] font-bold uppercase tracking-[0.1em] sm:text-[17px] ${
                            it.hot ? "text-[#F8F31A]" : "text-white"
                        }`}
                    >
                        {it.t}
                    </span>
                    <span aria-hidden="true" className="text-[12px] text-[#F8290A]">
                        ◆
                    </span>
                </span>
            ))}
        </div>
    );
}

/* Full-bleed (negative-margin) dark bar pinned to the bottom of the hero. */
function HeroMarquee() {
    return (
        <div className="marquee relative -mx-5 mt-8 flex items-center overflow-hidden bg-[#1a1a1a] py-3 sm:-mx-8 sm:mt-10">
            <div className="marquee-track flex min-w-max" style={{ animationDuration: "60s" }}>
                <MarqueeReel />
                <MarqueeReel hidden />
            </div>
        </div>
    );
}

/* ── Vibrant splash behind the gun ── an Up&Run-style colour burst in the slide
   accent: a bright radial core, a couple of soft offset blobs for an organic
   "cloud", two structure rings, and a spray of droplets (a few as brutal pops).
   Purely decorative; sits behind the gun image. */
const SPLASH_DROPS = [
    { x: 17, y: 16, s: 16, o: 0.85, pop: true },
    { x: 88, y: 34, s: 9, o: 0.65 },
    { x: 80, y: 82, s: 13, o: 0.6, pop: true },
    { x: 28, y: 86, s: 8, o: 0.5 },
    { x: 95, y: 63, s: 7, o: 0.5 },
];

function HeroSplash({ accent }) {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {/* bright radial core */}
            <span
                className="absolute left-1/2 top-1/2 h-[94%] w-[98%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ background: `radial-gradient(circle at 50% 45%, ${accent}73 0%, ${accent}2e 44%, transparent 68%)` }}
            />
            {/* soft offset blobs -> organic splash cloud */}
            <span
                className="absolute left-[30%] top-[33%] h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ background: accent, opacity: 0.2 }}
            />
            <span
                className="absolute left-[73%] top-[66%] h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ background: accent, opacity: 0.16 }}
            />
            {/* structure rings */}
            <span
                className="absolute left-1/2 top-1/2 h-[64%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed"
                style={{ borderColor: accent, opacity: 0.3 }}
            />
            <span
                className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{ borderColor: accent, opacity: 0.15 }}
            />
            {/* droplet spray */}
            {SPLASH_DROPS.map((d, i) => (
                <span
                    key={i}
                    className={`absolute rounded-full ${d.pop ? "brutal" : ""}`}
                    style={{
                        left: `${d.x}%`,
                        top: `${d.y}%`,
                        width: d.s,
                        height: d.s,
                        transform: "translate(-50%, -50%)",
                        background: accent,
                        opacity: d.o,
                    }}
                />
            ))}
        </div>
    );
}

export default function HeroCarousel({ heroRef }) {
    const { openDrawer } = useCart();
    /* One counter per buyable gun (fixed order -> hooks are stable). The
       coming-soon Crimson has no cart path, so it isn't wired. */
    const mp5k = useCartItem("/product/mp5k");
    const m416 = useCartItem("/product/m416");
    const CART = { "/product/mp5k": mp5k, "/product/m416": m416 };

    const [active, setActive] = useState(0);
    const pausedRef = useRef(false);
    const touchX = useRef(null);

    /* Resolve reduced-motion once (SSR/prerender-safe). */
    const [reduce] = useState(
        () =>
            typeof window !== "undefined" &&
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    const go = (i) => setActive(((i % COUNT) + COUNT) % COUNT);
    const next = () => go(active + 1);
    const prev = () => go(active - 1);

    /* Autoplay. Re-armed whenever `active` changes, so a manual jump still gets
       a full dwell before the next auto-advance. Paused on hover/touch and while
       the tab is hidden; disabled entirely under reduced-motion. */
    useEffect(() => {
        if (reduce) {
            return undefined;
        }
        const id = setInterval(() => {
            if (pausedRef.current || (typeof document !== "undefined" && document.hidden)) {
                return;
            }
            setActive((a) => (a + 1) % COUNT);
        }, 6000);
        return () => clearInterval(id);
    }, [active, reduce]);

    /* Swipe (mobile). A decisive horizontal drag flips to the next/prev slide. */
    const onTouchStart = (e) => {
        touchX.current = e.touches[0].clientX;
        pausedRef.current = true;
    };
    const onTouchEnd = (e) => {
        // Always resume autoplay once the finger lifts — otherwise a single tap
        // or scroll-start on the hero would pause the carousel forever.
        pausedRef.current = false;
        if (touchX.current == null) {
            return;
        }
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 44) {
            if (dx < 0) {
                next();
            } else {
                prev();
            }
        }
    };

    const addToCart = (slide) => {
        const item = CART[slide.link];
        if (!item) {
            return;
        }
        item.inc();
        trackEvent("hero_add_to_cart", { product: slide.name, price: slide.price });
        openDrawer();
    };

    const goSquad = (e) => {
        if (e) e.preventDefault();
        trackEvent("hero_build_squad", {});
        scrollToSection("#squad-packs");
    };

    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative w-full overflow-hidden px-5 pt-28 sm:px-8 sm:pt-32"
            onPointerEnter={(e) => {
                // Pause on hover for a real mouse only. A touch can emit a
                // synthetic enter with no matching leave, which used to stick.
                if (e.pointerType === "mouse") {
                    pausedRef.current = true;
                }
            }}
            onPointerLeave={(e) => {
                if (e.pointerType === "mouse") {
                    pausedRef.current = false;
                }
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carousel"
            aria-label="Featured blasters"
        >
            <div className="relative mx-auto w-full max-w-6xl">
                {/* ── Slide viewport ── absolute, crossfading slides. min-h is sized
                       to comfortably hold the tallest slide at each breakpoint. */}
                <div className="relative min-h-[560px] sm:min-h-[66svh] lg:min-h-[72svh]">
                    {SLIDES.map((s, i) => {
                        const show = i === active;
                        const accent = s.accent;
                        const isSquad = s.type === "squad";
                        const buyable = !s.comingSoon && !isSquad;
                        const pct =
                            s.mrp && s.price ? Math.round(((s.mrp - s.price) / s.mrp) * 100) : 0;
                        return (
                            <div
                                key={s.id}
                                className={`absolute inset-0 flex items-center ${show ? "z-10" : "z-0 pointer-events-none"}`}
                                aria-hidden={show ? undefined : "true"}
                            >
                                <div
                                    className={`grid w-full items-center gap-5 transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:gap-8 lg:grid-cols-2 lg:gap-10 ${
                                        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                                    }`}
                                >
                                    {/* ── RIGHT (image first on mobile) ── */}
                                    <div className="relative order-1 flex items-center justify-center lg:order-2">
                                        <HeroSplash accent={accent} />

                                        {isSquad ? (
                                            // Two blasters as a clean, parallel lineup = "squad".
                                            <div className="relative h-[300px] w-[min(86vw,400px)] lg:h-[450px] lg:w-[520px]">
                                                <img
                                                    src={cutout("mp5k.jpg")}
                                                    alt="MP5K water blaster"
                                                    draggable="false"
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="absolute left-1/2 top-0 w-[70%] -translate-x-1/2 -rotate-3 drop-shadow-[0_16px_24px_rgba(0,0,0,0.22)]"
                                                />
                                                <img
                                                    src={cutout("m416.jpg")}
                                                    alt="M416 water blaster"
                                                    draggable="false"
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="absolute bottom-0 left-1/2 w-[70%] -translate-x-1/2 -rotate-3 drop-shadow-[0_16px_24px_rgba(0,0,0,0.22)]"
                                                />
                                            </div>
                                        ) : (
                                            <img
                                                src={cutout(s.image)}
                                                alt={`${s.name} ${s.sub}`}
                                                draggable="false"
                                                loading={i === 0 ? "eager" : "lazy"}
                                                decoding="async"
                                                className="relative w-[min(78vw,400px)] -rotate-6 drop-shadow-[0_26px_34px_rgba(0,0,0,0.25)] lg:w-[520px] xl:w-[560px]"
                                            />
                                        )}
                                    </div>

                                    {/* ── LEFT (text) ── */}
                                    <div className="order-2 text-center lg:order-1 lg:text-left">
                                        <span
                                            className="brutal inline-block -rotate-2 rounded-full px-4 py-1.5 font-inter text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-[11px]"
                                            style={{ background: accent }}
                                        >
                                            {s.badge} · {s.sub}
                                        </span>

                                        <h1 className="mt-4 font-instrument text-[clamp(34px,7vw,68px)] font-bold leading-[0.95] tracking-tight text-[#1a1a1a] sm:mt-5">
                                            {s.lead}
                                            <br />
                                            <span style={{ color: accent }}>{s.emph}</span>
                                        </h1>

                                        <p className="mx-auto mt-3.5 max-w-md font-inter text-[13.5px] leading-relaxed text-[#1a1a1a]/70 sm:text-[15px] lg:mx-0">
                                            {s.desc}
                                        </p>

                                        {/* perk chips (squad) — the EXTRA-discount chip is
                                            highlighted in brand yellow so it reads as a
                                            bonus on top of the launch price, not a replacement. */}
                                        {isSquad && (
                                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                                                {s.perks.map((pk) => {
                                                    const hot = /extra/i.test(pk);
                                                    return (
                                                        <span
                                                            key={pk}
                                                            className={`rounded-full px-3 py-1 font-inter text-[11.5px] font-bold ${hot ? "border-2 border-[#1a1a1a]" : ""}`}
                                                            style={hot ? { background: "#F8F31A", color: "#1a1a1a" } : { background: `${accent}1f`, color: accent }}
                                                        >
                                                            {pk}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* price (buyable only) */}
                                        {buyable && (
                                            <div className="mt-4 flex items-center justify-center gap-2.5 lg:justify-start">
                                                <span className="font-instrument text-[26px] leading-none text-[#1a1a1a]">
                                                    {inr(s.price)}
                                                </span>
                                                {s.mrp > s.price && (
                                                    <span className="font-inter text-[14px] text-[#1a1a1a]/40 line-through">
                                                        {inr(s.mrp)}
                                                    </span>
                                                )}
                                                {pct > 0 && (
                                                    <span
                                                        className="rounded-full px-2 py-0.5 font-inter text-[11px] font-bold"
                                                        style={{ background: `${accent}1f`, color: accent }}
                                                    >
                                                        Save {pct}%
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* CTAs */}
                                        <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
                                            {isSquad ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={goSquad}
                                                        className="brutal brutal-press inline-flex items-center gap-2 rounded-full px-6 py-3 font-inter text-[13px] font-bold uppercase tracking-[0.12em] text-white"
                                                        style={{ background: accent }}
                                                    >
                                                        Build your squad
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                                                            <path d="M5 12h14M13 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                    <a
                                                        href="#squad-packs"
                                                        onClick={goSquad}
                                                        className="group inline-flex items-center gap-1.5 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]/75 transition hover:gap-2.5 hover:text-[#1a1a1a]"
                                                    >
                                                        See the savings
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                                            <path d="M5 12h14M13 5l7 7-7 7" />
                                                        </svg>
                                                    </a>
                                                </>
                                            ) : buyable ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => addToCart(s)}
                                                        className="brutal brutal-press inline-flex items-center gap-2 rounded-full px-6 py-3 font-inter text-[13px] font-bold uppercase tracking-[0.12em] text-white"
                                                        style={{ background: accent }}
                                                    >
                                                        Add to cart
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                                                            <path d="M5 12h14M13 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                    <Link
                                                        to={s.link}
                                                        className="group inline-flex items-center gap-1.5 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]/75 transition hover:gap-2.5 hover:text-[#1a1a1a]"
                                                    >
                                                        View details
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                                            <path d="M5 12h14M13 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link
                                                        to={s.link}
                                                        className="brutal brutal-press inline-flex items-center gap-2 rounded-full px-6 py-3 font-inter text-[13px] font-bold uppercase tracking-[0.12em] text-white"
                                                        style={{ background: accent }}
                                                    >
                                                        Notify me
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                                            <path d="M4 4h16v12H5.2L4 18.5V4z" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        to={s.link}
                                                        className="group inline-flex items-center gap-1.5 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]/75 transition hover:gap-2.5 hover:text-[#1a1a1a]"
                                                    >
                                                        Sneak peek
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                                            <path d="M5 12h14M13 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Dots ── */}
                <div className="mt-5 flex items-center justify-center gap-2.5">
                    {SLIDES.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            aria-label={`Show ${s.name}`}
                            aria-current={i === active ? "true" : undefined}
                            onClick={() => go(i)}
                            className={`h-2.5 rounded-full border-2 border-[#1a1a1a] transition-all ${
                                i === active ? "w-8" : "w-2.5 bg-white"
                            }`}
                            style={i === active ? { background: SLIDES[active].accent } : undefined}
                        />
                    ))}
                </div>

                {/* ── Scroll-down cue ── nudges past the hero into the Arsenal. */}
                <a
                    href="#arsenal"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("#arsenal");
                    }}
                    aria-label="Scroll to the Arsenal"
                    className="mx-auto mt-4 flex w-max flex-col items-center gap-1 text-[#1a1a1a]/45 transition hover:text-[#1a1a1a]/75"
                >
                    <span className="font-inter text-[9px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
                    <svg className="animate-bounce" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </a>
            </div>

            {/* ── Bottom marquee — "Made in India" + specs, slower than the top bar ── */}
            <HeroMarquee />

            {/* ── Edge arrows ── pinned to the SECTION edges (desktop) so they sit
                   in the outer gutter, clear of the headline and the gun. */}
            <button
                type="button"
                aria-label="Previous blaster"
                onClick={prev}
                className="brutal absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white sm:left-4 sm:grid"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <path d="M15 5l-7 7 7 7" />
                </svg>
            </button>
            <button
                type="button"
                aria-label="Next blaster"
                onClick={next}
                className="brutal absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white sm:right-4 sm:grid"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <path d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </section>
    );
}
