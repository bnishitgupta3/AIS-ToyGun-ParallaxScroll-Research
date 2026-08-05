import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart, useCartItem } from "@/lib/cart";
import NotifyMe from "@/components/showcase/NotifyMe";

/* Formspree `source` label per product, so Arsenal signups group with the
   product-page ones (e.g. "launch-crimson-blaster"). */
const launchSource = (name) =>
    "launch-" + (name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-");

/* Per-tile cart counter. Sits in the tile's bottom action row (replacing the
   redundant sub-label — the gun's category/tagline already live in the
   heading area above the gun). Always enabled on all 3 tiles for friction-
   free multi-add. stopPropagation on every click prevents the tile's
   gun-switch from firing.

   Reads/writes through the global cart context (useCartItem) so the nav
   badge and BuyNowSheet stay in sync. */
function TileCartCounter({ accent, cartKey }) {
    const { qty, inc, dec, set } = useCartItem(cartKey);
    const stop = (fn) => (e) => {
        e.stopPropagation();
        e.preventDefault();
        fn();
    };

    if (qty === 0) {
        return (
            <button
                type="button"
                aria-label="Add to cart"
                onClick={stop(() => set(1))}
                className="flex h-7 w-full items-center justify-center gap-1 rounded-full font-inter text-[10px] font-semibold uppercase tracking-[0.18em] transition"
                style={{
                    background: `${accent}1a`, // ~10% alpha tint
                    color: accent,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${accent}33`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${accent}1a`;
                }}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Add</span>
            </button>
        );
    }

    return (
        <div
            className="flex h-7 w-full items-center justify-between rounded-full pl-0.5 pr-0.5 text-white shadow-sm"
            style={{ background: accent }}
        >
            <button
                type="button"
                aria-label="Remove one from cart"
                onClick={stop(dec)}
                className="grid h-6 w-6 place-items-center rounded-full text-base leading-none transition hover:bg-white/20"
            >
                −
            </button>
            <span className="flex-1 text-center font-inter text-[12px] font-bold tabular-nums">
                {qty}
            </span>
            <button
                type="button"
                aria-label="Add one to cart"
                onClick={stop(inc)}
                className="grid h-6 w-6 place-items-center rounded-full text-base leading-none transition hover:bg-white/20"
            >
                +
            </button>
        </div>
    );
}

/* Buy Now button — opens a "checkout coming soon" panel.
   Shopify integration lands later; this is the placeholder UI. */
function BuyNowButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-7 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.2em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)] transition-all hover:brightness-110"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="relative">
                <path d="M13 2L4.5 13h6L11 22l8.5-11h-6L13 2z" />
            </svg>
            <span className="relative">Buy Now</span>
        </button>
    );
}

export const PRODUCTS = [
    {
        id: "p0",
        name: "MP5K",
        tagline: "Fully Electric · Automatic · Trigger-Only",
        link: "/product/mp5k",
        accent: "#f97316",
        sub: "Water Gun",
        stats: [
            { label: "Range", value: "8-10 m" },
            { label: "Tank", value: "300 ml" },
            { label: "Fire Rate", value: "5 /s" },
            { label: "Play Time", value: "45 min*" },
        ],
    },
    {
        id: "p1",
        name: "M416 Water X",
        tagline: "Fully Electric · Automatic · Trigger-Only",
        link: "/product/m416",
        accent: "#0871E7",
        sub: "Water Gun",
        stats: [
            { label: "Range", value: "7-9 m" },
            { label: "Tank", value: "300 ml" },
            { label: "Fire Rate", value: "4 /s" },
            { label: "Play Time", value: "45 min*" },
        ],
    },
    {
        id: "p2",
        name: "Crimson Blaster",
        tagline: "Gel Blaster · High Velocity · Tactical",
        link: "/product/crimson",
        accent: "#ef4444",
        sub: "Gel Blaster",
        /* Not launched yet — shown as a teaser everywhere (faded tile, no
           cart, "Coming Soon" badge, Notify-me CTA). Flip to false / remove
           on launch day and the buy paths light up automatically. */
        comingSoon: true,
        stats: [
            { label: "Range", value: "18 m" },
            { label: "Shots / Refill", value: "350" },
            { label: "Fire Rate", value: "11 /s" },
            { label: "Battery", value: "50 min" },
        ],
    },
];

/**
 * Arsenal — Jetour UI paradigm (heading ABOVE the gun, button BELOW it).
 *
 *   ┌──────────────────────────────────────────────┐
 *   │  /// The Arsenal              (eyebrow)        │
 *   │  [badge]  M416 Water X  tagline   (heading)   │  ← ABOVE gun
 *   │                                                │
 *   │            [ centered 3D gun ]                 │  ← fixed canvas
 *   │                                                │
 *   │              [ View Details ]   (button only)  │  ← BELOW gun
 *   │     [thumb0]  [thumb1]  [thumb2]   (nav row)   │  ← bottom thumbs
 *   └──────────────────────────────────────────────┘
 *
 * The section is pinned by GSAP (LandingPage) for a fixed scroll distance.
 * GSAP's onUpdate toggles the active name + button + thumbnail by opacity.
 * Clicking a thumbnail calls `onSelect(i)` → GSAP scroll-seek to that section.
 */
export default function ArsenalSection({ arsenalRef, onSelect, activeIndex = 0 }) {
    // Buy Now opens the single global drawer (mounted in App.js) via the cart
    // context. No per-section sheet instance — that caused multiple sheets in
    // the DOM and was the source of the earlier "drawer auto-show" bug.
    const { openDrawer } = useCart();

    // True once the section is essentially PINNED (its top has reached the top
    // of the viewport) — only then does the HTML overlay (heading, buttons,
    // tiles, spec strip) fade in. It must NOT reveal during the entry sweep:
    // the hero gun flies in from the right toward centre across that sweep, and
    // if the text is already painted it gets visibly passed over and then
    // "settles" (the hover regression). We gate on top <= ~5% vh.
    //
    // Two independent signals for cross-device robustness (a scroll-only
    // top<=0 check never fired on some devices, leaving the overlay invisible):
    //   • IntersectionObserver with a negative bottom rootMargin, so the 100vh
    //     section only counts as "intersecting" once its top nears the very top
    //     of the viewport (i.e. fully pinned) — mirrors the scroll check.
    //   • a passive scroll listener as backup.
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        const section = arsenalRef?.current;
        if (!section) return;
        let done = false;
        const flip = () => {
            if (done) return;
            done = true;
            setEntered(true);
        };
        const onScroll = () => {
            if (section.getBoundingClientRect().top <= window.innerHeight * 0.05) flip();
        };
        let io = null;
        if (typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver(
                (entries) => { if (entries.some((e) => e.isIntersecting)) flip(); },
                { rootMargin: "0px 0px -95% 0px", threshold: 0 },
            );
            io.observe(section);
        }
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (io) io.disconnect();
        };
    }, [arsenalRef]);

    return (
        <section
            ref={arsenalRef}
            id="arsenal"
            className="arsenal-track relative w-full overflow-hidden"
            style={{ height: "100vh" }}
        >
            {/* "Coming Soon" stamped directly ON the gun (centre) for a
                pre-launch product, so it's unmistakable the gun isn't buyable
                yet — the badge above the gun was reading as "available". */}
            <div
                className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-center transition-opacity duration-500"
                style={{
                    opacity:
                        entered && PRODUCTS[activeIndex] && PRODUCTS[activeIndex].comingSoon
                            ? 1
                            : 0,
                }}
            >
                <span
                    className="-rotate-[7deg] rounded-2xl border-2 border-white/90 px-6 py-2.5 font-mono-tactical text-[15px] font-bold uppercase tracking-[0.32em] text-white shadow-[0_12px_34px_-8px_rgba(0,0,0,0.55)] sm:text-lg"
                    style={{ background: (PRODUCTS[activeIndex] || {}).accent || "#ef4444" }}
                >
                    Coming Soon
                </span>
            </div>

            {/* ── TOP heading — compact cluster (eyebrow + category + name +
                   one-line tagline). Deliberately tight: the old stack (120px
                   name box + generous gaps + a two-line tagline) was too tall
                   and squeezed the gun and the CTA/tiles below it. Shorter box,
                   smaller gaps, a wider box so the tagline sits on ONE line on
                   desktop, and a slightly smaller name — nav clearance kept. ── */}
            <div
                className="pointer-events-none absolute left-1/2 top-24 z-20 flex -translate-x-1/2 flex-col items-center text-center transition-opacity duration-500"
                style={{ opacity: entered ? 1 : 0 }}
            >
                <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.4em] text-[#f97316]">
                    /// The Arsenal
                </span>

                {/* Stacked product names — GSAP toggles opacity. Tighter fixed
                    height so all three overlay cleanly on one line each. */}
                <div className="relative mt-2.5 h-[92px] w-[520px] max-w-[92vw]">
                    {PRODUCTS.map((p, i) => (
                        <div
                            key={p.id}
                            id={`arsenal-name-${i}`}
                            className="absolute inset-x-0 top-0 flex flex-col items-center transition-opacity duration-500"
                            style={{ opacity: i === activeIndex ? 1 : 0 }}
                        >
                            <span
                                className="font-inter mb-2 inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.28em]"
                                style={{ borderColor: p.accent, color: p.accent }}
                            >
                                {p.sub}
                            </span>
                            <h3 className="font-instrument text-[clamp(26px,4.4vw,40px)] leading-none text-[#1a1a1a]">
                                {p.name}
                            </h3>
                            <p className="mt-1.5 font-inter text-[10px] font-medium uppercase tracking-[0.2em] text-[#1a1a1a]/50">
                                {p.tagline}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Scroll-to-explore cue ──
                   The pinned carousel spins the guns as you scroll, which reads
                   as a HORIZONTAL control to some visitors — so they don't
                   realise they should keep scrolling DOWN. This explicit
                   vertical hint fixes that. It's parked on the LEFT edge
                   (mirroring the right-edge section dots) and vertically centred,
                   the one band that's clear on every device: the heading sits
                   top-centre, the gun is centred with side margin, and the
                   tiles/specs/CTA occupy the bottom — so this never overlaps any
                   of them. Compact label + capsule + bouncing down-chevron make
                   the DOWN direction unmistakable. Fades in with `entered`. */}
            <div
                className="pointer-events-none absolute left-3 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2.5 transition-opacity duration-500 sm:left-6"
                style={{ opacity: entered ? 1 : 0 }}
            >
                <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1a1a1a]/45 [writing-mode:vertical-rl]">
                    Scroll
                </span>
                <div className="relative h-9 w-5 rounded-full border border-[#1a1a1a]/25">
                    <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-[#1a1a1a]/50" />
                </div>
                <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    className="animate-bounce text-[#1a1a1a]/40"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </div>

            {/* ── PRIMARY CTA row — Experience it + Buy Now (per weapon); for a
                   pre-launch gun, inline email capture + an "Experience it" link.
                   Sits at the bottom as the terminal action: pick a gun from
                   the tiles above, read the specs, then act down here. ── */}
            <div
                className="absolute bottom-[calc(3.5rem_+_var(--chrome-bottom))] left-1/2 z-20 h-12 -translate-x-1/2 transition-opacity duration-500"
                style={{ opacity: entered ? 1 : 0 }}
            >
                {PRODUCTS.map((p, i) => (
                    <div
                        key={p.id}
                        id={`arsenal-btn-${i}`}
                        className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap transition-opacity duration-500"
                        style={{
                            opacity: i === activeIndex ? 1 : 0,
                            pointerEvents: i === activeIndex ? "auto" : "none",
                        }}
                    >
                        {p.comingSoon ? (
                            /* Pre-launch: no buy path. Primary action is the
                               inline email capture (no redirect); a secondary
                               "Experience it" link invites them into the 3D
                               teaser page. */
                            <div className="flex flex-col items-center gap-2.5">
                                <NotifyMe
                                    compact
                                    productName={p.name}
                                    source={launchSource(p.name)}
                                    accent={p.accent}
                                />
                                <Link
                                    to={p.link}
                                    className="group inline-flex items-center gap-1.5 font-inter text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:gap-2.5"
                                    style={{ color: p.accent }}
                                >
                                    Experience it
                                    <svg
                                        width="12" height="12" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2.5"
                                    >
                                        <path d="M5 12h14M13 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Experience it — clean dark outline. Leads into
                                    the immersive 3D product page. */}
                                <Link
                                    to={p.link}
                                    className="group inline-flex items-center gap-2 rounded-full border border-[#1a1a1a]/30 px-7 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a] transition-all hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"
                                >
                                    Experience it
                                    <svg
                                        width="13" height="13" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2.5"
                                        className="transition-transform group-hover:translate-x-0.5"
                                    >
                                        <path d="M5 12h14M13 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                {/* Buy Now — themed orange. Opens the "coming soon"
                                    sheet (right drawer on desktop, bottom sheet on mobile). */}
                                <BuyNowButton onClick={() => openDrawer(p)} />
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Spec strip — translucent glass with key numbers (per weapon),
                   sits below the buttons and above the thumbnail tiles ── */}
            <div
                className="pointer-events-none absolute bottom-[calc(8rem_+_var(--chrome-bottom))] left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500"
                style={{ opacity: entered ? 1 : 0 }}
            >
                {PRODUCTS.map((p, i) => (
                    <div
                        key={p.id}
                        id={`arsenal-stats-${i}`}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-opacity duration-500"
                        style={{ opacity: i === activeIndex ? 1 : 0 }}
                    >
                        {/* Apple "liquid glass" tile — translucent material, bright
                            specular rim, inner refraction glow, layered float shadow */}
                        {/* backdrop-blur REMOVED — backdrop-filter makes the
                            compositor read back the backdrop every frame, and
                            sitting over the constantly re-rendering WebGL canvas
                            that flickers on iOS Safari (this panel lives in the
                            bottom half, exactly where the flicker was reported).
                            A more opaque solid fill keeps the same glass look
                            (the inset highlights below do the heavy lifting)
                            with zero read-back cost. */}
                        <div className="relative overflow-hidden rounded-[26px] bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(255,255,255,0.5),inset_0_-14px_22px_-14px_rgba(255,255,255,0.8),0_12px_28px_-10px_rgba(0,0,0,0.22),0_30px_60px_-24px_rgba(0,0,0,0.42)]">
                            {/* specular sheen + bright top rim */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-white/55 via-white/12 to-transparent"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white/90"
                            />
                            <div className="relative z-10 flex items-stretch divide-x divide-[#1a1a1a]/10 px-1 py-2.5">
                                {p.stats.map((s) => (
                                    <div
                                        key={s.label}
                                        className="flex flex-col items-center px-3 sm:px-5"
                                    >
                                        <span
                                            className="whitespace-nowrap font-instrument text-[18px] leading-none text-[#1a1a1a] sm:text-[23px]"
                                            style={
                                                p.comingSoon
                                                    ? { filter: "blur(6px)", userSelect: "none" }
                                                    : undefined
                                            }
                                        >
                                            {s.value}
                                        </span>
                                        <span className="mt-1 whitespace-nowrap font-inter text-[8px] font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]/55 sm:text-[9px]">
                                            {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Thumbnail navigation / quick-add — sits ABOVE the spec strip
                   as the gun "menu"; the CTA row lives at the bottom. ── */}
            <div
                className="absolute bottom-[calc(12.75rem_+_var(--chrome-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 transition-opacity duration-500 sm:gap-4"
                style={{ opacity: entered ? 1 : 0 }}
            >
                {PRODUCTS.map((p, i) => (
                    /* The tile itself acts as a clickable surface (gun switch).
                       It's a div (not a button) so the cart counter buttons can
                       legally nest inside. Keyboard support kept via role + key
                       handlers. */
                    <div
                        key={p.id}
                        id={`arsenal-thumb-${i}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelect?.(i)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onSelect?.(i);
                            }
                        }}
                        /* backdrop-blur REMOVED here too — same iOS read-back
                           flicker hazard as the spec strip above, and these
                           tiles sit in the same bottom band. Compensated with
                           more opaque fills below so they still read as glass. */
                        className="group relative flex h-20 w-28 shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-xl border-2 p-2 text-left transition-all duration-300 sm:w-32"
                        style={{
                            /* Active vs inactive expressed via bg + border —
                               NOT root opacity — so the cart counter stays
                               fully opaque and never reads as disabled on
                               inactive tiles. */
                            background: i === activeIndex ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.62)",
                            borderColor: i === activeIndex ? p.accent : "rgba(0,0,0,0.10)",
                        }}
                    >
                        {/* Top row: accent swatch + product name. Sub-label
                            dropped intentionally — it lives in the heading
                            above the gun, which freed this space for the
                            cart action below. Info dims (not tile root) when
                            inactive so the counter stays fully enabled. */}
                        <div
                            className="flex flex-col transition-opacity duration-300"
                            style={{ opacity: i === activeIndex ? 1 : 0.45 }}
                        >
                            <span
                                className="h-1.5 w-5 rounded-full"
                                style={{ background: p.accent }}
                            />
                            <div className="mt-1.5 font-instrument text-[14px] leading-tight text-[#1a1a1a]">
                                {p.name}
                            </div>
                        </div>

                        {/* Bottom action row. Launched products get the cart
                            counter; a coming-soon product gets a static
                            "Coming Soon" pill instead — no cart path exists for
                            an unlaunched SKU. */}
                        {p.comingSoon ? (
                            <div
                                className="flex h-7 w-full items-center justify-center rounded-full font-inter text-[9px] font-bold uppercase tracking-[0.18em]"
                                style={{ background: `${p.accent}1a`, color: p.accent }}
                            >
                                Coming Soon
                            </div>
                        ) : (
                            <TileCartCounter accent={p.accent} cartKey={p.link} />
                        )}
                    </div>
                ))}
            </div>

            {/* Section label */}
            <div className="pointer-events-none absolute bottom-[calc(1.5rem_+_var(--chrome-bottom))] right-8 z-20 font-nokia text-[10px] uppercase tracking-[0.32em] text-[#1a1a1a]/25">
                Sec · 02 / 05 · Arsenal
            </div>

        </section>
    );
}
