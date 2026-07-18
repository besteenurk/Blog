"use client";

import dynamic from "next/dynamic";
import type { HeroPost } from "@/components/Hero3D";

const Hero3D = dynamic(() => import("@/components/Hero3D"), { ssr: false });

export default function Hero3DClient({ posts }: { posts: HeroPost[] }) {
  return <Hero3D posts={posts} />;
}
