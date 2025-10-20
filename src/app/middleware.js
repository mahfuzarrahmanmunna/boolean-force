import { NextResponse } from "next/server";

export function middleware(request) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get("host") || "";

    console.log("🔥 Hostname:", hostname, "Path:", url.pathname);

    // --- Handle Admin Subdomain ---
    // Using .includes() is more flexible and avoids issues with ports or www.
    const isAdminSubdomain = hostname.includes("admin.booleanforce.localhost");

    if (isAdminSubdomain) {
        // If the path is not already /admin, rewrite it.
        // This handles the root "/" and any other path like "/dashboard".
        if (!url.pathname.startsWith("/admin")) {
            url.pathname = `/admin${url.pathname}`;
            return NextResponse.rewrite(url);
        }
    }

    // --- Block Direct /admin on Main Domain ---
    const isMainDomain = hostname.includes("booleanforce.localhost") && !hostname.includes("admin.");

    if (isMainDomain && url.pathname.startsWith("/admin")) {
        // You can return a 404 response directly, which is often cleaner than a rewrite.
        // return new NextResponse("Not Found", { status: 404 });
        // Or stick with your rewrite to a 404 page:
        url.pathname = "/404";
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

// This matcher ensures the middleware only runs on page requests, not on images, fonts, etc.
// This is a performance best practice.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};