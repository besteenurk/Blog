import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, estimateReadingTime } from "@/lib/posts";
import MarkdownContent from "@/components/MarkdownContent";
import { tagColor } from "@/lib/tagColors";
import ViewTracker from "@/components/ViewTracker";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  return {
    title: `${post.title} — Mindead`,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const minutes = estimateReadingTime(post.content);

  return (
    <article className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <ViewTracker slug={post.slug} />
      <Link
        href="/yazilar"
        className="font-mono text-xs text-paper-400 transition-colors hover:text-accent-300"
      >
        ← Tüm yazılar
      </Link>

      <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-paper-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden className="text-ink-600">
          •
        </span>
        <span>{minutes} dk okuma</span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-paper-100 sm:text-4xl">
        {post.title}
      </h1>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => {
            const c = tagColor(tag);
            return (
              <span
                key={tag}
                className="rounded-full px-2.5 py-1 font-mono text-[11px]"
                style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
              >
                #{tag}
              </span>
            );
          })}
        </div>
      )}

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="mt-8 aspect-[16/9] w-full rounded-2xl border border-ink-700 object-cover"
        />
      )}

      <div className="mt-10">
        <MarkdownContent content={post.content} />
      </div>
    </article>
  );
}
