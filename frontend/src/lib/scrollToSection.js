/* Jump to a landing-page section.

   We scroll INSTANTLY, on purpose. The Arsenal is pinned by GSAP ScrollTrigger
   for ~3.4 viewport-heights; animating a scroll *through* it scrubs the 3D gun
   carousel on every frame, which is very heavy and makes a smooth scroll crawl
   (and visually stall mid-carousel). An instant jump to the section's true
   document position is fast and reliable — and it lands correctly because the
   pin's spacer means each section's getBoundingClientRect position is its real
   scroll target. (Native smooth scroll is separately a no-op here anyway, since
   ScrollTrigger hijacks the scroll.)

   `target` is a selector ("#mission") or an element. */
export function scrollToSection(target) {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    const y = Math.round(el.getBoundingClientRect().top + window.scrollY);
    window.scrollTo(0, y);
}
