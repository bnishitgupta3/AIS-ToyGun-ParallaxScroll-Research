import { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/lib/cart";
import { scrollToSection } from "@/lib/scrollToSection";
import { asset } from "@/lib/asset";
import { PRODUCTS } from "@/components/landing/ArsenalSection";
import { Mail, PackageSearch } from "lucide-react";

/* Homepage section anchors (smooth-scroll on home, route-then-scroll elsewhere).
   Mission removed from the nav per request; the section still exists on the page. */
const SECTION_LINKS = [];

/* Real page routes */
const PAGE_LINKS = [
    { label: "About", to: "/about" },
];

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

/* "Products" dropdown → the detail pages (PDPs), each with a thumbnail. */
const PRODUCT_NAV = PRODUCTS.map((p) => ({
    name: p.name,
    to: p.link,
    image: asset("/assets/products/" + p.image),
    sub: p.comingSoon ? "Coming soon" : inr(p.price),
}));

/* "Experience" dropdown → the immersive 3-D product pages (launched SKUs). */
const EXPERIENCE_NAV = [
    { name: "MP5K",         to: "/product/mp5k/3d", image: asset("/assets/products/mp5k.jpg"), sub: "3-D showcase" },
    { name: "M416 Water X", to: "/product/m416/3d", image: asset("/assets/products/m416.jpg"), sub: "3-D showcase" },
];

/* "Support" dropdown → help pages. Icon-based rows (no product thumbnail). */
const SUPPORT_NAV = [
    { name: "Track your order", to: "/track",   Icon: PackageSearch, sub: "Where is my order?" },
    { name: "Contact",          to: "/contact", Icon: Mail,          sub: "Help, orders, grievances" },
];

/* Desktop hover/click dropdown. A hover-close DELAY plus a no-gap bridge
   (top-full + pt-2.5) lets the cursor travel from the trigger onto the menu
   without it snapping shut — the earlier glitch. Items carry a product
   thumbnail for stronger CTA. */
function NavDropdown({ label, items }) {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef(null);
    const enter = () => { clearTimeout(closeTimer.current); setOpen(true); };
    const leave = () => { closeTimer.current = setTimeout(() => setOpen(false), 160); };
    return (
        <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
            <button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1 font-inter text-[14px] font-medium text-[#1a1a1a]/80 transition-opacity duration-150 hover:opacity-60"
            >
                {label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            {open && (
                <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2.5">
                    <div className="w-64 overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)]">
                        {items.map((it) => (
                            <Link
                                key={it.to}
                                to={it.to}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-black/5"
                            >
                                {it.image ? (
                                    <span className="h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f1f0ed]">
                                        <img src={it.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                                    </span>
                                ) : (
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#F8290A]/10 text-[#F8290A]">
                                        {it.Icon ? <it.Icon size={18} strokeWidth={2} /> : null}
                                    </span>
                                )}
                                <span className="min-w-0 flex-1">
                                    <span className="block font-inter text-[14px] font-semibold text-[#1a1a1a]">{it.name}</span>
                                    <span className="block font-inter text-[11px] text-[#1a1a1a]/45">{it.sub}</span>
                                </span>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="shrink-0 text-[#1a1a1a]/30">
                                    <path d="M9 6l6 6-6 6" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* Collapsible section for the mobile menu — keeps the panel compact by hiding
   secondary groups (Experience, Support) behind a tap. Collapsed by default. */
function MobileSection({ label, children }) {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 font-inter text-[15px] font-medium text-[#1a1a1a]/85 transition-colors hover:bg-black/5"
            >
                {label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-[#1a1a1a]/40 transition-transform ${open ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            {open && <div className="mt-0.5 flex flex-col gap-0.5 pl-1">{children}</div>}
        </div>
    );
}

/* Cart icon + qty badge. Opens the shared BuyNowSheet (cart drawer). The
   button stays visible on every viewport — qty badge appears only when there
   is at least one item, so empty carts don't add visual noise. */
function CartButton({ onAfterClick }) {
    const { total, openDrawer } = useCart();
    return (
        <button
            type="button"
            aria-label={total > 0 ? `Open cart (${total} item${total === 1 ? "" : "s"})` : "Open cart"}
            onClick={() => {
                openDrawer(null);
                onAfterClick && onAfterClick();
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#1a1a1a] transition-colors hover:bg-black/5"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
                <path d="M2 3h2.5l2.2 12.2a1.5 1.5 0 0 0 1.5 1.3h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
            </svg>
            {total > 0 && (
                <span
                    aria-hidden="true"
                    className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#F8290A] px-1 font-inter text-[10px] font-bold leading-none text-white"
                >
                    {total > 99 ? "99+" : total}
                </span>
            )}
        </button>
    );
}

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
            scrollToSection(target);
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

    // top-12 (not top-6): sits just below the fixed h-9 marquee bar.
    return (
        <>
            {/* Tap-outside-to-close backdrop for the mobile menu (sits below the
                nav pill at z-50, above the page). */}
            {open && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}
        <div className="landing-nav pointer-events-none fixed left-1/2 top-12 z-50 w-[95%] max-w-5xl -translate-x-1/2">
            <nav className="pointer-events-auto rounded-[26px] border border-black/10 bg-white/75 px-5 py-3 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    {/* Logo → home */}
                    <Link
                        to="/"
                        onClick={goHome}
                        className="select-none"
                        aria-label="Up Your Play — home"
                    >
                        <img
                            src={asset("/assets/logo.png?v=2")}
                            alt="Up Your Play"
                            draggable="false"
                            className="h-11 w-auto"
                        />
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden items-center gap-7 md:flex lg:gap-9">
                        <NavDropdown label="Products" items={PRODUCT_NAV} />
                        <NavDropdown label="Experience" items={EXPERIENCE_NAV} />
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
                        <NavDropdown label="Support" items={SUPPORT_NAV} />
                    </div>

                    {/* Right cluster: cart icon (always visible) + Explore CTA
                        (desktop) / hamburger (mobile) */}
                    <div className="flex items-center gap-1 md:gap-3">
                        <CartButton onAfterClick={() => setOpen(false)} />

                        {/* Desktop CTA */}
                        <a
                            href="#arsenal"
                            onClick={(e) => goSection(e, "#arsenal")}
                            className="group relative hidden cursor-pointer overflow-hidden rounded-full bg-[#F8290A] px-5 py-2 text-white shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline outline-1 outline-[#F8290A] -outline-offset-1 transition-all duration-200 hover:brightness-110 md:inline-block"
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
                </div>

                {/* Mobile menu panel */}
                {open && (
                    <div className="mt-3 flex flex-col gap-1 border-t border-black/10 pt-3 md:hidden">
                        {/* Products → detail pages, with thumbnails */}
                        <div className="px-2 pb-1 pt-1 font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/40">Products</div>
                        {PRODUCT_NAV.map((p) => (
                            <Link
                                key={p.to}
                                to={p.to}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-black/5"
                            >
                                <span className="h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f1f0ed]">
                                    <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block font-inter text-[15px] font-semibold text-[#1a1a1a]">{p.name}</span>
                                    <span className="block font-inter text-[11px] text-[#1a1a1a]/45">{p.sub}</span>
                                </span>
                            </Link>
                        ))}
                        <div className="my-1.5 border-t border-black/5" />
                        {/* Experience → 3-D product pages (collapsible to save space) */}
                        <MobileSection label="Experience in 3D">
                            {EXPERIENCE_NAV.map((s) => (
                                <Link
                                    key={s.to}
                                    to={s.to}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-between rounded-xl px-2 py-2.5 font-inter text-[15px] font-medium text-[#1a1a1a]/85 transition-colors hover:bg-black/5"
                                >
                                    {s.name}
                                    <span className="font-inter text-[9px] font-bold uppercase tracking-[0.18em] text-[#F8290A]">3D</span>
                                </Link>
                            ))}
                        </MobileSection>
                        <div className="my-1.5 border-t border-black/5" />
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
                        <div className="my-1.5 border-t border-black/5" />
                        {/* Support → help pages (collapsible to save space) */}
                        <MobileSection label="Support">
                            {SUPPORT_NAV.map((s) => (
                                <Link
                                    key={s.to}
                                    to={s.to}
                                    onClick={() => setOpen(false)}
                                    className="rounded-xl px-2 py-2.5 font-inter text-[15px] font-medium text-[#1a1a1a]/85 transition-colors hover:bg-black/5"
                                >
                                    {s.name}
                                </Link>
                            ))}
                        </MobileSection>
                        <a
                            href="#arsenal"
                            onClick={(e) => goSection(e, "#arsenal")}
                            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#F8290A] px-5 py-3 font-inter text-[14px] font-semibold text-white"
                        >
                            Explore the Arsenal
                        </a>
                    </div>
                )}
            </nav>
        </div>
        </>
    );
}
