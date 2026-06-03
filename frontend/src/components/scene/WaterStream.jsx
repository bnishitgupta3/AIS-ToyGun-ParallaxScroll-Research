import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Particle "water stream" emitted from a local nozzle point.
 * Particles travel along local -X (the nozzle direction) with gentle spread.
 */
export default function WaterStream({ origin, active }) {
    const COUNT = 220;
    const meshRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const arr = [];
        for (let i = 0; i < COUNT; i++) {
            arr.push({
                life: Math.random(),
                speed: 4 + Math.random() * 3,
                spreadY: (Math.random() - 0.5) * 0.18,
                spreadZ: (Math.random() - 0.5) * 0.18,
                size: 0.12 + Math.random() * 0.14,
            });
        }
        return arr;
    }, []);

    useFrame((_, dt) => {
        if (!meshRef.current) return;
        // Debug: log once when active flips
        if (active && !meshRef.current.__activeLogged) {
            // eslint-disable-next-line no-console
            console.log("[stream] active frame, origin=", origin.x, origin.y, origin.z);
            meshRef.current.__activeLogged = true;
        }
        if (!active) {
            meshRef.current.__activeLogged = false;
        }
        for (let i = 0; i < COUNT; i++) {
            const p = particles[i];
            if (active) {
                p.life += dt * 1.6;
                if (p.life > 1) p.life -= 1;
            } else {
                p.life = Math.min(1, p.life + dt * 2);
            }
            const t = p.life;
            // local axis: -X is nozzle direction
            const x = origin.x - 0.4 - t * p.speed;
            const y = origin.y + p.spreadY * (1 + t * 4);
            const z = origin.z + p.spreadZ * (1 + t * 4);
            const fade = active ? 1 - t : Math.max(0, 1 - t * 2);
            dummy.position.set(x, y, z);
            const s = p.size * (0.4 + fade * 0.6);
            dummy.scale.setScalar(s);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.visible = active;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, COUNT]}
            frustumCulled={false}
        >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
                color="#38bdf8"
                emissive="#0ea5e9"
                emissiveIntensity={1.2}
                roughness={0.15}
                metalness={0.1}
                transparent
                opacity={0.95}
            />
        </instancedMesh>
    );
}
