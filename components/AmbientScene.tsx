"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Shape = {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  offset: number;
  kind: "icosahedron" | "torus" | "octahedron";
};

const SHAPES: Shape[] = [
  { position: [-3.4, 1.6, -2], color: "#8a63f0", scale: 0.55, speed: 0.3, offset: 0, kind: "icosahedron" },
  { position: [3.2, -1.2, -3], color: "#45cbaf", scale: 0.7, speed: 0.24, offset: 1.4, kind: "torus" },
  { position: [-2.6, -2.2, -2.5], color: "#f472a6", scale: 0.4, speed: 0.36, offset: 2.6, kind: "octahedron" },
  { position: [2.6, 2.4, -3.4], color: "#ffb86b", scale: 0.45, speed: 0.28, offset: 3.7, kind: "icosahedron" },
  { position: [0.2, -3.1, -4], color: "#7c9bff", scale: 0.6, speed: 0.2, offset: 1.1, kind: "torus" },
];

function FloatingShape({ def }: { def: Shape }) {
  const mesh = useRef<THREE.Mesh>(null);
  const base = useMemo(() => new THREE.Vector3(...def.position), [def.position]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime() * def.speed + def.offset;
    mesh.current.position.y = base.y + Math.sin(t) * 0.4;
    mesh.current.position.x = base.x + Math.cos(t * 0.6) * 0.25;
    mesh.current.rotation.x = t * 0.3;
    mesh.current.rotation.y = t * 0.4;
  });

  const geometry =
    def.kind === "torus" ? (
      <torusGeometry args={[def.scale, def.scale * 0.35, 12, 32]} />
    ) : def.kind === "octahedron" ? (
      <octahedronGeometry args={[def.scale, 0]} />
    ) : (
      <icosahedronGeometry args={[def.scale, 0]} />
    );

  return (
    <mesh ref={mesh} position={def.position}>
      {geometry}
      <meshStandardMaterial
        color={def.color}
        transparent
        opacity={0.22}
        roughness={0.3}
        metalness={0.1}
        wireframe={def.kind !== "torus"}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} color="#eef1ff" />
      {SHAPES.map((def, i) => (
        <FloatingShape key={i} def={def} />
      ))}
    </>
  );
}

export default function AmbientScene() {
  return (
    <Canvas
      dpr={[1, 1.3]}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}
    >
      <Scene />
    </Canvas>
  );
}
