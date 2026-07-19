"use client";

import dynamic from "next/dynamic";

const HeroGlow = dynamic(() => import("@/components/HeroGlow"), { ssr: false });

export default function HeroGlowClient() {
  return <HeroGlow />;
}
