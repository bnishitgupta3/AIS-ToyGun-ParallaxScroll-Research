import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
    "SYSTEM ACTIVE.",
    "CALIBRATING PRESSURE...",
    "50FT EFFECTIVE RANGE.",
    "READY.",
];

const TYPING_MS  = 100;
const DELETE_MS  = 50;
const PAUSE_MS   = 2000;

/**
 * Cycles through MESSAGES with a typewriter effect.
 * Positioned to sit on the hero video subject per spec.
 */
export default function TelemetryTyping() {
    const [displayed, setDisplayed] = useState("");
    const [msgIdx,    setMsgIdx]    = useState(0);
    const [phase,     setPhase]     = useState("typing"); // "typing" | "pausing" | "deleting"

    useEffect(() => {
        const target = MESSAGES[msgIdx];
        let timer;

        if (phase === "typing") {
            if (displayed.length < target.length) {
                timer = setTimeout(
                    () => setDisplayed(target.slice(0, displayed.length + 1)),
                    TYPING_MS,
                );
            } else {
                timer = setTimeout(() => setPhase("pausing"), PAUSE_MS);
            }
        } else if (phase === "pausing") {
            setPhase("deleting");
        } else if (phase === "deleting") {
            if (displayed.length > 0) {
                timer = setTimeout(
                    () => setDisplayed(displayed.slice(0, -1)),
                    DELETE_MS,
                );
            } else {
                setMsgIdx((i) => (i + 1) % MESSAGES.length);
                setPhase("typing");
            }
        }

        return () => clearTimeout(timer);
    }, [displayed, msgIdx, phase]);

    return (
        <div
            className={[
                "absolute z-30 flex w-[110px] justify-start text-left",
                /* Position on video subject */
                "bottom-[32%]",
                "left-[48.5%] -translate-x-1/2",
                "sm:w-[130px]",
                "md:left-[47.5%]",
                "lg:left-[48.5%]",
            ].join(" ")}
        >
            <span className="font-nokia text-[10px] leading-tight text-[#2A3616] break-words min-h-[1.5em] sm:text-[14px]">
                {displayed}
            </span>

            {/* Blinking block cursor */}
            <motion.span
                aria-hidden="true"
                className="ml-1 inline-block h-3 w-1.5 align-middle bg-[#2A3616]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}
