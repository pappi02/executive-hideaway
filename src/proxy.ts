import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  // Server Action POSTs (React submits these to the current page's own URL
  // with a `next-action` header) don't interact well with this middleware
  // wrapper — let them through and rely on requireAdmin() inside each
  // action instead. GET navigations are still fully gated below.
  if (req.headers.get("next-action")) return;

  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/admin/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
