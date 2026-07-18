"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type ShapeDef = {
  top: string;
  left: string;
  size: number;
  color: string;
  kind: "circle" | "square" | "hex" | "triangle";
  depth: number;
  duration: number;
  delay: number;
  direction: 1 | -1;
};

const PALETTE = ["#8a63f0", "#45cbaf", "#f472a6", "#ffb86b", "#7c9bff", "#a888ff", "#e14f87", "#24a68d"];
const KINDS: ShapeDef["kind"][] = ["circle", "square", "hex", "triangle"];
const SHAPE_COUNT = 14;

function buildShapes(): ShapeDef[] {
  const shapes: ShapeDef[] = [];
  for (let i = 0; i < SHAPE_COUNT; i++) {
    const seed = i * 37.531;
    const top = 6 + Math.abs(Math.sin(seed)) * 80;
    const left = 3 + Math.abs(Math.cos(seed * 1.3)) * 92;
    const size = 26 + Math.abs(Math.sin(seed * 0.7)) * 58;
    shapes.push({
      top: `${top}%`,
      left: `${left}%`,
      size,
      color: PALETTE[i % PALETTE.length],
      kind: KINDS[i % KINDS.length],
      depth: 0.4 + (i % 5) * 0.22,
      duration: 6 + (i % 6),
      delay: -(i * 1.3),
      direction: i % 2 === 0 ? 1 : -1,
    });
  }
  return shapes;
}

const SHAPES = buildShapes();

function clipPathFor(kind: ShapeDef["kind"]): string | undefined {
  if (kind === "hex") return "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)";
  if (kind === "triangle") return "polygon(50% 6%, 95% 92%, 5% 92%)";
  return undefined;
}

function Shape({ def }: { def: ShapeDef }) {
  return (
    <div
      className="absolute"
      style={{
        top: def.top,
        left: def.left,
        width: def.size,
        height: def.size,
        transform: `translateZ(${def.depth * 40}px)`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: def.kind === "circle" ? "50%" : def.kind === "square" ? "22%" : undefined,
          clipPath: clipPathFor(def.kind),
          background: `linear-gradient(145deg, ${def.color}55, ${def.color}22)`,
          border: `1px solid ${def.color}66`,
          boxShadow: `0 0 30px -6px ${def.color}aa`,
          backdropFilter: "blur(2px)",
          animation: `float3d ${def.duration}s ease-in-out infinite`,
          animationDelay: `${def.delay}s`,
          animationDirection: def.direction === 1 ? "normal" : "reverse",
        }}
      />
    </div>
  );
}

export default function FloatingShapes3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 60, damping: 15 });
  const springY = useSpring(rotateY, { stiffness: 60, damping: 15 });

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotateY.set((px - 0.5) * 22);
      rotateX.set(-(py - 0.5) * 14);
    }

    function onOrientation(e: DeviceOrientationEvent) {
      if (e.gamma === null || e.beta === null) return;
      rotateY.set(Math.max(-16, Math.min(16, e.gamma * 0.5)));
      rotateX.set(Math.max(-12, Math.min(12, (e.beta - 35) * 0.35)));
    }

    let orientationBound = false;
    function bindOrientation() {
      if (orientationBound) return;
      orientationBound = true;
      const DOE = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof DOE?.requestPermission === "function") {
        DOE.requestPermission()
          .then((res) => {
            if (res === "granted") window.addEventListener("deviceorientation", onOrientation);
          })
          .catch(() => {});
      } else {
        window.addEventListener("deviceorientation", onOrientation);
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchstart", bindOrientation, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchstart", bindOrientation);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, [rotateX, rotateY]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden" style={{ perspective: 1000 }}>
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", rotateX: springX, rotateY: springY }}
      >
        {SHAPES.map((def, i) => (
          <Shape key={i} def={def} />
        ))}
      </motion.div>
    </div>
  );
}
