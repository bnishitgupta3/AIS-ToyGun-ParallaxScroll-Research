import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, setConsent } from "@/lib/consent";
import { initAnalytics, initClarity, trackPageview } from "@/lib/analytics";
import { isPrerendering } from "@/lib/isPrerendering";

/* Minimal cookie notice, the way most D2C storefronts do it: analytics load for
   every visitor and the notice is a one-tap acknowledgement shown once, with no
   opt-out button. The opt-out capability still lives in analytics.js
   (disableAnalytics / disableClarity) so we can wire a "manage cookies" control
   on the Privacy page later if we ever need one. */
export default function CookieConsent() {
    // null until we've read localStorage on the client (avoids a flash)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let cleanup;
        // Load analytics on every visit, unless the visitor turned them off via
        // the "Manage cookies" control (persisted "denied"). Skip during
        // react-snap prerender so the tags are never baked into the static HTML.
        if (getConsent() !== "denied" && !isPrerendering()) {
            const start = () => {
                initAnalytics();
                initClarity();
                trackPageview(window.location.pathname + window.location.search);
            };
            // GA4 + Clarity are heavy on a throttled phone CPU and were delaying
            // the hero LCP. On MOBILE, defer both until the first user
            // interaction OR a 4s safety timeout, whichever comes first: the
            // visit is still counted when they init, only a pre-timeout bounce
            // is missed. DESKTOP has the headroom, so it loads immediately.
            const isMobile =
                typeof window.matchMedia === "function" &&
                window.matchMedia("(max-width: 767px)").matches;
            if (isMobile) {
                let done = false;
                let idleHandle;
                let timer;
                const events = ["pointerdown", "touchstart", "keydown", "scroll", "wheel"];
                const opts = { passive: true, capture: true };
                const run = () => {
                    if (done) {
                        return;
                    }
                    done = true;
                    if (cleanup) {
                        cleanup();
                    }
                    start();
                };
                // Load on first interaction, or when the browser goes idle after
                // the critical render (so analytics never land on top of the hero
                // LCP). requestIdleCallback's timeout still fires it on a busy
                // page; older browsers fall back to a plain timeout.
                if (typeof window.requestIdleCallback === "function") {
                    idleHandle = window.requestIdleCallback(run, { timeout: 5000 });
                } else {
                    timer = setTimeout(run, 3500);
                }
                events.forEach((e) => window.addEventListener(e, run, opts));
                cleanup = () => {
                    if (idleHandle && typeof window.cancelIdleCallback === "function") {
                        window.cancelIdleCallback(idleHandle);
                    }
                    if (timer) {
                        clearTimeout(timer);
                    }
                    events.forEach((e) => window.removeEventListener(e, run, opts));
                };
            } else {
                start();
            }
        }
        // Show the notice once to a new visitor; never again after acknowledged.
        if (getConsent() == null) {
            setVisible(true);
        }
        return cleanup;
    }, []);

    const dismiss = () => {
        setConsent("granted");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie notice"
            className="fixed inset-x-3 bottom-3 z-[70] mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-black/10 bg-white/95 px-4 py-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:gap-5"
        >
            <p className="flex-1 font-inter text-[12.5px] leading-snug text-[#1a1a1a]/70">
                We use cookies to improve your experience. See our{" "}
                <Link to="/privacy" className="font-semibold text-[#F8290A] underline underline-offset-2">
                    Privacy Policy
                </Link>
                .
            </p>
            <button
                type="button"
                onClick={dismiss}
                className="shrink-0 rounded-full bg-[#F8290A] px-5 py-2 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)] transition hover:brightness-110"
            >
                Got it
            </button>
        </div>
    );
}
