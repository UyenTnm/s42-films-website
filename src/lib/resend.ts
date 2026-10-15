// Minimal Resend client (REST, no extra dependency).
// Docs: https://resend.com/docs/api-reference

const RESEND_API = "https://api.resend.com";

function getApiKey() {
  return process.env.RESEND_API_KEY?.trim() || null;
}

export function isEmailConfigured() {
  return getApiKey() !== null && Boolean(process.env.RESEND_FROM?.trim());
}

export async function sendAccessCodeEmail(to: string, code: string) {
  const apiKey = getApiKey();
  const from = process.env.RESEND_FROM?.trim();

  if (!apiKey || !from) {
    // Local development convenience: print the code instead of emailing it.
    if (process.env.NODE_ENV !== "production") {
      console.info(`[s42 access] code for ${to}: ${code}`);
      return true;
    }
    return false;
  }

  const spacedCode = code.split("").join(" ");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#050505;font-family:Helvetica,Arial,sans-serif;color:#f1f1ed;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;border:1px solid #2a2a2a;background:#0b0b0b;">
            <tr>
              <td style="padding:36px 32px;text-align:center;">
                <p style="margin:0 0 24px;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#9a9a96;">S&bull;42 Films</p>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#cfcfca;">Your private access code is</p>
                <p style="margin:0 0 24px;font-size:36px;font-weight:700;letter-spacing:0.18em;color:#ffffff;">${spacedCode}</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#8a8a86;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Your S•42 Films private access code is ${code}.\n\nIt expires in 10 minutes. If you did not request it, you can ignore this email.`;

  try {
    const response = await fetch(`${RESEND_API}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Your S•42 access code: ${code}`,
        html,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("[s42 access] Resend email failed", response.status);
    }

    return response.ok;
  } catch (error) {
    console.error("[s42 access] Resend email error", error);
    return false;
  }
}

/** Saves a verified email as a Resend contact. Never throws. */
export async function saveContact(email: string) {
  const apiKey = getApiKey();
  if (!apiKey) return;

  const segmentId = process.env.RESEND_SEGMENT_ID?.trim();

  try {
    const response = await fetch(`${RESEND_API}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
      }),
      signal: AbortSignal.timeout(5000),
    });

    // An existing contact is not an error worth surfacing to the visitor.
    if (!response.ok && response.status !== 409) {
      console.error("[s42 access] Resend contact failed", response.status);
    }
  } catch (error) {
    console.error("[s42 access] Resend contact error", error);
  }
}
