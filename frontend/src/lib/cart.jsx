import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

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

export function CartProvider({ children }) {
    // key (product link, e.g. "/product/mp5k") -> integer qty
    const [items, setItems] = useState({});
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

    // Cart price subtotal (₹) — bundles and products both carry a `price`.
    const subtotal = useMemo(
        () =>
            Object.entries(items).reduce(
                (s, [key, q]) => s + q * (PRODUCT_LOOKUP[key]?.price || 0),
                0,
            ),
        [items],
    );

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
    const squadNudge = !hasBundle && (individualSkus >= 2 || individualUnits >= 3);

    // Auto-open the cart the moment the order crosses into "group play"
    // territory. Fires on the false→true transition ONLY — a shopper who closes
    // it isn't fought on every later add; it re-arms if the cart drops back
    // below the threshold. High-AOV D2C move: surface the bundle upsell exactly
    // when it's relevant, not on every single add.
    const nudgeArmed = useRef(false);
    useEffect(() => {
        if (squadNudge && !nudgeArmed.current) {
            nudgeArmed.current = true;
            setDrawer((d) => (d.open ? d : { open: true, product: null }));
        } else if (!squadNudge) {
            nudgeArmed.current = false;
        }
    }, [squadNudge]);

    const value = useMemo(
        () => ({ items, setQty, total, blasters, subtotal, squadNudge, drawer, openDrawer, closeDrawer }),
        [items, setQty, total, blasters, subtotal, squadNudge, drawer, openDrawer, closeDrawer],
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
    "/product/mp5k": { name: "MP5K", sub: "Water Gun", accent: "#f97316", price: 999 },
    "/product/m416": { name: "M416 Water X", sub: "Water Gun", accent: "#0871E7", price: 899 },
    "/product/crimson": { name: "Crimson Blaster", sub: "Gel Blaster", accent: "#ef4444", comingSoon: true },
    /* Squad packs (bundles) — each is a single cart line. Flagged `bundle` so
       they're excluded from the cross-sell CATALOG below. */
    "/bundle/duo":   { name: "Duo Pack",   sub: "Bundle", accent: "#DA0213", price: 1699, bundle: true, units: 2,
        contents: [{ link: "/product/mp5k", qty: 1, name: "MP5K" }, { link: "/product/m416", qty: 1, name: "M416" }] },
    "/bundle/squad": { name: "Squad Pack", sub: "Bundle", accent: "#DA0213", price: 3299, bundle: true, units: 4,
        contents: [{ link: "/product/mp5k", qty: 2, name: "MP5K" }, { link: "/product/m416", qty: 2, name: "M416" }] },
    "/bundle/party": { name: "Party Pack", sub: "Bundle", accent: "#DA0213", price: 4799, bundle: true, units: 6,
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
