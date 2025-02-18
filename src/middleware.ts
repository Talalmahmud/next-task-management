import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is already logged in, redirect them to their role-based page
  if (token) {
    const role = token.role;
    const pathname = req.nextUrl.pathname;

    // If the user is trying to access the login page, redirect to their role-based page
    if (pathname === "/login") {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (role === "CUSTOMER") {
        return NextResponse.redirect(new URL("/user", req.url));
      }
    }

    if (pathname === "/") {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (role === "CUSTOMER") {
        return NextResponse.redirect(new URL("/user", req.url));
      }
    }

    // Allow access to role-specific pages
    if (
      (role === "ADMIN" && pathname.startsWith("/admin")) ||
      (role === "CUSTOMER" && pathname.startsWith("/user"))
    ) {
      return NextResponse.next();
    }

    // Redirect based on role to their respective home page
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }

  // If no token, redirect to login page
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
