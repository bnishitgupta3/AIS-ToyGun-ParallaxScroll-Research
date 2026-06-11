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
export const GUN_SPACING = 12;   // X distance between adjacent guns
const DAMP_LAMBDA = 6.5;         // higher = snappier, lower = floatier (buttery sweet-spot)

/* ── Scene graph — must live inside <Canvas> ── */
function LandingScene({ model1Ref, model2Ref, model3Ref, mouseRef, scrollRef }) {
    /*
     * BUTTERY MOTION CORE
     * ───────────────────
     * GSAP no longer sets gun positions directly. Instead it writes two
     * normalized scalars into scrollRef every scroll tick:
     *   • entry   0→1  hero → arsenal entrance
     *   • arsenal 0→1  carousel progress while pinned
     *
     * Here, EVERY render frame (60fps), we compute each gun's target X and
     * damp toward it. THREE.MathUtils.damp is frame-rate independent, so the
     * guns glide on a smooth exponential curve regardless of how choppily
     * scroll events fire — no stutter, and they always converge EXACTLY on
     * centre (x = 0) when the scroll settles on a weapon.
     *
     * Target for gun i:
     *   x = i*SPACING  +  HERO_GUN_X*(1 - entry)  −  2*SPACING*arsenal
     *   ├─ hero (entry 0, arsenal 0): 0/12/24 shifted +2.4  → gun1 in right col
     *   ├─ arsenal start (entry 1, arsenal 0): 0/12/24       → gun1 centred
     *   ├─ arsenal mid   (arsenal 0.5): −12/0/12             → gun2 centred
     *   └─ arsenal end   (arsenal 1):   −24/−12/0            → gun3 centred
     */
    useFrame((_, dt) => {
        const guns = [model1Ref.current, model2Ref.current, model3Ref.current];
        if (!guns[0]) return;

        const s = scrollRef.current || { entry: 0, arsenal: 0 };
        const entry   = s.entry   || 0;
        const arsenal = s.arsenal || 0;
        const heroX   = HERO_GUN_X * (1 - entry);

        // clamp dt so a tab-switch frame-spike can't teleport the guns
        const d = Math.min(dt, 1 / 30);

        for (let i = 0; i < guns.length; i++) {
            const g = guns[i];
            if (!g) continue;
            const target = i * GUN_SPACING + heroX - 2 * GUN_SPACING * arsenal;
            g.position.x = THREE.MathUtils.damp(g.position.x, target, DAMP_LAMBDA, d);
        }

        /* Mouse-tilt only during the hero (model1 near centre, entry low) */
        const g1 = guns[0];
        if (entry < 0.4) {
            const m = mouseRef.current;
            g1.rotation.y = THREE.MathUtils.damp(g1.rotation.y,  m.x * 0.28, 4, d);
            g1.rotation.x = THREE.MathUtils.damp(g1.rotation.x, -m.y * 0.14, 4, d);
        } else {
            g1.rotation.y = THREE.MathUtils.damp(g1.rotation.y, 0, 4, d);
            g1.rotation.x = THREE.MathUtils.damp(g1.rotation.x, 0, 4, d);
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
