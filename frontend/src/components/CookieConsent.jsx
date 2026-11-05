import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, setConsent } from "@/lib/consent";
import { initAnalytics, initClarity, trackPageview } from "@/lib/analytics";

/* Minimal cookie notice, the way most D2C storefronts do it: analytics load for
   every visitor and the notice is a one-tap acknowledgement shown once, with no
   opt-out button. The opt-out capability still lives in analytics.js
   (disableAnalytics / disableClarity) so we can wire a "manage cookies" control
   on the Privacy page later if we ever need one. */
export default function CookieConsent() {
    // null until we've read localStorage on the client (avoids a flash)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Load analytics on every visit.
        initAnalytics();
        initClarity();
        trackPageview(window.location.pathname + window.location.search);
        // Show the notice once to a new visitor; never again after acknowledged.
        if (getConsent() == null) setVisible(true);
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
