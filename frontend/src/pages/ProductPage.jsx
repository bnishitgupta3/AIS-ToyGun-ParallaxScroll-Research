import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate, useParams } from "react-router-dom";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import SectionDots from "@/components/landing/SectionDots";
import NotifyMe from "@/components/showcase/NotifyMe";
import { useCart, useCartItem } from "@/lib/cart";
import { PRODUCTS } from "@/components/landing/ArsenalSection";
import { PRODUCT_DETAILS } from "@/lib/productDetails";
import { asset } from "@/lib/asset";
import { trackEvent } from "@/lib/analytics";

/* ── Conventional D2C product page (PDP) ──
   Gallery + buy box up top, then highlights, full specs, what's in the box,
   reviews, FAQ and a "complete your squad" cross-sell. Data-driven from the
   shared PRODUCTS catalogue + PRODUCT_DETAILS copy, so all three products get
   the same page. The cinematic 3-D page lives on at /product/<slug>/3d and is
   reachable from the "Experience in 3D" link in the buy box.

   SHOPIFY-READY: add-to-cart goes through the same cart context the rest of the
   site uses (useCartItem), so when checkout moves to the Storefront API this
   page needs no change. */

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const productImg = (f) => asset("/assets/products/" + f);
const launchSource = (name) =>
    "launch-" + (name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-");

function HiIcon({ name }) {
    const common = {
        width: 22, height: 22, viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
    };
    switch (name) {
        case "bolt":    return <svg {...common}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>;
        case "drum":    return <svg {...common}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /></svg>;
        case "target":  return <svg {...common}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg>;
        case "battery": return <svg {...common}><rect x="2" y="8" width="16" height="8" rx="2" /><path d="M22 11v2" /></svg>;
        default:        return null;
    }
}

function Stars({ accent = "#1a1a1a", filled = 0 }) {
    return (
        <span className="inline-flex items-center gap-0.5" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < filled ? accent : "none"} stroke={accent} strokeWidth="1.6">
                    <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
                </svg>
            ))}
        </span>
    );
}

/* Buy box: price, specs, qty + add-to-cart (or notify for a pre-launch gun). */
function BuyBox({ product, details }) {
    const accent = product.accent;
    const { notifyAdded } = useCart();
    const { qty, set } = useCartItem(product.link);
    const [count, setCount] = useState(1);
    const pct = product.mrp && product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    const add = () => {
        set((qty || 0) + count);
        trackEvent("add_to_cart", {
            currency: "INR",
            value: (product.price || 0) * count,
            items: [{ item_id: product.link, item_name: product.name, quantity: count }],
        });
        notifyAdded(product.name);
    };

    return (
        <div className="lg:pt-2">
            <nav className="font-inter text-[12px] font-medium text-[#1a1a1a]/45">
                <Link to="/" className="transition hover:text-[#1a1a1a]">Home</Link>
                <span className="px-1.5">/</span>
                <Link to="/" state={{ scrollTo: "#arsenal" }} className="transition hover:text-[#1a1a1a]">Arsenal</Link>
                <span className="px-1.5">/</span>
                <span className="text-[#1a1a1a]/70">{product.name}</span>
            </nav>

            <span
                className="brutal mt-4 inline-block rounded-full px-3 py-1 font-inter text-[10px] font-bold uppercase tracking-[0.22em] text-white"
                style={{ background: accent }}
            >
                {product.sub}
            </span>

            <h1 className="font-instrument mt-3 text-[clamp(40px,6vw,64px)] leading-[0.92] text-[#1a1a1a]">
                {product.name}
            </h1>
            <p className="mt-2 font-inter text-[13px] font-medium uppercase tracking-[0.14em] text-[#1a1a1a]/50">
                {product.tagline}
            </p>

            {/* rating — honest pre-reviews state */}
            <a href="#reviews" className="mt-3 inline-flex items-center gap-2 font-inter text-[12px] text-[#1a1a1a]/55 transition hover:text-[#1a1a1a]">
                <Stars accent={accent} filled={0} />
                Be the first to review
            </a>

            {/* price / coming soon */}
            {product.comingSoon ? (
                <div className="mt-5">
                    <span className="font-instrument text-[26px] text-[#1a1a1a]">Launching soon</span>
                    <p className="mt-1 font-inter text-[13px] text-[#1a1a1a]/55">Join the waitlist and we will email you the moment it drops.</p>
                </div>
            ) : (
                <div className="mt-5 flex items-end gap-3">
                    <span className="font-instrument text-[40px] leading-none text-[#1a1a1a]">{inr(product.price)}</span>
                    {product.mrp > product.price && (
                        <span className="pb-1 font-inter text-[18px] text-[#1a1a1a]/40 line-through">{inr(product.mrp)}</span>
                    )}
                    {pct > 0 && (
                        <span className="mb-1.5 rounded-full px-2.5 py-1 font-inter text-[12px] font-bold" style={{ background: `${accent}1f`, color: accent }}>
                            {pct}% off
                        </span>
                    )}
                </div>
            )}

            <p className="mt-5 max-w-lg font-inter text-[15px] leading-relaxed text-[#1a1a1a]/70">
                {details.overview}
            </p>

            {/* key specs */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {product.stats.slice(0, 4).map((s) => (
                    <div key={s.label} className="rounded-2xl border border-black/10 bg-white px-3 py-2.5">
                        <div className="font-instrument text-[20px] leading-none text-[#1a1a1a]" style={product.comingSoon ? { filter: "blur(4px)" } : undefined}>
                            {s.value}
                        </div>
                        <div className="mt-1 font-inter text-[9px] font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]/45">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* actions */}
            {product.comingSoon ? (
                <div className="mt-7 max-w-md">
                    <NotifyMe productName={product.name} source={launchSource(product.name)} accent={accent} />
                </div>
            ) : (
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="brutal flex w-max items-center rounded-full bg-white">
                        <button type="button" aria-label="Decrease quantity" onClick={() => setCount((c) => Math.max(1, c - 1))} className="grid h-12 w-12 place-items-center rounded-full text-2xl leading-none text-[#1a1a1a] transition hover:bg-black/5">−</button>
                        <span className="w-8 text-center font-inter text-[16px] font-bold tabular-nums">{count}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => setCount((c) => Math.min(9, c + 1))} className="grid h-12 w-12 place-items-center rounded-full text-2xl leading-none text-[#1a1a1a] transition hover:bg-black/5">+</button>
                    </div>
                    <button
                        type="button"
                        onClick={add}
                        className="brutal brutal-press inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 font-inter text-[13px] font-bold uppercase tracking-[0.14em] text-white sm:w-auto sm:flex-1"
                        style={{ background: accent }}
                    >
                        Add to cart
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                </div>
            )}

            <Link
                to={`${product.link}/3d`}
                className="mt-4 inline-flex items-center gap-2 font-inter text-[12px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/70 transition hover:gap-3 hover:text-[#1a1a1a]"
            >
                Experience it in 3D
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>

            {/* trust row */}
            <div className="mt-7 grid grid-cols-2 gap-2.5 border-t border-black/10 pt-6 font-inter text-[12px] text-[#1a1a1a]/65 sm:grid-cols-4">
                {["Made in India", "Free shipping", "7-day returns", "Secure checkout"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                        {t}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* Full-screen zoom lightbox (Amazon-style). Click/tap the image to toggle a 2.4x
   zoom; moving the pointer (desktop) or dragging (mobile) pans by steering the
   transform-origin. Thumbnails switch the image; Esc / backdrop / X closes. */
function ZoomModal({ images, index, setIndex, onClose }) {
    const [zoom, setZoom] = useState(false);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });
    const frameRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    const track = (clientX, clientY) => {
        const el = frameRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setOrigin({
            x: Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)),
            y: Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100)),
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm" role="dialog" aria-modal="true">
            <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>

            <div className="flex flex-1 items-center justify-center p-4" onClick={onClose}>
                <div
                    ref={frameRef}
                    onClick={(e) => { e.stopPropagation(); setZoom((z) => !z); }}
                    onMouseMove={(e) => { if (zoom) track(e.clientX, e.clientY); }}
                    onTouchMove={(e) => { if (zoom && e.touches[0]) track(e.touches[0].clientX, e.touches[0].clientY); }}
                    className={`relative max-h-[82vh] overflow-hidden rounded-2xl ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                    style={{ touchAction: zoom ? "none" : "auto" }}
                >
                    <img
                        src={images[index]}
                        alt=""
                        draggable="false"
                        className="max-h-[82vh] w-auto select-none bg-[#f1f0ed] object-contain transition-transform duration-200"
                        style={{ transform: zoom ? "scale(2.4)" : "scale(1)", transformOrigin: `${origin.x}% ${origin.y}%` }}
                    />
                    {!zoom && (
                        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 font-inter text-[11px] font-semibold text-white">Tap to zoom</span>
                    )}
                </div>
            </div>

            {images.length > 1 && (
                <div className="flex items-center justify-center gap-2.5 p-4" onClick={(e) => e.stopPropagation()}>
                    {images.map((img, i) => (
                        <button
                            key={img}
                            type="button"
                            onClick={() => { setIndex(i); setZoom(false); }}
                            aria-label={`Image ${i + 1}`}
                            className="h-14 w-14 overflow-hidden rounded-lg border-2 bg-[#f1f0ed] transition"
                            style={{ borderColor: i === index ? "#fff" : "rgba(255,255,255,0.25)" }}
                        >
                            <img src={img} alt="" className="h-full w-full object-contain p-1" />
                        </button>
                    ))}
                </div>
            )}
        </div>,
        document.body,
    );
}

/* Image gallery with thumbnails; the main image opens the zoom lightbox. */
function Gallery({ product, images }) {
    const [active, setActive] = useState(0);
    const [zoomOpen, setZoomOpen] = useState(false);
    const srcs = images.map(productImg);
    return (
        <div className="lg:sticky lg:top-28">
            <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label="Zoom image"
                className="brutal-accent group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-3xl bg-[#f1f0ed]"
                style={{ "--accent": product.accent }}
            >
                <img src={srcs[active]} alt={`${product.name} view ${active + 1}`} className="h-full w-full object-contain p-6" />
                {product.comingSoon && (
                    <span className="absolute left-4 top-4 rounded-full px-3 py-1 font-inter text-[11px] font-bold uppercase tracking-[0.18em] text-white" style={{ background: product.accent }}>
                        Coming soon
                    </span>
                )}
                <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-[#1a1a1a] shadow-sm transition group-hover:bg-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" /></svg>
                </span>
            </button>
            <div className="mt-3 flex gap-3">
                {srcs.map((img, i) => (
                    <button
                        key={images[i]}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`View image ${i + 1}`}
                        className="aspect-square w-20 overflow-hidden rounded-xl border-2 bg-[#f1f0ed] transition"
                        style={{ borderColor: i === active ? product.accent : "rgba(0,0,0,0.1)" }}
                    >
                        <img src={img} alt="" className="h-full w-full object-contain p-1.5" />
                    </button>
                ))}
            </div>
            {zoomOpen && <ZoomModal images={srcs} index={active} setIndex={setActive} onClose={() => setZoomOpen(false)} />}
        </div>
    );
}

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-black/10">
            <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 py-4 text-left">
                <span className="font-inter text-[15px] font-semibold text-[#1a1a1a]">{q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={`shrink-0 text-[#1a1a1a]/50 transition-transform ${open ? "rotate-45" : ""}`}><path d="M12 5v14M5 12h14" /></svg>
            </button>
            {open && <p className="pb-5 pr-8 font-inter text-[14px] leading-relaxed text-[#1a1a1a]/65">{a}</p>}
        </div>
    );
}

function CrossSell({ current }) {
    const others = PRODUCTS.filter((p) => p.link !== current.link);
    return (
        <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
            <h2 className="font-instrument text-[clamp(28px,4vw,44px)] leading-[0.95] text-[#1a1a1a]">Complete your <span className="text-shimmer">squad</span>.</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((p) => (
                    <Link key={p.link} to={p.link} className="brutal-accent group flex items-center gap-4 overflow-hidden rounded-3xl bg-[#18181b] p-3 transition-transform hover:-translate-y-1" style={{ "--accent": p.accent }}>
                        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f1f0ed]">
                            <img src={productImg(p.image)} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-instrument text-[22px] leading-none" style={{ color: p.accent }}>{p.name}</div>
                            <div className="mt-1 font-inter text-[11px] uppercase tracking-[0.14em] text-white/45">{p.sub}</div>
                            <div className="mt-1.5 font-inter text-[13px] font-bold text-white">{p.comingSoon ? "Coming soon" : inr(p.price)}</div>
                        </div>
                    </Link>
                ))}
                {/* bundle upsell */}
                <Link to="/" state={{ scrollTo: "#squad-packs" }} className="brutal flex flex-col justify-center gap-1 rounded-3xl p-5 text-white transition-transform hover:-translate-y-1" style={{ background: "#F8290A" }}>
                    <span className="font-inter text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">Build Your Squad</span>
                    <span className="font-instrument text-[24px] leading-tight">Bundle up for an EXTRA 16% off</span>
                    <span className="mt-1 inline-flex items-center gap-1.5 font-inter text-[12px] font-bold uppercase tracking-[0.12em]">Start building <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 5l7 7-7 7" /></svg></span>
                </Link>
            </div>
        </section>
    );
}

export default function ProductPage() {
    const { slug } = useParams();
    const link = "/product/" + slug;
    const product = PRODUCTS.find((p) => p.link === link);
    const details = PRODUCT_DETAILS[link];

    // All hooks run unconditionally (before any early return) to keep hook order
    // stable — useCartItem(link) is safe even when the slug is unknown.
    const [showBar, setShowBar] = useState(false);
    const buyRef = useRef(null);
    const { notifyAdded } = useCart();
    const { qty, set } = useCartItem(link);
    useEffect(() => {
        const el = buyRef.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            return undefined;
        }
        // Show the mobile sticky bar once the main buy box has scrolled away.
        const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting), { rootMargin: "-120px 0px 0px 0px" });
        io.observe(el);
        return () => io.disconnect();
    }, [slug]);

    if (!product || !details) {
        return <Navigate to="/404" replace />;
    }
    const accent = product.accent;

    return (
        <main className="dot-grid relative w-full text-[#1a1a1a]">
            <LandingNav />
            <SectionDots variant="pdp" />

            {/* ── Gallery + buy box ── */}
            <section id="pdp-top" className="mx-auto max-w-6xl px-6 pb-16 pt-28 sm:pt-32 md:px-12">
                <div ref={buyRef} className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                    <Gallery product={product} images={details.gallery} />
                    <BuyBox product={product} details={details} />
                </div>
            </section>

            {/* ── Highlights ── */}
            <section className="border-y border-black/10 bg-white/60">
                <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 md:px-12">
                    {details.highlights.map((h) => (
                        <div key={h.title} className="flex flex-col gap-2">
                            <span className="grid h-11 w-11 place-items-center rounded-2xl text-white" style={{ background: accent }}><HiIcon name={h.icon} /></span>
                            <h3 className="font-instrument text-[22px] leading-none text-[#1a1a1a]">{h.title}</h3>
                            <p className="font-inter text-[13.5px] leading-relaxed text-[#1a1a1a]/60">{h.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Specs + what's in the box ── */}
            <section id="pdp-specs" className="mx-auto max-w-6xl px-6 py-16 md:px-12">
                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>/// Full specs</span>
                        <h2 className="font-instrument mt-3 text-[clamp(28px,4vw,40px)] leading-[0.95] text-[#1a1a1a]">The numbers.</h2>
                        <dl className="mt-6 divide-y divide-black/10 border-y border-black/10">
                            {product.stats.map((s) => (
                                <div key={s.label} className="flex items-baseline justify-between py-3">
                                    <dt className="font-inter text-[13px] font-medium uppercase tracking-[0.12em] text-[#1a1a1a]/55">{s.label}</dt>
                                    <dd className="font-instrument text-[20px] text-[#1a1a1a]" style={product.comingSoon ? { filter: "blur(5px)" } : undefined}>{s.value}</dd>
                                </div>
                            ))}
                        </dl>
                        {product.stats.some((s) => /\*/.test(s.value)) && (
                            <p className="mt-3 font-inter text-[11px] text-[#1a1a1a]/40">* Play time varies with fire rate and fill level.</p>
                        )}
                    </div>
                    <div>
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>/// In the box</span>
                        <h2 className="font-instrument mt-3 text-[clamp(28px,4vw,40px)] leading-[0.95] text-[#1a1a1a]">What you get.</h2>
                        <ul className="mt-6 space-y-3">
                            {details.whatsInBox.map((item) => (
                                <li key={item} className="flex items-center gap-3 font-inter text-[15px] text-[#1a1a1a]/75">
                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white" style={{ background: accent }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2"><path d="M20 6 9 17l-5-5" /></svg>
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── Reviews (honest pre-reviews state) ── */}
            <section id="reviews" className="border-y border-black/10 bg-white/60">
                <div className="mx-auto max-w-6xl px-6 py-14 md:px-12">
                    <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>/// Ratings and reviews</span>
                    <div className="mt-5 flex flex-col items-start gap-5 rounded-3xl border border-black/10 bg-white p-7 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <Stars accent={accent} filled={0} />
                                <span className="font-instrument text-[22px] text-[#1a1a1a]">No reviews yet</span>
                            </div>
                            <p className="mt-2 max-w-md font-inter text-[14px] text-[#1a1a1a]/60">
                                Be the first to tell the squad how the {product.name} performs on the field. Verified reviews open with our launch.
                            </p>
                        </div>
                        <Link to="/contact" className="brutal brutal-press inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-inter text-[12px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]">
                            Write a review
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section id="pdp-faq" className="mx-auto max-w-3xl px-6 py-16 md:px-12">
                <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>/// FAQ</span>
                <h2 className="font-instrument mt-3 text-[clamp(28px,4vw,44px)] leading-[0.95] text-[#1a1a1a]">Good to know.</h2>
                <div className="mt-6 border-t border-black/10">
                    {details.faq.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
                </div>
            </section>

            {/* ── Cross-sell ── */}
            <CrossSell current={product} />

            <LandingFooter />

            {/* ── Mobile sticky add-to-cart bar ── */}
            {!product.comingSoon && showBar && (
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pt-3 backdrop-blur lg:hidden" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
                        <div>
                            <div className="font-inter text-[13px] font-bold text-[#1a1a1a]">{product.name}</div>
                            <div className="font-instrument text-[18px] leading-none text-[#1a1a1a]">{inr(product.price)}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                set((qty || 0) + 1);
                                trackEvent("add_to_cart", { currency: "INR", value: product.price || 0, items: [{ item_id: product.link, item_name: product.name }] });
                                notifyAdded(product.name);
                            }}
                            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-inter text-[13px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.4)] active:scale-[0.99]"
                            style={{ background: accent }}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
