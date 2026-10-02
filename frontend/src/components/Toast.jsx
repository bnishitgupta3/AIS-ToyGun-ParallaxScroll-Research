import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/cart";

/* "Added to cart" toast — a lightweight confirmation that replaces auto-popping
   the whole cart drawer on every add. Carries a "View cart" CTA so the shopper
   can jump into the drawer when they want to. Single global instance, mounted in
   App; fires whenever a component calls useCart().notifyAdded(). */
export default function Toast() {
    const { toast, clearToast, openDrawer } = useCart();
    const [show, setShow] = useState(false);
    const hideTimer = useRef(null);
    const clearTimer = useRef(null);

    useEffect(() => {
        if (!toast) {
            return undefined;
        }
        setShow(true);
        clearTimeout(hideTimer.current);
        clearTimeout(clearTimer.current);
        hideTimer.current = setTimeout(() => setShow(false), 2800);
        clearTimer.current = setTimeout(() => clearToast(), 3200);
        return () => {
            clearTimeout(hideTimer.current);
            clearTimeout(clearTimer.current);
        };
    }, [toast, clearToast]);

    if (typeof document === "undefined" || !toast) {
        return null;
    }

    const label = toast.name && toast.name !== "Item" ? `${toast.name} added to cart` : "Added to cart";

    return createPortal(
        <div
            className={`fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4 transition-all duration-300 ${
                show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
            }`}
            role="status"
            aria-live="polite"
        >
            <div className="brutal flex items-center gap-3 rounded-full bg-white py-2 pl-3 pr-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F8290A] text-white">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <span className="max-w-[48vw] truncate font-inter text-[13px] font-semibold text-[#1a1a1a] sm:max-w-none">
                    {label}
                </span>
                <button
                    type="button"
                    onClick={() => { clearToast(); openDrawer(null); }}
                    className="ml-1 shrink-0 rounded-full bg-[#1a1a1a] px-3.5 py-1.5 font-inter text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:brightness-125"
                >
                    View cart
                </button>
            </div>
        </div>,
        document.body,
    );
}
