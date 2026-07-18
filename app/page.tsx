import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import HomeHero from "./HomeHero";
import ScrollStory, { StoryClosing } from "./ScrollStory";

const HOME_POST_COUNT = 5;

export default async function HomePage() {
  const posts = await getAllPosts();
  const latest = posts.slice(0, HOME_POST_COUNT);

  const totalViews = posts.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const earliest = posts.reduce<number | null>((min, p) => {
    const t = new Date(p.date).getTime();
    return min === null || t < min ? t : min;
  }, null);
  const daysSinceFirst = earliest ? Math.max(0, Math.floor((Date.now() - earliest) / 86400000)) : 0;

  return (
    <>
      <HomeHero />

      {posts.length > 0 && (
        <>
          <ScrollStory
            totalPosts={posts.length}
            totalViews={totalViews}
            daysSinceFirst={daysSinceFirst}
          />
          <StoryClosing>
            <p className="font-display text-2xl font-semibold text-paper-100 sm:text-3xl">
              Okumaya devam et.
            </p>
            <Link
              href="/yazilar"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-400 px-6 py-3 font-mono text-sm text-ink-950 transition-transform hover:scale-105"
            >
              Tüm yazılara göz at
              <span aria-hidden>→</span>
            </Link>
          </StoryClosing>
        </>
      )}

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-paper-100">Son yazılar</h2>
          <Link
            href="/yazilar"
            className="font-mono text-xs text-accent-300 transition-colors hover:text-accent-400"
          >
            tüm yazılar →
          </Link>
        </div>

        {latest.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-700 px-6 py-16 text-center">
            <p className="font-display text-lg text-paper-100">Henüz yazı yok.</p>
            <p className="mt-2 text-sm text-paper-400">İlk yazı yakında burada olacak.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {latest.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}

        {posts.length > HOME_POST_COUNT && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/yazilar"
              className="rounded-xl border border-ink-700 px-5 py-3 font-mono text-xs text-paper-400 transition-colors hover:border-accent-400/40 hover:text-paper-100"
            >
              Kalan {posts.length - HOME_POST_COUNT} yazıyı gör
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
