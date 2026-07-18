import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Hero3DClient from "./Hero3DClient";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden border-b border-ink-700/70 px-5 pb-12 pt-10 sm:min-h-[85svh] sm:pb-16">
        <div className="pointer-events-none absolute inset-0">
          <Hero3DClient />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 100%, rgba(10,13,19,0.95) 20%, rgba(10,13,19,0.55) 55%, rgba(10,13,19,0) 100%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-300">
            Kişisel Blog
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-paper-100 sm:text-5xl">
            Düşünceler kâğıda dökülünce iz bırakır.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-paper-400 sm:text-base">
            Okuduklarımı, denediklerimi ve üzerine uzun uzun düşündüğüm şeyleri
            biriktirdiğim yer. Belirli bir tempo yok, sadece biriken.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-paper-100">Yazılar</h2>
          <span className="font-mono text-xs text-paper-400">{posts.length} yazı</span>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-700 px-6 py-16 text-center">
            <p className="font-display text-lg text-paper-100">Henüz yazı yok.</p>
            <p className="mt-2 text-sm text-paper-400">İlk yazı yakında burada olacak.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
