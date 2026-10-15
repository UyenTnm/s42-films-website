import type { Profile } from "@/lib/siteAccess";

const RESEND_API = "https://api.resend.com";

const SITE_URL = (
  process.env.SITE_URL?.trim() || "https://www.s42films.com"
).replace(/\/$/, "");
const LOGO_URL = `${SITE_URL}/images/brand/s42-films-official.png`;

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
                                <img src="${LOGO_URL}" width="240" height="84" alt="S&bull;42 Films" style="display:block;margin:0 auto 28px;border:0;outline:none;width:240px;max-width:100%;height:auto;font-size:12px;letter-spacing:0.3em;color:#9a9a94;text-align:center;" />
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

/**
 * Saves a verified visitor as a Resend contact. Never throws.
 *
 * The company goes into a custom contact property called "company_name",
 * which must exist in Resend first (Contacts > Properties). If it does not,
 * the contact is still saved with email and name so no lead is lost.
 */
export async function saveContact(profile: Profile) {
  const apiKey = getApiKey();
  if (!apiKey) return;

  const segmentId = process.env.RESEND_SEGMENT_ID?.trim();
  const { email } = profile;
  const names = { first_name: profile.firstName, last_name: profile.lastName };
  const withCompany = {
    ...names,
    properties: { company_name: profile.company },
  };

  const send = (method: "POST" | "PATCH", fields: object) => {
    const isCreate = method === "POST";

    return fetch(
      isCreate
        ? `${RESEND_API}/contacts`
        : `${RESEND_API}/contacts/${encodeURIComponent(email)}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isCreate
            ? {
                email,
                ...fields,
                ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
              }
            : fields,
        ),
        signal: AbortSignal.timeout(5000),
      },
    );
  };

  // Create first; if the contact already exists, update it instead. Then
  // fall back to saving without the company property.
  const attempts: Array<["POST" | "PATCH", object]> = [
    ["POST", withCompany],
    ["PATCH", withCompany],
    ["POST", names],
    ["PATCH", names],
  ];

  try {
    let lastStatus = 0;

    for (const [method, fields] of attempts) {
      const response = await send(method, fields);

      if (response.ok) {
        if (fields === names) {
          console.warn(
            '[s42 access] Contact saved without company. Create the "company_name" property in Resend (Contacts > Properties).',
          );
        }
        return;
      }

      lastStatus = response.status;
      // Bad key, no permission or rate limited: retrying will not help.
      if ([401, 403, 429].includes(response.status)) break;
    }

    console.error("[s42 access] Resend contact failed", lastStatus);
  } catch (error) {
    console.error("[s42 access] Resend contact error", error);
  }
}
