// Server-side check of a Cloudflare Turnstile token.
// Env: TURNSTILE_SECRET_KEY (server only, never NEXT_PUBLIC_).
// Without the secret the check is skipped, so local development keeps working
// before keys are set up. In production a warning is logged so it is noticed.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: unknown, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[s42 careers] TURNSTILE_SECRET_KEY is not set; bot check skipped.");
    }
    return true;
  }

  if (typeof token !== "string" || !token || token.length > 2048) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (!result.success) {
      console.warn("[s42 careers] Turnstile rejected", result["error-codes"]);
    }
    return result.success === true;
  } catch (error) {
    console.error("[s42 careers] Turnstile verify error", error);
    return false;
  }
}
