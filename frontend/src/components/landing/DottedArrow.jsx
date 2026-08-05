/* Playful hand-drawn DOTTED arrow (dogggystyle-style). Inherits `currentColor`,
   so colour it with a text-* class. `flip` mirrors it horizontally. Decorative
   only (aria-hidden). Curved dashed shaft + solid arrowhead. */
export default function DottedArrow({ className = "", flip = false }) {
    return (
        <svg
            className={className}
            width="96"
            height="64"
            viewBox="0 0 96 64"
            fill="none"
            aria-hidden="true"
            style={flip ? { transform: "scaleX(-1)" } : undefined}
        >
            {/* dotted curved shaft */}
            <path
                d="M6 10 C 34 2, 66 8, 82 44"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="0.5 9"
            />
            {/* arrowhead */}
            <path
                d="M69 38 L84 47 L72 58"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
