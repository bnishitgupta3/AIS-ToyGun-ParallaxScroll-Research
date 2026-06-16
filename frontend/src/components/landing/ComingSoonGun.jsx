import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { asset } from "@/lib/asset";

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
        c.scale.setScalar(3.0 / longest);
        return c;
    }, [scene]);

    useFrame((_, dt) => {
        if (ref.current) ref.current.rotation.y += dt * 0.35; // teasing slow spin
    });

    return (
        <group ref={ref} rotation={[0.05, 0, 0]}>
            <primitive object={cloned} />
        </group>
    );
}

/**
 * Background teaser for the Coming Soon page — the dark MP5K silhouette
 * rotating slowly behind the copy. Fixed/absolute, non-interactive.
 */
export default function ComingSoonGun() {
    return (
        <div className="pointer-events-none absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0.1, 7], fov: 40 }}
                dpr={[1, 2]}
                gl={{ alpha: true }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.7} />
                <directionalLight position={[4, 6, 5]} intensity={1.2} color="#ffffff" />
                <directionalLight position={[-5, 2, -3]} intensity={0.4} color="#ffffff" />
                <Suspense fallback={null}>
                    <DarkGun />
                </Suspense>
            </Canvas>
        </div>
    );
}
