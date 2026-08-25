import "@/App.css";
import { Component, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useProgress } from "@react-three/drei";

/* ── All routes are EAGER (no route-level code-splitting) ──
   Code-splitting (React.lazy) was reverted after it caused "o is not a function"
   crashes on real devices: a lazy route chunk (e.g. the Contact page's) could
   resolve a shared module id (framer-motion) to the wrong thing at runtime —
   a chunk/runtime version mismatch that only showed on some visitors, not in
   testing. Bundling every page into the main graph removes lazy chunks entirely,
   so that whole class of mismatch cannot happen. The perf cost is small (three.js
   already dominates the bundle). DO NOT reintroduce React.lazy here without
   solving the chunk-versioning story first. */
import LandingPage            from "@/pages/LandingPage";
import AboutPage              from "@/pages/AboutPage";
import ComingSoonPage         from "@/pages/ComingSoonPage";
import NotFoundPage           from "@/pages/NotFoundPage";
import PrivacyPolicyPage      from "@/pages/PrivacyPolicyPage";
import TermsPage              from "@/pages/TermsPage";
import ReturnsShippingPage    from "@/pages/ReturnsShippingPage";
import FAQPage                from "@/pages/FAQPage";
import ContactPage           from "@/pages/ContactPage";
import CareersPage           from "@/pages/CareersPage";
import ProductShowcase        from "@/pages/ProductShowcase";
import M416Showcase           from "@/pages/M416Showcase";
import CrimsonBlasterShowcase from "@/pages/CrimsonBlasterShowcase";
import RouteSeo              from "@/components/seo/RouteSeo";
import BuyNowSheet           from "@/components/landing/BuyNowSheet";
import CookieConsent         from "@/components/CookieConsent";
import TopMarquee            from "@/components/landing/TopMarquee";
import { CartProvider, useCart } from "@/lib/cart";
import { trackPageview } from "@/lib/analytics";

/* Analytics: report a page_view on SPA route changes. GA4 itself is loaded
   only after the visitor accepts cookies (see <CookieConsent>), and the
   initial page_view is fired there on accept — so here we skip the first run
   and only track SUBSEQUENT navigations, avoiding a double count. If consent
   is denied, trackPageview is a no-op (gtag never loads). */
function Analytics() {
    const { pathname } = useLocation();
    const first = useRef(true);
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        trackPageview(pathname);
    }, [pathname]);
    return null;
}

/* Force every route change to start at the top of the new page.
   ScrollTrigger pinned sections leave window scroll wherever the
   user was — without this they enter the next page mid-section.
   Also re-hides body so the next page also waits for its assets. */
function ScrollToTop() {
    const { pathname } = useLocation();
    const first = useRef(true);
    useEffect(() => {
        window.scrollTo(0, 0);
        // The <body class="loading"> FOUC gate (set in index.html) is a ONE-TIME
        // thing that <BodyReveal> clears after the first paint. We must NOT re-hide
        // the body on client-side navigation: the old code re-added `loading` here,
        // but reveal() only runs once, so nothing removed it again and the page got
        // stuck BLANK the moment the reveal's leftover inline style was cleared.
        // First render: leave the gate to BodyReveal. Every later navigation:
        // defensively ensure the body is NOT hidden.
        if (first.current) {
            first.current = false;
        } else {
            document.body.classList.remove("loading");
        }
        if (typeof window !== "undefined" && window.ScrollTrigger) {
            requestAnimationFrame(() => window.ScrollTrigger.refresh());
        }
    }, [pathname]);
    return null;
}

/* Foolproof FOUC reveal: body ships with class="loading" (visibility:
   hidden + opacity: 0). Once drei's useProgress reports all GLBs as
   resolved, a single GSAP autoAlpha tween on <body> fades the entire
   document in. No React state, no per-page wrappers — one source of
   truth at the document level. */
function BodyReveal() {
    const { progress, active } = useProgress();
    const revealed = useRef(false);

    const reveal = () => {
        if (revealed.current) return;
        revealed.current = true;
        document.body.classList.remove("loading");
        gsap.to("body", { autoAlpha: 1, duration: 0.45, ease: "power2.inOut" });
    };

    /* Fallback: never blank the page for more than ~900ms waiting on the
       heavy .glb downloads. The HTML, fonts and GSAP animations show
       immediately; the 3-D guns stream in afterwards via Suspense. This is
       what keeps the site feeling instant on slow / mobile connections. */
    useEffect(() => {
        const t = setTimeout(reveal, 900);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Reveal sooner if the models actually finish first. */
    useEffect(() => {
        if (progress >= 100 && !active) {
            requestAnimationFrame(() => requestAnimationFrame(reveal));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress, active]);

    return null;
}

/* Global cart drawer — one instance, mounted at app root. Every "Buy Now"
   click and the nav cart icon converge on this. Lives inside CartProvider so
   it can read the open/close state and the items list. */
function GlobalBuyNowSheet() {
    const { drawer, closeDrawer } = useCart();
    return <BuyNowSheet open={drawer.open} product={drawer.product} onClose={closeDrawer} />;
}

/* Last line of defence: catch ANY render error (a stale-chunk import that got
   past the reload throttle, or a component crash) and show a Reload card instead
   of a blank white page. Without this, one thrown error unmounts the whole app. */
class AppErrorBoundary extends Component {
    state = { crashed: false, msg: "", where: "" };
    static getDerivedStateFromError(error) {
        return {
            crashed: true,
            msg: (error && (error.message || String(error))) || "Unknown error",
        };
    }
    componentDidCatch(error, info) {
        // eslint-disable-next-line no-console
        console.error("AppErrorBoundary caught:", error, info && info.componentStack);
        this.setState({
            where: info && info.componentStack ? String(info.componentStack).trim().slice(0, 1400) : "",
        });
    }
    render() {
        if (!this.state.crashed) return this.props.children;
        return (
            <div className="min-h-screen bg-white px-5 py-12">
                <div className="mx-auto max-w-lg text-center">
                    <p className="mb-4 font-inter text-[15px] text-[#1a1a1a]/80">
                        Something went wrong loading this page.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            sessionStorage.removeItem("__chunkReloadAt");
                            window.location.reload();
                        }}
                        className="rounded-full bg-[#DA0213] px-6 py-2.5 font-inter text-[14px] font-semibold text-white"
                    >
                        Reload
                    </button>
                    {/* TEMP diagnostic (removed once the bug is pinned): show the real
                        error + which component threw, so it's readable from a phone
                        screenshot. */}
                    <pre className="mt-5 max-h-[48vh] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#1a1a1a]/[0.05] p-3 text-left font-mono text-[10px] leading-snug text-[#DA0213]">
                        {this.state.msg + (this.state.where ? "\n\nthrown at:\n" + this.state.where : "")}
                    </pre>
                </div>
            </div>
        );
    }
}

function App() {
    return (
        <CartProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <ScrollToTop />
            <BodyReveal />
            <RouteSeo />
            <Analytics />
            <TopMarquee />
            <CookieConsent />
            <GlobalBuyNowSheet />
            <AppErrorBoundary>
            <Routes>
                {/* Home — full D2C landing page */}
                <Route path="/"               element={<LandingPage />} />

                {/* About */}
                <Route path="/about"          element={<AboutPage />} />

                {/* Coming soon (holding page) */}
                <Route path="/coming-soon"    element={<ComingSoonPage />} />

                {/* Legal / policy pages */}
                <Route path="/privacy"        element={<PrivacyPolicyPage />} />
                <Route path="/terms"          element={<TermsPage />} />
                <Route path="/returns"        element={<ReturnsShippingPage />} />
                <Route path="/faq"            element={<FAQPage />} />
                <Route path="/contact"        element={<ContactPage />} />
                <Route path="/careers"        element={<CareersPage />} />

                {/* Product detail pages */}
                <Route path="/product/mp5k"   element={<ProductShowcase />} />
                <Route path="/product/m416"   element={<M416Showcase />} />
                <Route path="/product/crimson" element={<CrimsonBlasterShowcase />} />

                {/* Branded 404 — also reachable at /404 for testing */}
                <Route path="/404"            element={<NotFoundPage />} />
                <Route path="*"              element={<NotFoundPage />} />
            </Routes>
            </AppErrorBoundary>
        </BrowserRouter>
        </CartProvider>
    );
}

export default App;
