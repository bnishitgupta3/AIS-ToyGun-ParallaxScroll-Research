export default function ParallaxBackground() {
    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
            data-testid="parallax-background"
        >
            {/* Soft radial wash */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,1) 0%, rgba(245,245,243,1) 60%, rgba(228,228,231,1) 100%)",
                }}
            />

            {/* Floating geometric shapes (parallax-tweened by GSAP) */}
            <div
                data-parallax="0.4"
                className="parallax-shape absolute left-[6%] top-[14%] h-44 w-44 rounded-full border border-zinc-300/70"
            />
            <div
                data-parallax="0.65"
                className="parallax-shape absolute left-[14%] top-[62%] h-24 w-24 rotate-12 rounded-2xl bg-zinc-200/60"
            />
            <div
                data-parallax="0.25"
                className="parallax-shape absolute right-[10%] top-[18%] h-56 w-56 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(255,90,31,0.18) 0%, transparent 70%)",
                }}
            />
            <div
                data-parallax="0.85"
                className="parallax-shape absolute right-[18%] top-[60%] h-16 w-16 -rotate-12 rounded-md border-2 border-zinc-900/15"
            />
            <div
                data-parallax="0.5"
                className="parallax-shape absolute left-[48%] top-[80%] h-2 w-40 bg-zinc-900/20"
            />
            <div
                data-parallax="0.3"
                className="parallax-shape absolute left-[40%] top-[8%] h-2 w-24 bg-zinc-900/20"
            />

            {/* Tactical crosshair lines */}
            <div className="absolute left-1/2 top-1/2 h-px w-[60%] -translate-x-1/2 bg-zinc-900/5" />
            <div className="absolute left-1/2 top-1/2 h-[60%] w-px -translate-y-1/2 bg-zinc-900/5" />

            {/* Grain overlay */}
            <div className="grain absolute inset-0" />
        </div>
    );
}
