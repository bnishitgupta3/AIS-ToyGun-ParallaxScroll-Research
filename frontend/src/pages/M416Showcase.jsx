import ProductShowcaseTemplate from "./ProductShowcaseTemplate";

const M416_PRODUCT = {
    modelUrl:    "/assets/m416-watergun.glb",
    name:        "M416 Water X",
    code:        "M416·WX",
    tagline:     "Electric Water Gun · Long-Range · Drum Mag",
    eyebrow:     "/// UTG · Tactical Division · 2026",
    accentColor: "#3b82f6",   // electric blue
    accentDeep:  "#1d4ed8",
    specs: [
        { label: "RANGE",        value: "15–18m" },
        { label: "CAPACITY",     value: "800 Beads" },
        { label: "RATE OF FIRE", value: "10 r/s" },
        { label: "BATTERY",      value: "11.1V Li-Po" },
        { label: "WEIGHT",       value: "1.85 kg" },
        { label: "MODE",         value: "Full Auto · Burst" },
    ],
    specsTitle: ["Engineered for", "Maximum", "Range."],
    specsDescription:
        "Drum-fed long-barrel architecture with a transparent smoke-black shell. " +
        "The M416 Water X dominates from distance with pinpoint accuracy and a drum " +
        "mag that never runs dry.",
    price:      "$119.00",
    squadPrice: "$399.00",
    version:    "v1.0.0 · M416-WX",
    unitLabel:  "7B-416 · In stock",
    homeLink:   "/",
};

export default function M416Showcase() {
    return <ProductShowcaseTemplate product={M416_PRODUCT} />;
}
