/**
 * Shopflo checkout endpoint - AWS Lambda port of checkout/worker.mjs.
 *
 * Runs behind a Lambda Function URL (request/response payload format 2.0). Same
 * wire contract as the Cloudflare Worker twin, so the frontend is unchanged:
 *   POST <function-url>   body: { sf_session_id, lines: [...] }
 *     1. buildCart() -> trusted items + Build-Your-Squad discount code
 *     2. POST Shopflo Token API v2 with the SECRET api key -> { checkout_url }
 *     3. -> { checkoutUrl }   (the browser redirects there)
 *
 * This is the AWS target of the checkout migration. worker.mjs stays live on
 * Cloudflare until prod is cut over, then it is deleted. Only the genuinely
 * shared logic (buildCart) is imported from checkout-core.mjs; the thin
 * Shopflo + CORS wrapper below intentionally mirrors the Worker so prod
 * behaviour is byte-for-byte identical. When the Worker is retired this is the
 * single source and there is no duplication left.
 *
 * Runtime: nodejs20.x (global fetch + Buffer, no dependencies -> tiny zip).
 * Handler: lambda.handler
 * Config (Lambda env vars): SHOPFLO_API_URL, SUCCESS_PATH, BACK_PATH,
 *   ALLOW_ORIGINS, SITE_URL (optional), and the SECRET SHOPFLO_API_KEY.
 * CORS is handled in code (dynamic per-origin echo), so leave the Function
 * URL's own CORS config empty to avoid duplicate Access-Control headers.
 */

import { buildCart } from "./checkout-core.mjs";

const DEFAULT_API = "https://api.shopflo.co/kratos/api/v2/token";

function allowedList() {
    return String(process.env.ALLOW_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function corsHeaders(origin) {
    const allowed = allowedList();
    const allow = allowed.includes(origin) ? origin : allowed[0] || "*";
    return {
        "Access-Control-Allow-Origin": allow,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
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

async function createShopfloCheckout(trusted, ctx) {
    const payload = {
        sf_session_id: ctx.sessionId,
        items: trusted.lineItems.map(toShopfloItem),
        back_url: ctx.backUrl,
        // Shopflo substitutes the order id + checkout id into these placeholders.
        success_url: ctx.successUrl,
        // is_flash_redirect -> Shopflo sends the buyer to success_url after pay.
        // Sent in both spots Shopflo's docs disagree on, as in the Worker.
        ui_config: {
            metadata: { is_flash_redirect: true },
            layout: { metadata: { is_flash_redirect: true } },
        },
    };
    // Build-Your-Squad discount as a Shopify CODE (Shopflo syncs Shopify codes).
    if (trusted.discountCode) {
        payload.discounts = [{ type: "CODE", code: trusted.discountCode }];
    }

    const res = await fetch(process.env.SHOPFLO_API_URL || DEFAULT_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: process.env.SHOPFLO_API_KEY || "",
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

/* Lambda Function URL handler (payload format 2.0). Header names arrive
   lowercased; method is on requestContext.http.method; the body is a string
   that may be base64-encoded. */
export async function handler(event) {
    const method = event?.requestContext?.http?.method || "GET";
    const origin = event?.headers?.origin || event?.headers?.Origin || "";
    const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

    if (method === "OPTIONS") return { statusCode: 204, headers, body: "" };
    if (method !== "POST") {
        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
    }
    // Only our own storefront origins may mint checkouts.
    if (!allowedList().includes(origin)) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: "Origin not allowed" }) };
    }

    try {
        const raw = event.isBase64Encoded && event.body
            ? Buffer.from(event.body, "base64").toString("utf8")
            : (event.body || "");
        const body = JSON.parse(raw || "{}");
        const sessionId = body && body.sf_session_id;
        if (!sessionId) throw new Error("Missing sf_session_id");

        const trusted = buildCart(body); // reads body.lines

        // Shopflo's firewall REJECTS localhost/http redirect URLs, so use the
        // calling origin only when https (preview or prod), else fall back to prod.
        const site = origin.startsWith("https://") ? origin : (process.env.SITE_URL || "https://upyourplay.in");
        // Send BOTH order-id placeholder spellings; /thank-you reads whichever
        // Shopflo actually substitutes (the other stays literal and is dropped).
        const successUrl = site + (process.env.SUCCESS_PATH || "/thank-you") +
            "?order_id={platform_order_id}&shopify_order_id={shopify_order_id}&checkout_id={checkout_id}";
        const backUrl = site + (process.env.BACK_PATH || "/");

        const checkoutUrl = await createShopfloCheckout(trusted, { sessionId, successUrl, backUrl });
        if (!checkoutUrl) throw new Error("No checkout URL returned by Shopflo.");
        return { statusCode: 200, headers, body: JSON.stringify({ checkoutUrl }) };
    } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: (e && e.message) || "Checkout failed" }) };
    }
}
