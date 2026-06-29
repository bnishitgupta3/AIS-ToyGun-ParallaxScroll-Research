import ProductActions from "@/components/showcase/ProductActions";

/* Real MP5K product specs. The * on PLAY TIME mirrors the industry pattern
   (EVs quote "up to X" range; we quote "up to 45 min" play time and explain
   the test conditions in a footnote below the table). */
const specs = [
    { label: "PLAY TIME",     value: "45 min*",        id: "spec-playtime" },
    { label: "RANGE",         value: "8–10 m",         id: "spec-range" },
    { label: "FIRE RATE",     value: "5 shots/sec",    id: "spec-rate" },
    { label: "BATTERY",       value: "3.7V Rechargeable", id: "spec-battery" },
    { label: "TANK CAPACITY", value: "300 ml",         id: "spec-capacity" },
    { label: "MODE",          value: "Automatic",      id: "spec-mode" },
];

const MP5K = { name: "MP5K", link: "/product/mp5k" };

export default function SpecsPanel() {
    return (
        <aside
            id="specs-panel"
            data-testid="specs-panel"
            /* On mobile, an opaque background covers the 3D gun behind the
               panel so the gun stays visible during the hero/entry phase but
               doesn't bleed through the spec rows once the panel slides in.
               No overflow scroll — the rhythm below is tuned to fit one
               viewport, and the column is vertically centred so it sits well
               on tall and short screens alike. */
            className="pointer-events-auto absolute left-0 top-0 z-30 flex h-full w-full max-w-[440px] flex-col justify-center bg-[color:var(--bg)] px-6 pt-16 md:bg-transparent md:px-10 md:pt-20 lg:px-14"
            /* Match GSAP's initial state declaratively so the panel renders
               hidden from frame 1 — otherwise it briefly shows before
               useEffect's gsap.set hides it (FOUC on every page load). */
            style={{ opacity: 0, transform: "translateX(-24px)" }}
        >
            <div className="flex flex-col">
                {/* Lead positioning badge — EV-style. Establishes that the
                    MP5K is fully electric + automatic up front, before specs. */}
                <span className="font-mono-tactical inline-flex items-center gap-2 self-start rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--accent)]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 2L4.5 13h6L11 22l8.5-11h-6L13 2z" />
                    </svg>
                    Fully Electric · Automatic
                </span>

                <span
                    className="font-mono-tactical mt-4 text-xs font-bold uppercase tracking-[0.32em] text-[color:var(--accent)]"
                    data-testid="specs-overline"
                >
                    /// Field Spec Sheet
                </span>
                <h2
                    className="font-display mt-3 text-3xl sm:text-4xl"
                    data-testid="specs-title"
                >
                    Built for
                    <br />
                    The Backyard
                    <br />
                    <span className="text-[color:var(--accent)]">Battle.</span>
                </h2>
                <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-zinc-600">
                    Zero pumping, zero priming — just pull the trigger. An
                    electric drive delivers full-auto fire from a 300 ml tank.
                </p>

                <ul className="mt-4 space-y-0">
                    {specs.map((s) => (
                        <li
                            key={s.id}
                            data-testid={s.id}
                            className="spec-row flex items-baseline justify-between py-2"
                        >
                            <span className="telemetry-label text-zinc-500">
                                {s.label}
                            </span>
                            <span className="telemetry-value text-lg text-zinc-900">
                                {s.value}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Asterisk footnote — subtle fine-print disclaimer, the way
                    brands hedge a headline number. Deliberately small and
                    low-contrast; framed as "up to / optimal" so it covers
                    real-world play (no one holds the trigger non-stop). */}
                <p className="mt-3 text-[10px] leading-snug text-zinc-400">
                    *Up to 45 min under optimal conditions. Real-world play
                    time varies with usage, temperature and refills.
                </p>

                {/* Primary conversion cluster — Buy Now (primary) + Add to Cart
                    (secondary) sit at the point of highest intent: right after
                    the user has read the spec sheet. */}
                <div className="mt-5">
                    <ProductActions product={MP5K} accent="var(--accent)" />
                </div>

                <div className="mt-4">
                    <div className="font-mono-tactical text-[10px] uppercase tracking-[0.32em] text-zinc-400">
                        Unit · 7B-014 ·{" "}
                        <span className="text-[color:var(--accent)]">
                            In stock
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
