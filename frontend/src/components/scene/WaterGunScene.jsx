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
            dpr={[1, 1.5]}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
                toneMapping: THREE.NeutralToneMapping,
            }}
            style={{ background: "transparent" }}
        >
            {/* Neutral IBL only — shows the asset at its true brightness with
                no added key/fill light (no extra highlights or hotspots). */}
            <NeutralEnvironment intensity={1.1} />

            {/* The ref'd group is OUTSIDE Suspense so it mounts immediately —
                the scroll-timeline/pin builds right away instead of waiting for
                the ~7 MB model to download (which locked scrolling for seconds
                on the MP5K page). The model itself streams into the already-
                parked group via the inner Suspense once it resolves. */}
            <group ref={modelRef}>
                <Suspense fallback={null}>
                    <WaterGunModel
                        isFiring={isFiring}
                        onNozzleResolved={setNozzle}
                    />
                    <WaterStream origin={nozzle} active={isFiring} />
                </Suspense>
            </group>

            <ContactShadows
                position={[0, -1.6, 0]}
                resolution={512}
                scale={10}
                blur={2}
                opacity={0.5}
                far={10}
                color="#000000"
            />
        </Canvas>
    );
}
