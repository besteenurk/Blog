import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isTokenValid } from "@/lib/auth";

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/posts",
    "/api/posts/:path*",
    "/api/upload",
    "/api/upload/:path*",
  ],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Reading posts is always public.
  if (pathname.startsWith("/api/posts") && request.method === "GET") {
    return NextResponse.next();
  }

  // The login page itself must stay reachable.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await isTokenValid(token);

  if (!authed) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
