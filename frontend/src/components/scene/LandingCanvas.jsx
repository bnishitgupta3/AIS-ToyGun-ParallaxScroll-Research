import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
const DAMP_LAMBDA = 6.5;         // higher = snappier, lower = floatier (buttery sweet-spot)

/* ── Semicircular carousel geometry ──
   Guns orbit a circle in the X-Z plane. The slot at angle 0 is front-and-
   centre (highlighted, full size); neighbours sit on the arc — smaller,
   rotated, and pushed back. Scrolling sweeps every gun through the centre. */
const N            = 3;      // weapons
const SLOT_ANGLE   = 1.0;    // radians between adjacent slots (~57°)
const ARC_RADIUS   = 3.5;    // orbit radius (bigger = sparser side guns)
const ARC_DEPTH    = 3.4;    // how far side guns recede in Z
const SIDE_TURN    = 0.7;    // how much side guns rotate (narrows their silhouette)
const lerp = THREE.MathUtils.lerp;
const damp = THREE.MathUtils.damp;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* Per-gun focus → scale / opacity.
   f = max(cos φ, 0): 1 at front, 0 once a gun is ≥90° around the arc. */
const focusScale   = (f) => 0.3  + 0.7  * Math.pow(f, 1.4);  // 1.0 centre → 0.30 far side
const focusOpacity = (f) => 0.25 + 0.75 * Math.pow(f, 2.2);  // 1.0 centre → 0.25 far side

/* ── Scene graph — must live inside <Canvas> ── */
function LandingScene({ model1Ref, model2Ref, model3Ref, mouseRef, scrollRef }) {
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

        // clamp dt so a tab-switch frame-spike can't teleport the guns
        const d = Math.min(dt, 1 / 30);

        for (let i = 0; i < guns.length; i++) {
            const g = guns[i];
            if (!g) continue;

            /* — Carousel pose for slot i — */
            const phi  = (i - activePos) * SLOT_ANGLE;
            const cphi = Math.cos(phi);
            const focus = Math.max(cphi, 0);               // 1 front → 0 far side
            const cX   = Math.sin(phi) * ARC_RADIUS;
            const cZ   = (cphi - 1) * ARC_DEPTH;           // 0 at front, negative on sides
            const cS   = focusScale(focus);                // 1.0 front → 0.30 far side
            const cO   = focusOpacity(focus);              // 1.0 front → 0.25 far side
            const cRotY = phi * SIDE_TURN;                 // the "spin"

            /* — Hero pose (off to the right; only gun1 visible) — */
            const hX = i * GUN_SPACING + HERO_GUN_X;

            /* — Blend hero → carousel by entry — */
            const tX = lerp(hX, cX, entry);
            const tZ = lerp(0,  cZ, entry);
            const tS = lerp(1,  cS, entry);
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
