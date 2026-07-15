import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

/* Smooth-scroll to a landing-page section.

   Native scrollIntoView({behavior:"smooth"}) / window.scrollTo({behavior})
   are a no-op on the landing page: GSAP ScrollTrigger (which pins the Arsenal)
   hijacks the scroll, so the browser's native smooth scroll never runs. We
   scroll via ScrollToPlugin instead — the same mechanism the Arsenal tile nav
   already uses — which is ScrollTrigger-aware and works reliably.

   `target` is a selector (e.g. "#mission") or an element. */
export function scrollToSection(target) {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    gsap.to(window, {
        duration: 1,
        scrollTo: { y: el, autoKill: false },
        ease: "power3.inOut",
    });
}
