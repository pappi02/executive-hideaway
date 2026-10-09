import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Uses the database-free config so Prisma is not bundled into the proxy function.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Server Action POSTs (React submits these to the current page's own URL
  // with a `next-action` header) don't interact well with this middleware
  // wrapper — let them through and rely on requireAdmin() inside each
  // action instead. Only POSTs are actions: a GET carrying the header is an
  // ordinary page render, so it must not skip the gate below.
  if (req.method === "POST" && req.headers.has("next-action")) return;

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
