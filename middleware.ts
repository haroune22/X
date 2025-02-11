import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Define paths that should NOT be protected (login, sign-up, API, and static assets)
    const publicPaths = ["/auth/signin", "/auth/signup", "/api", "/_next", "/favicon.ico"];

    // Checking if request path is public
    const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));

    // If user is not authenticated and the path is NOT public, redirect to sign-in
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
}

// ✅here we apply middleware to all pages
export const config = {
    matcher: "/:path*",
};
