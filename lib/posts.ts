// Server-only data access. Uses Node.js "fs", so this file must never be
// imported from a client component (use lib/postUtils.ts for that).
import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { slugify, makeExcerpt } from "./postUtils";
import type { Post, PostInput } from "./postUtils";

export type { Post, PostInput } from "./postUtils";
export { slugify, estimateReadingTime, makeExcerpt } from "./postUtils";

const DATA_FILE = path.join(process.cwd(), "data", "posts.json");

async function readAll(): Promise<Post[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(posts: Post[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export async function getAllPosts(opts: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  const posts = await readAll();
  const filtered = opts.includeDrafts ? posts : posts.filter((p) => p.published);
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(
  slug: string,
  opts: { includeDrafts?: boolean } = {}
): Promise<Post | null> {
  const posts = await readAll();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  if (!post.published && !opts.includeDrafts) return null;
  return post;
}

export async function createPost(input: PostInput): Promise<Post> {
  if (!input.title?.trim()) throw new Error("Başlık zorunludur.");
  if (!input.content?.trim()) throw new Error("İçerik zorunludur.");

  const posts = await readAll();
  const slugBase = slugify(input.slug?.trim() || input.title);
  if (!slugBase) throw new Error("Başlıktan geçerli bir bağlantı (slug) üretilemedi.");

  let unique = slugBase;
  let counter = 2;
  while (posts.some((p) => p.slug === unique)) {
    unique = `${slugBase}-${counter}`;
    counter += 1;
  }

  const post: Post = {
    slug: unique,
    title: input.title.trim(),
    excerpt: input.excerpt?.trim() || makeExcerpt(input.content),
    content: input.content,
    coverImage: input.coverImage || null,
    tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),
    date: new Date().toISOString(),
    published: input.published ?? true,
  };

  posts.push(post);
  await writeAll(posts);
  return post;
}

export async function updatePost(slug: string, input: Partial<PostInput>): Promise<Post> {
  const posts = await readAll();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) throw new Error("Yazı bulunamadı.");

  const existing = posts[idx];
  const updated: Post = {
    ...existing,
    title: input.title?.trim() || existing.title,
    excerpt: input.excerpt?.trim() || existing.excerpt,
    content: input.content ?? existing.content,
    coverImage: input.coverImage !== undefined ? input.coverImage : existing.coverImage,
    tags: input.tags ? input.tags.map((t) => t.trim()).filter(Boolean) : existing.tags,
    published: input.published !== undefined ? input.published : existing.published,
  };

  posts[idx] = updated;
  await writeAll(posts);
  return updated;
}

export async function deletePost(slug: string): Promise<void> {
  const posts = await readAll();
  const next = posts.filter((p) => p.slug !== slug);
  if (next.length === posts.length) throw new Error("Yazı bulunamadı.");
  await writeAll(next);
}
