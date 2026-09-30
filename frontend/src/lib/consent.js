/* Cookie-consent state (analytics/GA4 gating).

   Opt-OUT model: analytics loads by default for every visitor; a visitor can
   opt out via the notice (stores "denied"), which disables GA immediately and
   on future visits. Choice persists in localStorage so the notice shows once.
   Values: "granted" (dismissed) | "denied" (opted out) | null (new visitor). */

const KEY = "uyp-cookie-consent";

export function getConsent() {
    if (typeof window === "undefined") return null;
    try {
        return window.localStorage.getItem(KEY);
    } catch (_) {
        return null;
    }
}

export function setConsent(value) {
    try {
        window.localStorage.setItem(KEY, value);
    } catch (_) {
        /* storage blocked (private mode) — consent just won't persist */
    }
}
