/* Star rating (display only) — 5 SVG stars filled to the rounded `rating`, in
   the given `color` (defaults to the brand red). Matches the product-page star
   style; shared by the Arsenal cards and the PDP. Show the precise average as
   text next to it. */
export default function StarRating({ rating = 0, color = "#F8290A", size = 14, className = "" }) {
    const filled = Math.round(Number(rating) || 0);
    return (
        <span
            className={`inline-flex items-center gap-0.5 ${className}`}
            role="img"
            aria-label={`${rating} out of 5 stars`}
        >
            {[0, 1, 2, 3, 4].map((i) => (
                <svg
                    key={i}
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill={i < filled ? color : "none"}
                    stroke={color}
                    strokeWidth="1.6"
                >
                    <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
                </svg>
            ))}
        </span>
    );
}
