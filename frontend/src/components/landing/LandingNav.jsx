import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

/* Homepage section anchors (smooth-scroll on home, route-then-scroll elsewhere) */
const SECTION_LINKS = [
    { label: "Arsenal",    target: "#arsenal" },
    { label: "Mission",    target: "#mission" },
    { label: "Field Test", target: "#field-test" },
];

/* Real page routes */
const PAGE_LINKS = [
    { label: "About",   to: "/about" },
    { label: "Contact", to: "/contact" },
];

/**
 * Global pill navbar — used on every page. Desktop shows inline links;
 * below md it collapses to a hamburger that opens a full menu panel.
 */
export default function LandingNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const goSection = (e, target) => {
        e.preventDefault();
        setOpen(false);
        if (location.pathname === "/") {
            document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/", { state: { scrollTo: target } });
        }
    };

    /* Logo → hero section of the homepage, no matter the current scroll.
       On the homepage we just scroll to the top (no history entry), so the
       browser Back button still restores the previous scroll position. On any
       other page the <Link to="/"> navigates home and lands at the hero. */
    const goHome = (e) => {
        setOpen(false);
        if (location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="landing-nav pointer-events-none fixed left-1/2 top-6 z-50 w-[95%] max-w-5xl -translate-x-1/2">
            <nav className="pointer-events-auto rounded-[26px] border border-black/10 bg-white/75 px-5 py-3 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    {/* Logo → home */}
                    <Link
                        to="/"
                        onClick={goHome}
                        className="font-instrument text-[28px] leading-none tracking-tight text-[#1a1a1a] select-none"
                    >
                        SONIQ
                    </Link>

                    {/* Desktop links */}
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

                    {/* Desktop CTA */}
                    <a
                        href="#arsenal"
                        onClick={(e) => goSection(e, "#arsenal")}
                        className="group relative hidden cursor-pointer overflow-hidden rounded-full bg-[#f97316] px-5 py-2 text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline outline-1 outline-[#f97316] -outline-offset-1 transition-all duration-200 hover:brightness-110 md:inline-block"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-[10%] top-[1px] h-4 w-[80%] rounded-[12px] bg-gradient-to-b from-[#FFD9B8] to-transparent transition-transform duration-200 group-hover:scale-x-105"
                        />
                        <span className="relative font-inter text-[14px] font-medium">Explore</span>
                    </a>

                    {/* Hamburger (mobile) */}
                    <button
                        type="button"
                        aria-label={open ? "Close menu" : "Open menu"}
                        onClick={() => setOpen((o) => !o)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#1a1a1a] transition-colors hover:bg-black/5 md:hidden"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            {open ? (
                                <path d="M6 6l12 12M18 6L6 18" />
                            ) : (
                                <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu panel */}
                {open && (
                    <div className="mt-3 flex flex-col gap-1 border-t border-black/10 pt-3 md:hidden">
                        {SECTION_LINKS.map(({ label, target }) => (
                            <a
                                key={label}
                                href={target}
                                onClick={(e) => goSection(e, target)}
                                className="rounded-xl px-2 py-2.5 font-inter text-[15px] font-medium text-[#1a1a1a]/85 transition-colors hover:bg-black/5"
                            >
                                {label}
                            </a>
                        ))}
                        {PAGE_LINKS.map(({ label, to }) => (
                            <Link
                                key={label}
                                to={to}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-2 py-2.5 font-inter text-[15px] font-medium text-[#1a1a1a]/85 transition-colors hover:bg-black/5"
                            >
                                {label}
                            </Link>
                        ))}
                        <a
                            href="#arsenal"
                            onClick={(e) => goSection(e, "#arsenal")}
                            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#f97316] px-5 py-3 font-inter text-[14px] font-semibold text-white"
                        >
                            Explore the Arsenal
                        </a>
                    </div>
                )}
            </nav>
        </div>
    );
}
