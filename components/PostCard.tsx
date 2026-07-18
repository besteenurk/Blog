"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Post } from "@/lib/postUtils";
import { estimateReadingTime } from "@/lib/postUtils";
import { tagColor } from "@/lib/tagColors";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PostCard({ post, index }: { post: Post; index: number }) {
  const minutes = estimateReadingTime(post.content);
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: "easeOut" }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group rounded-2xl border border-ink-700 bg-ink-900/60 shadow-card transition-colors hover:border-accent-400/40"
      >
        <Link href={`/blog/${post.slug}`} className="block p-5 sm:p-6">
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

          <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-accent-400">
            Devamını oku
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </motion.div>
    </motion.article>
  );
}
