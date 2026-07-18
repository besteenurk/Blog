"use client";

import dynamic from "next/dynamic";

const HeroShapes = dynamic(() => import("@/components/HeroShapes"), { ssr: false });

export default function HeroShapesClient() {
  return <HeroShapes />;
}
