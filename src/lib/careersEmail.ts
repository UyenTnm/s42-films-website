import {
  CONTACT_EMAIL,
  formatVnPhone,
  formatVnd,
  type Application,
} from "@/lib/careers";
import type { CvUpload } from "@/lib/mondayCareers";

// Careers emails via Resend, same setup as src/lib/resend.ts
// (RESEND_API_KEY + RESEND_FROM). CAREERS_NOTIFY_EMAIL overrides who receives
// new applications; it defaults to hello@s42films.com.

const RESEND_API = "https://api.resend.com";
const SITE_URL = (
  process.env.SITE_URL?.trim() || "https://www.s42films.com"
).replace(/\/$/, "");
const LOGO_URL = `${SITE_URL}/images/brand/s42-films-official.png`;

/** Everything a candidate typed is escaped before it goes into HTML. */
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Removes line breaks so user input can never inject email headers. */
function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function toBase64(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64");
}

async function send(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachment?: CvUpload | null;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[s42 careers] email to ${payload.to}: ${payload.subject}`);
      return true;
    }
    return false;
  }

  try {
    const response = await fetch(`${RESEND_API}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: payload.to,
        subject: oneLine(payload.subject),
        html: payload.html,
        text: payload.text,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
        ...(payload.attachment
          ? {
              attachments: [
                {
                  filename: payload.attachment.name,
                  content: toBase64(payload.attachment.bytes),
                },
              ],
            }
          : {}),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      console.error("[s42 careers] Resend email failed", response.status);
    }
    return response.ok;
  } catch (error) {
    console.error("[s42 careers] Resend email error", error);
    return false;
  }
}

function shell(inner: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#050505;font-family:Helvetica,Arial,sans-serif;color:#f1f1ed;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;border:1px solid #2a2a2a;background:#0b0b0b;">
            <tr>
              <td style="padding:36px 32px;">
                <img src="${LOGO_URL}" width="200" alt="S&bull;42 Films" style="display:block;margin:0 auto 28px;border:0;width:200px;max-width:100%;height:auto;" />
                ${inner}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function rows(app: Application, cv: CvUpload | null): Array<[string, string]> {
  return [
    ["Full name", app.fullName],
    ["Email", app.email],
    ["Phone", formatVnPhone(app.phone)],
    ["Location", app.location],
    ["Position", app.position],
    ["Experience with AI tools", app.experience],
    ["Creative strengths", app.strengths.join(", ")],
    ["AI tools", app.tools.join(", ")],
    ["English", app.english || "—"],
    ["Portfolio / showreel", app.portfolioUrl],
    ["CV / resume", cv ? `Attached: ${cv.name}` : app.cvUrl],
    ["Best AI project", app.bestProjectUrl || "—"],
    ["On-site in HCMC", app.onSite === "yes" ? "Yes" : "No"],
    ["Can start", app.startDate],
    ["Expected salary", `${formatVnd(app.salaryMin)} – ${formatVnd(app.salaryMax)}`],
    ["Anything else", app.notes || "—"],
  ];
}

/** New application → team inbox. Reply-To is the candidate; CV attached. */
export function sendApplicationNotification(
  app: Application,
  cv: CvUpload | null,
) {
  const to = process.env.CAREERS_NOTIFY_EMAIL?.trim() || CONTACT_EMAIL;
  const list = rows(app, cv);

  const table = list
    .map(([label, value]) => {
      const isLink = /^https?:\/\//.test(value);
      const shown = isLink
        ? `<a href="${esc(value)}" style="color:#f1f1ed;">${esc(value)}</a>`
        : esc(value).replace(/\n/g, "<br />");
      return `<tr>
        <td style="padding:8px 12px 8px 0;vertical-align:top;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8a86;white-space:nowrap;">${esc(label)}</td>
        <td style="padding:8px 0;font-size:14px;line-height:1.5;color:#f1f1ed;word-break:break-word;">${shown}</td>
      </tr>`;
    })
    .join("");

  const html = shell(`
    <p style="margin:0 0 20px;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:#9a9a94;text-align:center;">New application</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2a2a2a;">${table}</table>`);

  const text = list.map(([label, value]) => `${label}: ${value}`).join("\n");

  return send({
    to,
    subject: `New application: ${app.fullName} — ${app.position}`,
    html,
    text,
    replyTo: app.email,
    attachment: cv,
  });
}

/** Confirmation → candidate. */
export function sendApplicationConfirmation(app: Application) {
  const firstName = app.fullName.split(/\s+/)[0] || app.fullName;

  const html = shell(`
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#cfcfca;">Hi ${esc(firstName)},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#cfcfca;">Thank you for applying to Studio 42 for the <strong style="color:#ffffff;">${esc(app.position)}</strong> role. We've received your application.</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#cfcfca;">Our team will review your profile and contact you if you're shortlisted.</p>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#8a8a86;">Questions? Write to <a href="mailto:${CONTACT_EMAIL}" style="color:#f1f1ed;">${CONTACT_EMAIL}</a>.</p>`);

  const text = `Hi ${firstName},

Thank you for applying to Studio 42 for the ${app.position} role. We've received your application.

Our team will review your profile and contact you if you're shortlisted.

Questions? Write to ${CONTACT_EMAIL}.`;

  return send({
    to: app.email,
    subject: "We received your application — Studio 42",
    html,
    text,
  });
}
