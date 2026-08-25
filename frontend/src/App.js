import "@/App.css";
import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useProgress } from "@react-three/drei";

import LandingPage            from "@/pages/LandingPage";  // eager: the homepage stays in the initial bundle

/* Every OTHER route is code-split — each ships as its own chunk that only
   downloads when the visitor actually navigates there. This keeps the homepage's
   initial bundle lean; the three product showcase pages in particular pull in the
   heavy 3-D template, so keeping them out of the first load is the big win. */
const AboutPage              = lazy(() => import("@/pages/AboutPage"));
const ComingSoonPage         = lazy(() => import("@/pages/ComingSoonPage"));
const NotFoundPage           = lazy(() => import("@/pages/NotFoundPage"));
const PrivacyPolicyPage      = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage              = lazy(() => import("@/pages/TermsPage"));
const ReturnsShippingPage    = lazy(() => import("@/pages/ReturnsShippingPage"));
const FAQPage                = lazy(() => import("@/pages/FAQPage"));
const ContactPage            = lazy(() => import("@/pages/ContactPage"));
const CareersPage            = lazy(() => import("@/pages/CareersPage"));
const ProductShowcase        = lazy(() => import("@/pages/ProductShowcase"));       // MP5K
const M416Showcase           = lazy(() => import("@/pages/M416Showcase"));
const CrimsonBlasterShowcase = lazy(() => import("@/pages/CrimsonBlasterShowcase"));
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
    useEffect(() => {
        window.scrollTo(0, 0);
        // Re-arm the FOUC gate for the incoming page
        document.body.classList.add("loading");
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

/* Fallback while a code-split route chunk downloads — a centered brand spinner
   on white. The homepage is eager, so this only ever appears on secondary
   routes, and only for the moment a chunk is in flight. */
function RouteFallback() {
    return (
        <div className="grid min-h-screen place-items-center bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#DA0213]/25 border-t-[#DA0213]" />
        </div>
    );
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
            <Suspense fallback={<RouteFallback />}>
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
            </Suspense>
        </BrowserRouter>
        </CartProvider>
    );
}

export default App;
