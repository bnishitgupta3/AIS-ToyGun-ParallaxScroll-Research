/* Scrolling announcement bar — dogggystyle-style promo marquee pinned to the
   top of every page. Bold Hinato, brand accent, 💦 separators.

   Seamless loop: the track holds TWO identical reels and animates 0 -> -50%
   (one reel). For it to be gap-free at ANY width, one reel must be wider than
   the viewport — so each reel repeats the item list enough times (×3) to exceed
   even ultra-wide screens. The transform animation is GPU-composited and layer-
   promoted (will-change, see index.css); it pauses under reduced-motion and
   while the page is still loading. */

const ITEMS = [
    "Fully electric. Zero pumping, zero priming.",
    "Just pull the trigger.",
    "Full-auto soak from a 300ml drum-fed tank.",
    "Made for Holi mornings and every sunlit day of the year.",
    "Free shipping across India at launch.",
    "Backyard battles, settled.",
];

/* One reel = the list repeated enough to overflow any viewport. */
const REEL = [...ITEMS, ...ITEMS, ...ITEMS];

function Reel({ hidden }) {
    return (
        <div
            className="flex shrink-0 items-center whitespace-nowrap"
            aria-hidden={hidden ? "true" : undefined}
        >
            {REEL.map((t, i) => (
                <span key={i} className="flex items-center">
                    <span className="font-instrument px-5 text-[13px] font-bold uppercase tracking-[0.06em] sm:text-[14px]">
                        {t}
                    </span>
                    <span className="text-[12px]" role="img" aria-label="water">💦</span>
                </span>
            ))}
        </div>
    );
}

export default function TopMarquee() {
    return (
        <div className="marquee fixed inset-x-0 top-0 z-[60] flex h-9 items-center overflow-hidden border-b-2 border-[#1a1a1a] bg-[#f97316] text-white">
            {/* two identical reels; translateX(-50%) == exactly one reel */}
            <div className="marquee-track flex min-w-max">
                <Reel />
                <Reel hidden />
            </div>
        </div>
    );
}
