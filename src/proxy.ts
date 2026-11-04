import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE_NAME, verifySessionToken } from "@/lib/siteAccess";
import { isProtectedPath } from "@/lib/protectedPaths";

// Which pages are behind /access is set by NEXT_PUBLIC_PROTECTED_PATHS
// (see src/lib/protectedPaths.ts). The access system itself stays in place.

function safeDestination(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname !== "/access" && !isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const hasAccess = Boolean(
    await verifySessionToken(request.cookies.get(ACCESS_COOKIE_NAME)?.value),
  );

  if (pathname === "/access") {
    if (hasAccess) {
      return NextResponse.redirect(
        new URL(
          safeDestination(request.nextUrl.searchParams.get("next")),
          request.url,
        ),
      );
    }

    return NextResponse.next();
  }

  if (!hasAccess) {
    const accessUrl = new URL("/access", request.url);
    accessUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(accessUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // api/careers is public like api/access: the job application endpoint has
    // its own protection (Turnstile, rate limits, validation).
    "/((?!api/access|api/careers|robots\\.txt|sitemap\\.xml|_next/static|_next/image|favicon(?:-3)?\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|woff2?|otf)$).*)",
  ],
};
