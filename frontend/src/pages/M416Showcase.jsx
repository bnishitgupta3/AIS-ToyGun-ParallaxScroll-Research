import ProductShowcaseTemplate from "./ProductShowcaseTemplate";
import { asset } from "@/lib/asset";

const M416_PRODUCT = {
    modelUrl:    asset("/assets/m416-watergun.glb"),
    name:        "M416 Water X",
    code:        "M416·WX",
    tagline:     "Fully Electric · Automatic · Trigger-Only",
    eyebrow:     "/// SONIQ Toys · 2026",
    accentColor: "#3b82f6",   // electric blue
    accentDeep:  "#1d4ed8",
    specs: [
        { label: "PLAY TIME",     value: "45 min*" },
        { label: "RANGE",         value: "7–9 m" },
        { label: "FIRE RATE",     value: "4 shots/sec" },
        { label: "BATTERY",       value: "3.7V Rechargeable" },
        { label: "TANK CAPACITY", value: "300 ml" },
        { label: "MODE",          value: "Automatic" },
    ],
    specsTitle: ["Engineered for", "Maximum", "Range."],
    specsDescription:
        "Zero pumping, zero priming. The M416 Water X is fully electric — " +
        "pull the trigger and the motor delivers continuous, automatic fire " +
        "from a 300 ml tank. Pure trigger play, every shot.",
    version:     "v1.0.0 · M416-WX",
    unitLabel:   "7B-416 · In stock",
    homeLink:    "/",
    currentLink: "/product/m416",
};

export default function M416Showcase() {
    return <ProductShowcaseTemplate product={M416_PRODUCT} />;
}
