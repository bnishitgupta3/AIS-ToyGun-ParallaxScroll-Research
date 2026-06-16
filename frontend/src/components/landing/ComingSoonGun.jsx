import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { asset } from "@/lib/asset";

useGLTF.preload(asset("/assets/mp5k-dark.glb"));

/* The MP5K rendered as a flat, UNLIT silhouette — pure shadow, no detail
   revealed — slowly auto-rotating. */
function GunSilhouette() {
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
        c.scale.setScalar(3.7 / longest);

        // Force every surface to a flat dark, unlit material → silhouette only.
        const sil = new THREE.MeshBasicMaterial({ color: 0x121316, toneMapped: false });
        c.traverse((o) => {
            if (o.isMesh) o.material = sil;
        });
        return c;
    }, [scene]);

    useFrame((state, dt) => {
        if (!ref.current) return;
        ref.current.rotation.y += dt * 0.32; // teasing slow spin

        /* Fit-to-viewport: on narrow / portrait screens shrink the gun so it
           doesn't overflow and swallow the whole page (desktop stays full). */
        const aspect = state.size.width / Math.max(1, state.size.height);
        const halfX = Math.tan((42 * Math.PI) / 180 / 2) * 6.6 * aspect; // half-width at z=0
        const fit = Math.min(1, (halfX * 0.82) / 1.9); // 1.9 ≈ gun half-length
        ref.current.scale.setScalar(fit);
    });

    return (
        <group ref={ref} rotation={[0.08, 0, 0]}>
            <primitive object={cloned} />
        </group>
    );
}

/**
 * Coming Soon centrepiece — a rotating dark SILHOUETTE of the MP5K (shape
 * only, no details). Unlit, so no lighting is needed.
 */
export default function ComingSoonGun() {
    return (
        <div className="pointer-events-none absolute inset-0 z-[1]">
            <Canvas
                camera={{ position: [0, 0.1, 6.6], fov: 42 }}
                dpr={[1, 2]}
                gl={{ alpha: true }}
                style={{ background: "transparent" }}
            >
                <Suspense fallback={null}>
                    <GunSilhouette />
                </Suspense>
            </Canvas>
        </div>
    );
}
