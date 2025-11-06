"use client";

import { useEffect, useRef, useState, Suspense, useMemo, memo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useGLTF, OrbitControls, Line } from "@react-three/drei";
import { Mesh, Vector3 } from "three";
import { useRouter } from "next/navigation";

interface Building3DProps {
  distributor: string;
}

useGLTF.preload("/models/soprema-building.glb");

type LabelSnapshot = { name: string; position: [number, number, number] };

const distributorLabels: Record<string, string[]> = {
  bayset: ["Roof", "Wall", "Foundation", "Civil"],
  allduro: ["Roof", "Wall", "Foundation", "Civil", "InternalWetArea"],
  enduroflex: ["Roof", "Wall", "Foundation", "Civil", "InternalWetArea"],
};

const labelCache = new Map<string, LabelSnapshot[]>();
const baseLabelPositions = new Map<string, [number, number, number]>();
const labelOffsets: Record<string, Vector3> = {
  roof: new Vector3(-1.05, 0.05, 0),
  wall: new Vector3(-0.65, 0.0, 0),
  internalwetarea: new Vector3(0, 0.05, 0),
  foundation: new Vector3(0.5, 0.05, 0.5),
  civil: new Vector3(-1.5, 0.05, 0.4),
};
const defaultOffset = new Vector3(0, 0, 0);
const leftLineOffset = new Vector3(-2.5, 0, 0);
const rightLineOffset = new Vector3(2.5, 0, 0);
const leftLabelShift = new Vector3(-0.05, 0, 0);
const rightLabelShift = new Vector3(0.05, 0, 0);

const displayNameMap: Record<string, string> = {
  roof: "Roof",
  wall: "Wall",
  internalwetarea: "Internal Wet Areas",
  foundation: "Foundation",
  civil: "Civil Works",
};

const Model = memo(function Model({
  distributor,
  onLabelExtract,
}: {
  distributor: string;
  onLabelExtract: (labels: { name: string; position: Vector3 }[]) => void;
}) {
  const gltf = useGLTF("/models/soprema-building.glb");
  const meshRefs = useRef<{ [name: string]: Mesh }>({});
  const extractedLabels: { name: string; position: Vector3 }[] = [];
  const allowedLabels = useMemo(
    () => distributorLabels[distributor] || [],
    [distributor]
  );

  useEffect(() => {
    let cached = labelCache.get(distributor);

    const ensureBasePositions = () => {
      if (baseLabelPositions.size > 0) return;
      const allLabels = new Set<string>(
        Object.values(distributorLabels).flat()
      );
      for (const label of allLabels) {
        const child = gltf.scene.getObjectByName(label) as Mesh | null;
        if (!child || !child.isMesh) continue;
        const pos = new Vector3();
        child.getWorldPosition(pos);
        baseLabelPositions.set(label, [pos.x, pos.y, pos.z]);
      }
    };

    const ensureShadows = () => {
      for (const label of allowedLabels) {
        const child = gltf.scene.getObjectByName(label) as Mesh | null;
        if (!child || !child.isMesh) continue;
        child.castShadow = true;
        child.receiveShadow = true;
        meshRefs.current[label] = child;
      }
    };

    if (!cached) {
      ensureBasePositions();
      const snapshot: LabelSnapshot[] = [];
      for (const label of allowedLabels) {
        const stored = baseLabelPositions.get(label);
        if (stored) {
          snapshot.push({ name: label, position: stored });
        } else {
          const child = gltf.scene.getObjectByName(label) as Mesh | null;
          if (!child || !child.isMesh) continue;
          const pos = new Vector3();
          child.getWorldPosition(pos);
          const array: [number, number, number] = [pos.x, pos.y, pos.z];
          baseLabelPositions.set(label, array);
          snapshot.push({ name: label, position: array });
        }
      }
      labelCache.set(distributor, snapshot);
      cached = snapshot;

      // Prime cache for other distributors using the shared base positions
      for (const [otherKey, labelsForKey] of Object.entries(distributorLabels)) {
        if (labelCache.has(otherKey)) continue;
        const otherSnapshot: LabelSnapshot[] = [];
        for (const label of labelsForKey) {
          const stored = baseLabelPositions.get(label);
          if (stored) {
            otherSnapshot.push({ name: label, position: stored });
          }
        }
        labelCache.set(otherKey, otherSnapshot);
      }
    }

    ensureShadows();

    if (cached) {
      onLabelExtract(
        cached.map((entry) => ({
          name: entry.name,
          position: new Vector3(
            entry.position[0],
            entry.position[1],
            entry.position[2]
          ),
        }))
      );
    }
  }, [allowedLabels, distributor, gltf.scene, onLabelExtract]);

  return <primitive object={gltf.scene} rotation={[0, Math.PI / 2, 0]} />;
});
Model.displayName = "Building3DModel";

export default function Building3D({ distributor }: Building3DProps) {
  const [labels, setLabels] = useState<{ name: string; position: Vector3 }[]>(() => {
    const cached = labelCache.get(distributor);
    if (!cached) return [];
    return cached.map((entry) => ({
      name: entry.name,
      position: new Vector3(entry.position[0], entry.position[1], entry.position[2]),
    }));
  });
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const router = useRouter();

  const applyLabels = useCallback(
    (incoming: { name: string; position: Vector3 }[]) => {
      setLabels((prev) => {
        if (prev.length === incoming.length) {
          let identical = true;
          for (let i = 0; i < prev.length; i += 1) {
            if (
              prev[i].name !== incoming[i].name ||
              !prev[i].position.equals(incoming[i].position)
            ) {
              identical = false;
              break;
            }
          }
          if (identical) return prev;
        }
        return incoming;
      });
    },
    []
  );

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
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [10, 10, 15], fov: 15 }}
      >
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
        <Suspense
          fallback={
            <Html center>
              <div style={{ color: "#6E7A86", fontSize: "18px" }}>
                Loading building...
              </div>
            </Html>
          }
        >
          <Model distributor={distributor} onLabelExtract={applyLabels} />
        </Suspense>

        {/* Labels */}
        {labels.map((label) => {
          const nameKey = label.name.toLowerCase();
          const isLeft =
            nameKey.includes("roof") ||
            nameKey.includes("wall") ||
            nameKey.includes("civil");

          const offset = labelOffsets[nameKey] || defaultOffset;
          const startPos = label.position.clone().add(offset);
          const lineEnd = startPos.clone().add(isLeft ? leftLineOffset : rightLineOffset);

          const displayName = displayNameMap[nameKey] || label.name;

          return (
            <group
              key={label.name}
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
                position={lineEnd.clone().add(isLeft ? leftLabelShift : rightLabelShift)}
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
