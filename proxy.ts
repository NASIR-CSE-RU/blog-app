import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_TOKEN_COOKIE, AUTH_USER_COOKIE } from "@/lib/auth/constants";

const AUTH_PAGES = new Set(["/login", "/registration"]);
const PROTECTED_PREFIXES = ["/feeds"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(AUTH_TOKEN_COOKIE)?.value);
  const hasUser = Boolean(request.cookies.get(AUTH_USER_COOKIE)?.value);
  const isAuthenticated = hasToken && hasUser;

  if (AUTH_PAGES.has(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/feeds", request.url));
  }

  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/registration", "/feeds/:path*"],
};
