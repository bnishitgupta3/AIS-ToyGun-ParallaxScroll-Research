import "@/App.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useProgress } from "@react-three/drei";

import ComingSoonPage from "@/pages/ComingSoonPage";

/* ──────────────────────────────────────────────────────────────────────────
   STANDALONE COMING-SOON BUILD
   This branch (coming-soon) ships ONLY the holding page. There is no router
   and no link to the main site — the logo is inert, so visitors always stay
   on the teaser. The full D2C site lives on `main` and is built/deployed
   separately. Do not add routes here.
   ────────────────────────────────────────────────────────────────────────── */

/* Foolproof FOUC reveal: body ships with class="loading" (visibility:
   hidden + opacity: 0). Once drei's useProgress reports the GLB resolved,
   a single GSAP autoAlpha tween on <body> fades the document in. */
function BodyReveal() {
    const { progress, active } = useProgress();
    const revealed = useRef(false);

    const reveal = () => {
        if (revealed.current) return;
        revealed.current = true;
        document.body.classList.remove("loading");
        gsap.to("body", { autoAlpha: 1, duration: 0.45, ease: "power2.inOut" });
    };

    /* Never blank the page for more than ~900ms waiting on the silhouette
       model; the HTML, fonts and animations show immediately. */
    useEffect(() => {
        const t = setTimeout(reveal, 900);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Reveal sooner if the model actually finishes first. */
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
        <>
            <BodyReveal />
            <ComingSoonPage />
        </>
    );
}

export default App;
