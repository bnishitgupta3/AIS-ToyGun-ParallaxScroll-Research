export default function HeroOverlay() {
    return (
        <div
            id="hero-overlay"
            data-testid="hero-overlay"
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
        >
            <span
                id="hero-eyebrow"
                data-testid="hero-eyebrow"
                className="font-mono-tactical text-xs font-bold uppercase tracking-[0.5em] text-[color:var(--accent)] mb-6"
            >
                /// SONIQ Toys · 2026
            </span>

            <h1
                id="hero-wordmark"
                data-testid="hero-title"
                className="font-display select-none text-[clamp(72px,18vw,300px)] text-zinc-900"
                style={{ lineHeight: 0.78 }}
            >
                MP5K
                <span className="inline-block translate-y-[0.08em] text-[color:var(--accent)]">
                    ·
                </span>
                SONIQ
            </h1>

            <div
                id="hero-subline"
                className="mt-4 flex items-center gap-4 text-xs font-mono-tactical uppercase tracking-[0.32em] text-zinc-700"
            >
                <span className="h-px w-12 bg-zinc-900/30" />
                <span data-testid="hero-subtitle">
                    Electric Water Gun · Drum-Fed
                </span>
                <span className="h-px w-12 bg-zinc-900/30" />
            </div>

            <div
                id="scroll-hint"
                data-testid="scroll-hint"
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="font-mono-tactical text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                    Scroll to Engage
                </span>
                <div className="relative h-9 w-5 rounded-full border border-zinc-400/70">
                    <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-zinc-700" />
                </div>
            </div>
        </div>
    );
}
