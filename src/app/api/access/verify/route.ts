import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_COOKIE_MAX_AGE,
  ACCESS_COOKIE_NAME,
  CHALLENGE_COOKIE_NAME,
  createSessionToken,
  getClientIp,
  isAccessConfigured,
  isRateLimited,
  sanitizeCode,
  verifyChallenge,
} from "@/lib/siteAccess";
import { saveContact } from "@/lib/resend";

export async function POST(request: NextRequest) {
  if (!isAccessConfigured()) {
    return Response.json(
      { ok: false, message: "Access is not available right now." },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  if (isRateLimited(`verify-ip:${ip}`, 30, 10 * 60 * 1000)) {
    return Response.json(
      {
        ok: false,
        message: "Too many attempts. Please wait a few minutes and try again.",
      },
      { status: 429 },
    );
  }

  const payload = (await request.json().catch(() => null)) as {
    code?: unknown;
  } | null;
  const code = sanitizeCode(payload?.code);

  if (!code) {
    return Response.json(
      { ok: false, message: "Enter the 6-digit code from your email." },
      { status: 400 },
    );
  }

  const challengeToken = request.cookies.get(CHALLENGE_COOKIE_NAME)?.value;
  const profile = await verifyChallenge(challengeToken, code);

  if (!profile) {
    return Response.json(
      {
        ok: false,
        message: "That code is not valid or has expired. Please try again.",
      },
      { status: 401 },
    );
  }

  const sessionToken = await createSessionToken(profile.email);
  if (!sessionToken) {
    return Response.json(
      { ok: false, message: "Access is not available right now." },
      { status: 503 },
    );
  }

  // Keep the verified visitor as a contact; a failure here never blocks access.
  await saveContact(profile);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
    priority: "high",
  });
  response.cookies.set({
    name: CHALLENGE_COOKIE_NAME,
    value: "",
    path: "/api/access",
    maxAge: 0,
  });

  return response;
}
