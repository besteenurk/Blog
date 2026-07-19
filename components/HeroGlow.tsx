"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PALETTE = [
  new THREE.Color("#8a63f0"),
  new THREE.Color("#7c9bff"),
  new THREE.Color("#45cbaf"),
  new THREE.Color("#f472a6"),
];

function buildKnotPoints(p: number, q: number, radius: number, tube: number, segments: number, radialSeg: number) {
  const geo = new THREE.TorusKnotGeometry(radius, tube, segments, radialSeg, p, q);
  const posAttr = geo.getAttribute("position");
  const count = posAttr.count;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = posAttr.getX(i);
    positions[i * 3 + 1] = posAttr.getY(i);
    positions[i * 3 + 2] = posAttr.getZ(i);

    const t = i / count;
    const scaled = t * (PALETTE.length - 1);
    const idx = Math.floor(scaled) % PALETTE.length;
    const next = (idx + 1) % PALETTE.length;
    const c = PALETTE[idx].clone().lerp(PALETTE[next], scaled - idx);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.dispose();
  return { positions, colors };
}

function GlowKnot({
  p,
  q,
  radius,
  tube,
  size,
  speed,
  direction,
  opacity,
}: {
  p: number;
  q: number;
  radius: number;
  tube: number;
  size: number;
  speed: number;
  direction: 1 | -1;
  opacity: number;
}) {
  const points = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => buildKnotPoints(p, q, radius, tube, 180, 14), [p, q, radius, tube]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime();
    points.current.rotation.z = t * speed * direction;
    points.current.rotation.x = Math.sin(t * 0.15) * 0.3 + 0.2;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Scene({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const targetY = pointer.current.x * 0.5;
    const targetX = -pointer.current.y * 0.3;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.4} />
      <GlowKnot p={2} q={3} radius={1.5} tube={0.42} size={0.045} speed={0.12} direction={1} opacity={0.9} />
      <GlowKnot p={3} q={5} radius={0.85} tube={0.22} size={0.03} speed={0.2} direction={-1} opacity={0.6} />
    </group>
  );
}

export default function HeroGlow() {
  const pointer = useRef({ x: 0, y: 0 });

  function onPointerMove(e: React.PointerEvent) {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  }

  return (
    <div className="absolute inset-0" onPointerMove={onPointerMove}>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <Scene pointer={pointer} />
      </Canvas>
    </div>
  );
}
