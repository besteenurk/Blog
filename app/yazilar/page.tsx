import { getAllPosts } from "@/lib/posts";
import PostsExplorer from "./PostsExplorer";

export const metadata = {
  title: "Yazılar — Mindead",
  description: "Tüm yazılar; konuya ya da etikete göre filtrelenebilir, aranabilir.",
};

export default async function YazilarPage() {
  const posts = await getAllPosts();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-300">Arşiv</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-paper-100 sm:text-4xl">
        Tüm yazılar
      </h1>
      <p className="mt-2 text-sm text-paper-400">
        {posts.length} yazı — konuya göre filtrele ya da doğrudan ara.
      </p>

      <PostsExplorer posts={posts} />
    </div>
  );
}
