import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* Floating WhatsApp support button.

   Opens a chat to our WhatsApp Business number. That number is managed by
   Interakt (our WhatsApp provider), so every message a shopper sends lands
   straight in the Interakt inbox for the team to answer. No Interakt snippet
   is needed for this; the button is just a deep link to the managed number.

   Driven by REACT_APP_WHATSAPP_NUMBER = country code + number, digits only
   (e.g. "919876543210"; no "+", no spaces). While it is unset the button
   renders nothing, so a half-wired button never ships to customers. Set the
   env var once the Interakt number is live and the button turns on everywhere. */

const NUMBER = String(process.env.REACT_APP_WHATSAPP_NUMBER || "").replace(/\D/g, "");
const PREFILL = "Hi Up Your Play! I have a question.";

export default function WhatsAppButton() {
    const [ready, setReady] = useState(false);

    // Small entrance delay so the button eases in after the page settles
    // instead of fighting the hero for attention on first paint.
    useEffect(() => {
        const t = setTimeout(() => setReady(true), 900);
        return () => {
            clearTimeout(t);
        };
    }, []);

    if (typeof document === "undefined" || !NUMBER) {
        return null;
    }

    const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(PREFILL)}`;

    return createPortal(
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            title="Chat with us on WhatsApp"
            className={`brutal brutal-press fixed bottom-5 right-5 z-[55] flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white transition-all duration-300 sm:h-auto sm:w-auto sm:px-5 sm:py-3.5 ${
                ready ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
            }`}
        >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
            </svg>
            <span className="hidden font-inter text-[14px] font-bold sm:inline">Chat with us</span>
        </a>,
        document.body,
    );
}
