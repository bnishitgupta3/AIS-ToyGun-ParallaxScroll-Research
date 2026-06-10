import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import GenericGunModel from "./GenericGunModel";
import WaterStream from "./WaterStream";

/**
 * Self-contained Canvas for individual product showcase pages.
 * Premium lighting: HDRI environment + grounded contact shadows.
 */
export default function GenericGunScene({ modelRef, modelUrl, isFiring }) {
    const [nozzle, setNozzle] = useState(new THREE.Vector3(-1.6, 0, 0));

    return (
        <Canvas
            shadows
            camera={{ position: [0, 0.2, 6.2], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            {/* Soft fill so HDRI reflections aren't the only signal */}
            <ambientLight intensity={0.35} />
            <directionalLight
                position={[5, 7, 6]}
                intensity={1.6}
                color="#ffffff"
                castShadow
            />
            <directionalLight position={[-6, 3, -2]} intensity={0.6} color="#cfe5ff" />

            <Suspense fallback={null}>
                {/* Photorealistic HDRI — drives metal/plastic reflections */}
                <Environment preset="studio" background={false} />

                <group ref={modelRef}>
                    <GenericGunModel
                        url={modelUrl}
                        isFiring={isFiring}
                        onNozzleResolved={setNozzle}
                    />
                    <WaterStream origin={nozzle} active={isFiring} />
                </group>
            </Suspense>

            <ContactShadows
                position={[0, -1.6, 0]}
                resolution={1024}
                scale={10}
                blur={2}
                opacity={0.5}
                far={10}
                color="#000000"
            />
        </Canvas>
    );
}
