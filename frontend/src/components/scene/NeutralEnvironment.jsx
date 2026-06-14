import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Soft, even, NEUTRAL image-based lighting — generated procedurally from
 * three's RoomEnvironment (no HDR download, no dramatic coloured studio
 * reflections). This makes PBR / metal materials read at their true,
 * authored brightness — the way a glTF viewer shows the asset "as is" —
 * instead of going dark with no environment to reflect.
 */
export default function NeutralEnvironment({ intensity = 1 }) {
    const { gl, scene } = useThree();

    useEffect(() => {
        const pmrem = new THREE.PMREMGenerator(gl);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envTex;
        if ("environmentIntensity" in scene) scene.environmentIntensity = intensity;

        return () => {
            scene.environment = null;
            envTex.dispose();
            pmrem.dispose();
        };
    }, [gl, scene, intensity]);

    return null;
}
