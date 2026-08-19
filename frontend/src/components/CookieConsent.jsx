import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, setConsent } from "@/lib/consent";
import { initAnalytics, trackPageview } from "@/lib/analytics";

/* Cookie-consent banner.

   Analytics (GA4) is gated behind explicit consent — nothing loads until the
   visitor accepts. On a return visit with prior consent we boot analytics
   silently and keep the banner hidden. Decline is given equal prominence
   (privacy-first). */
export default function CookieConsent() {
    // null until we've read localStorage on the client (avoids a flash)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const choice = getConsent();
        if (choice === "granted") {
            initAnalytics();
            trackPageview(window.location.pathname + window.location.search);
        } else if (choice == null) {
            setVisible(true);
        }
        // "denied" → stay hidden, analytics never loads
    }, []);

    const accept = () => {
        setConsent("granted");
        setVisible(false);
        initAnalytics();
        trackPageview(window.location.pathname + window.location.search);
    };

    const decline = () => {
        setConsent("denied");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie consent"
            className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white/95 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:flex sm:items-center sm:gap-5 sm:p-5"
        >
            <p className="flex-1 font-inter text-[13px] leading-relaxed text-[#1a1a1a]/75">
                We use cookies for basic analytics to improve the site. You can
                accept or decline. See our{" "}
                <Link to="/privacy" className="font-semibold text-[#DA0213] underline underline-offset-2">
                    Privacy Policy
                </Link>
                .
            </p>
            <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
                <button
                    type="button"
                    onClick={decline}
                    className="flex-1 rounded-full border border-black/15 px-5 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-[#1a1a1a] transition hover:bg-black/[0.04] sm:flex-none"
                >
                    Decline
                </button>
                <button
                    type="button"
                    onClick={accept}
                    className="flex-1 rounded-full bg-[#DA0213] px-5 py-2.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)] transition hover:brightness-110 sm:flex-none"
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
