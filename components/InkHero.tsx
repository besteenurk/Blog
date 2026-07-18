"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const TRAIL_POINTS = 90;
const TRAIL_COLOR_A = new THREE.Color("#a6bcff");
const TRAIL_COLOR_B = new THREE.Color("#f472a6");

function InkTrail({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const lineRef = useRef<THREE.Line>(null);

  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < TRAIL_POINTS; i++) {
      const t = i / (TRAIL_POINTS - 1);
      pts.push(
        new THREE.Vector3(
          -1.1 + t * 4.2,
          0.15 + Math.sin(t * Math.PI * 2.4) * 0.55 * (1 - t * 0.3),
          -0.4 + Math.cos(t * Math.PI * 1.6) * 0.3
        )
      );
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  const geometry = useMemo(() => {
    const points = curve.getPoints(TRAIL_POINTS);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    geo.setDrawRange(0, 0);
    return geo;
  }, [curve]);

  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: TRAIL_COLOR_A.clone(), transparent: true, opacity: 0.85 }),
    []
  );

  useFrame((state) => {
    const total = geometry.getAttribute("position").count;
    const visible = Math.floor(progressRef.current * total);
    geometry.setDrawRange(0, Math.max(0, visible));

    const hueT = (Math.sin(state.clock.getElapsedTime() * 0.3) + 1) / 2;
    material.color.copy(TRAIL_COLOR_A).lerp(TRAIL_COLOR_B, hueT);
  });

  const line = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  return <primitive object={line} ref={lineRef} />;
}

function InkwellGroup({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const targetY = pointer.current.x * 0.25;
    const targetX = -pointer.current.y * 0.15;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX + Math.sin(t * 0.5) * 0.03, 0.05);
    group.current.position.y = Math.sin(t * 0.6) * 0.06;
  });

  return (
    <group ref={group} position={[-1.3, -0.2, 0]}>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.62, 0.72, 0.75, 32]} />
        <meshPhysicalMaterial
          color="#7c9bff"
          transmission={0.88}
          thickness={0.6}
          roughness={0.06}
          ior={1.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.28, 0.4, 0.3, 32]} />
        <meshPhysicalMaterial
          color="#a6bcff"
          transmission={0.88}
          thickness={0.4}
          roughness={0.06}
          ior={1.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.16, 32]} />
        <meshStandardMaterial color="#26215c" roughness={0.3} />
      </mesh>

      <group position={[0.35, 0.55, 0.1]} rotation={[0, 0, -0.65]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.1, 12]} />
          <meshStandardMaterial color="#171c26" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <coneGeometry args={[0.045, 0.22, 12]} />
          <meshStandardMaterial color="#ffb86b" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function ScrollProgress({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  useEffect(() => {
    const heroEl = document.getElementById("home-hero");
    function onScroll() {
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const total = rect.height || 1;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      progressRef.current = scrolled / total;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [progressRef]);
  return null;
}

function PointerTracker({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { size } = useThree();
  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer, size]);
  return null;
}

export default function InkHero() {
  const pointer = useRef({ x: 0, y: 0 });
  const progress = useRef(0);

  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1} color="#eef1ff" />
        <pointLight position={[-2, 1, 3]} intensity={0.8} color="#a6bcff" />
        <pointLight position={[2, -1, 2]} intensity={0.5} color="#f472a6" />

        <PointerTracker pointer={pointer} />
        <ScrollProgress progressRef={progress} />
        <InkwellGroup pointer={pointer} />
        <InkTrail progressRef={progress} />
      </Canvas>
    </div>
  );
}
