import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/70 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-paper-100"
        >
          Defter<span className="text-accent-400">.</span>
        </Link>
        <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-paper-400">
          <Link href="/" className="transition-colors hover:text-paper-100">
            Yazılar
          </Link>
        </nav>
      </div>
    </header>
  );
}
