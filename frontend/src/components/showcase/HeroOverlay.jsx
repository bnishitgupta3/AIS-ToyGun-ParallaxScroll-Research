export default function HeroOverlay() {
    return (
        <div
            id="hero-overlay"
            data-testid="hero-overlay"
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
        >
            {/* Eyebrow + prominent CATEGORY badge (Water Gun). Highlighted as a
                solid accent pill so the "what is this" cue is unmistakable on
                the opening screen. Both sit in #hero-eyebrow so the scroll
                timeline fades them out together as the gun zooms in. */}
            <div
                id="hero-eyebrow"
                data-testid="hero-eyebrow"
                className="mb-6 flex flex-col items-center gap-3"
            >
                <span className="font-mono-tactical text-xs font-bold uppercase tracking-[0.5em] text-[color:var(--accent)]">
                    /// SONIQ Toys · 2026
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-1.5 font-inter text-[12px] font-bold uppercase tracking-[0.28em] text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] sm:text-[13px]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/90" />
                    Water Gun
                </span>
            </div>

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

            {/* Scroll cue — same left-edge vertical treatment as the Arsenal
                (vertical label + capsule + bouncing down-chevron), so the DOWN
                direction is unmistakable and it never fights the centre column.
                Anchored BELOW the wordmark block rather than dead-centre: unlike
                the Arsenal (heading at the top), the product hero's giant
                wordmark is vertically centred and the longer codes span nearly
                the full width on narrow phones. At ~66% it clears the wordmark
                (ends ~60%) and the parked gun (starts ~81%), and the gun only
                spans ~82% of the width so this left gutter stays free at every
                phase of the demo. */}
            <div
                id="scroll-hint"
                data-testid="scroll-hint"
                className="pointer-events-none absolute left-3 top-[66%] flex -translate-y-1/2 flex-col items-center gap-2.5 sm:left-6"
            >
                <span className="font-mono-tactical text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 [writing-mode:vertical-rl]">
                    Scroll
                </span>
                <div className="relative h-9 w-5 rounded-full border border-zinc-400/70">
                    <div className="scroll-nub absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 rounded-full bg-zinc-700" />
                </div>
                <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    className="animate-bounce text-zinc-400"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </div>
        </div>
    );
}
