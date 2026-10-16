/**
 * Shopflo checkout endpoint (Cloudflare Worker).
 *
 *   POST <worker-url>   body: { lines: [...] }   (the trusted-cart shape)
 *     1. buildCart() -> trusted line items + Build-Your-Squad discount (server-side)
 *     2. ask Shopflo's Checkout API for a hosted checkout URL
 *     3. -> { checkoutUrl }   (the browser then redirects there)
 *
 * Deploy (from this dir):   npx wrangler deploy
 * Secrets (never in code):  npx wrangler secret put SHOPFLO_API_KEY
 *                           npx wrangler secret put SHOPFLO_MERCHANT_ID
 * Vars live in wrangler.jsonc (SHOPFLO_API_URL, SUCCESS_URL, ALLOW_ORIGINS).
 *
 * ⚠️  The Shopflo request/response (endpoint, auth header, body + the field the
 *     checkout URL comes back in) must be CONFIRMED against Shopflo's Postman
 *     collection "[V2-NEW] Shopflo Checkout Integration with Shopify". That is
 *     the only unknown, and it is isolated in createShopfloCheckout() below so
 *     it is a one-spot fix once we have the doc + credentials.
 */

import { buildCart } from "./checkout-core.mjs";

const DEFAULT_SHOPFLO_API = "https://api.shopflo.com/public/api/v2/tokens";

function corsHeaders(origin, allowList) {
    const allowed = String(allowList || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const allow = allowed.includes(origin) ? origin : allowed[0] || "*";
    return {
        "Access-Control-Allow-Origin": allow,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
    };
}

/* The single Shopflo-specific call. CONFIRM shape against Shopflo's Postman. */
async function createShopfloCheckout(trusted, env) {
    const res = await fetch(env.SHOPFLO_API_URL || DEFAULT_SHOPFLO_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.SHOPFLO_API_KEY}`,
            "x-merchant-id": env.SHOPFLO_MERCHANT_ID || "",
        },
        body: JSON.stringify({
            merchant_key: env.SHOPFLO_MERCHANT_ID,
            line_items: trusted.lineItems.map((l) => ({
                variant_id: l.variantId,
                quantity: l.quantity,
            })),
            discount:
                trusted.discountInr > 0
                    ? { amount: trusted.discountInr, type: "fixed" }
                    : undefined,
            metadata: { "ui-config": { is_flash_redirect: true } },
            success_url: env.SUCCESS_URL || "https://upyourplay.in/",
        }),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error("Shopflo API " + res.status + ": " + text.slice(0, 300));
    }
    const data = await res.json().catch(() => ({}));
    return (
        data.checkout_url ||
        data.checkoutUrl ||
        (data.data && (data.data.checkout_url || data.data.checkoutUrl))
    );
}

export default {
    async fetch(request, env) {
        const origin = request.headers.get("Origin") || "";
        const headers = {
            ...corsHeaders(origin, env.ALLOW_ORIGINS),
            "Content-Type": "application/json",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers });
        }
        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers,
            });
        }

        try {
            const cart = await request.json();
            const trusted = buildCart(cart); // trusted prices + discount
            const checkoutUrl = await createShopfloCheckout(trusted, env);
            if (!checkoutUrl) throw new Error("No checkout URL returned by Shopflo.");
            return new Response(JSON.stringify({ checkoutUrl }), { status: 200, headers });
        } catch (e) {
            return new Response(
                JSON.stringify({ error: (e && e.message) || "Checkout failed" }),
                { status: 400, headers }
            );
        }
    },
};
