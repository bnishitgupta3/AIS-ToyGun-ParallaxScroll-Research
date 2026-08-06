/* Playful hand-drawn DOTTED arrow (dogggystyle-style). Points LEFT by default
   (tip on the left), so placed to the RIGHT of a target it points straight at
   it. `flip` mirrors it to point right. Inherits `currentColor`; decorative
   only (aria-hidden). Curved dotted shaft + solid arrowhead. */
export default function DottedArrow({ className = "", flip = false }) {
    return (
        <svg
            className={className}
            width="96"
            height="60"
            viewBox="0 0 96 60"
            fill="none"
            aria-hidden="true"
            style={flip ? { transform: "scaleX(-1)" } : undefined}
        >
            {/* dotted curved shaft — sweeps from the label (right) to the tip (left) */}
            <path
                d="M90 14 C 62 6, 30 12, 14 30"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="0.5 9"
            />
            {/* arrowhead — tip at the left (~10,30), opening to the right */}
            <path
                d="M28 20 L10 30 L28 40"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
