/* Playful hand-drawn DOTTED arrow (dogggystyle-style). A near-straight dotted
   trail ending in a SOLID (filled) arrowhead that connects cleanly to the
   trail — no detached chevron, no curling up to the label. Inherits
   `currentColor`; decorative (aria-hidden).
     • default: points LEFT (tip on the left) — place to the RIGHT of a target,
       label after it.
     • flip:    mirror to point RIGHT.
     • down:    points DOWN — place ABOVE a target, label above it. */
export default function DottedArrow({ className = "", flip = false, down = false }) {
    if (down) {
        return (
            <svg
                className={className}
                width="30"
                height="84"
                viewBox="0 0 30 84"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M14 6 C 8 28, 22 44, 16 64"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="0.5 8"
                />
                <path d="M8 60 L16 78 L24 60 Z" fill="currentColor" />
            </svg>
        );
    }
    return (
        <svg
            className={className}
            width="104"
            height="32"
            viewBox="0 0 104 32"
            fill="none"
            aria-hidden="true"
            style={flip ? { transform: "scaleX(-1)" } : undefined}
        >
            <path
                d="M98 11 C 72 7, 46 21, 24 16"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="0.5 8"
            />
            <path d="M24 8 L6 16 L24 24 Z" fill="currentColor" />
        </svg>
    );
}
