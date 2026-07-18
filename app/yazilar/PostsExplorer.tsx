"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Post } from "@/lib/postUtils";
import { tagColor } from "@/lib/tagColors";
import PostCard from "@/components/PostCard";

export default function PostsExplorer({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [shuffling, setShuffling] = useState(false);
  const [shuffleTitle, setShuffleTitle] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return posts.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      if (!matchesTag) return false;
      if (!q) return true;
      const haystack = `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLocaleLowerCase("tr");
      return haystack.includes(q);
    });
  }, [posts, query, activeTag]);

  function surpriseMe() {
    const pool = filtered.length > 0 ? filtered : posts;
    if (pool.length === 0 || shuffling) return;
    setShuffling(true);

    let ticks = 0;
    const maxTicks = 10;
    const interval = setInterval(() => {
      const random = pool[Math.floor(Math.random() * pool.length)];
      setShuffleTitle(random.title);
      ticks += 1;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        router.push(`/blog/${random.slug}`);
      }
    }, 90);
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-paper-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Yazı ara…"
            className="w-full rounded-xl border border-ink-700 bg-ink-900/60 py-3 pl-11 pr-4 text-paper-100 outline-none placeholder:text-paper-400/60 focus:border-accent-400"
          />
        </div>

        <motion.button
          onClick={surpriseMe}
          whileTap={{ scale: 0.95 }}
          disabled={shuffling}
          className="shrink-0 rounded-xl border border-ink-700 px-4 py-3 font-mono text-xs text-paper-400 transition-colors hover:border-accent-400/40 hover:text-paper-100 disabled:opacity-70"
        >
          <AnimatePresence mode="wait">
            {shuffling ? (
              <motion.span
                key="shuffling"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="line-clamp-1 max-w-[160px] text-accent-300"
              >
                {shuffleTitle ?? "…"}
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                🎲 rastgele yazı
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <TagPill
            label="Tümü"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
            colors={{ bg: "rgba(237,239,243,0.08)", border: "rgba(237,239,243,0.25)", text: "#edeff3" }}
          />
          {allTags.map((tag) => (
            <TagPill
              key={tag}
              label={`#${tag}`}
              active={activeTag === tag}
              onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
              colors={tagColor(tag)}
            />
          ))}
        </div>
      )}

      <p className="mt-5 font-mono text-[11px] text-paper-400">
        {filtered.length} sonuç
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((post, i) => (
            <motion.div
              key={post.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              <PostCard post={post} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-700 px-6 py-16 text-center">
            <p className="font-display text-lg text-paper-100">Sonuç bulunamadı.</p>
            <p className="mt-2 text-sm text-paper-400">
              Farklı bir kelime dene ya da filtreyi kaldır.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TagPill({
  label,
  active,
  onClick,
  colors,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  colors: { bg: string; border: string; text: string };
}) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-full px-3 py-1.5 font-mono text-[11px] transition-transform active:scale-95"
      style={{
        background: active ? colors.bg : "transparent",
        border: `1px solid ${active ? colors.border : "var(--color-ink-700)"}`,
        color: active ? colors.text : "var(--color-paper-400)",
      }}
    >
      {label}
    </button>
  );
}
