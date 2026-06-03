import useEmblaCarousel from "embla-carousel-react";

const CLIPS = [
    { id: 1, label: "Backyard Blitz", handle: "@xander_ops", views: "2.4M", color: "from-blue-900/70" },
    { id: 2, label: "Range Test: 20m", handle: "@tactical.talia", views: "1.8M", color: "from-orange-900/70" },
    { id: 3, label: "Full-Auto Review", handle: "@gelblast_kai", views: "3.1M", color: "from-zinc-700/80" },
    { id: 4, label: "vs. Supersoaker", handle: "@summer.siege", views: "5.7M", color: "from-purple-900/70" },
    { id: 5, label: "Crimson Unbox", handle: "@redteam.gears", views: "900K", color: "from-red-900/70" },
];

export default function FieldTestSection() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        dragFree: true,
        align: "start",
    });

    return (
        <section
            id="field-test"
            className="relative z-10 w-full overflow-hidden bg-black py-24"
        >
            <div className="px-6 md:px-20">
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <span className="font-mono-tactical text-xs font-bold uppercase tracking-[0.4em] text-orange-500">
                            /// Field Test
                        </span>
                        <h2 className="font-display mt-3 text-5xl text-white md:text-6xl">
                            The Field Speaks.
                        </h2>
                    </div>
                    <div className="hidden items-center gap-3 md:flex">
                        <button
                            type="button"
                            onClick={() => emblaApi?.scrollPrev()}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-colors hover:border-orange-500 hover:text-orange-500"
                            aria-label="Previous"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => emblaApi?.scrollNext()}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-colors hover:border-orange-500 hover:text-orange-500"
                            aria-label="Next"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div ref={emblaRef} className="overflow-hidden pl-6 md:pl-20">
                <div className="flex gap-4">
                    {CLIPS.map((clip) => (
                        <div
                            key={clip.id}
                            className="relative flex-none overflow-hidden rounded-2xl border border-zinc-800 cursor-grab active:cursor-grabbing"
                            style={{ width: "clamp(280px, 38vw, 340px)", height: "480px" }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-b ${clip.color} to-black`} />

                            {/* Mock video frame */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <span className="font-mono-tactical text-[10px] uppercase tracking-widest text-white/40">
                                    Tap to play
                                </span>
                            </div>

                            {/* Metadata overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-12">
                                <div className="font-display text-xl text-white">
                                    {clip.label}
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="font-mono-tactical text-[11px] uppercase tracking-widest text-orange-400">
                                        {clip.handle}
                                    </span>
                                    <span className="font-mono-tactical text-[10px] text-zinc-500">
                                        {clip.views} views
                                    </span>
                                </div>
                            </div>

                            <div className="absolute right-3 top-3 rounded-full bg-orange-500 px-2.5 py-1">
                                <span className="font-mono-tactical text-[9px] font-bold uppercase text-black">
                                    UGC
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <span className="font-mono-tactical text-[10px] uppercase tracking-widest text-zinc-700">
                    Drag to explore · {CLIPS.length} clips
                </span>
            </div>
        </section>
    );
}
