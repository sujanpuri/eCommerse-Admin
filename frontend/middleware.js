import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow these paths without login
  const isPublic =
    pathname === "/routes/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") || // nextjs internals
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/public");

  // Redirect to /login if trying to access anything else without session
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/routes/login", req.url));
  }

  return NextResponse.next(); // Allow if logged in or public
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};