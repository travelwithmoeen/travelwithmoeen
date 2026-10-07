import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/office")) return NextResponse.next();
  if (pathname === "/office/login") return NextResponse.next();
  const session = request.cookies.get("twm_office");
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/office/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/office/:path*"],
};
