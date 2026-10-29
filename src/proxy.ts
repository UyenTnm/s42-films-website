import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE_NAME, verifySessionToken } from "@/lib/siteAccess";

// Pages anyone may open without the private-access code. Everything else
// (films, slate, confidential materials) stays behind /access.
const PUBLIC_PATHS = ["/careers"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function safeDestination(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname)) return NextResponse.next();

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
