import { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    useGLTF,
    Environment,
    ContactShadows,
    Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import GenericGunModel from "./GenericGunModel";

/* Pre-warm all three models so Arsenal transitions feel instant */
useGLTF.preload("/assets/watergun.glb");
useGLTF.preload("/assets/m416-watergun.glb");
useGLTF.preload("/assets/crimson-blaster.glb");

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

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/* ── Responsive layout from viewport aspect ──
   Narrow / portrait screens shrink the ring + the guns and bring the hero
   gun toward centre & lower, so the carousel always fits and the hero gun
   doesn't collide with the stacked mobile text. Wide desktops get the full
   ARC_RADIUS / full-size guns / right-column hero gun. */
function responsiveLayout(width, height) {
    const aspect = (width || 1) / (height || 1);
    return {
        radius: clamp(aspect * 2.6, 1.7, ARC_RADIUS),
        depth:  clamp(aspect * 1.9, 1.4, ARC_DEPTH),
        scale:  clamp(aspect * 0.78, 0.52, 1.0),
        heroX:  clamp((aspect - 0.78) * 3.2, 0, 1) * HERO_GUN_X,
        heroY:  -clamp((0.95 - aspect) * 2.2, 0, 1) * 1.15,  // gun lower on mobile hero
    };
}

/* ── Scene graph — must live inside <Canvas> ── */
function LandingScene({ model1Ref, model2Ref, model3Ref, mouseRef, scrollRef }) {
    const { size } = useThree();
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
            const tS = lerp(1,  cS, entry) * R.scale;      // shrink whole rig on small screens
            const tO = lerp(1,  cO, entry);  // fully opaque in hero, fades on the arc
            let   tRotY = lerp(0, cRotY, entry);
            let   tRotX = 0;

            /* Hero mouse-tilt on the focused gun1, fading out as we enter */
            if (i === 0) {
                tRotY += (1 - entry) * (m.x * 0.28);
                tRotX  = (1 - entry) * (-m.y * 0.14);
            }

            /* — Damp every channel for buttery motion — */
            g.position.x = damp(g.position.x, tX, DAMP_LAMBDA, d);
            g.position.y = damp(g.position.y, tY, DAMP_LAMBDA, d);
            g.position.z = damp(g.position.z, tZ, DAMP_LAMBDA, d);
            g.rotation.y = damp(g.rotation.y, tRotY, DAMP_LAMBDA, d);
            g.rotation.x = damp(g.rotation.x, tRotX, DAMP_LAMBDA, d);
            const ns = damp(g.scale.x, tS, DAMP_LAMBDA, d);
            g.scale.setScalar(ns);

            /* — Fade the non-focused guns (like the 40% thumbnails) — */
            const op = damp(g.userData.op ?? 1, tO, DAMP_LAMBDA, d);
            g.userData.op = op;
            g.traverse((o) => {
                if (o.isMesh && o.material) {
                    const mats = Array.isArray(o.material) ? o.material : [o.material];
                    for (let k = 0; k < mats.length; k++) mats[k].opacity = op;
                }
            });
        }
    });

    return (
        <>
            {/* Dramatic dark-background studio lighting */}
            <ambientLight intensity={0.25} />
            <directionalLight position={[0, 8, 5]}   intensity={2.6} color="#ffffff" castShadow />
            <directionalLight position={[-7, 2, -2]}  intensity={0.9} color="#3a8fff" />
            <directionalLight position={[7, -1, 3]}   intensity={0.6} color="#ff6b35" />
            <spotLight position={[2, 10, 6]} intensity={4.2} angle={0.38} penumbra={0.85} color="#ffffff" />

            {/* HDRI environment — drives photoreal metal/plastic reflections. */}
            <Suspense fallback={null}>
                <Environment preset="studio" background={false} />
            </Suspense>

            {/* Slow, out-of-focus particles behind the guns — premium depth */}
            <Sparkles
                position={[0, 0, -4]}
                count={50}
                scale={12}
                size={2}
                speed={0.2}
                opacity={0.2}
                color="#ffffff"
            />

            {/* Product 1 – MP5K-UTG  (hero + arsenal slot 0) */}
            <group ref={model1Ref}>
                <Suspense fallback={null}>
                    <GenericGunModel url="/assets/watergun.glb" targetSize={2.8} />
                </Suspense>
            </group>

            {/* Product 2 – M416 Water X  (arsenal slot 1) */}
            <group ref={model2Ref}>
                <Suspense fallback={null}>
                    <GenericGunModel url="/assets/m416-watergun.glb" targetSize={2.8} />
                </Suspense>
            </group>

            {/* Product 3 – Crimson Blaster  (arsenal slot 2) */}
            <group ref={model3Ref}>
                <Suspense fallback={null}>
                    <GenericGunModel url="/assets/crimson-blaster.glb" targetSize={2.8} />
                </Suspense>
            </group>

            {/* Invisible floor plane — receives cast shadows */}
            <mesh
                position={[0, -1.61, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[60, 60]} />
                <shadowMaterial transparent opacity={0.4} />
            </mesh>

            {/* Grounded contact shadow under the active model area */}
            <ContactShadows
                position={[0, -1.6, 0]}
                resolution={1024}
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
    return (
        <Canvas
            camera={{ position: [0, 0.15, 7.5], fov: 40 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100%", height: "100%",
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
