import { NextResponse } from "next/server";
import {
  CHALLENGE_COOKIE_NAME,
  CHALLENGE_TTL_SECONDS,
  createChallenge,
  getClientIp,
  isAccessConfigured,
  isRateLimited,
  normalizeEmail,
} from "@/lib/siteAccess";
import { sendAccessCodeEmail } from "@/lib/resend";

export async function POST(request: Request) {
  if (!isAccessConfigured()) {
    return Response.json(
      { ok: false, message: "Access is not available right now." },
      { status: 503 },
    );
  }

  const payload = (await request.json().catch(() => null)) as {
    email?: unknown;
  } | null;
  const email = normalizeEmail(payload?.email);

  if (!email) {
    return Response.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);
  if (
    isRateLimited(`request-ip:${ip}`, 10, 60 * 60 * 1000) ||
    isRateLimited(`request-email:${email}`, 3, 10 * 60 * 1000)
  ) {
    return Response.json(
      {
        ok: false,
        message: "Too many requests. Please wait a few minutes and try again.",
      },
      { status: 429 },
    );
  }

  const challenge = await createChallenge(email);
  if (!challenge) {
    return Response.json(
      { ok: false, message: "Access is not available right now." },
      { status: 503 },
    );
  }

  const sent = await sendAccessCodeEmail(email, challenge.code);
  if (!sent) {
    return Response.json(
      {
        ok: false,
        message: "We could not send the code. Please try again shortly.",
      },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: CHALLENGE_COOKIE_NAME,
    value: challenge.token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/access",
    maxAge: CHALLENGE_TTL_SECONDS,
  });

  return response;
}
