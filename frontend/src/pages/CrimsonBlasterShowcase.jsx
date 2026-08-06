import ProductShowcaseTemplate from "./ProductShowcaseTemplate";
import { asset } from "@/lib/asset";

const CRIMSON_PRODUCT = {
    modelUrl:    asset("/assets/crimson-blaster.glb"),
    name:        "Crimson Blaster",
    code:        "Crimson·MB",
    category:    "Gel Blaster",
    tagline:     "Gel Blaster · High Velocity · Full Auto",
    eyebrow:     "/// SONIQ Toys · 2026",
    accentColor: "#ef4444",   // tactical red
    accentDeep:  "#b91c1c",
    specs: [
        { label: "RANGE",        value: "20-25m" },
        { label: "CAPACITY",     value: "10,000 Beads" },
        { label: "RATE OF FIRE", value: "11 r/s" },
        { label: "BATTERY",      value: "7.4V 1200mAh" },
        { label: "WEIGHT",       value: "1.60 kg" },
        { label: "MODE",         value: "Semi · Full Auto" },
    ],
    specsTitle: ["Built to", "Dominate the", "Field."],
    specsDescription:
        "Crimson digital-camo shell, integrated muffler barrel, and a " +
        "10,000-bead hopper. The full spec drops at launch.",
    version:     "v1.0.0 · Crimson-MB",
    unitLabel:   "7B-CMB",
    homeLink:    "/",
    currentLink: "/product/crimson",
    /* Not launched yet — the template renders this as a teaser: "Coming Soon"
       badge, specs shown as a preview, and a Notify-me capture in place of the
       Buy Now / Add to Cart actions. Remove on launch day. */
    comingSoon:  true,
};

export default function CrimsonBlasterShowcase() {
    return <ProductShowcaseTemplate product={CRIMSON_PRODUCT} />;
}
