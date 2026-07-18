"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type PageDef = {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  color: string;
  opacity: number;
  floatSpeed: number;
  floatOffset: number;
};

const PAGES: PageDef[] = [
  { position: [-1.5, 0.4, -0.6], rotation: [0.1, 0.5, -0.15], size: [1.7, 2.2], color: "#8a63f0", opacity: 0.55, floatSpeed: 0.5, floatOffset: 0 },
  { position: [0.9, -0.5, -0.2], rotation: [-0.08, -0.35, 0.12], size: [1.9, 2.5], color: "#45cbaf", opacity: 0.5, floatSpeed: 0.42, floatOffset: 1.6 },
  { position: [-0.4, -0.9, 0.6], rotation: [0.15, 0.15, -0.05], size: [1.5, 2.0], color: "#7c9bff", opacity: 0.45, floatSpeed: 0.6, floatOffset: 3.1 },
  { position: [1.7, 0.9, 0.3], rotation: [-0.12, -0.2, 0.08], size: [1.3, 1.7], color: "#ffb86b", opacity: 0.5, floatSpeed: 0.46, floatOffset: 2.2 },
  { position: [0.1, 1.1, -0.9], rotation: [0.05, 0.3, 0.05], size: [1.6, 2.1], color: "#f472a6", opacity: 0.42, floatSpeed: 0.38, floatOffset: 4.4 },
  { position: [-1.9, -0.7, 0.1], rotation: [-0.1, -0.15, -0.1], size: [1.2, 1.6], color: "#a888ff", opacity: 0.4, floatSpeed: 0.55, floatOffset: 0.8 },
  { position: [2.1, -1.3, -1.2], rotation: [0.08, -0.1, 0.15], size: [1.1, 1.4], color: "#24a68d", opacity: 0.4, floatSpeed: 0.48, floatOffset: 2.9 },
  { position: [-0.8, 1.6, -1.4], rotation: [-0.05, 0.25, -0.1], size: [1.3, 1.6], color: "#e14f87", opacity: 0.38, floatSpeed: 0.33, floatOffset: 1.9 },
];

function Page({ def, index }: { def: PageDef; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const base = useMemo(() => new THREE.Vector3(...def.position), [def.position]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime() * def.floatSpeed + def.floatOffset;
    mesh.current.position.y = base.y + Math.sin(t) * 0.18;
    mesh.current.position.x = base.x + Math.cos(t * 0.7) * 0.08;
    mesh.current.rotation.z = def.rotation[2] + Math.sin(t * 0.5) * 0.05;
  });

  return (
    <RoundedBox
      ref={mesh}
      args={[def.size[0], def.size[1], 0.04]}
      radius={0.08}
      smoothness={4}
      position={def.position}
      rotation={def.rotation}
    >
      <meshStandardMaterial
        color={def.color}
        transparent
        opacity={def.opacity}
        roughness={0.4}
        metalness={0.05}
      />
    </RoundedBox>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const { pointer } = state;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.28, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.18, 0.04);
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#eef1ff" />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color="#8a63f0" />
      <pointLight position={[3, 2, -1]} intensity={0.6} color="#45cbaf" />
      {PAGES.map((def, i) => (
        <Page key={i} def={def} index={i} />
      ))}
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Scene />
    </Canvas>
  );
}
