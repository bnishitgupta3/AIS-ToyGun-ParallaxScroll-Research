import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

/* Smooth-scroll to a landing-page section.

   Two gotchas this handles:

   1. Native scrollIntoView({behavior:"smooth"}) is a no-op on the landing page
      — GSAP ScrollTrigger (which pins the Arsenal) hijacks the scroll — so we
      scroll via ScrollToPlugin (same mechanism as the Arsenal tile nav).

   2. The Arsenal is PINNED for ~3.4 viewport-heights. Any section AFTER it
      (Mission, Footer) has a real scroll position far below its naive DOM
      offset, so resolving the target from the element lands you inside the
      pinned Arsenal instead. LandingPage registers a pin-aware resolver (built
      from the ScrollTrigger's start/end) via registerSectionResolver so the
      numbers are correct. On pages without the pin (no resolver) we fall back
      to the element's document position. */

let sectionResolver = null;

/* LandingPage calls this after its ScrollTrigger is built. Pass null on
   unmount. The resolver maps a target ("#mission") to a numeric scrollY, or
   returns null/undefined to defer to the element fallback. */
export function registerSectionResolver(fn) {
    sectionResolver = fn;
}

export function scrollToSection(target) {
    let y = sectionResolver ? sectionResolver(target) : null;

    if (y == null) {
        const el = typeof target === "string" ? document.querySelector(target) : target;
        if (!el) return;
        y = el.getBoundingClientRect().top + window.scrollY;
    }

    gsap.to(window, {
        duration: 1,
        scrollTo: { y, autoKill: false },
        ease: "power3.inOut",
    });
}
