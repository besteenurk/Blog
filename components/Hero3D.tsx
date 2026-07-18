"use client";

import { useMemo, useRef, useState } from "react";
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
  impulse: [number, number, number];
};

const PAGES: PageDef[] = [
  { position: [-1.5, 0.4, -0.6], rotation: [0.1, 0.5, -0.15], size: [1.7, 2.2], color: "#8a63f0", opacity: 0.55, floatSpeed: 0.5, floatOffset: 0, impulse: [-1.2, 0.6, 0.4] },
  { position: [0.9, -0.5, -0.2], rotation: [-0.08, -0.35, 0.12], size: [1.9, 2.5], color: "#45cbaf", opacity: 0.5, floatSpeed: 0.42, floatOffset: 1.6, impulse: [0.9, -0.8, 0.2] },
  { position: [-0.4, -0.9, 0.6], rotation: [0.15, 0.15, -0.05], size: [1.5, 2.0], color: "#7c9bff", opacity: 0.45, floatSpeed: 0.6, floatOffset: 3.1, impulse: [-0.6, -1.1, -0.3] },
  { position: [1.7, 0.9, 0.3], rotation: [-0.12, -0.2, 0.08], size: [1.3, 1.7], color: "#ffb86b", opacity: 0.5, floatSpeed: 0.46, floatOffset: 2.2, impulse: [1.3, 0.7, 0.1] },
  { position: [0.1, 1.1, -0.9], rotation: [0.05, 0.3, 0.05], size: [1.6, 2.1], color: "#f472a6", opacity: 0.42, floatSpeed: 0.38, floatOffset: 4.4, impulse: [0.2, 1.3, -0.4] },
  { position: [-1.9, -0.7, 0.1], rotation: [-0.1, -0.15, -0.1], size: [1.2, 1.6], color: "#a888ff", opacity: 0.4, floatSpeed: 0.55, floatOffset: 0.8, impulse: [-1.1, -0.5, 0.5] },
  { position: [2.1, -1.3, -1.2], rotation: [0.08, -0.1, 0.15], size: [1.1, 1.4], color: "#24a68d", opacity: 0.4, floatSpeed: 0.48, floatOffset: 2.9, impulse: [1.0, -1.0, -0.2] },
  { position: [-0.8, 1.6, -1.4], rotation: [-0.05, 0.25, -0.1], size: [1.3, 1.6], color: "#e14f87", opacity: 0.38, floatSpeed: 0.33, floatOffset: 1.9, impulse: [-0.5, 1.2, 0.3] },
];

type DragState = {
  dragging: boolean;
  lastX: number;
  lastY: number;
  rotX: number;
  rotY: number;
  moved: number;
  burstStart: number | null;
  burstRequested: boolean;
};

function Page({ def }: { def: PageDef }) {
  const mesh = useRef<THREE.Mesh>(null);
  const base = useMemo(() => new THREE.Vector3(...def.position), [def.position]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime() * def.floatSpeed + def.floatOffset;
    const burst = (mesh.current.userData.burst as number) ?? 0;
    mesh.current.position.y = base.y + Math.sin(t) * 0.18 + def.impulse[1] * burst;
    mesh.current.position.x = base.x + Math.cos(t * 0.7) * 0.08 + def.impulse[0] * burst;
    mesh.current.position.z = base.z + def.impulse[2] * burst;
    mesh.current.rotation.z = def.rotation[2] + Math.sin(t * 0.5) * 0.05 + burst * 1.4;
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

function Scene({ drag }: { drag: React.MutableRefObject<DragState> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const { pointer } = state;
    const d = drag.current;

    const targetY = pointer.x * 0.28 + d.rotY;
    const targetX = -pointer.y * 0.18 + d.rotX;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.08);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.08);

    if (!d.dragging) {
      d.rotY *= 0.94;
      d.rotX *= 0.94;
    }

    if (d.burstRequested) {
      d.burstStart = state.clock.getElapsedTime();
      d.burstRequested = false;
    }

    let burstValue = 0;
    if (d.burstStart !== null) {
      const elapsed = state.clock.getElapsedTime() - d.burstStart;
      burstValue = Math.max(0, 1 - elapsed / 1.1) * Math.sin(elapsed * 3);
      if (elapsed > 1.1) d.burstStart = null;
    }
    group.current.children.forEach((child) => {
      child.userData.burst = burstValue;
    });
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#eef1ff" />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color="#8a63f0" />
      <pointLight position={[3, 2, -1]} intensity={0.6} color="#45cbaf" />
      {PAGES.map((def, i) => (
        <Page key={i} def={def} />
      ))}
    </group>
  );
}

export default function Hero3D() {
  const drag = useRef<DragState>({
    dragging: false,
    lastX: 0,
    lastY: 0,
    rotX: 0,
    rotY: 0,
    moved: 0,
    burstStart: null,
    burstRequested: false,
  });
  const [grabbing, setGrabbing] = useState(false);

  function onPointerDown(e: React.PointerEvent) {
    drag.current.dragging = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.moved = 0;
    setGrabbing(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.dragging) return;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.moved += Math.abs(dx) + Math.abs(dy);
    drag.current.rotY += dx * 0.006;
    drag.current.rotX += dy * 0.006;
  }

  function endDrag() {
    drag.current.dragging = false;
    setGrabbing(false);
    if (drag.current.moved < 6) {
      drag.current.burstRequested = true;
    }
  }

  return (
    <div
      className="absolute inset-0"
      style={{ touchAction: "none", cursor: grabbing ? "grabbing" : "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={() => {
        if (drag.current.dragging) {
          drag.current.dragging = false;
          setGrabbing(false);
        }
      }}
    >
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <Scene drag={drag} />
      </Canvas>
    </div>
  );
}
