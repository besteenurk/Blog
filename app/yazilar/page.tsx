import { getAllPosts } from "@/lib/posts";
import PostsExplorer from "./PostsExplorer";
import PostOrbitClient from "./PostOrbitClient";

export const metadata = {
  title: "Yazılar — Mindead",
  description: "Tüm yazılar; konuya ya da etikete göre filtrelenebilir, aranabilir.",
};

const TOP_COUNT = 4;

export default async function YazilarPage() {
  const posts = await getAllPosts();
  const topPosts = [...posts]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, TOP_COUNT)
    .map((p) => ({ slug: p.slug, title: p.title }));

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-300">Arşiv</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-paper-100 sm:text-4xl">
        Tüm yazılar
      </h1>
      <p className="mt-2 text-sm text-paper-400">
        {posts.length} yazı — konuya göre filtrele ya da doğrudan ara.
      </p>

      {topPosts.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-paper-400">
            En çok okunan
          </h2>
          <div className="relative mt-3 h-[280px] overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/40 sm:h-[340px]">
            <PostOrbitClient posts={topPosts} />
          </div>
          <p className="mt-2 font-mono text-[11px] text-paper-400/70">
            Düğümleri yatay sürükle, bir yazıya tıkla.
          </p>
        </div>
      )}

      <PostsExplorer posts={posts} />
    </div>
  );
}
