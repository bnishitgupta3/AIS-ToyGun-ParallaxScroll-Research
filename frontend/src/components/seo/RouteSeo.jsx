import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Per-route <title> + meta updates for SPA navigation. The static tags in
   public/index.html cover the first paint (what non-JS crawlers see); this
   keeps them correct as the user/Googlebot navigates between routes. */

const SITE = "https://www.soniqtoys.com";

const DEFAULT = {
    title: "Up Your Play · Premium Water Guns & Gel Blasters in India",
    description:
        "Up Your Play makes premium, precision-engineered water guns and gel blasters in India, built for year-round play: Holi, pool parties, water parks and backyard battles.",
};

const META = {
    "/": DEFAULT,
    "/about": {
        title: "About Up Your Play · Made in India",
        description:
            "The story behind Up Your Play: engineering premium water guns and gel blasters in India for players who love precision, power and play.",
    },
    "/faq": {
        title: "FAQ · Up Your Play",
        description:
            "Answers about Up Your Play water guns and gel blasters: safety, shipping across India, payments, returns, refills and order tracking.",
    },
    "/contact": {
        title: "Contact Up Your Play",
        description:
            "Get in touch with Up Your Play for product help, orders, returns, grievances or partnership enquiries.",
    },
    "/careers": {
        title: "Careers at Up Your Play · Come Make a Splash",
        description:
            "Help build India's most-loved water blaster brand. Join the Up Your Play team across design, engineering, operations, growth and more.",
    },
    "/returns": {
        title: "Returns & Shipping · Up Your Play",
        description:
            "Up Your Play returns, refunds and shipping policy for orders across India.",
    },
    "/privacy": {
        title: "Privacy Policy · Up Your Play",
        description:
            "How Up Your Play collects, uses and protects your personal data, in line with India's DPDP Act and IT rules.",
    },
    "/terms": {
        title: "Terms & Conditions · Up Your Play",
        description:
            "The terms governing use of the Up Your Play website and purchase of our products under Indian law.",
    },
    "/product/mp5k": {
        title: "MP5K Water Gun · Electric, Drum-Fed, Full Auto · Up Your Play",
        description:
            "The Up Your Play MP5K: an electric, drum-fed, full-auto water gun engineered for long range and relentless soaking.",
    },
    "/product/m416": {
        title: "M416 Water X · Long-Range Water Gun · Up Your Play",
        description:
            "The Up Your Play M416 Water X: long-range, drum-mag, precision water gun built for backyard dominance.",
    },
    "/product/crimson": {
        title: "Crimson Blaster · High-Velocity Gel Blaster · Up Your Play",
        description:
            "The Up Your Play Crimson Blaster: a high-velocity tactical gel blaster for fast-paced outdoor play.",
    },
    "/coming-soon": {
        title: "Coming Soon · Up Your Play",
        description: "Something new from Up Your Play is charging up. Get early access.",
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
