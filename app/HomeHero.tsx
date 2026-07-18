"use client";

import { motion } from "framer-motion";
import InkHeroClient from "./InkHeroClient";

const LINE = "Düşünceler kâğıda dökülünce iz bırakır.";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.028 },
  },
};

const letter = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function HomeHero() {
  return (
    <div
      id="home-hero"
      className="relative isolate min-h-[62svh] overflow-hidden border-b border-ink-700/70 px-5 pb-14 pt-16 sm:min-h-[74svh] sm:pb-20 sm:pt-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="blob blob-violet" />
        <span className="blob blob-teal" />
        <span className="blob blob-rose" />
      </div>

      <InkHeroClient />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,13,19,0.15) 0%, rgba(10,13,19,0.55) 65%, rgba(10,13,19,0.92) 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-300">
          Mindead — Kişisel Blog
        </p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
          style={{
            backgroundImage: "linear-gradient(90deg, #a6bcff 0%, #ff9fc9 45%, #7fe3cf 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {LINE.split("").map((char, i) => (
            <motion.span key={i} variants={letter} style={{ display: "inline-block" }}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          <motion.span
            aria-hidden
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            style={{ display: "inline-block", color: "#a6bcff", WebkitTextFillColor: "#a6bcff" }}
          >
            |
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-4 max-w-md text-[15px] leading-relaxed text-paper-400 sm:text-base"
        >
          Okuduklarımı, denediklerimi ve üzerine uzun uzun düşündüğüm şeyleri
          biriktirdiğim yer. Belirli bir tempo yok, sadece biriken.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-3 font-mono text-[11px] text-paper-400/70"
        >
          Aşağı kaydır, mürekkep izini takip et.
        </motion.p>
      </div>
    </div>
  );
}
