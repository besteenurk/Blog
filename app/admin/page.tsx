"use client";

import { useEffect, useState, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import MarkdownContent from "@/components/MarkdownContent";
import type { Post } from "@/lib/postUtils";

type FormState = {
  slug: string | null; // null => creating a new post
  title: string;
  excerpt: string;
  tags: string;
  coverImage: string | null;
  content: string;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  slug: null,
  title: "",
  excerpt: "",
  tags: "",
  coverImage: null,
  content: "",
  published: true,
};

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?all=true");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setPreview(false);
  }

  function editPost(post: Post) {
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags.join(", "),
      coverImage: post.coverImage,
      content: post.content,
      published: post.published,
    });
    setNotice(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yükleme başarısız.");
      setForm((f) => ({ ...f, coverImage: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: form.published,
    };

    try {
      const res = await fetch(form.slug ? `/api/posts/${form.slug}` : "/api/posts", {
        method: form.slug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kaydedilemedi.");
      setNotice(form.slug ? "Yazı güncellendi." : "Yazı yayınlandı.");
      resetForm();
      loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Bu yazıyı silmek istediğine emin misin?")) return;
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi.");
      loadPosts();
      if (form.slug === slug) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silinemedi.");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-300">
            Yönetim
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-paper-100">
            Yazıları yönet
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-ink-700 px-3 py-2 font-mono text-xs text-paper-400 transition-colors hover:text-paper-100"
        >
          Çıkış yap
        </button>
      </div>

      {/* Editor */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-ink-700 bg-ink-900/60 p-5 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-paper-100">
            {form.slug ? `Düzenleniyor: ${form.title}` : "Yeni yazı"}
          </h2>
          {form.slug && (
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs text-paper-400 hover:text-paper-100"
            >
              vazgeç
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Başlık"
            className="w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-paper-100 outline-none placeholder:text-paper-400/60 focus:border-accent-400"
          />

          <textarea
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            placeholder="Kısa özet (boş bırakılırsa içerikten otomatik üretilir)"
            rows={2}
            className="w-full resize-none rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-paper-100 outline-none placeholder:text-paper-400/60 focus:border-accent-400"
          />

          <input
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="Etiketler (virgülle ayır: günlük, teknik)"
            className="w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-paper-100 outline-none placeholder:text-paper-400/60 focus:border-accent-400"
          />

          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-xl border border-dashed border-ink-700 px-4 py-2.5 font-mono text-xs text-paper-400 transition-colors hover:border-accent-400 hover:text-paper-100">
              {uploading ? "Yükleniyor…" : "Kapak görseli yükle"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
            {form.coverImage && (
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.coverImage}
                  alt="Kapak"
                  className="h-12 w-20 rounded-lg border border-ink-700 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, coverImage: null }))}
                  className="font-mono text-[11px] text-paper-400 hover:text-amber-400"
                >
                  kaldır
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-wider text-paper-400">
                İçerik (Markdown)
              </label>
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="font-mono text-[11px] text-accent-300 hover:text-accent-400"
              >
                {preview ? "düzenlemeye dön" : "önizle"}
              </button>
            </div>

            {preview ? (
              <div className="min-h-[220px] rounded-xl border border-ink-700 bg-ink-900 px-4 py-4">
                <MarkdownContent content={form.content || "*Henüz içerik yok.*"} />
              </div>
            ) : (
              <textarea
                required
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder={"## Başlık\n\nYazını buraya Markdown olarak yaz."}
                rows={12}
                className="w-full resize-y rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 font-mono text-sm text-paper-100 outline-none placeholder:text-paper-400/60 focus:border-accent-400"
              />
            )}
          </div>

          <label className="flex items-center gap-2 font-mono text-xs text-paper-400">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="h-4 w-4 rounded border-ink-700 bg-ink-900 accent-accent-400"
            />
            Yayında (kapatırsan taslak olarak kalır, sitede görünmez)
          </label>

          {error && <p className="text-sm text-amber-400">{error}</p>}
          {notice && <p className="text-sm text-accent-300">{notice}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-accent-400 px-5 py-3 font-medium text-ink-950 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Kaydediliyor…" : form.slug ? "Güncelle" : "Yayınla"}
            </button>
          </div>
        </div>
      </form>

      {/* Post list */}
      <div className="mt-12">
        <h2 className="font-display text-lg font-semibold text-paper-100">
          Tüm yazılar {loading ? "" : `(${posts.length})`}
        </h2>

        <div className="mt-5 flex flex-col gap-3">
          {loading && <p className="text-sm text-paper-400">Yükleniyor…</p>}
          {!loading && posts.length === 0 && (
            <p className="text-sm text-paper-400">Henüz hiç yazı yok.</p>
          )}
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex flex-col gap-3 rounded-xl border border-ink-700 bg-ink-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-paper-100">{post.title}</p>
                  {!post.published && (
                    <span className="rounded-full border border-amber-400/40 px-2 py-0.5 font-mono text-[10px] text-amber-400">
                      taslak
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-[11px] text-paper-400">/yazilar/{post.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editPost(post)}
                  className="rounded-lg border border-ink-700 px-3 py-1.5 font-mono text-xs text-paper-400 hover:text-paper-100"
                >
                  düzenle
                </button>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="rounded-lg border border-ink-700 px-3 py-1.5 font-mono text-xs text-paper-400 hover:text-amber-400"
                >
                  sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
