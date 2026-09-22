import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_MAX_AGE,
  ACCESS_COOKIE_NAME,
  createAccessToken,
  isValidAccessCode,
} from "@/lib/siteAccess";

function safeDestination(value: FormDataEntryValue | null) {
  const destination = typeof value === "string" ? value : "/";
  return destination.startsWith("/") && !destination.startsWith("//")
    ? destination
    : "/";
}

function redirectTo(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: path },
  });
}

export async function POST(request: Request) {
  const isJson = request.headers
    .get("content-type")
    ?.includes("application/json");
  let code = "";
  let destination = "/";

  if (isJson) {
    const payload = (await request.json().catch(() => null)) as {
      code?: unknown;
    } | null;
    code = typeof payload?.code === "string" ? payload.code : "";
  } else {
    const formData = await request.formData();
    code = String(formData.get("access-code") || "");
    destination = safeDestination(formData.get("next"));
  }

  if (!isValidAccessCode(code)) {
    if (!isJson) {
      const params = new URLSearchParams({
        error: "invalid",
        next: destination,
      });
      return redirectTo(`/access?${params.toString()}`);
    }

    return Response.json(
      { ok: false, message: "That access code is not recognised." },
      { status: 401 },
    );
  }

  const response = isJson
    ? NextResponse.json({ ok: true })
    : redirectTo(destination);

  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: await createAccessToken(),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
    priority: "high",
  });

  return response;
}
