import ProductActions from "@/components/showcase/ProductActions";

const MP5K = { name: "MP5K" };

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
                            /// Deploy · 2026
                        </span>
                        <h2 className="font-display mt-5 text-5xl text-white sm:text-6xl">
                            Ready for every
                            <br />
                            <span className="text-tactical-stroke" style={{ WebkitTextStrokeColor: "#fff" }}>
                                sunlit
                            </span>{" "}
                            day.
                        </h2>
                        <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400">
                            The MP5K ships with a full charging kit, two drum
                            mags and an extended-range nozzle. Built for Holi
                            mornings, weekend pool runs, and every sunny
                            afternoon in between, the year round.
                        </p>
                    </div>

                    <div className="md:col-span-5 md:flex md:items-end md:pl-10">
                        {/* Primary closing CTAs — Buy Now + Add to Cart. The
                            pricing block was removed pre-launch; we will swap
                            this block in for a real price once we set up
                            checkout. */}
                        <div className="w-full">
                            <ProductActions
                                product={MP5K}
                                accent="var(--accent)"
                                variant="dark"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex items-center justify-between font-mono-tactical text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    <span>© 2026 SONIQ Toys</span>
                    <span>v1.4.0 · MP5K</span>
                </div>
            </div>
        </section>
    );
}
