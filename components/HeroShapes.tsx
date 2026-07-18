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
  { position: [-2.2, 0.9, -0.5], color: "#8a63f0", scale: 0.75, speed: 0.3, offset: 0, kind: "icosahedron" },
  { position: [2.1, -0.6, -0.8], color: "#45cbaf", scale: 0.95, speed: 0.24, offset: 1.4, kind: "torus" },
  { position: [-1.4, -1.3, 0.4], color: "#f472a6", scale: 0.55, speed: 0.36, offset: 2.6, kind: "octahedron" },
  { position: [1.6, 1.4, 0.2], color: "#ffb86b", scale: 0.6, speed: 0.28, offset: 3.7, kind: "icosahedron" },
  { position: [0.1, -1.8, -0.3], color: "#7c9bff", scale: 0.7, speed: 0.2, offset: 1.1, kind: "torus" },
  { position: [2.6, 0.3, 0.6], color: "#a888ff", scale: 0.45, speed: 0.4, offset: 4.2, kind: "octahedron" },
];

function FloatingShape({ def }: { def: Shape }) {
  const mesh = useRef<THREE.Mesh>(null);
  const base = useMemo(() => new THREE.Vector3(...def.position), [def.position]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime() * def.speed + def.offset;
    mesh.current.position.y = base.y + Math.sin(t) * 0.3;
    mesh.current.position.x = base.x + Math.cos(t * 0.6) * 0.15;
    mesh.current.rotation.x = t * 0.4;
    mesh.current.rotation.y = t * 0.5;
  });

  const geometry =
    def.kind === "torus" ? (
      <torusGeometry args={[def.scale, def.scale * 0.38, 12, 32]} />
    ) : def.kind === "octahedron" ? (
      <octahedronGeometry args={[def.scale, 0]} />
    ) : (
      <icosahedronGeometry args={[def.scale, 0]} />
    );

  return (
    <mesh ref={mesh} position={def.position}>
      {geometry}
      <meshStandardMaterial color={def.color} roughness={0.35} metalness={0.15} wireframe={def.kind !== "torus"} />
    </mesh>
  );
}

function Scene({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const idle = state.clock.getElapsedTime() * 0.06;
    const targetY = idle + pointer.current.x * 0.35;
    const targetX = -pointer.current.y * 0.2;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.06);
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#eef1ff" />
      <pointLight position={[-3, -1, 2]} intensity={0.7} color="#8a63f0" />
      <pointLight position={[3, 2, -1]} intensity={0.6} color="#45cbaf" />
      {SHAPES.map((def, i) => (
        <FloatingShape key={i} def={def} />
      ))}
    </group>
  );
}

export default function HeroShapes() {
  const pointer = useRef({ x: 0, y: 0 });
  const orientationBound = useRef(false);

  function onPointerMove(e: React.PointerEvent) {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  }

  function bindOrientation() {
    if (orientationBound.current) return;
    orientationBound.current = true;

    function handleOrientation(e: DeviceOrientationEvent) {
      if (e.gamma === null || e.beta === null) return;
      pointer.current.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp((e.beta - 35) / 30, -1, 1);
    }

    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    if (typeof DOE?.requestPermission === "function") {
      DOE.requestPermission()
        .then((res) => {
          if (res === "granted") window.addEventListener("deviceorientation", handleOrientation);
        })
        .catch(() => {});
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }
  }

  return (
    <div
      className="absolute inset-0"
      onPointerMove={onPointerMove}
      onPointerDown={bindOrientation}
      onTouchStart={bindOrientation}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <Scene pointer={pointer} />
      </Canvas>
    </div>
  );
}
