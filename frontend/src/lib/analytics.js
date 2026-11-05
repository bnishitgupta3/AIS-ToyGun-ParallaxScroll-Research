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

/* Opt-out: GA4/gtag checks this global per Measurement ID and stops sending
   hits once it's set, so a visitor who opts out isn't tracked (this session or
   future ones, combined with the persisted "denied" consent). */
export function disableAnalytics() {
    if (!GA_ID || typeof window === "undefined") return;
    window[`ga-disable-${GA_ID}`] = true;
}

/* Re-enable GA after a prior opt-out: clear the per-ID disable flag and make
   sure the tag is loaded. Pairs with disableAnalytics() for a "manage cookies"
   control. */
export function enableAnalytics() {
    if (!GA_ID || typeof window === "undefined") return;
    window[`ga-disable-${GA_ID}`] = false;
    initAnalytics();
}

/* ──────────────────────────────────────────────────────────────────────────
   Microsoft Clarity — behavioural analytics: heatmaps + session replay.
   Same opt-out model and env gating as GA above: set REACT_APP_CLARITY_ID (the
   10-char project id from the Clarity dashboard) in your host's env vars.
   Without it this is a no-op, so dev and preview builds stay clean.
   Clarity tracks SPA route changes on its own, so there's no per-navigation
   call to mirror trackPageview(). */
const CLARITY_ID = process.env.REACT_APP_CLARITY_ID;

export function initClarity() {
    if (!CLARITY_ID || typeof window === "undefined" || window.__clarityInitialized) return;
    window.__clarityInitialized = true;

    // Standard Clarity bootstrap: defines the window.clarity() queue stub, then
    // async-loads the tag. Calls made before the tag arrives are queued.
    (function (c, l, a, r, i) {
        c[a] = c[a] || function () {
            (c[a].q = c[a].q || []).push(arguments);
        };
        const t = l.createElement(r);
        t.async = 1;
        t.src = "https://www.clarity.ms/tag/" + i;
        const y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
}

/* Opt-out: withdraw consent and tear the session down. We send both the current
   v2 consent signal and the legacy stop call; whichever the loaded Clarity build
   understands takes effect and the rest queue as harmless no-ops. Guarded so a
   call before the tag loads (window.clarity is the queue stub) is still safe. */
export function disableClarity() {
    if (typeof window === "undefined" || typeof window.clarity !== "function") return;
    try {
        window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
    } catch { /* no-op */ }
    try {
        window.clarity("stop");
    } catch { /* no-op */ }
}
