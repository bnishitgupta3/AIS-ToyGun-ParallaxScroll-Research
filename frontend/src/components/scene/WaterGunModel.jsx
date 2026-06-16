import { forwardRef, useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { asset } from "@/lib/asset";

const MODEL_URL = asset("/assets/watergun.glb");

/**
 * MP5K-UTG water gun model.
 * Exposes its outer Group via forwardRef so the parent (outside <Canvas/>)
 * can drive scroll-tied GSAP tweens on position / rotation / scale.
 */
const WaterGunModel = forwardRef(function WaterGunModel(
    { isFiring = false, onNozzleResolved },
    ref,
) {
    const { scene } = useGLTF(MODEL_URL);
    const muzzleLightRef = useRef();
    const nozzleAnchorRef = useRef(new THREE.Vector3(0, 0, 0));

    // Clone once so multiple mounts don't share state and so we can recenter.
    const cloned = useMemo(() => {
        const c = scene.clone(true);
        // Recenter geometry: compute bounding box, move to origin.
        const box = new THREE.Box3().setFromObject(c);
        const center = new THREE.Vector3();
        box.getCenter(center);
        c.position.sub(center);

        // Normalise size to ~3 units along longest axis.
        const size = new THREE.Vector3();
        box.getSize(size);
        const longest = Math.max(size.x, size.y, size.z);
        const targetSize = 3.2;
        const k = targetSize / longest;
        c.scale.setScalar(k);

        // Locate nozzle (assume leftmost X tip after recentering).
        const localBox = new THREE.Box3().setFromObject(c);
        nozzleAnchorRef.current.set(
            localBox.min.x,
            (localBox.min.y + localBox.max.y) / 2,
            (localBox.min.z + localBox.max.z) / 2,
        );

        // Improve material rendering.
        c.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = false;
                o.receiveShadow = false;
                if (o.material) {
                    o.material.envMapIntensity = 1.0;
                    o.material.needsUpdate = true;
                }
            }
        });
        return c;
    }, [scene]);

    useEffect(() => {
        if (onNozzleResolved) {
            onNozzleResolved(nozzleAnchorRef.current.clone());
        }
    }, [onNozzleResolved]);

    // Flickering muzzle light when firing.
    useFrame((_, dt) => {
        if (!muzzleLightRef.current) return;
        if (isFiring) {
            const flicker = 6 + Math.random() * 10;
            muzzleLightRef.current.intensity = flicker;
        } else {
            // ease down
            muzzleLightRef.current.intensity = THREE.MathUtils.damp(
                muzzleLightRef.current.intensity,
                0,
                12,
                dt,
            );
        }
    });

    return (
        <group ref={ref} dispose={null}>
            <primitive object={cloned} />
            <pointLight
                ref={muzzleLightRef}
                position={[
                    nozzleAnchorRef.current.x - 0.05,
                    nozzleAnchorRef.current.y,
                    nozzleAnchorRef.current.z,
                ]}
                color={"#ff7a18"}
                distance={3.5}
                decay={2}
                intensity={0}
            />
        </group>
    );
});

useGLTF.preload(MODEL_URL);

export default WaterGunModel;
