import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Cart context — single source of truth for everything cart-related.

   Why a context: every "Add to cart" surface on the site (Arsenal tiles, the
   AlsoInArsenal cross-sell, the product-page ProductActions, and the nav cart
   icon) needs to read the SAME quantities and trigger the SAME drawer. Local
   useState in each counter (the old design) made the nav badge impossible.

   Keys: we use each product's canonical link (e.g. "/product/mp5k") as the
   cart key. Stable, unique, and trivially mappable to a Shopify productHandle
   when integration lands.

   ─── SHOPIFY INTEGRATION SWAP POINTS ───────────────────────────────────────
   When wiring Shopify Storefront API later, the public surface (the hooks
   below) should STAY THE SAME. Only the internals change. Concretely:

     1. Replace the local `items` useState with Shopify's `cart` query (read
        line items, qty, total) and `cartLinesAdd / cartLinesUpdate /
        cartLinesRemove` mutations (write).
     2. Persist the `cartId` to localStorage so a returning visitor sees the
        same cart. Today we don't persist anything (in-memory only).
     3. `openDrawer()` from a Buy Now click can either keep opening this
        "coming soon" review panel (acts as a mini-cart), OR redirect to
        Shopify's hosted checkout URL (`cart.checkoutUrl`) when the user is
        ready to pay. For best conversion: open the drawer for review first,
        then a "Checkout" CTA in the drawer hits checkoutUrl.
     4. The line-item-name lookup (PRODUCT_LOOKUP at the bottom of this file)
        becomes a query off the Shopify product handle instead of our local
        table.

   Concrete surface that components depend on:
     • useCartItem(key)   → { qty, set, inc, dec }   (per-product counter)
     • useCart()          → { items, total, openDrawer, drawer, closeDrawer }
   Keep that surface stable on swap day. Counters and Buy Now buttons won't
   need to change.
   ═══════════════════════════════════════════════════════════════════════════ */

const CartContext = createContext(null);

/* Cart persistence — a D2C cart must survive reloads and return visits, so we
   mirror it to localStorage (guest cart). We also stash any custom Build-Your-
   Squad bundle definitions (runtime-registered into PRODUCT_LOOKUP) so a
   persisted custom squad still renders + checks out after a reload. Everything
   is wrapped in try/catch — localStorage can throw or be empty (private mode,
   prerender, blocked storage). */
const CART_STORAGE_KEY = "uyp_cart_v1";
const CART_TTL_MS = 30 * 24 * 60 * 60 * 1000; // drop carts older than 30 days

/* Squad discount tiers (mirror checkout-core.mjs / BuildYourSquad). The tier is
   chosen from the total BUNDLE units (matching the Worker) and, like the live
   Shopify code, then discounts the WHOLE cart — so loose singles added next to a
   pack are discounted too, keeping the drawer total equal to the Shopflo total. */
const TIERS = [
    { units: 2, pct: 10, code: "SQUAD10" },
    { units: 4, pct: 13, code: "SQUAD13" },
    { units: 6, pct: 16, code: "SQUAD16" },
];
const activeSquadTier = (bundleUnits) => TIERS.reduce((acc, t) => (bundleUnits >= t.units ? t : acc), null);

function loadCart() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return {};
        const saved = JSON.parse(raw);
        if (!saved || typeof saved !== "object") return {};
        if (saved.savedAt && Date.now() - saved.savedAt > CART_TTL_MS) {
            localStorage.removeItem(CART_STORAGE_KEY);
            return {};
        }
        if (saved.customBundles) {
            for (const [k, def] of Object.entries(saved.customBundles)) {
                if (!PRODUCT_LOOKUP[k]) PRODUCT_LOOKUP[k] = def;
            }
        }
        return saved.items && typeof saved.items === "object" ? saved.items : {};
    } catch {
        return {};
    }
}

export function CartProvider({ children }) {
    // key (product link, e.g. "/product/mp5k") -> integer qty. Seeded from
    // localStorage so the cart survives reloads and return visits.
    const [items, setItems] = useState(loadCart);

    // Mirror every cart change back to localStorage (incl. custom bundle defs).
    useEffect(() => {
        try {
            const customBundles = {};
            for (const key of Object.keys(items)) {
                // Runtime bundle definitions (Build Your Squad "custom-" + PDP
                // "pack-") live only in memory, so persist them with the cart or
                // they come back as a dangling key (404 + lost price) after a reload.
                if ((key.startsWith("/bundle/custom-") || key.startsWith("/bundle/pack-")) && PRODUCT_LOOKUP[key]) {
                    customBundles[key] = PRODUCT_LOOKUP[key];
                }
            }
            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify({ items, customBundles, savedAt: Date.now() }),
            );
        } catch {
            /* storage unavailable (private mode / disabled) — cart stays in-memory */
        }
    }, [items]);
    // drawer state — { open: bool, product?: { name } | null }
    const [drawer, setDrawer] = useState({ open: false, product: null });

    const setQty = useCallback((key, qty) => {
        setItems((prev) => {
            const next = { ...prev };
            const clamped = Math.max(0, qty | 0);
            if (clamped === 0) delete next[key];
            else next[key] = clamped;
            return next;
        });
    }, []);

    // Empty the whole cart — used by the post-payment thank-you page once an
    // order is placed (the localStorage mirror effect clears the saved copy too).
    const clearCart = useCallback(() => setItems({}), []);

    const openDrawer = useCallback((product = null) => {
        setDrawer({ open: true, product });
    }, []);

    const closeDrawer = useCallback(() => {
        setDrawer({ open: false, product: null });
    }, []);

    // "total" = number of line items — the nav cart badge shows this, so a Squad
    // Pack counts as 1, not 4.
    const total = useMemo(
        () => Object.values(items).reduce((s, q) => s + q, 0),
        [items],
    );

    // "blasters" = actual blaster count (a bundle contributes its unit count:
    // Duo=2, Squad=4, Party=6) — used for the "N blasters ready" copy INSIDE the
    // cart. (Referencing PRODUCT_LOOKUP is safe — runs at render, module loaded.)
    const blasters = useMemo(
        () =>
            Object.entries(items).reduce(
                (s, [key, q]) => s + q * (PRODUCT_LOOKUP[key]?.units || 1),
                0,
            ),
        [items],
    );

    // Undiscounted cart value (₹) — bundles are valued from their CONTENTS at full
    // sale price (not a pre-discounted `price`), so the single squad discount below
    // covers the whole cart consistently.
    const grossSubtotal = useMemo(
        () =>
            Object.entries(items).reduce((s, [key, q]) => {
                const info = PRODUCT_LOOKUP[key];
                if (!info) return s;
                if (info.bundle && Array.isArray(info.contents)) {
                    return s + q * info.contents.reduce((cs, c) => cs + c.qty * (PRODUCT_LOOKUP[c.link]?.price || 0), 0);
                }
                return s + q * (info.price || 0);
            }, 0),
        [items],
    );
    // Squad tier is chosen from the TOTAL blaster quantity (the "buy more, save
    // more" offer) and, like the live Shopify code, discounts the whole cart.
    const squadTier = useMemo(() => activeSquadTier(blasters), [blasters]);
    const squadCode = squadTier ? squadTier.code : null;
    const squadDiscount = useMemo(
        () => (squadTier ? Math.round(grossSubtotal * (squadTier.pct / 100)) : 0),
        [squadTier, grossSubtotal],
    );
    // What the shopper pays (pre-shipping) — matches the Shopflo checkout total.
    const subtotal = grossSubtotal - squadDiscount;

    // ── Squad Pack upsell signals ───────────────────────────────────────────
    // Individual = non-bundle line items. Once the order starts to look like
    // group play — 2+ different blasters OR 3+ total units — a Squad Pack
    // becomes the better deal, so we surface it. We DON'T nudge once a bundle is
    // already in the cart (that's the thing we're upselling).
    const [individualSkus, individualUnits, hasBundle] = useMemo(() => {
        let skus = 0, units = 0, bundle = false;
        for (const [key, q] of Object.entries(items)) {
            if (q <= 0) continue;
            if (PRODUCT_LOOKUP[key]?.bundle) bundle = true;
            else { skus += 1; units += q; }
        }
        return [skus, units, bundle];
    }, [items]);
    // The order looks like "group play" once there are 2+ different blasters or
    // 3+ individual units. The Squad Pack NUDGE banner shows then — but only if a
    // bundle isn't already in the cart (don't upsell what they just bought).
    const groupPlay = individualSkus >= 2 || individualUnits >= 3;
    const squadNudge = groupPlay && !hasBundle;

    // Every add fires an "Added to cart" TOAST (item name + how many were added)
    // AND auto-opens the cart drawer, so the shopper sees their cart immediately.
    // (Earlier the drawer stayed closed on add; changed per request.)
    const [toast, setToast] = useState(null);
    const notifyAdded = useCallback((name = "Item", qty = 1) => {
        setToast({ name, qty, id: Date.now() });
        setDrawer({ open: true, product: null }); // auto-open the cart on every add
    }, []);
    const clearToast = useCallback(() => setToast(null), []);

    const value = useMemo(
        () => ({ items, setQty, clearCart, total, blasters, subtotal, squadDiscount, squadCode, squadNudge, drawer, openDrawer, closeDrawer, toast, notifyAdded, clearToast }),
        [items, setQty, clearCart, total, blasters, subtotal, squadDiscount, squadCode, squadNudge, drawer, openDrawer, closeDrawer, toast, notifyAdded, clearToast],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* Read the whole cart + drawer controls. Use for the nav cart icon, the
   global BuyNowSheet, and Buy Now buttons. */
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within <CartProvider>");
    return ctx;
}

/* Per-product counter helper. Use inside every Add/Stepper component. */
export function useCartItem(key) {
    const { items, setQty } = useCart();
    const qty = items[key] || 0;
    return {
        qty,
        set: (q) => setQty(key, q),
        inc: () => setQty(key, qty + 1),
        dec: () => setQty(key, qty - 1),
    };
}

/* Lookup table: cart key → human-readable product name.

   Used by BuyNowSheet to render the cart line items. This is duplicated from
   the Arsenal PRODUCTS data on purpose — to keep the cart code import-graph
   independent of the Arsenal component (avoids circular imports as the cart
   gets used in more places).

   ─── SHOPIFY SWAP ───────────────────────────────────────────────────────────
   On Shopify, this lookup goes away. Line items come back from the cart
   query already containing the merchandise title and variant. Delete this
   table and read directly from the Shopify cart line. */
export const PRODUCT_LOOKUP = {
    "/product/mp5k": { name: "MP5K", sub: "Water Gun", accent: "#f97316", price: 1299 },
    "/product/m416": { name: "M416 Water X", sub: "Water Gun", accent: "#0871E7", price: 1299 },
    "/product/crimson": { name: "Crimson Blaster", sub: "Gel Blaster", accent: "#ef4444", comingSoon: true },
    /* Squad packs (bundles) — each is a single cart line. Flagged `bundle` so
       they're excluded from the cross-sell CATALOG below. */
    "/bundle/duo":   { name: "Duo Pack",   sub: "Bundle", accent: "#F8290A", price: 2338, bundle: true, units: 2,
        contents: [{ link: "/product/mp5k", qty: 1, name: "MP5K" }, { link: "/product/m416", qty: 1, name: "M416" }] },
    "/bundle/squad": { name: "Squad Pack", sub: "Bundle", accent: "#F8290A", price: 4521, bundle: true, units: 4,
        contents: [{ link: "/product/mp5k", qty: 2, name: "MP5K" }, { link: "/product/m416", qty: 2, name: "M416" }] },
    "/bundle/party": { name: "Party Pack", sub: "Bundle", accent: "#F8290A", price: 6547, bundle: true, units: 6,
        contents: [{ link: "/product/mp5k", qty: 3, name: "MP5K" }, { link: "/product/m416", qty: 3, name: "M416" }] },
};

/* Ordered product catalogue (derived from the lookup above) for the cart
   drawer's cross-sell / "you might also like" quick-add row. Bundles are
   excluded — they aren't cross-sell items. Kept here so the cart's import graph
   stays independent of the Arsenal component. On the Shopify swap this becomes a
   product-recommendations query. */
export const CATALOG = Object.entries(PRODUCT_LOOKUP)
    .filter(([, v]) => !v.bundle)
    .map(([key, v]) => ({ key, ...v }));

/* Biggest rupee saving of any bundle vs buying its contents individually —
   powers the "save up to ₹X" Squad Pack upsell copy in the cart. Derived from
   the table so it stays correct if prices ever change. */
export const MAX_BUNDLE_SAVING = Math.max(
    0,
    ...Object.values(PRODUCT_LOOKUP)
        .filter((v) => v.bundle && v.contents)
        .map((v) =>
            v.contents.reduce((s, c) => s + c.qty * (PRODUCT_LOOKUP[c.link]?.price || 0), 0) - v.price,
        ),
);
