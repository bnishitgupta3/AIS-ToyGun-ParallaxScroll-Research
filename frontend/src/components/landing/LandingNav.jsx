import { Link } from "react-router-dom";

const NAV_LINKS = ["Arsenal", "Engineering", "Mission", "Field Test"];

/**
 * Premium pill navbar — fixed, horizontally centered, light-theme.
 *
 * Outer container is pointer-events-none so clicks fall through to content.
 * The actual <nav> is pointer-events-auto so links and button work.
 */
export default function LandingNav() {
    return (
        <div className="pointer-events-none fixed left-1/2 top-6 z-50 w-[95%] max-w-5xl -translate-x-1/2">
            <nav className="pointer-events-auto flex items-center justify-between rounded-full border border-black/10 bg-white/70 px-5 py-3 backdrop-blur-md">

                {/* Logo */}
                <Link
                    to="/"
                    className="font-instrument text-[28px] leading-none tracking-tight text-[#1a1a1a] select-none"
                >
                    UTG
                </Link>

                {/* Page links — hidden on mobile */}
                <div className="hidden items-center gap-10 md:flex">
                    {NAV_LINKS.map((label) => (
                        <a
                            key={label}
                            href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                            className="font-inter text-[14px] font-medium text-[#1a1a1a]/80 transition-opacity duration-150 hover:opacity-50"
                        >
                            {label}
                        </a>
                    ))}
                </div>

                {/* CTA — blue pill with glass glint */}
                <a
                    href="#arsenal"
                    className="group relative overflow-hidden rounded-full bg-[#0871E7] px-5 py-2 text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline outline-1 outline-[#0871E7] -outline-offset-1 transition-all duration-200 hover:brightness-110"
                >
                    {/* Glass glint stripe */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#DEF0FC] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                    />
                    <span className="relative font-inter text-[14px] font-medium">
                        Explore
                    </span>
                </a>
            </nav>
        </div>
    );
}
