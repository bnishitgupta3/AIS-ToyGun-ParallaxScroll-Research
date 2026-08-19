import { useEffect, useState } from "react";

/* Vertical section dots — a right-edge scrollspy. Clicking jumps to a section.

   `variant` picks the set:
   • "home"    — hero → arsenal → mission → footer (element-based; hidden over
                 the hero, revealed from the Arsenal on).
   • "product" — Experience → Details → Arsenal → Deploy. Experience and Details
                 are two moments INSIDE the pinned showcase (the gun demo, then
                 the spec sheet), so they target scroll POSITIONS (a fraction of
                 the pin distance) rather than DOM elements. Visible throughout,
                 including while the gun is scrolling.

   A section is `{ key, label, id? , y? }`: give `id` for an element target, or
   `y()` for a scroll-position target. */

const productPinDist = () =>
    Math.round(window.innerHeight * (window.innerWidth < 768 ? 1.1 : 2.2));

const SECTION_SETS = {
    home: {
        alwaysVisible: false,
        revealId: "arsenal",
        sections: [
            { key: "hero", id: "hero", label: "Top" },
            { key: "arsenal", id: "arsenal", label: "Arsenal" },
            // `offset` nudges the click-scroll up so this section clears the
            // fixed nav/marquee and lands cleanly. It defaults to 0 everywhere
            // else, so the other dots are completely unchanged.
            { key: "squad", id: "squad-packs", label: "Squad Packs", offset: 96 },
            { key: "mission", id: "mission", label: "Mission" },
            { key: "footer", id: "footer", label: "Connect" },
        ],
    },
    product: {
        // Hidden on the opening gun-name screen; revealed once the visitor
        // scrolls a little into the demo (past where the hero name fades).
        revealY: () => Math.round(productPinDist() * 0.12),
        sections: [
            // `y` = where a click scrolls to; `activeY` = when the dot lights up.
            { key: "experience", label: "Experience", y: () => Math.round(productPinDist() * 0.2), activeY: () => 0 },
            { key: "details", label: "Details", y: () => Math.round(productPinDist() * 0.95), activeY: () => Math.round(productPinDist() * 0.78) },
            { key: "also-arsenal", id: "also-arsenal", label: "Arsenal" },
            { key: "deploy", id: "deploy", label: "Deploy" },
        ],
    },
};

export default function SectionDots({ variant = "home" }) {
    const cfg = SECTION_SETS[variant] || SECTION_SETS.home;
    const sections = cfg.sections;
    const [activeKey, setActiveKey] = useState(sections[0].key);
    const [visible, setVisible] = useState(!!cfg.alwaysVisible);

    useEffect(() => {
        // Absolute document scroll position that brings a section to the top.
        const targetY = (s) => {
            if (typeof s.y === "function") return s.y();
            const el = document.getElementById(s.id);
            return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
        };

        const update = () => {
            const vh = window.innerHeight;
            const y = window.scrollY;

            if (cfg.alwaysVisible) {
                setVisible(true);
            } else if (cfg.revealY) {
                // Scroll-position reveal (product): hidden on the opening
                // gun-name screen, shown once scrolled into the demo.
                setVisible(y > cfg.revealY());
            } else if (cfg.revealId) {
                const el = document.getElementById(cfg.revealId);
                setVisible(el ? el.getBoundingClientRect().top <= vh * 0.5 : false);
            }

            // Active = the last section whose target the scroll has reached.
            // Element targets use a ~45%-into-view reference line (as before);
            // in-pin position targets (Experience/Details) activate at their
            // own `activeY` so the dot matches the demo phase (spec sheet, etc.).
            let current = sections[0].key;
            for (const s of sections) {
                const isPos = typeof s.y === "function";
                const t = isPos
                    ? (typeof s.activeY === "function" ? s.activeY() : s.y())
                    : targetY(s);
                const ref = isPos ? y + 2 : y + vh * 0.45;
                if (t <= ref) current = s.key;
            }
            setActiveKey(current);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant]);

    const go = (s) => {
        let y = null;
        if (typeof s.y === "function") y = s.y();
        else {
            const el = document.getElementById(s.id);
            if (el) y = el.getBoundingClientRect().top + window.scrollY;
        }
        if (y != null) window.scrollTo(0, Math.round(y - (s.offset || 0)));
    };

    return (
        <div
            aria-hidden={!visible}
            className={`section-dots fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-4 transition-opacity duration-300 sm:right-5 ${
                visible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            {sections.map((s) => {
                const active = s.key === activeKey;
                return (
                    <button
                        key={s.key}
                        type="button"
                        onClick={() => go(s)}
                        aria-label={`Go to ${s.label}`}
                        aria-current={active ? "true" : undefined}
                        className="group relative flex items-center justify-center p-1.5"
                    >
                        {/* Hover label, sits to the left of the dot column */}
                        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#1a1a1a] px-2.5 py-1 font-inter text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                            {s.label}
                        </span>
                        <span
                            className={`block rounded-full transition-all duration-300 ${
                                active
                                    ? "h-2.5 w-2.5 bg-[#DA0213]"
                                    : "h-2 w-2 bg-zinc-400/70 group-hover:bg-zinc-500"
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
}
