import { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    useGLTF,
    ContactShadows,
    Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import GenericGunModel from "./GenericGunModel";
import NeutralEnvironment from "./NeutralEnvironment";
import { asset } from "@/lib/asset";

/* Pre-warm the HERO gun immediately. The two Arsenal-only guns (~14 MB) are
   preloaded + mounted after first paint (see the deferred mount in
   LandingCanvas below) so the hero wins the initial bandwidth. */
useGLTF.preload(asset("/assets/watergun.glb"));

/* World-space layout constants — MUST match LandingPage. */
export const HERO_GUN_X = 2.4;   // model1's X during the hero (renders in right column)
export const GUN_SPACING = 12;   // hero parking distance between guns (off-screen)
const OFFSCREEN_PUSH = 11;       // how far past its arc slot a side gun parks off-screen
const DAMP_LAMBDA = 6.5;         // higher = snappier, lower = floatier (buttery sweet-spot)

/* ── Circular turntable geometry ──
   Guns are evenly spaced around a FULL circle (360° / N apart) in the X-Z
   plane. The slot at angle 0 is front-and-centre (highlighted, full size);
   the others orbit symmetrically on both sides and wrap around the back as
   the carousel rotates. Scrolling spins the ring so each gun loops to front. */
const N            = 3;                    // weapons
const SLOT_ANGLE   = (2 * Math.PI) / N;    // 120° — even spacing on a full circle
const ARC_RADIUS   = 3.8;                  // X spread of the orbit (bigger circle)
const ARC_DEPTH    = 2.8;                  // Z depth (shallower than radius → ellipse)
const SIDE_TURN    = 0.3;                  // gentle tangential turn as guns orbit
const lerp = THREE.MathUtils.lerp;
const damp = THREE.MathUtils.damp;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* Per-gun focus → scale / opacity.
   f = (cos φ + 1) / 2 across the FULL circle: 1 at front, 0.25 at the ±120°
   side slots, 0 directly behind. Keeps the orbiting guns visible-but-dim. */
const focusScale   = (f) => 0.32 + 0.68 * Math.pow(f, 1.3);  // 1.0 front → ~0.43 sides
const focusOpacity = (f) => 0.28 + 0.72 * Math.pow(f, 1.8);  // 1.0 front → ~0.34 sides

/* Pre-launch guns render permanently dimmed — even when swung to the front
   slot — so an un-launched product reads as a faded "coming soon" teaser.
   Index matches the model order below == the Arsenal PRODUCTS order:
   [0] MP5K, [1] M416, [2] Crimson (pre-launch). Flip 2 → false on launch. */
const COMING_SOON      = [false, false, true];
const COMING_SOON_FADE = 0.32;  // multiplier on target opacity for a teaser gun

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/* ── Responsive layout from viewport aspect ──
   Narrow / portrait screens shrink the ring + the guns and bring the hero
   gun toward centre & lower, so the carousel always fits and the hero gun
   doesn't collide with the stacked mobile text. Wide desktops get the full
   ARC_RADIUS / full-size guns / right-column hero gun. */
function responsiveLayout(width, height) {
    const aspect = (width || 1) / (height || 1);
    return {
        /* Lower radius floor so the side guns stay fully on-screen (not cut
           off at the edges) on narrow / portrait devices. */
        radius: clamp(aspect * 2.3, 1.35, ARC_RADIUS),
        depth:  clamp(aspect * 1.9, 1.4, ARC_DEPTH),
        scale:  clamp(aspect * 0.8, 0.5, 1.0),
        /* Spyra-style hero: gun centred horizontally, sitting in the lower
           third. On desktop it parks at -1.1. On narrow/portrait phones it
           needs to sit HIGHER, not lower: the fixed canvas is 100vh (larger
           than the visible area, since the browser's bottom toolbar eats into
           it), so a gun placed for desktop renders too low on a phone — it
           dropped into / overlapped the "Scroll to explore" cue at the bottom.
           So RAISE it on narrow screens (positive offset) to keep it centred in
           the visible area and clear of both the headline above and the cue
           below. Desktop (aspect > 0.95) is unchanged. */
        heroX:  0,
        heroY:  -1.1 + clamp((0.95 - aspect) * 2.2, 0, 1) * 0.2,
    };
}

/* ── Scene graph — must live inside <Canvas> ── */
function LandingScene({ model1Ref, model2Ref, model3Ref, mouseRef, scrollRef }) {
    const { size } = useThree();
    /* Each gun snaps straight to its target on the FIRST frame it's processed
       (tracked per-object via userData.placed), then damps. This means a gun
       that mounts late (the two Arsenal guns are deferred for load perf) drops
       into place instead of flying in from the origin (0,0,0). */
    /*
     * BUTTERY CAROUSEL CORE
     * ─────────────────────
     * GSAP writes two scalars into scrollRef every scroll tick:
     *   • entry   0→1  hero → arsenal entrance
     *   • arsenal 0→1  carousel rotation while pinned
     *
     * Every render frame we compute each gun's carousel pose and DAMP toward
     * it (frame-rate independent → buttery, no stutter, exact settling).
     *
     * Carousel: activePos = arsenal·(N−1) is the slot currently centred.
     * Gun i's angle φ = (i − activePos)·SLOT_ANGLE.
     *   φ = 0  → front centre, full scale, no turn (HIGHLIGHTED)
     *   φ ≠ 0  → swung onto the arc: smaller, pushed back, rotated
     * As `arsenal` grows, every gun sweeps through φ = 0 in turn.
     *
     * The hero pose (gun1 parked in the right column, others off-screen)
     * is blended into the carousel by `entry`.
     */
    useFrame((_, dt) => {
        const guns = [model1Ref.current, model2Ref.current, model3Ref.current];
        if (!guns[0]) return;

        const s       = scrollRef.current || { entry: 0, arsenal: 0 };
        const entry   = clamp01(s.entry || 0);
        const arsenal = clamp01(s.arsenal || 0);
        const activePos = arsenal * (N - 1);
        const m = mouseRef.current;

        /* Responsive ring / scale / hero offset for this viewport */
        const R = responsiveLayout(size.width, size.height);

        // clamp dt so a tab-switch frame-spike can't teleport the guns
        const d = Math.min(dt, 1 / 30);

        for (let i = 0; i < guns.length; i++) {
            const g = guns[i];
            if (!g) continue;

            // Snap this gun to target on its first processed frame, then damp.
            const snapThis = !g.userData.placed;
            const ap = (cur, tgt) => (snapThis ? tgt : damp(cur, tgt, DAMP_LAMBDA, d));

            /* — Carousel pose for slot i — */
            const phi  = (i - activePos) * SLOT_ANGLE;
            const cphi = Math.cos(phi);
            const focus = (cphi + 1) / 2;                  // 1 front → 0.25 sides → 0 behind
            const cX   = Math.sin(phi) * R.radius;
            const cZ   = (cphi - 1) * R.depth;             // 0 at front, negative on sides
            const cS   = focusScale(focus);                // 1.0 front → ~0.43 sides
            const cO   = focusOpacity(focus);              // 1.0 front → ~0.34 sides
            /* wrap φ to ±π so both flanks turn symmetrically across the loop */
            const wphi = Math.atan2(Math.sin(phi), cphi);
            const cRotY = wphi * SIDE_TURN;                // the "spin"

            /* — Hero pose — only gun0 is visible (parked in the right column
               on desktop, centred-and-lower on mobile). Side guns park
               OFF-SCREEN ON THE SIDE THEY BELONG TO so on scroll-in they glide
               symmetrically inward — gun1 from the right, gun2 from the left. */
            const hX = i === 0
                ? R.heroX
                : cX + Math.sign(cX || 1) * OFFSCREEN_PUSH;
            const hY = i === 0 ? R.heroY : 0;

            /* — Blend hero → carousel by entry — */
            const tX = lerp(hX, cX, entry);
            const tY = lerp(hY, 0,  entry);
            const tZ = lerp(0,  cZ, entry);
            const tS = lerp(0.85, cS, entry) * R.scale;    // hero gun a touch smaller; arsenal unaffected
            let   tO = lerp(1,  cO, entry);  // fully opaque in hero, fades on the arc
            if (COMING_SOON[i]) tO *= COMING_SOON_FADE;  // teaser guns stay dimmed
            let   tRotY = lerp(0, cRotY, entry);
            let   tRotX = 0;

            /* Hero mouse-tilt on the focused gun1, fading out as we enter */
            if (i === 0) {
                tRotY += (1 - entry) * (m.x * 0.28);
                tRotX  = (1 - entry) * (-m.y * 0.14);
            }

            /* — Damp every channel for buttery motion (snap on first frame) — */
            g.position.x = ap(g.position.x, tX);
            g.position.y = ap(g.position.y, tY);
            g.position.z = ap(g.position.z, tZ);
            g.rotation.y = ap(g.rotation.y, tRotY);
            g.rotation.x = ap(g.rotation.x, tRotX);
            const ns = ap(g.scale.x, tS);
            g.scale.setScalar(ns);

            /* — Fade the non-focused guns (like the 40% thumbnails) —
               Cache each gun's material list once (traversing the scene graph
               every frame was a big cost) and only write opacity when it
               actually changes, so a settled gun costs nothing here. */
            const op = ap(g.userData.op ?? 1, tO);
            g.userData.op = op;
            let mats = g.userData.mats;
            if (!mats || mats.length === 0) {
                mats = [];
                g.traverse((o) => {
                    if (o.isMesh && o.material) {
                        const list = Array.isArray(o.material) ? o.material : [o.material];
                        for (let k = 0; k < list.length; k++) mats.push(list[k]);
                    }
                });
                g.userData.mats = mats;
                g.userData.appliedOp = undefined; // apply now that we have mats
            }
            if (
                mats.length &&
                (g.userData.appliedOp === undefined ||
                    Math.abs(op - g.userData.appliedOp) > 0.002)
            ) {
                for (let k = 0; k < mats.length; k++) mats[k].opacity = op;
                g.userData.appliedOp = op;
            }

            g.userData.placed = true;
        }
    });

    return (
        <>
            {/* Neutral IBL only — soft, even RoomEnvironment lighting so PBR/
                metal reads at its true brightness, with NO added key/fill light
                (removes the extra highlights/hotspots on the guns). */}
            <NeutralEnvironment intensity={1.1} />

            {/* Slow, out-of-focus particles behind the guns — premium depth.
                Trimmed count for cheaper per-frame animation. */}
            <Sparkles
                position={[0, 0, -4]}
                count={20}
                scale={12}
                size={2}
                speed={0.2}
                opacity={0.2}
                color="#ffffff"
            />

            {/* Product 1 – MP5K  (hero + arsenal slot 0) */}
            <group ref={model1Ref}>
                <Suspense fallback={null}>
                    <GenericGunModel url={asset("/assets/watergun.glb")} targetSize={2.8} />
                </Suspense>
            </group>

            {/* Guns 2 & 3 (M416, Crimson) are NO LONGER mounted here — the
                Arsenal is now a photo grid (ArsenalGrid), so streaming those two
                ~7 MB GLBs on the homepage is pure waste. Only the hero gun loads.
                model2Ref/model3Ref stay unattached; the useFrame skips nulls. */}

            {/* Grounded contact shadow under the active model area.
                512 resolution (from 1024) — 4x fewer pixels to re-render each
                frame, visually near-identical under the soft blur. */}
            <ContactShadows
                position={[0, -1.6, 0]}
                resolution={512}
                scale={10}
                blur={2}
                opacity={0.5}
                far={10}
                color="#000000"
            />
        </>
    );
}

export default function LandingCanvas({ model1Ref, model2Ref, model3Ref, mouseRef, scrollRef }) {
    /* Only the hero gun loads now — the Arsenal grid replaced the 3-D carousel,
       so guns 2 & 3 are no longer mounted or preloaded here. */
    return (
        <Canvas
            camera={{ position: [0, 0.15, 7.5], fov: 40 }}
            /* Cap devicePixelRatio at 1.5: on a 2x Retina screen this is ~1.8x
               fewer pixels to shade every frame — the single biggest smoothness
               win — with barely perceptible sharpness loss under antialiasing. */
            dpr={[1, 1.5]}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
                toneMapping: THREE.NeutralToneMapping,
            }}
            /* Don't re-measure the canvas on scroll. Combined with the constant
               100vh height below, this stops iOS Safari's toolbar show/hide (a
               scroll side-effect) from resizing the WebGL drawing buffer mid-
               scroll — which was jittering the contact shadow and flickering
               the bottom band. */
            resize={{ scroll: false }}
            style={{
                position: "fixed",
                top: 0, left: 0,
                /* height MUST be 100vh, not 100%. On iOS Safari `height:100%`
                   on a fixed element tracks the *visual* viewport, which grows/
                   shrinks as the bottom toolbar collapses/expands during scroll;
                   that resized the canvas every frame and made the ground shadow
                   flicker at the bottom. `100vh` is the constant large-viewport
                   height there, so the buffer size stays put through the swing. */
                width: "100%", height: "100vh",
                zIndex: 1,
                background: "transparent",
                pointerEvents: "none",
            }}
        >
            <LandingScene
                model1Ref={model1Ref}
                model2Ref={model2Ref}
                model3Ref={model3Ref}
                mouseRef={mouseRef}
                scrollRef={scrollRef}
            />
        </Canvas>
    );
}
