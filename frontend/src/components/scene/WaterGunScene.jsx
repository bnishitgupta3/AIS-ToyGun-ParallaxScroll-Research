import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import WaterGunModel from "./WaterGunModel";
import WaterStream from "./WaterStream";
import NeutralEnvironment from "./NeutralEnvironment";

export default function WaterGunScene({ modelRef, isFiring }) {
    const [nozzle, setNozzle] = useState(new THREE.Vector3(-1.6, 0, 0));

    return (
        <Canvas
            camera={{ position: [0, 0.2, 6.2], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
            style={{ background: "transparent" }}
        >
            {/* Neutral, even lighting — shows the asset at its true brightness */}
            <NeutralEnvironment intensity={1.1} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[3, 6, 5]} intensity={0.5} color="#ffffff" />

            <Suspense fallback={null}>
                <group ref={modelRef}>
                    <WaterGunModel
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
