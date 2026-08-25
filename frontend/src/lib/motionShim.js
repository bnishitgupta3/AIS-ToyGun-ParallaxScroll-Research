/* Drop-in replacement for framer-motion's `motion`.
 *
 * framer-motion's `motion.<tag>` proxy threw "o is not a function" AT RENDER on
 * some real mobile browsers (Chrome + Safari), which unmounted the whole page.
 * It never reproduced in desktop Chromium, so it was invisible in testing. This
 * shim renders plain DOM elements (stripping framer-motion-only props) so every
 * existing `<motion.x>` call site keeps working with zero animation code that can
 * throw. Entrance animations are dropped here; use the CSS `.reveal-up` class
 * (index.css) where a fade is wanted.
 *
 * DO NOT switch these imports back to "framer-motion" until the underlying
 * crash is understood and fixed. */
import { createElement, forwardRef } from "react";

// Props framer-motion owns — they must NOT be forwarded to a real DOM element.
const MOTION_ONLY = new Set([
    "initial", "animate", "exit", "variants", "transition",
    "whileHover", "whileTap", "whileInView", "whileFocus", "whileDrag",
    "viewport", "custom", "layout", "layoutId", "layoutScroll", "layoutDependency",
    "drag", "dragConstraints", "dragElastic", "dragMomentum", "dragListener",
    "dragControls", "dragSnapToOrigin", "dragTransition", "dragPropagation",
    "dragDirectionLock", "onAnimationStart", "onAnimationComplete", "onUpdate",
    "onViewportEnter", "onViewportLeave", "onDrag", "onDragStart", "onDragEnd",
    "onHoverStart", "onHoverEnd", "onTap", "onTapStart", "onTapCancel",
    "transformTemplate", "inherit",
]);

function domOnly(props) {
    const out = {};
    for (const key in props) {
        if (!MOTION_ONLY.has(key)) out[key] = props[key];
    }
    return out;
}

const cache = new Map();
function componentFor(tag) {
    if (!cache.has(tag)) {
        const El = forwardRef((props, ref) =>
            createElement(tag, { ref, ...domOnly(props) }),
        );
        El.displayName = "motion." + String(tag);
        cache.set(tag, El);
    }
    return cache.get(tag);
}

// `motion.div` / `motion.h1` / ... via the get trap; `motion(Component)` via call.
export const motion = new Proxy(
    function motionFactory(Comp) {
        return forwardRef((props, ref) =>
            createElement(Comp, { ref, ...domOnly(props) }),
        );
    },
    {
        get(_target, tag) {
            return componentFor(tag);
        },
    },
);

/* No-op passthroughs, in case these are ever imported from here too. */
export function AnimatePresence({ children }) {
    return children;
}
export const useReducedMotion = () => true;

export default motion;
