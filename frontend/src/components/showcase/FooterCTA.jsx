export default function FooterCTA() {
    return (
        <section
            data-testid="footer-cta"
            className="relative w-full bg-[color:var(--ink)] text-white"
        >
            <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                    <div className="md:col-span-7">
                        <span className="font-mono-tactical text-xs font-bold uppercase tracking-[0.32em] text-[color:var(--accent)]">
                            /// Deploy · Q1 2026
                        </span>
                        <h2 className="font-display mt-5 text-5xl text-white sm:text-6xl">
                            Ready when
                            <br />
                            <span className="text-tactical-stroke" style={{ WebkitTextStrokeColor: "#fff" }}>
                                summer
                            </span>{" "}
                            is.
                        </h2>
                        <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400">
                            The MP5K ships with a full charging kit, two
                            drum mags and an extended-range nozzle. Limited
                            allocation per region.
                        </p>
                    </div>

                    <div className="md:col-span-5 md:pl-10">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                                <span className="font-mono-tactical text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                                    Retail
                                </span>
                                <span className="font-display text-2xl text-white">
                                    $89.00
                                </span>
                            </div>
                            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                                <span className="font-mono-tactical text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                                    Squad Pack (×4)
                                </span>
                                <span className="font-display text-2xl text-[color:var(--accent)]">
                                    $299.00
                                </span>
                            </div>
                            <button
                                type="button"
                                data-testid="cta-preorder"
                                className="btn-pill mt-4 inline-flex items-center justify-between rounded-full bg-[color:var(--accent)] px-7 py-4 text-black"
                            >
                                <span className="font-mono-tactical text-sm font-bold uppercase tracking-[0.22em]">
                                    Pre-Order Now
                                </span>
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path d="M5 12h14M13 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex items-center justify-between font-mono-tactical text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                    <span>© 2026 SONIQ Toys</span>
                    <span>v1.4.0 · MP5K</span>
                    <span>Built · React · R3F · GSAP</span>
                </div>
            </div>
        </section>
    );
}
