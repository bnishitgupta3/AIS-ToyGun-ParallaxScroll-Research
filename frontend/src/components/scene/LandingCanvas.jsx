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

/* ── Scene graph — must live inside <Canvas> ── */
function LandingScene({ model1Ref, model2Ref, model3Ref, mouseRef }) {
    useFrame(() => {
        const g1 = model1Ref.current;
        if (!g1) return;
        /* Mouse tracking only while model1 is near centre (hero state) */
        if (Math.abs(g1.position.x) < 2.5) {
            const m = mouseRef.current;
            g1.rotation.y = THREE.MathUtils.lerp(g1.rotation.y, m.x * 0.28, 0.04);
            g1.rotation.x = THREE.MathUtils.lerp(g1.rotation.x, -m.y * 0.14, 0.04);
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

            {/* HDRI environment — drives photoreal metal/plastic reflections.
                Wrapped in its own Suspense so the rest of the scene isn't
                gated by HDR download. */}
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

            {/* Invisible floor plane — receives cast shadows so the
                ContactShadows layer reads cleanly on the dark stage. */}
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

export default function LandingCanvas({ model1Ref, model2Ref, model3Ref, mouseRef }) {
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
            />
        </Canvas>
    );
}
