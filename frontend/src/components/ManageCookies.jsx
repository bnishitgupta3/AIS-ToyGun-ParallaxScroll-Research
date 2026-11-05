import { useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";
import { initClarity, enableAnalytics, disableAnalytics, disableClarity } from "@/lib/analytics";

/* "Manage cookies" control for the Privacy page. Analytics are on by default
   (the site shows a one-tap notice, not an opt-out banner), so this gives a
   visitor a persistent way to turn analytics cookies off or back on, honouring
   the opt-out right stated in this policy. The choice is stored in the same
   consent key the notice uses, so it sticks across visits. */
export default function ManageCookies() {
    const [on, setOn] = useState(() => getConsent() !== "denied");

    const turnOff = () => {
        setConsent("denied");
        disableAnalytics();
        disableClarity();
        setOn(false);
    };

    const turnOn = () => {
        setConsent("granted");
        enableAnalytics();
        initClarity();
        setOn(true);
    };

    return (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="font-inter text-[14px] font-semibold text-[#1a1a1a]">Analytics cookies</p>
                <p className="mt-0.5 font-inter text-[13px] leading-snug text-[#1a1a1a]/60">
                    {on
                        ? "On. Anonymous analytics help us understand what works and improve the site."
                        : "Off. Analytics cookies are turned off on this browser."}
                </p>
            </div>
            <button
                type="button"
                onClick={on ? turnOff : turnOn}
                aria-pressed={on}
                className={
                    "shrink-0 self-start rounded-full px-5 py-2 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] transition sm:self-auto " +
                    (on
                        ? "border border-black/15 text-[#1a1a1a] hover:bg-black/[0.04]"
                        : "bg-[#F8290A] text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.35)] hover:brightness-110")
                }
            >
                {on ? "Turn off" : "Turn on"}
            </button>
        </div>
    );
}
