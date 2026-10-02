/* ── Product detail content for the D2C product pages (PDP) ──
   The shoppable facts (name, price, mrp, accent, specs, comingSoon) live with
   the shared PRODUCTS data in ArsenalSection. This module adds only the long-
   form PDP content: gallery images, overview copy, highlights, box contents and
   FAQ, keyed by the product link.

   SHOPIFY-READY: when the headless Storefront API is wired, the marketing copy
   can stay here (it is content, not catalogue data) while price/variants/stock
   come from Shopify. Gallery image paths would be replaced by Shopify CDN URLs. */

export const PRODUCT_DETAILS = {
    "/product/mp5k": {
        // Gallery = the two studio photos + the transparent cutout (a clean
        // floating hero shot on the light gallery panel).
        gallery: ["mp5k.jpg", "mp5k-hover.jpg", "cutout/mp5k.webp"],
        overview:
            "The MP5K is a fully electric, trigger-only water blaster built for Holi mornings and every sunlit day. No pumping, no priming. Load the 300ml drum, pull the trigger, and let loose a full-auto stream that soaks targets up to 10 metres away.",
        highlights: [
            { icon: "bolt", title: "Zero pumping", text: "Fully electric drive. Pull the trigger and soak, that is it." },
            { icon: "drum", title: "300ml drum tank", text: "Drum-fed reservoir for long bursts between refills." },
            { icon: "target", title: "8 to 10m range", text: "Reaches across the lawn, the pool or the rooftop." },
            { icon: "battery", title: "45 min of play", text: "Rechargeable battery keeps the whole squad soaked." },
        ],
        whatsInBox: ["MP5K water blaster", "300ml drum tank", "USB charging cable", "Quick-start guide"],
        faq: [
            { q: "Does it need pumping or manual priming?", a: "Neither. It is fully electric with a built-in rechargeable battery, charged over USB. Just pull the trigger." },
            { q: "How far does it shoot?", a: "Roughly 8 to 10 metres, depending on the fill level and the angle you hold it at." },
            { q: "Is it safe for kids?", a: "Recommended for ages 8+ with adult supervision. It fires water only." },
            { q: "How long does one charge last?", a: "About 45 minutes of active play on a full charge." },
        ],
    },
    "/product/m416": {
        gallery: ["m416.jpg", "m416-hover.jpg", "cutout/m416.webp"],
        overview:
            "The M416 Water X is a rapid-fire electric water blaster made for backyard battles and Holi mornings. Drum-fed, trigger-only and fully electric, it keeps the stream coming so you can keep the whole crew drenched all summer long.",
        highlights: [
            { icon: "bolt", title: "Electric auto-fire", text: "No pumping or priming. Pull and hold to keep firing." },
            { icon: "drum", title: "300ml drum tank", text: "A generous drum means fewer trips to refill." },
            { icon: "target", title: "7 to 9m range", text: "Plenty of reach for lawns, terraces and pool decks." },
            { icon: "battery", title: "45 min of play", text: "Rechargeable over USB, ready for the next round fast." },
        ],
        whatsInBox: ["M416 Water X blaster", "300ml drum tank", "USB charging cable", "Quick-start guide"],
        faq: [
            { q: "Do I need to pump it?", a: "No. It is fully electric and trigger-only, with a rechargeable battery charged over USB." },
            { q: "How far does it shoot?", a: "Around 7 to 9 metres depending on fill and angle." },
            { q: "What age is it for?", a: "Best for ages 8+ with adult supervision. Water only." },
            { q: "Can I use it in a pool?", a: "Yes, refill straight from the pool and keep firing. Dry the battery compartment after play." },
        ],
    },
    "/product/crimson": {
        gallery: ["crimson.jpg", "crimson-hover.jpg", "cutout/crimson.webp"],
        overview:
            "The Crimson Blaster is our high-velocity gel blaster, built for tactical squad play. Electric drive, an 18 metre range and up to 11 shots a second. It is launching soon, join the waitlist to be first in line.",
        highlights: [
            { icon: "bolt", title: "High velocity", text: "Electric gel blaster tuned for fast, flat shots." },
            { icon: "target", title: "18m range", text: "Long reach for open-ground skirmishes." },
            { icon: "drum", title: "11 shots / sec", text: "Rapid fire to keep the other squad pinned." },
            { icon: "battery", title: "50 min battery", text: "Rechargeable pack for extended matches." },
        ],
        whatsInBox: ["Crimson gel blaster", "Gel bead starter pack", "USB charging cable", "Quick-start guide"],
        faq: [
            { q: "When does it launch?", a: "Soon. Join the waitlist on this page and we will email you the moment it drops." },
            { q: "What does it fire?", a: "Soft water-gel beads that burst on impact and dry up clean. Eye protection is recommended." },
            { q: "Is it the same as the water guns?", a: "No. The Crimson is a gel blaster, a different category with more range and a higher fire rate." },
        ],
    },
};
