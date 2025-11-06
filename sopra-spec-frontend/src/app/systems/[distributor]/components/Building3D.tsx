"use client";

import {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, useGLTF } from "@react-three/drei";
import { Mesh, Vector3 } from "three";
import { useRouter } from "next/navigation";

export interface Building3DProps {
  distributor: string;
  onSelectArea?: (areaType: string) => void;
  allowedAreas?: string[];
  width?: number | string;
  height?: number | string;
}

useGLTF.preload("/models/soprema-building.glb");

type LabelSnapshot = { name: string; position: [number, number, number] };

const meshNameToAreaType: Record<string, string> = {
  Roof: "roof",
  Wall: "wall",
  Foundation: "foundation",
  Civil: "civil_work",
  InternalWetArea: "internal_wet_area",
};

const areaTypeToRouteSegment: Record<string, string> = {
  roof: "roof",
  wall: "wall",
  foundation: "foundation",
  civil_work: "civil-works",
  internal_wet_area: "internal-wet-areas",
};

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

const displayNameByAreaType: Record<string, string> = {
  roof: "Roof",
  wall: "Wall",
  foundation: "Foundation",
  civil_work: "Civil Works",
  internal_wet_area: "Internal Wet Areas",
};

function LabelAnnotations({
  labels,
  hoveredLabel,
  setHoveredLabel,
  onSelectArea,
  enabledAreas,
}: {
  labels: { name: string; position: Vector3 }[];
  hoveredLabel: string | null;
  setHoveredLabel: (label: string | null) => void;
  onSelectArea: (meshName: string) => void;
  enabledAreas: Set<string> | null;
}) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [invalidate, labels, enabledAreas]);

  return (
    <>
      {labels.map((label) => {
        const areaType = meshNameToAreaType[label.name] ?? "";
        const nameKey = label.name.toLowerCase();
        const isLeft =
          nameKey.includes("roof") ||
          nameKey.includes("wall") ||
          nameKey.includes("civil");

        const offset = labelOffsets[nameKey] ?? defaultOffset;
        const startPos = label.position.clone().add(offset);
        const lineEnd = startPos.clone().add(
          isLeft ? leftLineOffset : rightLineOffset
        );

        const displayName =
          displayNameByAreaType[areaType] ??
          label.name.replace(/([A-Z])/g, " $1").trim();

        const isEnabled = !enabledAreas || enabledAreas.has(areaType);
        const lineColor = isEnabled
          ? hoveredLabel === nameKey
            ? "#007bff"
            : "#6E7A86"
          : "#CBD5E1";
        const dotColor = isEnabled
          ? hoveredLabel === nameKey
            ? "#007bff"
            : "#6E7A86"
          : "#CBD5E1";

        return (
          <group
            key={label.name}
            onPointerOver={() => {
              if (isEnabled) setHoveredLabel(nameKey);
            }}
            onPointerOut={() => {
              if (isEnabled) setHoveredLabel(null);
            }}
          >
            <Line
              points={[startPos, lineEnd]}
              color={lineColor}
              lineWidth={4}
            />

            <mesh position={startPos}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial
                color={dotColor}
              />
            </mesh>

            <Html
              position={lineEnd.clone().add(isLeft ? leftLabelShift : rightLabelShift)}
              style={{
                pointerEvents: isEnabled ? "auto" : "none",
                whiteSpace: "nowrap",
                transform: isLeft ? "translateX(-70%)" : "translateX(-50%)",
              }}
            >
              <div
                onPointerEnter={() => {
                  if (isEnabled) setHoveredLabel(nameKey);
                }}
                onPointerLeave={() => {
                  if (isEnabled) setHoveredLabel(null);
                }}
                onClick={() => {
                  if (isEnabled) onSelectArea(label.name);
                }}
                style={{
                  cursor: isEnabled ? "pointer" : "default",
                  color: isEnabled
                    ? hoveredLabel === nameKey
                      ? "#007bff"
                      : "#6E7A86"
                    : "#CBD5E1",
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
    </>
  );
}

const Model = memo(function Model({
  distributor,
  onLabelExtract,
}: {
  distributor: string;
  onLabelExtract: (labels: { name: string; position: Vector3 }[]) => void;
}) {
  const gltf = useGLTF("/models/soprema-building.glb");
  const meshRefs = useRef<Record<string, Mesh>>({});

  const distributorKey = useMemo(() => distributor.toLowerCase(), [distributor]);
  const distributorLabelNames = useMemo(
    () => distributorLabels[distributorKey] ?? [],
    [distributorKey]
  );

  useEffect(() => {
    let cached = labelCache.get(distributorKey);

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
      for (const label of distributorLabelNames) {
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
      for (const label of distributorLabelNames) {
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
      labelCache.set(distributorKey, snapshot);
      cached = snapshot;

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
        cached.map(
          (entry) =>
            ({
              name: entry.name,
              position: new Vector3(
                entry.position[0],
                entry.position[1],
                entry.position[2]
              ),
            }) satisfies { name: string; position: Vector3 }
        )
      );
    }
  }, [distributorKey, distributorLabelNames, gltf.scene, onLabelExtract]);

  return <primitive object={gltf.scene} rotation={[0, Math.PI / 2, 0]} />;
});
Model.displayName = "Building3DModel";

export default function Building3D({
  distributor,
  onSelectArea,
  allowedAreas,
  width = "100vw",
  height = "100vh",
}: Building3DProps) {
  const router = useRouter();
  const distributorKey = useMemo(() => distributor.toLowerCase(), [distributor]);

  const enabledAreaTypes = useMemo(() => {
    if (!allowedAreas || allowedAreas.length === 0) return null;
    return new Set(allowedAreas.map((area) => area.toLowerCase()));
  }, [allowedAreas]);

  const initialLabels = useMemo(() => {
    const cached = labelCache.get(distributorKey);
    if (!cached) return [];
    return cached.map(
      (entry) =>
        ({
          name: entry.name,
          position: new Vector3(
            entry.position[0],
            entry.position[1],
            entry.position[2]
          ),
        }) satisfies { name: string; position: Vector3 }
    );
  }, [distributorKey]);

  const [labels, setLabels] = useState(initialLabels);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

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

  useEffect(() => {
    const cached = labelCache.get(distributorKey);
    if (!cached) return;
    applyLabels(
      cached.map(
        (entry) =>
          ({
            name: entry.name,
            position: new Vector3(
              entry.position[0],
              entry.position[1],
              entry.position[2]
            ),
          }) satisfies { name: string; position: Vector3 }
      )
    );
  }, [applyLabels, distributorKey]);

  const handleSelect = useCallback(
    (meshName: string) => {
      const areaType = meshNameToAreaType[meshName];
      if (!areaType) return;
      if (onSelectArea) {
        onSelectArea(areaType);
        return;
      }
      const routeSegment = areaTypeToRouteSegment[areaType];
      if (!routeSegment) return;
      router.push(`/systems/${distributorKey}/${routeSegment}`);
    },
    [distributorKey, onSelectArea, router]
  );

  const containerStyle = useMemo(() => {
    const resolvedWidth =
      typeof width === "number" ? `${width}px` : width ?? "100vw";
    const resolvedHeight =
      typeof height === "number" ? `${height}px` : height ?? "100vh";
    return { width: resolvedWidth, height: resolvedHeight };
  }, [height, width]);

  return (
    <div style={containerStyle}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [10, 10, 15], fov: 15 }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 15, 10]} intensity={3} castShadow />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3}
        />

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

        <LabelAnnotations
          labels={labels}
          hoveredLabel={hoveredLabel}
          setHoveredLabel={setHoveredLabel}
          onSelectArea={handleSelect}
          enabledAreas={enabledAreaTypes}
        />
     </Canvas>
   </div>
 );
}
