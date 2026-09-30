import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, setConsent } from "@/lib/consent";
import { initAnalytics, trackPageview, disableAnalytics } from "@/lib/analytics";

/* Cookie notice (opt-out model).

   Analytics (GA4) loads by default for every visitor. A visitor can opt out
   via this notice, which stores "denied" and disables GA immediately and on
   future visits. The notice is shown once to new visitors; anyone who has
   already chosen doesn't see it again. */
export default function CookieConsent() {
    // null until we've read localStorage on the client (avoids a flash)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const choice = getConsent();
        if (choice !== "denied") {
            // Opt-out: load analytics by default for everyone.
            initAnalytics();
            trackPageview(window.location.pathname + window.location.search);
        }
        if (choice == null) setVisible(true); // show the notice once to new visitors
    }, []);

    const dismiss = () => {
        setConsent("granted");
        setVisible(false);
    };

    const optOut = () => {
        setConsent("denied");
        setVisible(false);
        disableAnalytics();
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie notice"
            className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white/95 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:flex sm:items-center sm:gap-5 sm:p-5"
        >
            <p className="flex-1 font-inter text-[13px] leading-relaxed text-[#1a1a1a]/75">
                We use cookies for basic analytics to improve the site. You can
                opt out anytime. See our{" "}
                <Link to="/privacy" className="font-semibold text-[#F8290A] underline underline-offset-2">
                    Privacy Policy
                </Link>
                .
            </p>
            <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
                <button
                    type="button"
                    onClick={optOut}
                    className="flex-1 rounded-full border border-black/15 px-5 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-[#1a1a1a] transition hover:bg-black/[0.04] sm:flex-none"
                >
                    Opt out
                </button>
                <button
                    type="button"
                    onClick={dismiss}
                    className="flex-1 rounded-full bg-[#F8290A] px-5 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)] transition hover:brightness-110 sm:flex-none"
                >
                    Got it
                </button>
            </div>
        </div>
    );
}
