import "@/App.css";
import { Component, lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";

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
import TrackOrderPage        from "@/pages/TrackOrderPage";
import ThankYouPage          from "@/pages/ThankYouPage";
import ReplacePage           from "@/pages/ReplacePage";
import ProductPage            from "@/pages/ProductPage";
/* ── Heavy 3-D showcase routes are CODE-SPLIT ──
   These three routes pull three.js + @react-three/fiber + drei (the bulk of the
   old 1.6 MB bundle). Lazy-loading them moves all of that into async chunks that
   download ONLY when a /3d route is opened, so the homepage and every content
   page stop paying for three.js. The split is deliberately limited to just these
   routes (not the content/legal pages) to keep the shared-chunk surface tiny —
   the thing that previously caused the "o is not a function" stale-chunk crash.
   Safe now: the real root causes were fixed (no hydrateRoot, block-wrapped
   effects), the deploy keeps old hashed chunks (S3 sync has no --delete, so a
   visitor on an old build never 404s a chunk), and <Suspense> + the
   AppErrorBoundary below catch anything that slips through. Do NOT widen this to
   other routes without keeping that story intact. */
const ProductShowcase        = lazy(() => import("@/pages/ProductShowcase"));
const M416Showcase           = lazy(() => import("@/pages/M416Showcase"));
const CrimsonBlasterShowcase = lazy(() => import("@/pages/CrimsonBlasterShowcase"));
import RouteSeo              from "@/components/seo/RouteSeo";
import BuyNowSheet           from "@/components/landing/BuyNowSheet";
import CookieConsent         from "@/components/CookieConsent";
import Toast                 from "@/components/Toast";
import TopBundleBar          from "@/components/landing/TopBundleBar";
import WhatsAppButton        from "@/components/WhatsAppButton";
import { CartProvider, useCart } from "@/lib/cart";
import { trackPageview } from "@/lib/analytics";

/* Analytics: report a page_view on SPA route changes. Analytics load for every
   visitor (see <CookieConsent>), which also fires the initial page_view, so
   here we skip the first run and only track SUBSEQUENT navigations, avoiding a
   double count. trackPageview is a no-op until analytics have initialised. */
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
    const revealed = useRef(false);

    useEffect(() => {
        const reveal = () => {
            if (revealed.current) {
                return;
            }
            revealed.current = true;
            document.body.classList.remove("loading");
            gsap.to("body", { autoAlpha: 1, duration: 0.45, ease: "power2.inOut" });
        };
        // Production HTML is already revealed at build time by react-snap (no
        // `loading` class in the served markup), so here this just confirms it.
        // It still matters for local dev and any non-prerendered route served the
        // SPA shell: reveal on the first client frame. The 3-D loader this used to
        // wait on (drei useProgress) is gone — three.js no longer loads on the
        // critical path — so there is nothing left to block the reveal. The short
        // timeout is the safety net so the page can never get stuck hidden.
        const raf = requestAnimationFrame(() => requestAnimationFrame(reveal));
        const t = setTimeout(reveal, 600);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t);
        };
    }, []);

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
    state = { crashed: false };
    static getDerivedStateFromError() {
        return { crashed: true };
    }
    componentDidCatch(error, info) {
        // Log for debugging (invisible to users); no on-screen error dump.
        // eslint-disable-next-line no-console
        console.error("AppErrorBoundary caught:", error, info && info.componentStack);
    }
    componentDidUpdate(prevProps) {
        // Reset on route change, so navigating away from a page that errored
        // recovers automatically instead of showing the card forever.
        if (prevProps.resetKey !== this.props.resetKey && this.state.crashed) {
            this.setState({ crashed: false });
        }
    }
    render() {
        if (!this.state.crashed) return this.props.children;
        return (
            <div className="grid min-h-screen place-items-center bg-white px-6 text-center">
                <div>
                    <p className="mb-4 font-inter text-[15px] text-[#1a1a1a]/80">
                        Something went wrong loading this page.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            sessionStorage.removeItem("__chunkReloadAt");
                            window.location.reload();
                        }}
                        className="rounded-full bg-[#F8290A] px-6 py-2.5 font-inter text-[14px] font-semibold text-white"
                    >
                        Reload
                    </button>
                </div>
            </div>
        );
    }
}

/* Feeds the current pathname to the boundary as a reset key, so a crash on one
   page clears automatically when the visitor navigates to another. */
function RoutedErrorBoundary({ children }) {
    const { pathname } = useLocation();
    return <AppErrorBoundary resetKey={pathname}>{children}</AppErrorBoundary>;
}

function App() {
    return (
        <CartProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <ScrollToTop />
            <BodyReveal />
            <RouteSeo />
            <Analytics />
            <TopBundleBar />
            <CookieConsent />
            <GlobalBuyNowSheet />
            <Toast />
            <WhatsAppButton />
            <RoutedErrorBoundary>
            <Suspense fallback={<div style={{ minHeight: "100vh", background: "#050505" }} aria-hidden="true" />}>
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
                <Route path="/track"          element={<TrackOrderPage />} />
                <Route path="/thank-you"      element={<ThankYouPage />} />
                <Route path="/replace"        element={<ReplacePage />} />

                {/* Product detail pages */}
                {/* Conventional PDP is the main product page; the cinematic
                    3-D showcase moves to /product/<slug>/3d (linked from the PDP). */}
                <Route path="/product/mp5k/3d"    element={<ProductShowcase />} />
                <Route path="/product/m416/3d"    element={<M416Showcase />} />
                <Route path="/product/crimson/3d" element={<CrimsonBlasterShowcase />} />
                <Route path="/product/:slug"      element={<ProductPage />} />

                {/* Branded 404 — also reachable at /404 for testing */}
                <Route path="/404"            element={<NotFoundPage />} />
                <Route path="*"              element={<NotFoundPage />} />
            </Routes>
            </Suspense>
            </RoutedErrorBoundary>
        </BrowserRouter>
        </CartProvider>
    );
}

export default App;
