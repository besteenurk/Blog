"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/postUtils";
import { estimateReadingTime } from "@/lib/postUtils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PostCard({ post, index }: { post: Post; index: number }) {
  const minutes = estimateReadingTime(post.content);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: "easeOut" }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-2xl border border-ink-700 bg-ink-900/60 p-5 shadow-card transition-colors hover:border-accent-400/40 sm:p-6"
      >
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-paper-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden className="text-ink-600">
            •
          </span>
          <span>{minutes} dk okuma</span>
        </div>

        <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-paper-100 transition-colors group-hover:text-accent-300 sm:text-2xl">
          {post.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-paper-400">
          {post.excerpt}
        </p>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ink-700 px-2.5 py-1 font-mono text-[11px] text-paper-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-accent-400">
          Devamını oku
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </motion.article>
  );
}
