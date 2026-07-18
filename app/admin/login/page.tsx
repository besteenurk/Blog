"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Giriş başarısız.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Tekrar dene.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-sm flex-col justify-center px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-300">Yönetim</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-paper-100">
        Giriş yap
      </h1>
      <p className="mt-2 text-sm text-paper-400">
        Yazı ekleyip düzenlemek için şifreni gir.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          className="w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-paper-100 outline-none placeholder:text-paper-400/60 focus:border-accent-400"
        />
        {error && <p className="text-sm text-amber-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent-400 px-4 py-3 font-medium text-ink-950 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
