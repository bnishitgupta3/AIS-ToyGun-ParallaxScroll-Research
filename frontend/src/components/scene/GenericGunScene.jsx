import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import GenericGunModel from "./GenericGunModel";
import WaterStream from "./WaterStream";

/**
 * Self-contained Canvas for individual product showcase pages.
 * Mirrors WaterGunScene but accepts a modelUrl prop.
 */
export default function GenericGunScene({ modelRef, modelUrl, isFiring }) {
    const [nozzle, setNozzle] = useState(new THREE.Vector3(-1.6, 0, 0));

    return (
        <Canvas
            camera={{ position: [0, 0.2, 6.2], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            <ambientLight intensity={1.4} />
            <directionalLight position={[5, 7, 6]} intensity={2.4} color="#ffffff" />
            <directionalLight position={[-6, 3, -2]} intensity={1.4} color="#cfe5ff" />
            <directionalLight position={[0, -3, 5]} intensity={0.9} color="#fff2e0" />
            <hemisphereLight args={["#ffffff", "#1a1a1a", 0.55]} />

            <group ref={modelRef}>
                <Suspense fallback={null}>
                    <GenericGunModel
                        url={modelUrl}
                        isFiring={isFiring}
                        onNozzleResolved={setNozzle}
                    />
                </Suspense>
                <WaterStream origin={nozzle} active={isFiring} />
            </group>

            <ContactShadows
                position={[0, -1.6, 0]}
                opacity={0.35}
                scale={10}
                blur={2.6}
                far={3}
                color="#0a0a0a"
            />
        </Canvas>
    );
}
