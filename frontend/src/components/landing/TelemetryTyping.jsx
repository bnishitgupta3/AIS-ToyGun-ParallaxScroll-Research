import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
    "SYSTEM ACTIVE.",
    "CALIBRATING PRESSURE...",
    "50FT EFFECTIVE RANGE.",
    "READY.",
];

const TYPING_MS = 100;
const DELETE_MS = 50;
const PAUSE_MS  = 2000;

/**
 * Typewriter cycling through MESSAGES.
 * Renders inline (no absolute positioning) — the parent positions it.
 */
export default function TelemetryTyping() {
    const [displayed, setDisplayed] = useState("");
    const [msgIdx,    setMsgIdx]    = useState(0);
    const [phase,     setPhase]     = useState("typing");

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
        <span className="font-nokia text-[10px] leading-tight text-[#2A3616] break-words sm:text-[13px]">
            {displayed}
            {/* Blinking cursor */}
            <motion.span
                aria-hidden="true"
                className="ml-0.5 inline-block h-[0.8em] w-1 align-middle bg-[#2A3616]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
        </span>
    );
}
