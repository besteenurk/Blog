import { NextRequest, NextResponse } from "next/server";
import { incrementViews } from "@/lib/posts";

export const runtime = "nodejs";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const views = await incrementViews(slug);
  if (views === null) {
    return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ views });
}
