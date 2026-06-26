import ProductActions from "@/components/showcase/ProductActions";

const specs = [
    { label: "RANGE", value: "10–12m", id: "spec-range" },
    { label: "CAPACITY", value: "500 Beads", id: "spec-capacity" },
    { label: "RATE OF FIRE", value: "8 r/s", id: "spec-rate" },
    { label: "BATTERY", value: "7.4V Li-Po", id: "spec-battery" },
    { label: "WEIGHT", value: "1.42 kg", id: "spec-weight" },
    { label: "MODE", value: "Semi · Burst · Auto", id: "spec-mode" },
];

const MP5K = { name: "MP5K" };

export default function SpecsPanel() {
    return (
        <aside
            id="specs-panel"
            data-testid="specs-panel"
            className="pointer-events-auto absolute left-0 top-0 z-30 h-full w-full max-w-[440px] px-6 pt-24 md:px-10 md:pt-28 lg:px-14"
            /* Match GSAP's initial state declaratively so the panel renders
               hidden from frame 1 — otherwise it briefly shows before
               useEffect's gsap.set hides it (FOUC on every page load). */
            style={{ opacity: 0, transform: "translateX(-24px)" }}
        >
            <div className="flex h-full flex-col">
                <span
                    className="font-mono-tactical text-xs font-bold uppercase tracking-[0.32em] text-[color:var(--accent)]"
                    data-testid="specs-overline"
                >
                    /// Field Spec Sheet
                </span>
                <h2
                    className="font-display mt-4 text-4xl sm:text-5xl"
                    data-testid="specs-title"
                >
                    Built for
                    <br />
                    The Backyard
                    <br />
                    <span className="text-[color:var(--accent)]">Battle.</span>
                </h2>
                <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-zinc-600">
                    Drum-fed, electric drive, full-auto rated. The MP5K is
                    engineered for soaking precision and zero-recoil play.
                </p>

                <ul className="mt-8 space-y-0">
                    {specs.map((s) => (
                        <li
                            key={s.id}
                            data-testid={s.id}
                            className="spec-row flex items-baseline justify-between py-3.5"
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

                {/* Primary conversion cluster — replaces the old Fire Test
                    button. Buy Now (primary) + Add to Cart (secondary) sit at
                    the point of highest intent: right after the user has read
                    the spec sheet. */}
                <div className="mt-8">
                    <ProductActions product={MP5K} accent="var(--accent)" />
                </div>

                <div className="mt-auto pt-10">
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
