"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useGLTF, OrbitControls, Line } from "@react-three/drei";
import { Mesh, Vector3 } from "three";
import { useRouter } from "next/navigation";

interface Building3DProps {
    distributor: string;
}

function Model({ distributor, onLabelExtract }: { distributor: string; onLabelExtract: (labels: { name: string; position: Vector3 }[]) => void }) {
    const gltf = useGLTF("/models/soprema-building.glb");
    const meshRefs = useRef<{ [name: string]: Mesh }>({});
    const extractedLabels: { name: string; position: Vector3 }[] = [];

    useEffect(() => {
        const distributorLabels: Record<string, string[]> = {
            bayset: ["Roof", "Wall", "Foundation", "Civil"],
            allduro: ["Roof", "Wall", "Foundation", "Civil", "InternalWetArea"],
            enduroflex: ["Roof", "Wall", "Foundation", "Civil", "InternalWetArea"],
        };

        const allowedLabels = distributorLabels[distributor] || [];

        gltf.scene.traverse((child: any) => {
            if (child.isMesh && allowedLabels.includes(child.name)) {
                child.castShadow = true;
                child.receiveShadow = true;
                meshRefs.current[child.name] = child;

                const pos = new Vector3();
                child.getWorldPosition(pos);
                extractedLabels.push({ name: child.name, position: pos });
            }
        });

        onLabelExtract(extractedLabels);
    }, [distributor, gltf.scene]);

    return <primitive object={gltf.scene} rotation={[0, Math.PI / 2, 0]} />;
}

export default function Building3D({ distributor }: Building3DProps) {
    const [labels, setLabels] = useState<{ name: string; position: Vector3 }[]>([]);
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
    const router = useRouter();

    const handleSelect = (meshName: string) => {
        const keyMap: Record<string, string> = {
            Roof: "roof",
            Wall: "wall",
            InternalWetArea: "internal-wet-areas",
            Foundation: "foundation",
            Civil: "civil-works",
        };

        const areaKey = keyMap[meshName];
        if (!areaKey) return;
        router.push(`/systems/${distributor}/${areaKey}`);
    };

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas shadows camera={{ position: [10, 10, 15], fov: 15 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[10, 15, 10]} intensity={3} castShadow />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 3}
                />

                {/* Load GLB model once */}
                <Suspense fallback={null}>
                    <Model distributor={distributor} onLabelExtract={setLabels} />
                </Suspense>

                {/* Labels */}
                {labels.map((label, index) => {
                    const nameKey = label.name.toLowerCase();
                    const isLeft = nameKey.includes("roof") || nameKey.includes("wall") || nameKey.includes("civil");

                    const labelOffsets: { [key: string]: Vector3 } = {
                        roof: new Vector3(-1.05, 0.05, 0),
                        wall: new Vector3(-0.65, 0.0, 0),
                        internalwetarea: new Vector3(0, 0.05, 0),
                        foundation: new Vector3(0.5, 0.05, 0.5),
                        civil: new Vector3(-1.5, 0.05, 0.4),
                    };

                    const offset = labelOffsets[nameKey] || new Vector3(0, 0, 0);
                    const startPos = label.position.clone().add(offset);
                    const lineEnd = startPos.clone().add(new Vector3(isLeft ? -2.5 : 2.5, 0, 0));

                    const displayNameMap: { [key: string]: string } = {
                        roof: "Roof",
                        wall: "Wall",
                        internalwetarea: "Internal Wet Areas",
                        foundation: "Foundation",
                        civil: "Civil Works",
                    };
                    const displayName = displayNameMap[nameKey] || label.name;

                    return (
                        <group
                            key={index}
                            onPointerOver={() => setHoveredLabel(nameKey)}
                            onPointerOut={() => setHoveredLabel(null)}
                        >
                            {/* Line */}
                            <Line
                                points={[startPos, lineEnd]}
                                color={hoveredLabel === nameKey ? "#007bff" : "#6E7A86"}
                                lineWidth={4}
                            />

                            {/* Dot */}
                            <mesh position={startPos}>
                                <sphereGeometry args={[0.05, 16, 16]} />
                                <meshStandardMaterial
                                    color={hoveredLabel === nameKey ? "#007bff" : "#6E7A86"}
                                />
                            </mesh>

                            {/* Clickable label */}
                            <Html
                                position={lineEnd.clone().add(new Vector3(isLeft ? -0.05 : 0.05, 0, 0))}
                                style={{
                                    pointerEvents: "auto",
                                    whiteSpace: "nowrap",
                                    transform: isLeft ? "translateX(-70%)" : "translateX(-50%)",
                                }}
                            >
                                <div
                                    onPointerEnter={() => setHoveredLabel(nameKey)}
                                    onPointerLeave={() => setHoveredLabel(null)}
                                    onClick={() => handleSelect(label.name)}
                                    style={{
                                        cursor: "pointer",
                                        color: hoveredLabel === nameKey ? "#007bff" : "#6E7A86",
                                        fontSize: "25px",
                                        fontWeight: 600,
                                        background: "none",
                                        padding: 0,
                                        margin: 0,
                                        textAlign: isLeft ? "right" : "left",
                                    }}
                                >
                                    {displayName}
                                </div>
                            </Html>
                        </group>
                    );
                })}
            </Canvas>
        </div>
    );
}
