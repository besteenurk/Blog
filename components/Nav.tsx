"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/70 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-paper-100"
        >
          Mindead<span className="text-accent-400">.</span>
        </Link>
        <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-paper-400">
          <Link
            href="/"
            className={`transition-colors hover:text-paper-100 ${pathname === "/" ? "text-paper-100" : ""}`}
          >
            Anasayfa
          </Link>
          <Link
            href="/yazilar"
            className={`transition-colors hover:text-accent-300 ${pathname === "/yazilar" ? "text-accent-300" : ""}`}
          >
            Yazılar
          </Link>
        </nav>
      </div>
    </header>
  );
}
