import { useEffect } from "react";

/* ── Track your order ──
   The Eshopbox branded tracking portal (track.upyourplay.in) is now SSL-live and
   is the canonical tracking experience, so /track redirects straight to it rather
   than showing an intermediate page. A fallback link covers no-JS and the
   react-snap prerender crawler (which we guard so the static build doesn't follow
   the redirect and capture the external page). */

const TRACKING_URL = "https://track.upyourplay.in";

export default function TrackOrderPage() {
    useEffect(() => {
        // Don't redirect during react-snap's prerender crawl — let it keep the
        // fallback below as the static /track content.
        if (typeof navigator !== "undefined" && /ReactSnap/i.test(navigator.userAgent)) {
            return;
        }
        window.location.replace(TRACKING_URL);
    }, []);

    return (
        <div className="dot-grid grid min-h-screen place-items-center px-6 text-center text-[#1a1a1a]">
            <div className="max-w-md">
                <h1 className="font-instrument text-[clamp(28px,5vw,44px)] leading-tight">
                    Taking you to your tracking page.
                </h1>
                <p className="mt-3 font-inter text-[14px] text-[#1a1a1a]/60">
                    If you are not redirected automatically, tap below.
                </p>
                <a
                    href={TRACKING_URL}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#F8290A] px-7 py-3 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] transition-all hover:brightness-110"
                >
                    Continue to tracking
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
