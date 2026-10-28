/**
 * Checkout core for the Shopflo integration — host-agnostic, pure logic.
 *
 * Turns the site cart into trusted Shopify line items plus the dynamic
 * "Build Your Squad" discount CODE, computed from a TRUSTED table so the browser
 * can never tamper with prices or discounts. Imported by the serverless
 * create-checkout Worker (checkout/worker.mjs).
 *
 * Catalogue MUST stay in sync with:
 *   - the live Shopify store (ad0eqh-ma) variant IDs, product IDs, SKUs, images
 *   - frontend/src/components/landing/BuildYourSquad.jsx (TIERS + price math)
 *   - frontend/src/lib/cart.jsx (PRODUCT_LOOKUP prices)
 */

// Trusted catalogue: cart product key -> Shopify identifiers + sale price.
// All fields are what Shopflo's Token API marks mandatory per item.
export const PRODUCTS = {
    mp5k: {
        variantId: "60140951798046",
        variantGid: "gid://shopify/ProductVariant/60140951798046",
        productId: "15944213004574",
        price: 1299,
        title: "MP5K Water Gun/Blaster",
        variantName: "Default Title",
        sku: "UYP-MP5K",
        image: "https://cdn.shopify.com/s/files/1/1096/6302/7486/files/mp5k.jpg?v=1791187095",
    },
    m416: {
        variantId: "60140951830814",
        variantGid: "gid://shopify/ProductVariant/60140951830814",
        productId: "15944213037342",
        price: 1299,
        title: "M416 Water Gun/Blaster",
        variantName: "Default Title",
        sku: "UYP-M416",
        image: "https://cdn.shopify.com/s/files/1/1096/6302/7486/files/m416.jpg?v=1791187097",
    },
    // crimson is coming-soon / not buyable yet — intentionally omitted.
};

// Dynamic "Build Your Squad" tiers: total blaster units -> EXTRA % off. Mirror
// of BuildYourSquad.jsx TIERS.
export const TIERS = [
    { units: 2, pct: 10 },
    { units: 4, pct: 13 },
    { units: 6, pct: 16 },
];

// The Shopify discount CODE each tier maps to. Highest qualifying tier wins;
// Shopify enforces the real min-quantity gate when Shopflo applies the code.
export const TIER_CODES = [
    { units: 6, code: "SQUAD16" },
    { units: 4, code: "SQUAD13" },
    { units: 2, code: "SQUAD10" },
];

const activeTier = (u) => TIERS.reduce((acc, t) => (u >= t.units ? t : acc), null);

/**
 * Build the trusted line items + discount from the cart the browser sends.
 *
 * Input shape (client sends STRUCTURE, never prices):
 *   { lines: [
 *       { product: "mp5k", qty: 1 },                         // individual
 *       { bundle: [ { product: "mp5k", qty: 2 },             // one dynamic
 *                   { product: "m416", qty: 2 } ] },         //   bundle
 *   ] }
 *
 * Returns:
 *   { lineItems: [{ variantId, variantGid, productId, title, variantName, sku,
 *                   image, price, quantity }],
 *     discountInr, discountCode, totalBundleUnits, freeShipping,
 *     subtotalInr, totalInr }
 */
export function buildCart(cart) {
    const byVariant = Object.create(null); // variantId -> merged line item
    let discountInr = 0;
    let totalBundleUnits = 0;
    const freeShipping = true; // free shipping is universal (no minimum order)

    const addUnits = (productKey, qty) => {
        const p = PRODUCTS[productKey];
        if (!p) throw new Error("Unknown product: " + productKey);
        const q = qty | 0;
        if (q <= 0) throw new Error("Invalid quantity for " + productKey + ": " + qty);
        const line = byVariant[p.variantId] || {
            variantId: p.variantId,
            variantGid: p.variantGid,
            productId: p.productId,
            title: p.title,
            variantName: p.variantName,
            sku: p.sku,
            image: p.image,
            price: p.price,
            quantity: 0,
        };
        line.quantity += q;
        byVariant[p.variantId] = line;
    };

    for (const line of cart.lines || []) {
        if (line.product) {
            addUnits(line.product, line.qty);
        } else if (Array.isArray(line.bundle)) {
            // Expand the dynamic bundle into real variants, then recompute its
            // tier discount from the trusted table — mirrors BuildYourSquad's
            // finalTotal = round(subtotal * (1 - pct/100)).
            let units = 0;
            let subtotal = 0;
            for (const c of line.bundle) {
                const p = PRODUCTS[c.product];
                if (!p) throw new Error("Unknown product in bundle: " + c.product);
                const q = c.qty | 0;
                if (q <= 0) continue;
                addUnits(c.product, q);
                units += q;
                subtotal += q * p.price;
            }
            totalBundleUnits += units;
            const tier = activeTier(units);
            if (tier) {
                const finalTotal = Math.round(subtotal * (1 - tier.pct / 100));
                discountInr += subtotal - finalTotal;
            }
        } else {
            throw new Error("Cart line must have `product` or `bundle`");
        }
    }

    const lineItems = Object.values(byVariant);
    if (!lineItems.length) throw new Error("Cart is empty");

    const subtotalInr = lineItems.reduce((s, v) => s + v.price * v.quantity, 0);
    const totalInr = subtotalInr - discountInr;

    // One Build-Your-Squad code for the whole cart, from total bundle units
    // (mirrors the live Shopify path). Shopify validates the min-qty on apply.
    const tierCode = TIER_CODES.find((t) => totalBundleUnits >= t.units);
    const discountCode = tierCode ? tierCode.code : null;

    return {
        lineItems,
        discountInr,
        discountCode,
        totalBundleUnits,
        freeShipping,
        subtotalInr,
        totalInr,
    };
}
