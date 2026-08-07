/* Playful hand-drawn DOTTED arrow (dogggystyle-style). Bold, round-dotted shaft
   + chunky arrowhead, inherits `currentColor`. Decorative (aria-hidden).
     • default: points LEFT (tip on the left) — put it to the RIGHT of a target.
     • flip:    mirror to point RIGHT.
     • down:    a dedicated DOWN-pointing arrow — put it ABOVE a target. */
export default function DottedArrow({ className = "", flip = false, down = false }) {
    if (down) {
        return (
            <svg
                className={className}
                width="54"
                height="82"
                viewBox="0 0 54 82"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M12 6 C 4 30, 48 36, 34 66"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="0.5 13"
                />
                <path
                    d="M22 56 L35 72 L48 58"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
        );
    }
    return (
        <svg
            className={className}
            width="104"
            height="54"
            viewBox="0 0 104 54"
            fill="none"
            aria-hidden="true"
            style={flip ? { transform: "scaleX(-1)" } : undefined}
        >
            <path
                d="M98 12 C 68 4, 36 10, 15 28"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="0.5 13"
            />
            <path
                d="M30 18 L10 28 L30 40"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
