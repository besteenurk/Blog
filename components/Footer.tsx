import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-700/70">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-5 py-10 text-center">
        <p className="font-mono text-xs text-paper-400">
          © {new Date().getFullYear()} Defter — düşünceler biriktikçe yazılır.
        </p>
        <Link
          href="/admin/login"
          className="font-mono text-[11px] text-ink-600 transition-colors hover:text-paper-400"
        >
          yönet
        </Link>
      </div>
    </footer>
  );
}
