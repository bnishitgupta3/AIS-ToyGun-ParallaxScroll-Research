import { useEffect, useRef, useState } from "react";

const CLIPS = ["/assets/hero-1.mp4", "/assets/hero-2.mp4"];
const CROSSFADE = 0.7; // seconds before a clip ends to start the next

/**
 * Full-bleed hero background video — "stitches" the two clips by crossfading
 * between two stacked <video> layers and looping forever. Muted, no controls.
 * A dark tint sits on top (Spyra-style) so the white headline + 3-D gun read
 * cleanly. The whole thing is fixed BEHIND the 3-D canvas (z-0 < canvas z-1)
 * and fades out as the user scrolls past the hero.
 */
export default function HeroVideo() {
    const refs = [useRef(null), useRef(null)];
    const [active, setActive] = useState(0);
    const switching = useRef(false);
    const [fade, setFade] = useState(1);
    /* Defer the 2nd (heavier) clip — only fetch it once clip 1 is playing,
       so the initial page load downloads just clip 1 (~3.6 MB), not ~17 MB. */
    const [loadSecond, setLoadSecond] = useState(false);

    /* Kick off the first clip */
    useEffect(() => {
        refs[0].current?.play().catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Scroll-driven fade-out (gone by ~80% of the first viewport) */
    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                const f = 1 - Math.min(1, window.scrollY / (window.innerHeight * 0.8));
                setFade(f);
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    /* Crossfade to the other clip just before this one ends */
    const onTimeUpdate = (i) => () => {
        if (i !== active || switching.current) return;
        const v = refs[i].current;
        if (!v || !v.duration) return;

        /* Once clip 1 has been playing a moment, start fetching clip 2 so it
           has time to buffer before the crossfade — but not on initial load. */
        if (i === 0 && !loadSecond && v.currentTime > 1.5) {
            setLoadSecond(true);
        }

        if (v.currentTime >= v.duration - CROSSFADE) {
            switching.current = true;
            const next = 1 - i;
            const nv = refs[next].current;
            if (nv) {
                nv.currentTime = 0;
                nv.play().catch(() => {});
            }
            setActive(next);
            setTimeout(() => { switching.current = false; }, CROSSFADE * 1000 + 200);
        }
    };

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            style={{ opacity: fade, transition: "opacity 120ms linear" }}
            aria-hidden="true"
        >
            {CLIPS.map((src, i) => (
                <video
                    key={src}
                    ref={refs[i]}
                    /* Clip 1 loads immediately; clip 2 only once clip 1 is playing */
                    src={i === 0 || loadSecond ? src : undefined}
                    muted
                    playsInline
                    preload={i === 0 ? "auto" : "none"}
                    onTimeUpdate={onTimeUpdate(i)}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out"
                    style={{ opacity: active === i ? 1 : 0 }}
                />
            ))}

            {/* Dark tint + subtle bottom vignette so text/gun pop */}
            <div className="absolute inset-0 bg-black/65" />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)",
                }}
            />
        </div>
    );
}
