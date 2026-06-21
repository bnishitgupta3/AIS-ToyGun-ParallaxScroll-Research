/* Google Analytics 4 — loaded only when a Measurement ID is configured.
   Set REACT_APP_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX) in a .env file or your
   host's env vars. Without it, these are no-ops (so dev/preview stay clean).

   GA4 has a live "Realtime" report — that is your real-time dashboard. */

const GA_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

export function initAnalytics() {
    if (!GA_ID || typeof window === "undefined" || window.__gaInitialized) return;
    window.__gaInitialized = true;

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    // We send page_view manually on every route change (SPA navigation).
    window.gtag("config", GA_ID, { send_page_view: false });
}

export function trackPageview(path) {
    if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
    window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
    });
}

/* Optional helper for custom events (add-to-cart, signup, etc.) */
export function trackEvent(name, params = {}) {
    if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
    window.gtag("event", name, params);
}
