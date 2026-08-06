import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * FLAT, uniform, neutral image-based lighting.
 *
 * We deliberately do NOT use three's RoomEnvironment here: that environment
 * contains bright light panels which reflect off the guns as glossy hotspots /
 * glare — the "extra lighting" that washes out the asset's original look.
 *
 * Instead we build an even, single-tone environment (an inward box of one flat
 * colour). PBR materials still get just enough soft, uniform light to read at
 * their true authored colour and metals reflect an even neutral tone instead of
 * going black — but there are NO directional highlights and no studio glare.
 * The asset shows as-is.
 *
 * `tone` = the flat environment brightness (0..1). `intensity` scales the
 * overall exposure. Nudge either if the guns look too dark or too bright.
 */
export default function NeutralEnvironment({ intensity = 1, tone = 0.72 }) {
    const { gl, scene } = useThree();

    useEffect(() => {
        const pmrem = new THREE.PMREMGenerator(gl);

        const src = new THREE.Scene();
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(tone, tone, tone),
                side: THREE.BackSide,
            }),
        );
        src.add(box);

        const envTex = pmrem.fromScene(src, 0.04).texture;
        scene.environment = envTex;
        if ("environmentIntensity" in scene) scene.environmentIntensity = intensity;

        box.geometry.dispose();
        box.material.dispose();

        return () => {
            scene.environment = null;
            envTex.dispose();
            pmrem.dispose();
        };
    }, [gl, scene, intensity, tone]);

    return null;
}
