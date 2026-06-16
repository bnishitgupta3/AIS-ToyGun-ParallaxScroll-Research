import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { asset } from "@/lib/asset";
import NeutralEnvironment from "@/components/scene/NeutralEnvironment";

useGLTF.preload(asset("/assets/mp5k-dark.glb"));

/* The all-black teaser MP5K, centred + slowly auto-rotating. */
function DarkGun() {
    const { scene } = useGLTF(asset("/assets/mp5k-dark.glb"));
    const ref = useRef();

    const cloned = useMemo(() => {
        const c = scene.clone(true);
        const box = new THREE.Box3().setFromObject(c);
        const center = new THREE.Vector3();
        box.getCenter(center);
        c.position.sub(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const longest = Math.max(size.x, size.y, size.z);
        c.scale.setScalar(3.6 / longest);
        return c;
    }, [scene]);

    useFrame((_, dt) => {
        if (ref.current) ref.current.rotation.y += dt * 0.35; // teasing slow spin
    });

    return (
        <group ref={ref} rotation={[0.08, 0, 0]}>
            <primitive object={cloned} />
        </group>
    );
}

/**
 * Coming Soon centrepiece — the dark MP5K, spotlit against a dark backdrop
 * with a cool rim light so its edges and metal catch the light (reads as a
 * dark gun, not a flat black blob), slowly rotating.
 */
export default function ComingSoonGun() {
    return (
        <div className="pointer-events-none absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0.1, 6.6], fov: 42 }}
                dpr={[1, 2]}
                gl={{ alpha: true, toneMapping: THREE.NeutralToneMapping }}
                style={{ background: "transparent" }}
            >
                {/* Subtle reflections so the black metal isn't a void */}
                <NeutralEnvironment intensity={0.45} />
                {/* low ambient — keep it moody */}
                <ambientLight intensity={0.35} />
                {/* warm key from front-right */}
                <directionalLight position={[4, 5, 5]} intensity={2.6} color="#fff3e6" />
                {/* cool rim from back-left to catch the edges */}
                <directionalLight position={[-5, 1.5, -4]} intensity={2.4} color="#aac8ff" />
                {/* top spotlight for a studio feel */}
                <spotLight position={[0, 7, 3]} intensity={3} angle={0.5} penumbra={1} color="#ffffff" />
                <Suspense fallback={null}>
                    <DarkGun />
                </Suspense>
            </Canvas>
        </div>
    );
}
