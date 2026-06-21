import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Per-route <title> + meta updates for SPA navigation. The static tags in
   public/index.html cover the first paint (what non-JS crawlers see); this
   keeps them correct as the user/Googlebot navigates between routes. */

const SITE = "https://www.soniqtoys.com";

const DEFAULT = {
    title: "SONIQ Toys · Premium Water Guns & Gel Blasters in India",
    description:
        "SONIQ Toys makes premium, precision-engineered water guns and gel blasters in India, built for year-round play: Holi, pool parties, water parks and backyard battles.",
};

const META = {
    "/": DEFAULT,
    "/about": {
        title: "About SONIQ Toys · Made in India",
        description:
            "The story behind SONIQ Toys: engineering premium water guns and gel blasters in India for players who want more than cheap plastic.",
    },
    "/faq": {
        title: "FAQ · SONIQ Toys",
        description:
            "Answers about SONIQ water guns and gel blasters: safety, shipping across India, payments, returns, refills and order tracking.",
    },
    "/contact": {
        title: "Contact SONIQ Toys",
        description:
            "Get in touch with SONIQ Toys for product help, orders, returns, grievances or partnership enquiries.",
    },
    "/returns": {
        title: "Returns & Shipping · SONIQ Toys",
        description:
            "SONIQ Toys returns, refunds and shipping policy for orders across India.",
    },
    "/privacy": {
        title: "Privacy Policy · SONIQ Toys",
        description:
            "How SONIQ Toys collects, uses and protects your personal data, in line with India's DPDP Act and IT rules.",
    },
    "/terms": {
        title: "Terms & Conditions · SONIQ Toys",
        description:
            "The terms governing use of the SONIQ Toys website and purchase of our products under Indian law.",
    },
    "/product/mp5k": {
        title: "MP5K Water Gun · Electric, Drum-Fed, Full Auto · SONIQ Toys",
        description:
            "The SONIQ MP5K: an electric, drum-fed, full-auto water gun engineered for long range and relentless soaking.",
    },
    "/product/m416": {
        title: "M416 Water X · Long-Range Water Gun · SONIQ Toys",
        description:
            "The SONIQ M416 Water X: long-range, drum-mag, precision water gun built for backyard dominance.",
    },
    "/product/crimson": {
        title: "Crimson Blaster · High-Velocity Gel Blaster · SONIQ Toys",
        description:
            "The SONIQ Crimson Blaster: a high-velocity tactical gel blaster for fast-paced outdoor play.",
    },
    "/coming-soon": {
        title: "Coming Soon · SONIQ Toys",
        description: "Something new from SONIQ Toys is charging up. Get early access.",
    },
};

function upsertMeta(attr, key, content) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function upsertCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
}

export default function RouteSeo() {
    const { pathname } = useLocation();

    useEffect(() => {
        const m = META[pathname] || DEFAULT;
        const url = SITE + (pathname === "/" ? "/" : pathname);

        document.title = m.title;
        upsertMeta("name", "description", m.description);
        upsertMeta("property", "og:title", m.title);
        upsertMeta("property", "og:description", m.description);
        upsertMeta("property", "og:url", url);
        upsertMeta("name", "twitter:title", m.title);
        upsertMeta("name", "twitter:description", m.description);
        upsertCanonical(url);
    }, [pathname]);

    return null;
}
