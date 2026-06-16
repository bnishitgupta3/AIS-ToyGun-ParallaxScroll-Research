/**
 * Prefix a runtime asset URL (model, video, image in /public) with the app's
 * base path. Locally and at a domain root, PUBLIC_URL is "" so paths are
 * unchanged; on a GitHub Pages project site it becomes the repo subpath
 * (e.g. "/AIS-ToyGun-ParallaxScroll-Research") so /assets/* still resolves.
 */
export const asset = (path) => `${process.env.PUBLIC_URL || ""}${path}`;
