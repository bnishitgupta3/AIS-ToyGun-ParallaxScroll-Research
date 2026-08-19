import { useCartItem } from "@/lib/cart";
import PriceTag from "@/components/PriceTag";
import { PRODUCTS } from "@/components/landing/ArsenalSection";
import { asset } from "@/lib/asset";

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
        tagline: "Two blasters, one squad. Grab a friend and go.",
        items: [{ link: "/product/mp5k", qty: 1 }, { link: "/product/m416", qty: 1 }],
        price: 1699,
    },
    {
        id: "squad",
        key: "/bundle/squad",
        name: "Squad Pack",
        tagline: "Four-strong. The whole crew, fully loaded.",
        items: [{ link: "/product/mp5k", qty: 2 }, { link: "/product/m416", qty: 2 }],
        price: 3299,
        badge: "Most Popular",
    },
    {
        id: "party",
        key: "/bundle/party",
        name: "Party Pack",
        tagline: "Six blasters for the whole street. Total drench.",
        items: [{ link: "/product/mp5k", qty: 3 }, { link: "/product/m416", qty: 3 }],
        price: 4799,
    },
];

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const bundleMrp = (b) => b.items.reduce((s, it) => s + (BY_LINK[it.link]?.mrp || 0) * it.qty, 0);
const bundleUnits = (b) => b.items.reduce((s, it) => s + it.qty, 0);

/* Add-to-cart for a pack: "Add Squad" → − N + stepper, wired to the shared cart
   (nav badge + Buy-Now sheet stay in sync). Brand red fill, yellow label. */
function AddBundle({ bundleKey }) {
    const { qty, inc, dec, set } = useCartItem(bundleKey);
    if (qty === 0) {
        return (
            <button
                type="button"
                onClick={() => set(1)}
                className="brutal-accent flex h-11 w-full items-center justify-center gap-2 rounded-full font-inter text-[12px] font-bold uppercase tracking-[0.16em] transition hover:brightness-110"
                style={{ background: "#990505", color: "#F8F31A" }}
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
            style={{ background: "#990505", color: "#F8F31A" }}
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
            style={{ "--accent": "#990505" }}
        >
            {/* Contents — the constituent blasters on a light tile, each with a
                quantity badge, so the pack's value is obvious at a glance. */}
            <div className="relative flex items-center justify-center gap-4 bg-[#f1f0ed] px-5 py-12">
                {b.badge && (
                    <span
                        className="absolute left-3 top-3 z-10 rounded-full px-3 py-1 font-inter text-[10px] font-bold uppercase tracking-[0.18em]"
                        style={{ background: "#F8F31A", color: "#990505" }}
                    >
                        {b.badge}
                    </span>
                )}
                {b.items.map((it) => {
                    const p = BY_LINK[it.link];
                    if (!p) return null;
                    return (
                        <div key={it.link} className="relative w-[47%]">
                            <img
                                src={asset("/assets/products/" + p.image)}
                                alt={p.name}
                                draggable="false"
                                className="aspect-[4/3] w-full rounded-xl object-cover object-center"
                            />
                            <span
                                className="absolute -bottom-2.5 -right-2.5 grid h-8 w-8 place-items-center rounded-full font-inter text-[13px] font-bold tabular-nums text-white shadow-md"
                                style={{ background: "#990505" }}
                            >
                                ×{it.qty}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Accent seam. */}
            <div className="h-[3px] w-full" style={{ background: "#990505" }} />

            {/* Name + contents summary + price. */}
            <div className="flex flex-1 flex-col px-4 pt-4">
                <span
                    className="font-inter self-start rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.24em]"
                    style={{ background: "#F8F31A", color: "#990505" }}
                >
                    {units} Blasters
                </span>
                <h3 className="font-instrument mt-2 text-[clamp(26px,3vw,36px)] leading-[0.92] text-[#F8F31A]">
                    {b.name}
                </h3>
                <p className="mt-1.5 font-inter text-[12px] leading-snug text-white/55">
                    {b.tagline}
                </p>

                <div className="mt-auto pt-4">
                    <PriceTag mrp={mrp} price={b.price} variant="dark" size="md" />
                    <p className="mt-1.5 font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        You save {inr(save)}
                    </p>
                </div>
            </div>

            {/* Action. */}
            <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 px-4 pb-4 pt-4">
                <AddBundle bundleKey={b.key} />
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
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.4em] text-[#990505]">
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
