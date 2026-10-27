/**
 * Shopflo checkout endpoint (Cloudflare Worker).
 *
 *   POST <worker-url>   body: { sf_session_id, lines: [...] }
 *     1. buildCart() -> trusted items + Build-Your-Squad discount code (server-side)
 *     2. POST Shopflo Token API v2 with the SECRET api key -> { data.checkout_url }
 *     3. -> { checkoutUrl }   (the browser redirects there)
 *
 * After payment Shopflo redirects the buyer to success_url (with the order id +
 * checkout id substituted into the placeholders); on exit/back to back_url.
 *
 * Deploy (from this dir):   npx wrangler deploy
 * Secret (never in code):   npx wrangler secret put SHOPFLO_API_KEY
 * Vars (wrangler.jsonc):    SHOPFLO_API_URL, SUCCESS_PATH, BACK_PATH, ALLOW_ORIGINS
 *
 * Token API ref (verified 2026-10-23): POST https://api.shopflo.co/kratos/api/v2/token
 *   headers: Authorization: <api key> (raw, no Bearer)
 *   body:   { sf_session_id, items[], discounts[], back_url, success_url, ui_config }
 *   resp:   { success, data: { token_id, checkout_url, application_id } }
 */

import { buildCart } from "./checkout-core.mjs";

const DEFAULT_API = "https://api.shopflo.co/kratos/api/v2/token";
const DEFAULT_SHOPIFY_API_VERSION = "2025-01";

function allowedList(env) {
    return String(env.ALLOW_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function corsHeaders(origin, env) {
    const allowed = allowedList(env);
    const allow = allowed.includes(origin) ? origin : allowed[0] || "*";
    return {
        "Access-Control-Allow-Origin": allow,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
    };
}

// Trusted cart line item -> Shopflo item object. Every field below except
// line_price is marked mandatory in the Shopflo Token API docs.
function toShopfloItem(l) {
    return {
        id: String(l.variantId),
        quantity: l.quantity,
        name: l.title,
        product_name: l.title,
        variant_name: l.variantName || "Default Title",
        price: l.price,
        sku: l.sku,
        product_id: String(l.productId),
        image: l.image,
        line_price: { sub_total: Number(l.price).toFixed(2) },
    };
}

async function createShopfloCheckout(trusted, ctx, env) {
    const payload = {
        sf_session_id: ctx.sessionId,
        items: trusted.lineItems.map(toShopfloItem),
        back_url: ctx.backUrl,
        // Shopflo substitutes the order id + checkout id into these placeholders.
        success_url: ctx.successUrl,
        // is_flash_redirect -> Shopflo sends the buyer to success_url after pay.
        // The guide says "the metadata in ui-config"; the Postman example nests
        // metadata under layout (ui_config.layout.metadata). Put the flag in BOTH
        // spots so whichever path Shopflo reads, it sees the flag.
        ui_config: {
            metadata: { is_flash_redirect: true },
            layout: { metadata: { is_flash_redirect: true } },
        },
    };
    // Build-Your-Squad discount as a Shopify CODE (Shopflo syncs Shopify codes).
    if (trusted.discountCode) {
        payload.discounts = [{ type: "CODE", code: trusted.discountCode }];
    }

    const res = await fetch(env.SHOPFLO_API_URL || DEFAULT_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: env.SHOPFLO_API_KEY || "",
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data || data.success === false) {
        const msg = (data && (data.message || data.error)) || "Shopflo API " + res.status;
        throw new Error(String(msg).slice(0, 300));
    }
    return data.data && data.data.checkout_url;
}

/* ── Order summary for the /thank-you page ──
   GET /order?id=<shopify order id>. Looks the order up with a read_orders Admin
   API token (server-side only) and returns a NON-PII summary: name (e.g. UYP1014),
   line items and totals. No customer name / email / address is ever returned.
   `id` may be the numeric order id, a gid, or the order name. */
function orderGid(id) {
    const s = String(id).trim();
    if (s.startsWith("gid://")) return s;
    if (/^\d+$/.test(s)) return "gid://shopify/Order/" + s;
    return null; // looks like a name -> search by name instead
}

const ORDER_FIELDS = `
    name
    displayFinancialStatus
    totalDiscountsSet { shopMoney { amount } }
    totalShippingPriceSet { shopMoney { amount } }
    totalPriceSet { shopMoney { amount currencyCode } }
    lineItems(first: 20) {
        nodes {
            title
            quantity
            discountedTotalSet { shopMoney { amount } }
            originalUnitPriceSet { shopMoney { amount } }
        }
    }`;

async function fetchOrderSummary(rawId, env) {
    const store = env.SHOPIFY_STORE;
    const token = env.SHOPIFY_ADMIN_TOKEN;
    if (!store || !token) throw new Error("Order lookup not configured");
    const ver = env.SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_API_VERSION;
    const endpoint = "https://" + store + "/admin/api/" + ver + "/graphql.json";

    const gid = orderGid(rawId);
    let query, variables;
    if (gid) {
        query = "query($id: ID!){ order(id:$id){ " + ORDER_FIELDS + " } }";
        variables = { id: gid };
    } else {
        const name = String(rawId).trim().replace(/^#/, "");
        query = "query($q: String!){ orders(first:1, query:$q){ nodes { " + ORDER_FIELDS + " } } }";
        variables = { q: "name:" + name };
    }

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
        body: JSON.stringify({ query, variables }),
    });
    const json = await res.json().catch(() => ({}));
    const order = gid
        ? json.data && json.data.order
        : json.data && json.data.orders && json.data.orders.nodes && json.data.orders.nodes[0];
    if (!order) return null;

    const money = (m) => (m && m.shopMoney ? Number(m.shopMoney.amount) : 0);
    const currency =
        (order.totalPriceSet && order.totalPriceSet.shopMoney && order.totalPriceSet.shopMoney.currencyCode) ||
        "INR";
    return {
        name: order.name,
        status: order.displayFinancialStatus,
        currency,
        discount: money(order.totalDiscountsSet),
        shipping: money(order.totalShippingPriceSet),
        total: money(order.totalPriceSet),
        items: (order.lineItems && order.lineItems.nodes ? order.lineItems.nodes : []).map((li) => ({
            title: li.title,
            quantity: li.quantity,
            lineTotal: money(li.discountedTotalSet),
            unitPrice: money(li.originalUnitPriceSet),
        })),
    };
}

export default {
    async fetch(request, env) {
        const origin = request.headers.get("Origin") || "";
        const headers = { ...corsHeaders(origin, env), "Content-Type": "application/json" };
        const url = new URL(request.url);

        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });

        // GET /order?id=<shopify order id> -> non-PII order summary for /thank-you.
        if (request.method === "GET" && url.pathname === "/order") {
            if (!allowedList(env).includes(origin)) {
                return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers });
            }
            const id = url.searchParams.get("id") || "";
            if (!id) return new Response(JSON.stringify({ error: "Missing order id" }), { status: 400, headers });
            try {
                const summary = await fetchOrderSummary(id, env);
                if (!summary) return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers });
                return new Response(JSON.stringify(summary), { status: 200, headers });
            } catch (e) {
                return new Response(
                    JSON.stringify({ error: (e && e.message) || "Lookup failed" }),
                    { status: 502, headers },
                );
            }
        }

        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
        }
        // Only our own storefront origins may mint checkouts.
        if (!allowedList(env).includes(origin)) {
            return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers });
        }

        try {
            const body = await request.json();
            const sessionId = body && body.sf_session_id;
            if (!sessionId) throw new Error("Missing sf_session_id");

            const trusted = buildCart(body); // reads body.lines

            // Shopflo's firewall REJECTS localhost/http redirect URLs (returns a
            // Cloudflare block page), so use the calling origin only when it's
            // https (preview or prod), else fall back to the prod site.
            const site = origin.startsWith("https://") ? origin : (env.SITE_URL || "https://upyourplay.in");
            // Shopflo's two docs disagree on the order-id placeholder: the Postman
            // API collection uses {platform_order_id}, the integration guide uses
            // {shopify_order_id}. Same Shopify order number either way, so send BOTH
            // spellings as named params and let /thank-you read whichever Shopflo
            // actually substitutes (an unrecognised one stays a literal, dropped there).
            const successUrl = site + (env.SUCCESS_PATH || "/thank-you") +
                "?order_id={platform_order_id}&shopify_order_id={shopify_order_id}&checkout_id={checkout_id}";
            const backUrl = site + (env.BACK_PATH || "/");

            const checkoutUrl = await createShopfloCheckout(
                trusted,
                { sessionId, successUrl, backUrl },
                env,
            );
            if (!checkoutUrl) throw new Error("No checkout URL returned by Shopflo.");
            return new Response(JSON.stringify({ checkoutUrl }), { status: 200, headers });
        } catch (e) {
            return new Response(
                JSON.stringify({ error: (e && e.message) || "Checkout failed" }),
                { status: 400, headers },
            );
        }
    },
};
