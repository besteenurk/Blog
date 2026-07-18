import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-ink-700/70 bg-ink-950/60">
      <div
        aria-hidden
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-violet-400), var(--color-accent-400), var(--color-teal-400), var(--color-rose-400), transparent)",
          opacity: 0.6,
        }}
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-base font-semibold text-paper-100">
            Mindead<span className="text-accent-400">.</span>
          </p>
          <p className="mt-1 text-xs text-paper-400">
            Düşünceler biriktikçe yazılır.
          </p>
        </div>

        <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-paper-400">
          <Link href="/" className="transition-colors hover:text-paper-100">
            Anasayfa
          </Link>
          <Link href="/#posts" className="transition-colors hover:text-accent-300">
            Yazılar
          </Link>
          <Link href="/admin/login" className="transition-colors hover:text-paper-400/70">
            yönet
          </Link>
        </nav>
      </div>

      <div className="border-t border-ink-700/50 py-4 text-center">
        <p className="font-mono text-[11px] text-ink-600">
          © {new Date().getFullYear()} Mindead
        </p>
      </div>
    </footer>
  );
}
