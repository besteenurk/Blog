import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isTokenValid } from "@/lib/auth";
import { createPost, getAllPosts } from "@/lib/posts";

export const runtime = "nodejs";

async function requestIsAuthed(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return isTokenValid(token);
}

export async function GET(request: NextRequest) {
  const authed = await requestIsAuthed(request);
  const wantsAll = new URL(request.url).searchParams.get("all") === "true";
  const posts = await getAllPosts({ includeDrafts: wantsAll && authed });
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const authed = await requestIsAuthed(request);
  if (!authed) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const post = await createPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
