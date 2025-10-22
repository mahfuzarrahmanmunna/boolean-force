import { NextResponse } from "next/server";

export function middleware(request) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get("host") || "";

    console.log("🔥 Hostname:", hostname, "Path:", url.pathname);

    // ✅ Check if the request is for the admin subdomain
    const isAdminSubdomain = hostname.startsWith("admin.");

    // --- Handle admin subdomain ---
    if (isAdminSubdomain) {
        // If user is on admin subdomain but not already under /admin
        if (!url.pathname.startsWith("/admin")) {
            url.pathname = `/admin${url.pathname}`;
            return NextResponse.rewrite(url);
        }
    }

    // --- (Optional) Block direct /admin access on main domain ---
    const isMainDomain = hostname.includes("booleanforce.localhost") && !hostname.startsWith("admin.");

    if (isMainDomain && url.pathname.startsWith("/admin")) {
        url.pathname = "/404";
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
