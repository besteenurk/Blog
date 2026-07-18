"use client";

import dynamic from "next/dynamic";
import type { OrbitPost } from "@/components/PostOrbit";

const PostOrbit = dynamic(() => import("@/components/PostOrbit"), { ssr: false });

export default function PostOrbitClient({ posts }: { posts: OrbitPost[] }) {
  return <PostOrbit posts={posts} />;
}
