/* Scrolling announcement bar — dogggystyle-style promo marquee pinned to the
   very top of every page. Bold Fredoka, brand accent, ✦ separators. The track
   holds TWO identical copies and is translated 0 -> -50% for a seamless infinite
   loop; the transform animation is GPU-composited (cheap) and pauses under
   prefers-reduced-motion / while the page is still loading (see index.css). */

const ITEMS = [
    "Fully Electric · Zero Pumping",
    "Trigger-Only · Full-Auto Soak",
    "Made for Holi & Every Sunlit Day",
    "Free Shipping Across India at Launch",
    "Backyard Battles, Settled",
];

function Copy() {
    return (
        <div className="flex shrink-0 items-center whitespace-nowrap">
            {ITEMS.map((t, i) => (
                <span key={i} className="flex items-center">
                    <span className="font-instrument px-5 text-[13px] font-bold uppercase tracking-[0.06em] sm:text-[14px]">
                        {t}
                    </span>
                    <span className="text-[11px] text-white/75">✦</span>
                </span>
            ))}
        </div>
    );
}

export default function TopMarquee() {
    return (
        <div className="marquee fixed inset-x-0 top-0 z-[60] flex h-9 items-center overflow-hidden border-b-2 border-[#1a1a1a] bg-[#f97316] text-white">
            {/* two copies side by side; translateX(-50%) == exactly one copy */}
            <div className="marquee-track flex min-w-max">
                <Copy />
                <Copy aria-hidden />
            </div>
        </div>
    );
}
