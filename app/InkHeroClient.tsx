"use client";

import dynamic from "next/dynamic";

const InkHero = dynamic(() => import("@/components/InkHero"), { ssr: false });

export default function InkHeroClient() {
  return <InkHero />;
}
