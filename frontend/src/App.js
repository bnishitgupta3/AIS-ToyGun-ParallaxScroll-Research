import "@/App.css";
import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useProgress } from "@react-three/drei";

import LandingPage            from "@/pages/LandingPage";
import AboutPage              from "@/pages/AboutPage";
import ComingSoonPage         from "@/pages/ComingSoonPage";
import NotFoundPage          from "@/pages/NotFoundPage";
import PrivacyPolicyPage     from "@/pages/PrivacyPolicyPage";
import TermsPage             from "@/pages/TermsPage";
import ReturnsShippingPage   from "@/pages/ReturnsShippingPage";
import FAQPage               from "@/pages/FAQPage";
import ContactPage          from "@/pages/ContactPage";
import CareersPage          from "@/pages/CareersPage";
import ProductShowcase        from "@/pages/ProductShowcase";       // existing MP5K page
import M416Showcase           from "@/pages/M416Showcase";
import CrimsonBlasterShowcase from "@/pages/CrimsonBlasterShowcase";
import RouteSeo              from "@/components/seo/RouteSeo";
import { initAnalytics, trackPageview } from "@/lib/analytics";

/* Analytics: init GA4 once (if a Measurement ID is configured) and report a
   page_view on every SPA route change. */
function Analytics() {
    const { pathname } = useLocation();
    useEffect(() => {
        initAnalytics();
    }, []);
    useEffect(() => {
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

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <ScrollToTop />
            <BodyReveal />
            <RouteSeo />
            <Analytics />
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
        </BrowserRouter>
    );
}

export default App;
