import { useLocation, useNavigate } from "react-router-dom";
import { scrollToSection } from "@/lib/scrollToSection";

/* Slim top announcement bar — a single "BUNDLE IT UP" call to action (Up&Run
   style) that routes to the Build Your Squad bundle builder. Replaces the old
   scrolling marquee at the top; that marquee now runs at the bottom of the hero.
   Fixed at top-0 (h-10) so the floating nav (top-12) still clears it. */
export default function TopBundleBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const go = (e) => {
        e.preventDefault();
        if (location.pathname === "/") {
            scrollToSection("#squad-packs");
        } else {
            navigate("/", { state: { scrollTo: "#squad-packs" } });
        }
    };
    return (
        <div className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center justify-center border-b-2 border-[#1a1a1a] bg-[#1a1a1a] px-4">
            <a
                href="#squad-packs"
                onClick={go}
                className="group inline-flex items-center gap-1.5 font-instrument text-[13px] font-bold uppercase tracking-[0.12em] text-white underline decoration-2 underline-offset-[5px] transition hover:text-white/80 sm:text-[15px]"
            >
                Build your bundle
                <span className="no-underline transition-transform group-hover:translate-x-0.5">→</span>
            </a>
        </div>
    );
}
