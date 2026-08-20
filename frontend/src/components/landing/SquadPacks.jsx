import { useCartItem } from "@/lib/cart";
import PriceTag from "@/components/PriceTag";
import { PRODUCTS } from "@/components/landing/ArsenalSection";
import { asset } from "@/lib/asset";
import { trackEvent } from "@/lib/analytics";

/* ── Squad Packs — bundle combos that add to the cart as a single line ──
   Sits right below the Arsenal. Each pack combines the launched blasters at a
   deeper discount than buying separately (the classic D2C "bundle & save"
   ladder — bigger pack, bigger saving), which lifts average order value.

   Dark charcoal cards to match the Arsenal, brand red + yellow throughout. The
   cart keys ("/bundle/…") are registered in PRODUCT_LOOKUP so the nav badge and
   Buy-Now sheet pick the packs up automatically. */

const BY_LINK = Object.fromEntries(PRODUCTS.map((p) => [p.link, p]));

const BUNDLES = [
    {
        id: "duo",
        key: "/bundle/duo",
        name: "Duo Pack",
        desc: "One MP5K and one M416, ready to soak. The perfect two player kit to gear up with a friend for Holi mornings and sunny standoffs.",
        items: [{ link: "/product/mp5k", qty: 1 }, { link: "/product/m416", qty: 1 }],
        price: 1699,
    },
    {
        id: "squad",
        key: "/bundle/squad",
        name: "Squad Pack",
        desc: "Two MP5Ks and two M416s, fully loaded for a four way water war. Our most picked pack, at a bigger saving than buying each on its own.",
        items: [{ link: "/product/mp5k", qty: 2 }, { link: "/product/m416", qty: 2 }],
        price: 3299,
        badge: "Most Popular",
    },
    {
        id: "party",
        key: "/bundle/party",
        name: "Party Pack",
        desc: "Three of each, six blasters in all, for the whole crew. Maximum drench and our deepest saving, the entire street soaked.",
        items: [{ link: "/product/mp5k", qty: 3 }, { link: "/product/m416", qty: 3 }],
        price: 4799,
    },
];

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const bundleMrp = (b) => b.items.reduce((s, it) => s + (BY_LINK[it.link]?.mrp || 0) * it.qty, 0);
const bundleUnits = (b) => b.items.reduce((s, it) => s + it.qty, 0);

/* Add-to-cart for a pack: "Add Squad" → − N + stepper, wired to the shared cart
   (nav badge + Buy-Now sheet stay in sync). Brand red fill, yellow label. */
function AddBundle({ bundleKey, name, price }) {
    const { qty, inc, dec, set } = useCartItem(bundleKey);
    const add = () => {
        set(1);
        trackEvent("add_to_cart", {
            currency: "INR",
            value: price || 0,
            items: [{ item_id: bundleKey, item_name: name, item_category: "bundle" }],
        });
    };
    if (qty === 0) {
        return (
            <button
                type="button"
                onClick={add}
                className="brutal-accent flex h-11 w-full items-center justify-center gap-2 rounded-full font-inter text-[12px] font-bold uppercase tracking-[0.16em] transition hover:brightness-110"
                style={{ background: "#DA0213", color: "#F8F31A" }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                Add Squad
            </button>
        );
    }
    return (
        <div
            className="brutal-accent flex h-11 w-full items-center justify-between rounded-full pl-1 pr-1"
            style={{ background: "#DA0213", color: "#F8F31A" }}
        >
            <button type="button" aria-label="Remove one" onClick={dec} className="grid h-9 w-9 place-items-center rounded-full text-2xl leading-none transition hover:bg-white/15">−</button>
            <span className="flex-1 text-center font-inter text-[15px] font-bold tabular-nums">{qty}</span>
            <button type="button" aria-label="Add one" onClick={inc} className="grid h-9 w-9 place-items-center rounded-full text-2xl leading-none transition hover:bg-white/15">+</button>
        </div>
    );
}

function BundleCard({ b }) {
    const mrp = bundleMrp(b);
    const units = bundleUnits(b);
    const save = mrp - b.price;

    return (
        <div
            className="brutal-accent group flex flex-col overflow-hidden rounded-3xl bg-[#18181b] transition-transform duration-200 hover:-translate-y-1.5"
            style={{ "--accent": "#DA0213" }}
        >
            {/* Contents — the constituent blasters on a light tile, each with a
                quantity badge, so the pack's value is obvious at a glance. */}
            <div className="relative bg-[#f4f3f8] px-4 py-4">
                {b.badge && (
                    <span
                        className="absolute left-3 top-3 z-10 rounded-full px-3 py-1 font-inter text-[10px] font-bold uppercase tracking-[0.18em] shadow-sm"
                        style={{ background: "#F8F31A", color: "#DA0213" }}
                    >
                        {b.badge}
                    </span>
                )}
                {/* Blasters stacked vertically with a "+" between — reads as
                    "this gun plus this gun". object-contain keeps each gun whole
                    (a short crop would clip the magazine); the panel matches the
                    photo background so the fit is seamless and the card stays
                    compact. */}
                <div className="flex flex-col gap-0.5">
                    {b.items.map((it, idx) => {
                        const p = BY_LINK[it.link];
                        if (!p) return null;
                        return (
                            <div key={it.link} className="w-full">
                                {idx > 0 && (
                                    <div className="flex items-center justify-center py-0.5">
                                        <span
                                            className="grid h-6 w-6 place-items-center rounded-full font-inter text-[15px] font-bold leading-none text-white shadow"
                                            style={{ background: "#DA0213" }}
                                        >
                                            +
                                        </span>
                                    </div>
                                )}
                                <div className="relative">
                                    <img
                                        src={asset("/assets/products/" + p.image)}
                                        alt={p.name}
                                        draggable="false"
                                        className="aspect-[5/2] w-full object-contain object-center"
                                    />
                                    <span
                                        className="absolute bottom-1 left-1 rounded-full px-2.5 py-0.5 font-inter text-[11px] font-bold uppercase tracking-[0.08em] tabular-nums text-white shadow-sm"
                                        style={{ background: "#DA0213" }}
                                    >
                                        {it.qty}× {p.name.split(" ")[0]}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Accent seam. */}
            <div className="h-[3px] w-full" style={{ background: "#DA0213" }} />

            {/* Name + contents summary + price. */}
            <div className="flex flex-1 flex-col px-4 pt-3.5">
                <span
                    className="font-inter self-start rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.24em]"
                    style={{ background: "#F8F31A", color: "#DA0213" }}
                >
                    {units} Blasters
                </span>
                <h3 className="font-instrument mt-1.5 text-[clamp(24px,2.8vw,32px)] leading-[0.92] text-[#F8F31A]">
                    {b.name}
                </h3>
                <p className="mt-1.5 font-inter text-[12px] leading-snug text-white/60">
                    {b.desc}
                </p>

                <div className="mt-auto pt-3">
                    <PriceTag mrp={mrp} price={b.price} variant="dark" size="md" />
                    <p className="mt-1 font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        You save {inr(save)}
                    </p>
                </div>
            </div>

            {/* Action. */}
            <div className="mt-3 flex items-center gap-2.5 border-t border-white/10 px-4 pb-4 pt-3.5">
                <AddBundle bundleKey={b.key} name={b.name} price={b.price} />
            </div>
        </div>
    );
}

export default function SquadPacks({ packsRef }) {
    return (
        <section
            ref={packsRef}
            id="squad-packs"
            className="relative z-10 w-full px-6 pb-24 pt-4 md:px-12 md:pb-28"
        >
            <div className="mx-auto max-w-7xl">
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.4em] text-[#DA0213]">
                    /// Squad Packs
                </span>
                <h2 className="font-instrument mt-4 text-[clamp(40px,7vw,84px)] leading-[0.9] text-[#1a1a1a]">
                    Gear up the <span className="text-shimmer">whole squad</span>.
                </h2>
                <p className="mt-4 max-w-xl font-inter text-[15px] leading-relaxed text-[#1a1a1a]/60">
                    Bundle up and save more the bigger the crew. One tap adds the
                    whole pack to your cart. Perfect for Holi mornings and squad
                    water fights.
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {BUNDLES.map((b) => (
                        <BundleCard key={b.id} b={b} />
                    ))}
                </div>
            </div>
        </section>
    );
}
