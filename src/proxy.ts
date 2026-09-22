import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE_NAME, createAccessToken } from "@/lib/siteAccess";

function safeDestination(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function proxy(request: NextRequest) {
  const expectedToken = await createAccessToken();
  const hasAccess =
    request.cookies.get(ACCESS_COOKIE_NAME)?.value === expectedToken;
  const { pathname, search } = request.nextUrl;

  if (pathname === "/access") {
    if (hasAccess) {
      return NextResponse.redirect(
        new URL(safeDestination(request.nextUrl.searchParams.get("next")), request.url),
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
    "/((?!api/access|_next/static|_next/image|favicon(?:-3)?\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|woff2?|otf)$).*)",
  ],
};
