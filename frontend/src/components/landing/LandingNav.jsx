import { Link, useNavigate, useLocation } from "react-router-dom";

/* Homepage section anchors (smooth-scroll on home, route-then-scroll elsewhere) */
const SECTION_LINKS = [
    { label: "Arsenal",    target: "#arsenal" },
    { label: "Mission",    target: "#mission" },
    { label: "Field Test", target: "#field-test" },
];

/* Real page routes */
const PAGE_LINKS = [{ label: "About", to: "/about" }];

/**
 * Global pill navbar — used on EVERY page (home, product pages, about).
 * Section links smooth-scroll when already on the homepage; from any other
 * route they navigate home and pass the target via router state so the
 * landing page scrolls to it after mount.
 */
export default function LandingNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const goSection = (e, target) => {
        e.preventDefault();
        if (location.pathname === "/") {
            document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/", { state: { scrollTo: target } });
        }
    };

    return (
        <div className="pointer-events-none fixed left-1/2 top-6 z-50 w-[95%] max-w-5xl -translate-x-1/2">
            <nav className="pointer-events-auto flex items-center justify-between rounded-full border border-black/10 bg-white/70 px-5 py-3 backdrop-blur-md">

                {/* Logo → home */}
                <Link
                    to="/"
                    className="font-instrument text-[28px] leading-none tracking-tight text-[#1a1a1a] select-none"
                >
                    UTG
                </Link>

                {/* Links — hidden on mobile */}
                <div className="hidden items-center gap-8 md:flex lg:gap-10">
                    {SECTION_LINKS.map(({ label, target }) => (
                        <a
                            key={label}
                            href={target}
                            onClick={(e) => goSection(e, target)}
                            className="cursor-pointer font-inter text-[14px] font-medium text-[#1a1a1a]/80 transition-opacity duration-150 hover:opacity-50"
                        >
                            {label}
                        </a>
                    ))}
                    {PAGE_LINKS.map(({ label, to }) => (
                        <Link
                            key={label}
                            to={to}
                            className="font-inter text-[14px] font-medium text-[#1a1a1a]/80 transition-opacity duration-150 hover:opacity-50"
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* CTA — blue pill with glass glint */}
                <a
                    href="#arsenal"
                    onClick={(e) => goSection(e, "#arsenal")}
                    className="group relative cursor-pointer overflow-hidden rounded-full bg-[#0871E7] px-5 py-2 text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline outline-1 outline-[#0871E7] -outline-offset-1 transition-all duration-200 hover:brightness-110"
                >
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
