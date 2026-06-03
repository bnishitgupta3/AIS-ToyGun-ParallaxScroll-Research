import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * HTML overlay for the FIRE visual feedback.
 *
 * Rendered via React Portal directly into `document.body` to avoid any
 * parent stacking context / transform that would otherwise contain the
 * fixed positioning and clip / hide its children.
 */
export default function FireEffects({ active }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("visibility", "hidden", "important");
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (active) {
            el.style.setProperty("visibility", "visible", "important");
            el.style.setProperty("opacity", "1", "important");
        } else {
            el.style.setProperty("opacity", "0", "important");
            el.style.setProperty("visibility", "hidden", "important");
        }
    }, [active]);

    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            ref={ref}
            data-testid="fire-effects"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[9999] overflow-visible"
        >
            <div data-testid="muzzle-flash" className="fire-muzzle-flash" />
            <div className="fire-water-cone fire-water-cone--a" />
            <div className="fire-water-cone fire-water-cone--b" />
            <div className="fire-water-cone fire-water-cone--c" />
            <div data-testid="water-stream" className="fire-water-specks">
                {Array.from({ length: 18 }).map((_, i) => (
                    <span
                        key={i}
                        className="fire-speck"
                        style={{
                            top: `${42 + (i % 6) * 2.2 - 6}%`,
                            animationDelay: `${(i % 9) * 0.07}s`,
                        }}
                    />
                ))}
            </div>
        </div>,
        document.body,
    );
}
