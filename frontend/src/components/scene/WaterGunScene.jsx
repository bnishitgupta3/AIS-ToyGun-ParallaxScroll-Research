import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import WaterGunModel from "./WaterGunModel";
import WaterStream from "./WaterStream";

export default function WaterGunScene({ modelRef, isFiring }) {
    const [nozzle, setNozzle] = useState(new THREE.Vector3(-1.6, 0, 0));

    return (
        <Canvas
            shadows
            camera={{ position: [0, 0.2, 6.2], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            <ambientLight intensity={0.35} />
            <directionalLight
                position={[5, 7, 6]}
                intensity={1.6}
                color="#ffffff"
                castShadow
            />
            <directionalLight position={[-6, 3, -2]} intensity={0.6} color="#cfe5ff" />

            <Suspense fallback={null}>
                <Environment preset="studio" background={false} />

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
