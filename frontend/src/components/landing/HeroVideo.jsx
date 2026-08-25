import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

const CLIPS = [asset("/assets/hero-1.mp4"), asset("/assets/hero-2.mp4")];
const CROSSFADE = 0.7; // seconds before a clip ends to start the next

/**
 * Full-bleed hero background video — "stitches" the two clips by crossfading
 * between two stacked <video> layers and looping forever. Muted, no controls.
 * A dark tint sits on top (Spyra-style) so the white headline + 3-D gun read
 * cleanly. The whole thing is fixed BEHIND the 3-D canvas (z-0 < canvas z-1)
 * and fades out as the user scrolls past the hero.
 */
/* Respect the OS "reduce motion" setting — a motion-sensitive visitor gets a
   calm, static first frame instead of an autoplaying, crossfading background. */
const REDUCE_MOTION =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* On phones we NEVER fetch the heavy 2nd clip (~13 MB): mobile bandwidth is the
   scarcest resource and the single-clip loop looks the same on a small screen.
   This alone cuts the hero's mobile video payload by ~78% (17 MB -> ~3.6 MB). */
const IS_MOBILE =
    typeof window !== "undefined" && window.innerWidth < 768;

export default function HeroVideo() {
    const refs = [useRef(null), useRef(null)];
    const [active, setActive] = useState(0);
    const switching = useRef(false);
    const [fade, setFade] = useState(1);
    /* Defer the 2nd (heavier) clip — only fetch it once clip 1 is playing, so
       the initial load downloads just clip 1 (~3.6 MB), not ~17 MB. Once we DO
       load it, it preloads="auto" (below) and buffers throughout clip 1's
       playback, so the crossfade never stalls. */
    const [loadSecond, setLoadSecond] = useState(false);

    /* Kick off the first clip. `autoPlay` on the element is the primary
       trigger, but on a COLD load it can silently fail to start: the <body>
       ships hidden (the FOUC gate) for up to ~900ms, and iOS/Chrome defer
       muted autoplay while the element isn't actually visible — so the
       mount-time play() gets dropped and the video stays paused until a hard
       reload (one user hit exactly this: it only played after scrolling to the
       Arsenal and back, i.e. after a gesture). Retry play() on a short bounded
       interval (spans the hidden→visible window) and on the first user gesture
       / tab-visible, clearing as soon as it actually plays. */
    useEffect(() => {
        if (REDUCE_MOTION) return;
        let tries = 0;
        let id;
        const cleanup = () => {
            clearInterval(id);
            window.removeEventListener("pointerdown", onGesture);
            window.removeEventListener("touchstart", onGesture);
            window.removeEventListener("scroll", onGesture);
            document.removeEventListener("visibilitychange", onVis);
        };
        const tryPlay = () => {
            const v = refs[0].current;
            if (!v) return;
            if (!v.paused) { cleanup(); return; }
            v.play().then(() => cleanup()).catch(() => {});
        };
        const onGesture = () => tryPlay();
        const onVis = () => { if (!document.hidden) tryPlay(); };
        id = setInterval(() => {
            tryPlay();
            if (++tries >= 20) clearInterval(id); // ~5s of retries
        }, 250);
        window.addEventListener("pointerdown", onGesture, { passive: true });
        window.addEventListener("touchstart", onGesture, { passive: true });
        window.addEventListener("scroll", onGesture, { passive: true });
        document.addEventListener("visibilitychange", onVis);
        tryPlay();
        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Retry play() once the active clip actually has data. On a cold (uncached)
       first load the mount-time play() can be rejected/interrupted before any
       media has buffered; without this retry the video would silently stay
       paused until a hard reload served it from cache. Fires on `canplay`. */
    const onCanPlay = (i) => () => {
        if (REDUCE_MOTION || i !== active) return;
        const v = refs[i].current;
        if (v && v.paused) v.play().catch(() => {});
    };

    /* Safety: if the active clip reaches its end without a crossfade having
       fired (e.g. the next clip wasn't buffered in time), loop it rather than
       freezing on the last frame. */
    const onEnded = (i) => () => {
        if (REDUCE_MOTION || i !== active || switching.current) return;
        const v = refs[i].current;
        if (v) {
            v.currentTime = 0;
            v.play().catch(() => {});
        }
    };

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

        /* Start fetching clip 2 shortly after clip 1 begins, so it has the
           whole rest of clip 1 to buffer before the crossfade. Skipped on
           mobile — clip 1 just loops (onEnded), saving the ~13 MB 2nd clip. */
        if (i === 0 && !loadSecond && !IS_MOBILE && v.currentTime > 0.5) {
            setLoadSecond(true);
        }

        /* On mobile there is no 2nd clip — loop clip 1 instead of crossfading. */
        if (IS_MOBILE) {
            if (v.currentTime >= v.duration - 0.15) {
                v.currentTime = 0;
                v.play().catch(() => {});
            }
            return;
        }

        if (v.currentTime >= v.duration - CROSSFADE) {
            const next = 1 - i;
            const nv = refs[next].current;
            // Only cross into the next clip once it actually has data buffered
            // (readyState >= HAVE_FUTURE_DATA); otherwise wait — the onEnded
            // safety loops this clip so nothing freezes.
            if (!nv || nv.readyState < 3) return;
            switching.current = true;
            nv.currentTime = 0;
            nv.play().catch(() => {});
            setActive(next);
            setTimeout(() => { switching.current = false; }, CROSSFADE * 1000 + 200);
        }
    };

    return (
        <div
            /* Anchored at the top and made TALLER than the viewport (extra
               160px below the fold). On iOS Safari the bottom toolbar shows/
               hides as you scroll, which changes the visual-viewport height; a
               plain `inset-0` fixed layer briefly exposes the light page
               background at the bottom during that swing (the "bottom flicker").
               Overscanning past the bottom keeps the dark video covering that
               whole toolbar-swing band, so nothing flashes through. */
            className="pointer-events-none fixed left-0 top-0 z-0 w-full overflow-hidden"
            style={{
                height: "calc(100vh + 160px)",
                opacity: fade,
                transition: "opacity 120ms linear",
                /* NOTE: intentionally NO visibility:hidden here. We used to hide
                   the layer once scrolled past to save compositing — but on real
                   devices visibility:hidden SUSPENDS the video's decode pipeline,
                   so a FAST scroll back up from the footer showed a frozen/stale
                   frame for ~2s while it re-decoded (the reported lag). Keeping it
                   painted at opacity:0 (with the translateZ / willChange GPU hints
                   on each <video> below) keeps the decode warm, so returning to
                   the hero is instant. */
            }}
            aria-hidden="true"
        >
            {CLIPS.map((src, i) => (
                <video
                    key={src}
                    ref={refs[i]}
                    /* Clip 1 loads immediately; clip 2 only once clip 1 is
                       playing — and then it preloads="auto" so it BUFFERS
                       ahead (it was "none" before, which is why the crossfade
                       used to stall). */
                    src={i === 0 || loadSecond ? src : undefined}
                    autoPlay={i === 0 && !REDUCE_MOTION}
                    muted
                    playsInline
                    preload={i === 0 || loadSecond ? "auto" : "none"}
                    onCanPlay={onCanPlay(i)}
                    onTimeUpdate={onTimeUpdate(i)}
                    onEnded={onEnded(i)}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out"
                    /* Promote each clip to its own GPU layer. Two stacked
                       hardware-decoded videos compositing on iOS is fragile;
                       the translateZ/backface hints stabilise the crossfade and
                       stop edge repaint flicker. */
                    style={{
                        opacity: active === i ? 1 : 0,
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden",
                        willChange: "opacity",
                    }}
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
