import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isTokenValid } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await isTokenValid(token);
  return NextResponse.json({ authed });
}
