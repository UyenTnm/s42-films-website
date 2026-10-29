import type { Metadata } from "next";
import ApplicationForm from "@/components/careers/ApplicationForm";

const SITE_URL = (
  process.env.SITE_URL?.trim() || "https://www.s42films.com"
).replace(/\/$/, "");

// Ngày đăng tin. Đổi khi đăng lại tin mới.
const DATE_POSTED = "2026-10-29";

export const metadata: Metadata = {
  title: "Careers — AI Creative | Studio 42",
  description:
    "Studio 42 is hiring AI Creatives in Ho Chi Minh City — full-time and internship. Apply with your portfolio and showreel.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Join Studio 42 as an AI Creative",
    description:
      "Full-time and internship roles in Ho Chi Minh City for creatives working with AI image and video tools.",
    url: "/careers",
    type: "website",
  },
};

const description = `
<p>Studio 42 (S•42 Films) is looking for AI Creatives to join our team on-site in Ho Chi Minh City.</p>
<p>You will create images and video with AI tools such as Midjourney, Kling, Runway, Google Veo, Higgsfield and ComfyUI, and bring them together through editing, visual storytelling, VFX and motion graphics.</p>
<p><strong>What we ask for:</strong> a portfolio or showreel, your CV, and experience with AI creative tools. Internship applicants are welcome.</p>
<p>Apply online at ${SITE_URL}/careers.</p>`.trim();

function jobPosting(employmentType: "FULL_TIME" | "INTERN", title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted: DATE_POSTED,
    employmentType,
    directApply: true,
    url: `${SITE_URL}/careers`,
    hiringOrganization: {
      "@type": "Organization",
      name: "S•42 Films",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/images/brand/s42-films-official.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ho Chi Minh City",
        addressRegion: "Ho Chi Minh City",
        addressCountry: "VN",
      },
    },
  };
}

const structuredData = [
  jobPosting("FULL_TIME", "AI Creative (Full-time)"),
  jobPosting("INTERN", "AI Creative (Internship)"),
];

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static data only; "<" is escaped so the JSON can never close the tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <ApplicationForm />
    </>
  );
}
