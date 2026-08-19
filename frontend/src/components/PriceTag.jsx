/* Strategic D2C price block — bold sale price + struck MRP + a discount chip,
   the layout most Indian D2C stores use to make the deal obvious at a glance.

   Brand-aware: on DARK surfaces (the charcoal Arsenal cards) the sale price is
   brand yellow and the chip is a bright yellow badge — both pop on charcoal.
   On LIGHT surfaces (product pages) the sale price is brand red and the chip is
   a red badge with yellow text. Either way it reads red + yellow, on brand.

   Returns null when there is no price (e.g. a coming-soon product), so callers
   can drop it in unconditionally. */

const BRAND_RED = "#990505";
const BRAND_YELLOW = "#F8F31A";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const SIZES = {
    sm: { price: "text-[21px]", mrp: "text-[12px]", chip: "text-[9px] px-1.5 py-[3px]" },
    md: { price: "text-[26px]", mrp: "text-[13px]", chip: "text-[10px] px-2 py-[3px]" },
    lg: { price: "text-[38px]", mrp: "text-[15px]", chip: "text-[12px] px-2.5 py-1" },
};

export default function PriceTag({ mrp, price, variant = "light", size = "md", className = "" }) {
    if (price == null) return null;
    const dark = variant === "dark";
    const off = mrp && mrp > price ? Math.round((1 - price / mrp) * 100) : 0;
    const S = SIZES[size] || SIZES.md;

    return (
        <div className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${className}`}>
            <span
                className={`font-inter font-extrabold tabular-nums leading-none ${S.price}`}
                style={{ color: dark ? BRAND_YELLOW : BRAND_RED }}
            >
                {inr(price)}
            </span>
            {off > 0 && (
                <span
                    className={`font-inter tabular-nums line-through ${S.mrp} ${dark ? "text-white/40" : "text-black/35"}`}
                >
                    {inr(mrp)}
                </span>
            )}
            {off > 0 && (
                <span
                    className={`font-inter rounded-md font-extrabold uppercase tracking-[0.06em] ${S.chip}`}
                    style={
                        dark
                            ? { background: BRAND_YELLOW, color: BRAND_RED }
                            : { background: BRAND_RED, color: BRAND_YELLOW }
                    }
                >
                    {off}% Off
                </span>
            )}
        </div>
    );
}
