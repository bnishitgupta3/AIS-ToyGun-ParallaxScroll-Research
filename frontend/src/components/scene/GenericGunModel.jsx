import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Generic parameterized gun model. Wrap in a <group ref={...}> in the parent.
 * Handles centering, normalizing size, and muzzle-flicker light when firing.
 */
export default function GenericGunModel({
    url,
    isFiring = false,
    onNozzleResolved,
    targetSize = 3.2,
}) {
    const { scene } = useGLTF(url);
    const muzzleLightRef = useRef();
    const nozzleAnchorRef = useRef(new THREE.Vector3(0, 0, 0));

    const cloned = useMemo(() => {
        const c = scene.clone(true);
        const box = new THREE.Box3().setFromObject(c);
        const center = new THREE.Vector3();
        box.getCenter(center);
        c.position.sub(center);

        const size = new THREE.Vector3();
        box.getSize(size);
        const longest = Math.max(size.x, size.y, size.z);
        c.scale.setScalar(targetSize / longest);

        const localBox = new THREE.Box3().setFromObject(c);
        nozzleAnchorRef.current.set(
            localBox.min.x,
            (localBox.min.y + localBox.max.y) / 2,
            (localBox.min.z + localBox.max.z) / 2,
        );

        c.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = false;
                o.receiveShadow = false;
                if (o.material) {
                    o.material.envMapIntensity = 0.9;
                    o.material.needsUpdate = true;
                }
            }
        });
        return c;
    }, [scene, targetSize]);

    useEffect(() => {
        if (onNozzleResolved) onNozzleResolved(nozzleAnchorRef.current.clone());
    }, [onNozzleResolved]);

    useFrame((_, dt) => {
        if (!muzzleLightRef.current) return;
        if (isFiring) {
            muzzleLightRef.current.intensity = 6 + Math.random() * 10;
        } else {
            muzzleLightRef.current.intensity = THREE.MathUtils.damp(
                muzzleLightRef.current.intensity,
                0,
                12,
                dt,
            );
        }
    });

    return (
        <>
            <primitive object={cloned} />
            <pointLight
                ref={muzzleLightRef}
                position={[
                    nozzleAnchorRef.current.x - 0.05,
                    nozzleAnchorRef.current.y,
                    nozzleAnchorRef.current.z,
                ]}
                color="#ff7a18"
                distance={3.5}
                decay={2}
                intensity={0}
            />
        </>
    );
}
