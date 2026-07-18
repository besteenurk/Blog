"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export type OrbitPost = { slug: string; title: string };

const COLORS = ["#8a63f0", "#45cbaf", "#f472a6", "#ffb86b", "#7c9bff", "#a888ff"];
const RADIUS = 2.3;
const CLICK_MOVE_THRESHOLD = 6;

function nodeBasePosition(index: number, total: number): [number, number, number] {
  const angle = (index / total) * Math.PI * 2;
  return [Math.cos(angle) * RADIUS, Math.sin(angle * 1.3) * 0.8, Math.sin(angle) * RADIUS * 0.6];
}

function Hub() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const s = 1 + Math.sin(state.clock.getElapsedTime() * 1.2) * 0.08;
    mesh.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[0.4, 1]} />
      <meshStandardMaterial color="#edeff3" transparent opacity={0.85} roughness={0.2} metalness={0.2} wireframe />
    </mesh>
  );
}

function Connection({ index, total }: { index: number; total: number }) {
  const end = nodeBasePosition(index, total);
  return <Line points={[[0, 0, 0], end]} color="#7c9bff" transparent opacity={0.22} lineWidth={1} />;
}

function Spark({ index, total }: { index: number; total: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const end = useMemo(() => new THREE.Vector3(...nodeBasePosition(index, total)), [index, total]);
  const zero = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime() * 0.55 + index * 0.8;
    const phase = Math.abs(((t % 2) - 1));
    mesh.current.position.lerpVectors(zero, end, phase);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
    </mesh>
  );
}

function Node({
  post,
  index,
  total,
  hovered,
  onHover,
  drag,
}: {
  post: OrbitPost;
  index: number;
  total: number;
  hovered: boolean;
  onHover: (i: number | null) => void;
  drag: React.MutableRefObject<DragState>;
}) {
  const router = useRouter();
  const mesh = useRef<THREE.Mesh>(null);
  const color = COLORS[index % COLORS.length];
  const base = useMemo(() => new THREE.Vector3(...nodeBasePosition(index, total)), [index, total]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime() * 0.4 + index * 1.3;
    mesh.current.position.set(base.x, base.y + Math.sin(t) * 0.1, base.z);
    const targetScale = hovered ? 1.4 : 1;
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
  });

  return (
    <mesh
      ref={mesh}
      position={base}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(index);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (drag.current.pressMoved > CLICK_MOVE_THRESHOLD) return;
        router.push(`/blog/${post.slug}`);
      }}
    >
      <icosahedronGeometry args={[0.28, 0]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={hovered ? 0.95 : 0.68}
        roughness={0.3}
        metalness={0.1}
        wireframe
      />
      <Html
        center
        distanceFactor={7.5}
        position={[0, -0.5, 0]}
        style={{ pointerEvents: "none", userSelect: "none", WebkitUserSelect: "none" }}
      >
        <div
          style={{
            width: 130,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: hovered ? "#ffffff" : "rgba(237,239,243,0.7)",
            textShadow: "0 1px 6px rgba(0,0,0,0.85)",
            transition: "color 0.2s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          {post.title}
        </div>
      </Html>
    </mesh>
  );
}

type DragState = {
  dragging: boolean;
  lastX: number;
  rotY: number;
  pressMoved: number;
};

function Scene({ posts, drag }: { posts: OrbitPost[]; drag: React.MutableRefObject<DragState> }) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const total = posts.length;

  useFrame((state) => {
    if (!group.current) return;
    const d = drag.current;
    const idle = state.clock.getElapsedTime() * 0.04;
    group.current.rotation.y = idle + d.rotY;
    if (!d.dragging) {
      d.rotY *= 0.97;
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1} color="#eef1ff" />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color="#8a63f0" />
      <pointLight position={[3, 2, -1]} intensity={0.6} color="#45cbaf" />

      <Hub />

      {total > 0 && posts.map((_, i) => <Connection key={`line-${i}`} index={i} total={total} />)}
      {total > 0 && posts.map((_, i) => <Spark key={`spark-${i}`} index={i} total={total} />)}
      {total > 0 &&
        posts.map((post, i) => (
          <Node
            key={post.slug}
            post={post}
            index={i}
            total={total}
            hovered={hovered === i}
            onHover={setHovered}
            drag={drag}
          />
        ))}
    </group>
  );
}

export default function PostOrbit({ posts }: { posts: OrbitPost[] }) {
  const drag = useRef<DragState>({ dragging: false, lastX: 0, rotY: 0, pressMoved: 0 });
  const [grabbing, setGrabbing] = useState(false);

  function onPointerDown(e: React.PointerEvent) {
    drag.current.dragging = true;
    drag.current.lastX = e.clientX;
    drag.current.pressMoved = 0;
    setGrabbing(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.dragging) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    drag.current.pressMoved += Math.abs(dx);
    drag.current.rotY += dx * 0.006;
  }

  function endDrag() {
    drag.current.dragging = false;
    setGrabbing(false);
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        touchAction: "pan-y",
        cursor: grabbing ? "grabbing" : "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 5.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <Scene posts={posts} drag={drag} />
      </Canvas>
    </div>
  );
}
