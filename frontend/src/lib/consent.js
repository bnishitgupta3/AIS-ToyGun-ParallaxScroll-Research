/* Cookie-consent state (analytics/GA4 gating).

   Privacy-preserving default: analytics does NOT load until the visitor
   explicitly accepts. Choice persists in localStorage so the banner only shows
   once. Values: "granted" | "denied" | null (undecided). */

const KEY = "soniq-cookie-consent";

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
