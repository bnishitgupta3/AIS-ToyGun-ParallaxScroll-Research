import { useMemo, useRef, useState } from "react";
import { useCart, PRODUCT_LOOKUP } from "@/lib/cart";
import { PRODUCTS } from "@/components/landing/ArsenalSection";
import { asset } from "@/lib/asset";
import { trackEvent } from "@/lib/analytics";

/* ── Build Your Squad — interactive volume-bundle builder ──
   Replaces the fixed Duo/Squad/Party cards with a flexible "pick your blasters,
   the discount grows with the squad" builder (the Up&Run pattern, adapted to
   our catalogue + group-play positioning).

   Tiers mirror the old packs — 2 / 4 / 6 blasters unlock 10 / 13 / 16% off (so
   margins match the fixed packs), and 6+ also unlocks free shipping. On
   checkout the selection is added to the shared cart as ONE custom bundle line
   (registered into PRODUCT_LOOKUP at runtime), so the nav badge, drawer and
   subtotal pick it up exactly like a preset pack. */

const RED = "#F8290A";
const YELLOW = "#F8F31A"; // brand yellow — highlights a tier once its count is reached
const inr = (n) => "₹" + Number(Math.round(n)).toLocaleString("en-IN");

const TIERS = [
    { units: 2, pct: 10 },
    { units: 4, pct: 13 },
    { units: 6, pct: 16, perk: "free shipping" },
];
const MAX_UNITS = TIERS[TIERS.length - 1].units;
const activeTier = (u) => TIERS.reduce((acc, t) => (u >= t.units ? t : acc), null);
const nextTier = (u) => TIERS.find((t) => u < t.units) || null;

function ProductCard({ p, qty, onAdd, onInc, onDec }) {
    const accent = p.accent;
    const comingSoon = p.comingSoon;
    const img = p.image ? asset("/assets/products/" + p.image) : null;
    return (
        <div
            className="brutal-accent group flex flex-col overflow-hidden rounded-3xl bg-[#18181b]"
            style={{ "--accent": accent }}
        >
            {/* Photo — edge-to-edge on its light studio bg, matching the Arsenal cards. */}
            <div className="relative aspect-[5/3] overflow-hidden bg-[#f1f0ed]">
                {comingSoon ? (
                    <span className="absolute right-2 top-2 z-10 rounded-full px-2.5 py-1 font-inter text-[9px] font-bold uppercase tracking-[0.18em] text-white" style={{ background: accent }}>
                        Coming Soon
                    </span>
                ) : qty > 0 ? (
                    <span className="absolute left-2 top-2 z-10 grid h-6 min-w-[1.5rem] place-items-center rounded-full px-1.5 font-inter text-[12px] font-bold tabular-nums text-white" style={{ background: accent }}>
                        {qty}
                    </span>
                ) : null}
                {img && (
                    <img src={img} alt={p.name} draggable="false" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
                )}
            </div>

            {/* Accent seam. */}
            <div className="h-[3px] w-full" style={{ background: accent }} />

            {/* Name + price — accent name on charcoal, like the Arsenal. */}
            <div className="flex flex-1 flex-col px-3 pt-3">
                <h3 className="font-instrument text-[clamp(20px,2.4vw,26px)] leading-[0.95]" style={{ color: accent }}>
                    {p.name}
                </h3>
                {comingSoon ? (
                    <span className="mt-1.5 font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Launching soon</span>
                ) : (
                    <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="font-inter text-[15px] font-bold text-white">{inr(p.price)}</span>
                        {p.mrp > p.price && <span className="font-inter text-[12px] text-white/40 line-through">{inr(p.mrp)}</span>}
                    </div>
                )}
            </div>

            {/* Action. */}
            <div className="mt-3 border-t border-white/10 px-3 pb-3 pt-3">
                {comingSoon ? (
                    <div className="flex h-10 w-full items-center justify-center rounded-full border-2 border-white/15 font-inter text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
                        Coming soon
                    </div>
                ) : qty === 0 ? (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="brutal flex h-10 w-full items-center justify-center gap-1.5 rounded-full font-inter text-[12px] font-bold uppercase tracking-[0.14em] text-white transition hover:brightness-105"
                        style={{ background: accent }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M12 5v14M5 12h14" /></svg>
                        Add
                    </button>
                ) : (
                    <div className="brutal flex h-10 w-full items-center justify-between rounded-full px-1 text-white" style={{ background: accent }}>
                        <button type="button" aria-label="Remove one" onClick={onDec} className="grid h-8 w-8 place-items-center rounded-full text-xl leading-none transition hover:bg-white/20">−</button>
                        <span className="flex-1 text-center font-inter text-[15px] font-bold tabular-nums">{qty}</span>
                        <button type="button" aria-label="Add one" onClick={onInc} className="grid h-8 w-8 place-items-center rounded-full text-xl leading-none transition hover:bg-white/20">+</button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Panel({ units, mrpTotal, pct, finalTotal, youSave, contents, onCheckout, onClear }) {
    const next = nextTier(units);
    const pf = Math.min(1, units / MAX_UNITS);
    return (
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
                <h3 className="font-instrument text-[28px] leading-none text-[#1a1a1a]">Build your Squad</h3>
                {units > 0 && (
                    <button type="button" onClick={onClear} className="font-inter text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a1a1a]/40 transition hover:text-[#1a1a1a]/70">
                        Clear
                    </button>
                )}
            </div>
            <p className="mt-1 font-inter text-[12px] text-[#1a1a1a]/55">The bigger your squad, the more you save.</p>

            {/* Tier progress — nodes on the bar, each discount % aligned beneath its node */}
            <div className="mt-6 px-3">
                <div className="relative h-1.5 rounded-full bg-black/10">
                    <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-300" style={{ width: `${pf * 100}%`, background: RED }} />
                    {TIERS.map((t) => {
                        const on = units >= t.units;
                        return (
                            <div
                                key={t.units}
                                className={`absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 font-inter text-[10px] font-bold tabular-nums ${on ? "text-[#1a1a1a]" : "border-black/15 bg-white text-[#1a1a1a]/50"}`}
                                style={{ left: `${(t.units / MAX_UNITS) * 100}%`, ...(on ? { background: YELLOW, borderColor: YELLOW } : {}) }}
                            >
                                {t.units}
                            </div>
                        );
                    })}
                </div>
                <div className="relative mt-3 h-5">
                    {TIERS.map((t) => {
                        const on = units >= t.units;
                        return (
                            <span
                                key={t.units}
                                className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-inter text-[10px] font-bold uppercase tracking-[0.06em]"
                                style={{ left: `${(t.units / MAX_UNITS) * 100}%` }}
                            >
                                {on ? (
                                    <span className="rounded-full px-1.5 py-0.5" style={{ background: YELLOW, color: RED }}>{t.pct}% off</span>
                                ) : (
                                    <span className="text-[#1a1a1a]/45">{t.pct}% off</span>
                                )}
                            </span>
                        );
                    })}
                </div>
            </div>

            <p className="mt-4 text-center font-inter text-[14px] font-bold leading-snug text-[#1a1a1a]/80">
                {units === 0
                    ? "Add blasters to unlock bundle savings."
                    : next
                        ? `Add ${next.units - units} more to unlock ${next.pct}% off${next.perk ? " + " + next.perk : ""}.`
                        : "Top squad discount unlocked. Free shipping included."}
            </p>

            {/* Contents */}
            <div className="mt-4 space-y-2">
                {contents.length === 0 ? (
                    <p className="font-inter text-[12px] text-[#1a1a1a]/35">No blasters added yet.</p>
                ) : (
                    contents.map((c) => (
                        <div key={c.link} className="flex items-center gap-3 rounded-xl bg-black/[0.03] p-2">
                            <img src={asset("/assets/products/" + c.image)} alt={c.name} className="h-9 w-12 shrink-0 object-contain" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-inter text-[12px] font-semibold text-[#1a1a1a]">{c.name}</p>
                                <p className="font-inter text-[11px] text-[#1a1a1a]/50">{inr(c.price)} × {c.qty}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Trust */}
            <div className="mt-4 grid grid-cols-2 gap-1.5 border-t border-black/5 pt-4 font-inter text-[11px] text-[#1a1a1a]/60">
                {["Made in India", "Pressure-tested", "Holi-ready", "Secure checkout"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                        {t}
                    </span>
                ))}
            </div>

            {/* Total */}
            <div className="mt-4 flex items-end justify-between border-t border-black/5 pt-4">
                <span className="font-inter text-[12px] uppercase tracking-[0.12em] text-[#1a1a1a]/50">Total</span>
                <div className="text-right">
                    {youSave > 0 && <span className="mr-2 font-inter text-[13px] text-[#1a1a1a]/35 line-through">{inr(mrpTotal)}</span>}
                    <span className="font-instrument text-[30px] leading-none text-[#1a1a1a]">{inr(finalTotal)}</span>
                    {youSave > 0 && <p className="mt-0.5 font-inter text-[12px] font-semibold text-[#F8290A]">You save {inr(youSave)}</p>}
                </div>
            </div>

            <button
                type="button"
                disabled={units === 0}
                onClick={onCheckout}
                className="mt-4 w-full rounded-full py-3.5 font-inter text-[13px] font-bold uppercase tracking-[0.14em] text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: RED }}
            >
                {units === 0 ? "Add blasters to start" : `Add Squad to Cart · ${inr(finalTotal)}`}
            </button>
        </div>
    );
}

export default function BuildYourSquad({ packsRef }) {
    const { setQty, openDrawer } = useCart();
    const [qtys, setQtys] = useState({});
    const lastKey = useRef(null);

    const BY_LINK = useMemo(() => Object.fromEntries(PRODUCTS.map((p) => [p.link, p])), []);
    const setOne = (link, q) =>
        setQtys((prev) => {
            const n = { ...prev };
            const c = Math.max(0, q);
            if (!c) delete n[link]; else n[link] = c;
            return n;
        });

    const units = useMemo(() => Object.values(qtys).reduce((s, q) => s + q, 0), [qtys]);
    const listSubtotal = useMemo(
        () => Object.entries(qtys).reduce((s, [l, q]) => s + q * (BY_LINK[l]?.price || 0), 0),
        [qtys, BY_LINK],
    );
    const mrpTotal = useMemo(
        () => Object.entries(qtys).reduce((s, [l, q]) => s + q * (BY_LINK[l]?.mrp || BY_LINK[l]?.price || 0), 0),
        [qtys, BY_LINK],
    );
    const pct = activeTier(units)?.pct || 0;
    const finalTotal = Math.round(listSubtotal * (1 - pct / 100));
    const youSave = mrpTotal - finalTotal;
    const contents = useMemo(
        () =>
            Object.entries(qtys)
                .filter(([, q]) => q > 0)
                .map(([l, q]) => ({ link: l, qty: q, name: BY_LINK[l]?.name, image: BY_LINK[l]?.image, price: BY_LINK[l]?.price || 0 })),
        [qtys, BY_LINK],
    );

    const checkout = () => {
        if (units === 0) return;
        // Replace any previous custom squad so the cart recomputes (unique key).
        if (lastKey.current) setQty(lastKey.current, 0);
        const key = "/bundle/custom-" + Date.now();
        PRODUCT_LOOKUP[key] = {
            name: "Your Squad",
            sub: `Custom Bundle · ${units} blasters`,
            accent: RED,
            price: finalTotal,
            bundle: true,
            units,
            contents: contents.map((c) => ({ link: c.link, qty: c.qty, name: c.name })),
        };
        setQty(key, 1);
        lastKey.current = key;
        trackEvent("add_to_cart", {
            currency: "INR",
            value: finalTotal,
            items: contents.map((c) => ({ item_id: c.link, item_name: c.name, quantity: c.qty, item_category: "custom-bundle" })),
        });
        openDrawer();
    };

    return (
        <section ref={packsRef} id="squad-packs" className="relative z-10 w-full px-6 pb-24 pt-4 md:px-12 md:pb-28">
            <div className="mx-auto max-w-7xl">
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.4em] text-[#F8290A]">/// Build Your Squad</span>
                <h2 className="font-instrument mt-4 text-[clamp(40px,7vw,84px)] leading-[0.9] text-[#1a1a1a]">
                    Build your bundle, <span className="text-shimmer">save more</span>.
                </h2>
                <p className="mt-4 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/60">
                    Pick your blasters and the discount grows as the squad does. One tap adds the
                    whole bundle to your cart. Perfect for Holi mornings and squad water fights.
                </p>

                <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                    <div className="grid grid-cols-2 content-start gap-4 self-start sm:grid-cols-3 lg:col-span-2">
                        {PRODUCTS.map((p) => (
                            <ProductCard
                                key={p.link}
                                p={p}
                                qty={qtys[p.link] || 0}
                                onAdd={() => setOne(p.link, 1)}
                                onInc={() => setOne(p.link, (qtys[p.link] || 0) + 1)}
                                onDec={() => setOne(p.link, (qtys[p.link] || 0) - 1)}
                            />
                        ))}
                    </div>
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <Panel
                            units={units}
                            mrpTotal={mrpTotal}
                            pct={pct}
                            finalTotal={finalTotal}
                            youSave={youSave}
                            contents={contents}
                            onCheckout={checkout}
                            onClear={() => setQtys({})}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
