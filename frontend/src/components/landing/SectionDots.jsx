import { useEffect, useState } from "react";

/* Vertical section dots — a right-edge scrollspy. Each dot maps to a section
   on the landing page; clicking jumps there. It stays hidden over the hero and
   only fades in once the Arsenal section reaches the upper viewport, remaining
   through to the footer. */
const SECTIONS = [
    { id: "hero", label: "Top" },
    { id: "arsenal", label: "Arsenal" },
    { id: "mission", label: "Mission" },
    { id: "field-test", label: "Field Test" },
    { id: "footer", label: "Connect" },
];

export default function SectionDots() {
    const [activeId, setActiveId] = useState("arsenal");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Reading 4 rects per scroll is cheap, and React bails on unchanged
        // state, so we update directly on scroll (no rAF throttle needed).
        const update = () => {
            const vh = window.innerHeight;
            const refY = vh * 0.45; // reference line ~45% down the viewport

            // Show only from the Arsenal onward (hidden over the hero).
            const arsenal = document.getElementById("arsenal");
            setVisible(arsenal ? arsenal.getBoundingClientRect().top <= vh * 0.5 : false);

            // Active = the last section whose top has crossed the reference line.
            let current = SECTIONS[0].id;
            for (const s of SECTIONS) {
                const el = document.getElementById(s.id);
                if (el && el.getBoundingClientRect().top <= refY) current = s.id;
            }
            setActiveId(current);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    const go = (id) =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    return (
        <div
            aria-hidden={!visible}
            className={`section-dots fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-4 transition-opacity duration-300 sm:right-5 ${
                visible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            {SECTIONS.map((s) => {
                const active = s.id === activeId;
                return (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => go(s.id)}
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
                                    ? "h-2.5 w-2.5 bg-[#f97316]"
                                    : "h-2 w-2 bg-zinc-400/70 group-hover:bg-zinc-500"
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
}
