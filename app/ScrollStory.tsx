"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Beat = {
  eyebrow: string;
  value: string;
  label: string;
  color: string;
  align: "left" | "right";
};

function Underline({ color }: { color: string }) {
  return (
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      style={{
        display: "block",
        transformOrigin: "left",
        height: 3,
        borderRadius: 999,
        background: color,
        marginTop: 14,
      }}
    />
  );
}

function StoryBeat({ eyebrow, value, label, color, align }: Beat) {
  const isRight = align === "right";
  return (
    <div
      className={`flex flex-col px-5 py-16 sm:py-24 ${isRight ? "items-end text-right" : "items-start text-left"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto w-full max-w-3xl"
      >
        <p
          className="font-mono text-xs uppercase tracking-[0.2em]"
          style={{ color, textAlign: isRight ? "right" : "left" }}
        >
          {eyebrow}
        </p>
        <p
          className="mt-3 font-display text-6xl font-semibold tracking-tight sm:text-8xl"
          style={{ color, textAlign: isRight ? "right" : "left" }}
        >
          {value}
        </p>
        <p
          className="mt-2 max-w-sm font-display text-xl text-paper-300 sm:text-2xl"
          style={{ marginLeft: isRight ? "auto" : 0 }}
        >
          {label}
        </p>
        <div style={isRight ? { marginLeft: "auto" } : undefined} className="w-24">
          <Underline color={color} />
        </div>
      </motion.div>
    </div>
  );
}

export function StoryClosing({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-3xl px-5 pb-20 pt-4 text-center sm:pb-28"
    >
      {children}
    </motion.div>
  );
}

export default function ScrollStory({
  totalPosts,
  totalViews,
  daysSinceFirst,
}: {
  totalPosts: number;
  totalViews: number;
  daysSinceFirst: number;
}) {
  return (
    <div className="border-b border-ink-700/70">
      <StoryBeat
        eyebrow="Şimdiye kadar"
        value={String(totalPosts)}
        label="yazı kâğıda döküldü"
        color="#a888ff"
        align="left"
      />
      <StoryBeat
        eyebrow="Toplamda"
        value={totalViews.toLocaleString("tr-TR")}
        label="kez okundu"
        color="#7fe3cf"
        align="right"
      />
      <StoryBeat
        eyebrow="Yaklaşık"
        value={`${daysSinceFirst} gün`}
        label="önce ilk yazı düştü"
        color="#ff9fc9"
        align="left"
      />
    </div>
  );
}
