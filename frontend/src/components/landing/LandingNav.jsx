import { Link } from "react-router-dom";

export default function LandingNav() {
    return (
        <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12">
            <Link to="/" className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span className="font-mono-tactical text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-400">
                    UTG · Tactical
                </span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
                {["Arsenal", "Engineering", "Mission", "Field Test"].map((n) => (
                    <a
                        key={n}
                        href={`#${n.toLowerCase().replace(/\s+/, "-")}`}
                        className="font-mono-tactical text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-500 transition-colors hover:text-orange-500"
                    >
                        {n}
                    </a>
                ))}
            </nav>

            <a
                href="#footer"
                className="hidden rounded-full border border-zinc-700 px-5 py-2 font-mono-tactical text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-300 transition-all hover:border-orange-500 hover:text-orange-500 md:inline-block"
            >
                Pre-Order
            </a>
        </header>
    );
}
