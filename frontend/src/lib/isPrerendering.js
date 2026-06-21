/* True while react-snap's headless Chromium is pre-rendering the page at build
   time (it appends "ReactSnap" to the user agent). We use this to skip the
   heavy WebGL canvases and the hero video during prerender so each route
   reaches "network idle" quickly and its text content is captured into static
   HTML for search engines and AI crawlers. At runtime in real browsers this is
   always false, so users still get the full 3D experience. */
export const isPrerendering = () =>
    typeof navigator !== "undefined" && /ReactSnap/i.test(navigator.userAgent);
