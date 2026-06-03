import ProductShowcaseTemplate from "./ProductShowcaseTemplate";

const CRIMSON_PRODUCT = {
    modelUrl:    "/assets/crimson-blaster.glb",
    name:        "Crimson Blaster",
    code:        "Crimson·MB",
    tagline:     "Gel Blaster · High Velocity · Full Auto",
    eyebrow:     "/// UTG · Tactical Division · 2026",
    accentColor: "#ef4444",   // tactical red
    accentDeep:  "#b91c1c",
    specs: [
        { label: "RANGE",        value: "20–25m" },
        { label: "CAPACITY",     value: "10,000 Beads" },
        { label: "RATE OF FIRE", value: "11 r/s" },
        { label: "BATTERY",      value: "7.4V 1200mAh" },
        { label: "WEIGHT",       value: "1.60 kg" },
        { label: "MODE",         value: "Semi · Full Auto" },
    ],
    specsTitle: ["Built to", "Dominate the", "Field."],
    specsDescription:
        "Crimson digital-camo shell with an integrated muffler barrel. " +
        "The Crimson Blaster fires hydrogel rounds at 11 rounds per second " +
        "with a 10,000-bead hopper that keeps the pressure on.",
    price:      "$99.00",
    squadPrice: "$329.00",
    version:    "v1.0.0 · Crimson-MB",
    unitLabel:  "7B-CMB · In stock",
    homeLink:   "/",
};

export default function CrimsonBlasterShowcase() {
    return <ProductShowcaseTemplate product={CRIMSON_PRODUCT} />;
}
