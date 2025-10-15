"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useGLTF, OrbitControls } from "@react-three/drei";
import { Mesh, Vector3 } from "three";
import { useRouter } from "next/navigation";

function Model() {
    const gltf = useGLTF("/models/soprema-building.glb");
    return <primitive object={gltf.scene} rotation={[0, Math.PI / 2, 0]} />;
}

interface Building3DProps {
    distributor: string;
}

export default function Building3D({ distributor }: Building3DProps) {
    const gltf = useGLTF("/models/soprema-building.glb");
    const meshRefs = useRef<{ [name: string]: Mesh }>({});
    const [labels, setLabels] = useState<{ name: string; position: Vector3 }[]>([]);
    const router = useRouter();

    // Define allowed labels per distributor
    const distributorLabels: Record<string, string[]> = {
        bayset: ["Roof", "Wall", "Foundation", "Bridge"], // no InternalWetArea
        allduro: ["Roof", "Wall", "Foundation", "Bridge", "InternalWetArea"],
        enduroflex: ["Roof", "Wall", "Foundation", "Bridge", "InternalWetArea"],
    };

    const allowedLabels = distributorLabels[distributor] || [];
    const extractedLabels: { name: string; position: Vector3 }[] = [];

    useEffect(() => {
        gltf.scene.traverse((child: any) => {
            if (child.isMesh && allowedLabels.includes(child.name)) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.needsUpdate = true;

                meshRefs.current[child.name] = child;

                const pos = new Vector3();
                child.getWorldPosition(pos);
                extractedLabels.push({ name: child.name, position: pos });
            }
        });

        setLabels(extractedLabels);
    }, [distributor, gltf.scene]);

    const handleSelect = (meshName: string) => {
        const keyMap: Record<string, string> = {
            Roof: "roof",
            Wall: "wall",
            InternalWetArea: "internal-wet-areas", // check this matches your mesh name
            Foundation: "foundation",
            Bridge: "civil-works",
        };

        const areaKey = keyMap[meshName];
        if (!areaKey) {
            console.warn("No mapping for mesh:", meshName);
            return;
        }

        // navigate to systemTree page
        router.push(`/systems/${distributor}/${areaKey}`);
    };

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas shadows camera={{ position: [10, 8, 15], fov: 15 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[10, 15, 10]} intensity={2} castShadow />
                <OrbitControls enableZoom={false} enablePan={false} />
                
                {/* GLB model */}
                <Suspense fallback={null}>
                    <Model />
                </Suspense>

                {labels.map((label, i) => (
                    <Html
                        key={`${label.name}-${i}`} 
                        position={label.position.toArray()}
                        center
                        style={{ pointerEvents: "auto" }}
                    >
                        <div
                            style={{
                                cursor: "pointer",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                padding: "2px 4px",
                                borderRadius: 4,
                                fontWeight: "bold",
                                color: "white",
                                textAlign: "center",
                            }}
                            onClick={() => handleSelect(label.name)}
                        >
                            {label.name}
                        </div>
                    </Html>
                ))}
            </Canvas>
        </div>
    );
}