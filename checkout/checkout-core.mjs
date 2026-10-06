/**
 * Checkout core for the Shopflo integration — host-agnostic, pure logic.
 *
 * Turns the site cart into Shopify variant line items plus the dynamic
 * "Build Your Squad" discount, computed from a TRUSTED table so the browser
 * can never tamper with prices or discounts. Imported by the serverless
 * create-checkout function (Cloudflare Worker or AWS Lambda — this file does
 * not care which).
 *
 * Catalogue + tiers MUST stay in sync with:
 *   - the live Shopify store (ad0eqh-ma) product variant IDs
 *   - frontend/src/components/landing/BuildYourSquad.jsx (TIERS + price math)
 *   - frontend/src/lib/cart.jsx (PRODUCT_LOOKUP prices)
 */

// Trusted product catalogue: cart product key -> Shopify variant + sale price.
// Variant IDs are from the live store; prices in whole INR.
export const PRODUCTS = {
    mp5k: {
        variantId: "60140951798046",
        variantGid: "gid://shopify/ProductVariant/60140951798046",
        price: 999,
        title: "MP5K Electric Water Blaster",
    },
    m416: {
        variantId: "60140951830814",
        variantGid: "gid://shopify/ProductVariant/60140951830814",
        price: 899,
        title: "M416 Water X Electric Blaster",
    },
    // crimson is coming-soon / not buyable yet — intentionally omitted.
};

// Dynamic "Build Your Squad" tiers: total blaster units -> EXTRA % off.
// Mirror of BuildYourSquad.jsx TIERS. Highest tier reached applies.
export const TIERS = [
    { units: 2, pct: 10 },
    { units: 4, pct: 13 },
    { units: 6, pct: 16, freeShipping: true },
];
const activeTier = (u) => TIERS.reduce((acc, t) => (u >= t.units ? t : acc), null);

/**
 * Build the trusted line items + discount from the cart the browser sends.
 *
 * Input shape (client sends structure, never prices):
 *   { lines: [
 *       { product: "mp5k", qty: 1 },                         // individual
 *       { bundle: [ { product: "mp5k", qty: 2 },             // one dynamic
 *                   { product: "m416", qty: 2 } ] },         //   bundle
 *   ] }
 *
 * Returns:
 *   { lineItems: [{ variantId, variantGid, title, quantity, price }],
 *     discountInr, freeShipping, subtotalInr, totalInr }
 */
export function buildCart(cart) {
    const byVariant = Object.create(null); // variantId -> line item (merged qty)
    let discountInr = 0;
    let freeShipping = false;

    const addUnits = (productKey, qty) => {
        const p = PRODUCTS[productKey];
        if (!p) throw new Error("Unknown product: " + productKey);
        const q = qty | 0;
        if (q <= 0) throw new Error("Invalid quantity for " + productKey + ": " + qty);
        const line = byVariant[p.variantId] || {
            variantId: p.variantId,
            variantGid: p.variantGid,
            title: p.title,
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
            const tier = activeTier(units);
            if (tier) {
                const finalTotal = Math.round(subtotal * (1 - tier.pct / 100));
                discountInr += subtotal - finalTotal;
                if (tier.freeShipping) freeShipping = true;
            }
        } else {
            throw new Error("Cart line must have `product` or `bundle`");
        }
    }

    const lineItems = Object.values(byVariant);
    const subtotalInr = lineItems.reduce((s, v) => s + v.price * v.quantity, 0);
    const totalInr = subtotalInr - discountInr;
    return { lineItems, discountInr, freeShipping, subtotalInr, totalInr };
}
