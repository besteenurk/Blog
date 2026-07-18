"use client";

import dynamic from "next/dynamic";

const AmbientScene = dynamic(() => import("@/components/AmbientScene"), { ssr: false });

export default function AmbientSceneClient() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] opacity-70">
      <AmbientScene />
    </div>
  );
}
