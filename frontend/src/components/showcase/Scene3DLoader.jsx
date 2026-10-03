import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { asset } from "@/lib/asset";
import { isPrerendering } from "@/lib/isPrerendering";

const PRERENDER = isPrerendering();

/* Branded loading overlay for the 3-D showcase pages — a tactical reticle with a
   live progress ring driven by drei's useProgress, so it tracks the actual gun
   GLB download and fades out the moment the model is ready. Full-screen, dark,
   per-product accent. Latches "done" on the first completion so the other guns
   preloading afterwards can't make it flash back. */
export default function Scene3DLoader({ name = "your blaster", accent = "#F8290A" }) {
    const { progress, active } = useProgress();
    const [fadeOut, setFadeOut] = useState(false);
    const [visible, setVisible] = useState(true);
    const doneRef = useRef(false);

    useEffect(() => {
        if (!doneRef.current && progress >= 100 && !active) {
            doneRef.current = true;
            setFadeOut(true);
            const t = setTimeout(() => setVisible(false), 700);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [progress, active]);

    if (PRERENDER || !visible) {
        return null;
    }

    const pct = Math.min(100, Math.round(progress));
    const R = 52;
    const C = 2 * Math.PI * R;

    return (
        <div
            className={`fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-[#0b0b0e] transition-opacity duration-500 ${
                fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            role="status"
            aria-label={`Loading ${name}`}
        >
            {/* dot-grid texture + accent glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
                style={{ background: accent, opacity: 0.16 }}
            />

            <img src={asset("/assets/logo.png")} alt="Up Your Play" draggable="false" className="relative mb-10 h-8 w-auto opacity-90" />

            {/* tactical reticle + progress ring */}
            <div className="relative grid h-44 w-44 place-items-center">
                <svg className="absolute inset-0 animate-spin" style={{ animationDuration: "7s" }} viewBox="0 0 120 120" fill="none" stroke={accent}>
                    <circle cx="60" cy="60" r="58" strokeWidth="1" strokeDasharray="4 9" opacity="0.5" />
                    <path d="M60 3v13M60 104v13M3 60h13M104 60h13" strokeWidth="2.5" />
                </svg>
                <svg className="absolute inset-0 animate-spin" style={{ animationDuration: "11s", animationDirection: "reverse" }} viewBox="0 0 120 120" fill="none" stroke={accent}>
                    <circle cx="60" cy="60" r="47" strokeWidth="1" strokeDasharray="2 12" opacity="0.4" />
                </svg>
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r={R} stroke="#ffffff14" strokeWidth="5" />
                    <circle
                        cx="60"
                        cy="60"
                        r={R}
                        stroke={accent}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={C * (1 - pct / 100)}
                        style={{ transition: "stroke-dashoffset 0.35s ease" }}
                    />
                </svg>
                <div className="relative text-center">
                    <div className="font-instrument text-[44px] font-bold leading-none text-white tabular-nums">{pct}</div>
                    <div className="mt-0.5 font-inter text-[9px] font-bold uppercase tracking-[0.32em]" style={{ color: accent }}>loaded</div>
                </div>
            </div>

            <div className="relative mt-9 flex items-center gap-2 font-inter text-[11px] font-bold uppercase tracking-[0.34em] text-white/55">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />
                Loading {name}
            </div>
        </div>
    );
}
