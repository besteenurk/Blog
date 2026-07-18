import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isTokenValid } from "@/lib/auth";
import { deletePost, getPostBySlug, updatePost } from "@/lib/posts";

export const runtime = "nodejs";

async function requestIsAuthed(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return isTokenValid(token);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const authed = await requestIsAuthed(request);
  const post = await getPostBySlug(slug, { includeDrafts: authed });
  if (!post) {
    return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authed = await requestIsAuthed(request);
  if (!authed) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const { slug } = await params;
  try {
    const body = await request.json();
    const post = await updatePost(slug, body);
    return NextResponse.json({ post });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authed = await requestIsAuthed(request);
  if (!authed) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const { slug } = await params;
  try {
    await deletePost(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
