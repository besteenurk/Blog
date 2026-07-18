// Client-safe utilities and types. No Node.js APIs (fs/path) in this file,
// since it's imported from client components like PostCard.

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  date: string;
  published: boolean;
  views: number;
}

export type PostInput = {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string | null;
  tags?: string[];
  published?: boolean;
  slug?: string;
};

export function slugify(input: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  const replaced = input
    .split("")
    .map((ch) => trMap[ch] ?? ch)
    .join("");
  return replaced
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function makeExcerpt(content: string, length = 160): string {
  const plain = content
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[[^\]]*]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= length) return plain;
  return plain.slice(0, length).trim() + "…";
}
