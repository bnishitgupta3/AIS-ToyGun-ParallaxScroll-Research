import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import WaterGunModel from "./WaterGunModel";
import WaterStream from "./WaterStream";

export default function WaterGunScene({ modelRef, isFiring }) {
    const [nozzle, setNozzle] = useState(new THREE.Vector3(-1.6, 0, 0));

    return (
        <Canvas
            camera={{ position: [0, 0.2, 6.2], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
            onCreated={() => {
                // eslint-disable-next-line no-console
                console.log("[scene] canvas created");
            }}
        >
            {/* Studio lighting */}
            <ambientLight intensity={1.4} />
            <directionalLight
                position={[5, 7, 6]}
                intensity={2.4}
                color="#ffffff"
            />
            <directionalLight
                position={[-6, 3, -2]}
                intensity={1.4}
                color="#cfe5ff"
            />
            <directionalLight
                position={[0, -3, 5]}
                intensity={0.9}
                color="#fff2e0"
            />
            <hemisphereLight args={["#ffffff", "#1a1a1a", 0.55]} />

            <group ref={modelRef}>
                <Suspense fallback={null}>
                    <WaterGunModel
                        isFiring={isFiring}
                        onNozzleResolved={(v) => {
                            // eslint-disable-next-line no-console
                            console.log("[scene] nozzle xyz", v.x, v.y, v.z);
                            setNozzle(v);
                        }}
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
