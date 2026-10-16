import type { Metadata } from "next";
import PrivateAccessForm from "@/components/access/PrivateAccessForm";

// export const metadata: Metadata = {
//   title: "Private Access | S•42 Films",
//   description: "Private access to the S•42 Films development slate.",
//   robots: { index: false, follow: false },
// };

export const metadata: Metadata = {
  title: "S•42 Films — Independent Entertainment Studio | Private Access",
  description:
    "S•42 Films is an independent entertainment studio developing forty-two original stories, virtual stars, films and series for audiences worldwide. Private access to our development slate.",
  alternates: { canonical: "/access" },
  robots: { index: true, follow: false },
};

function safeDestination(value: string | string[] | undefined) {
  const destination = Array.isArray(value) ? value[0] : value;
  return destination?.startsWith("/") && !destination.startsWith("//")
    ? destination
    : "/";
}

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string | string[];
  }>;
}) {
  const query = await searchParams;

  return <PrivateAccessForm destination={safeDestination(query.next)} />;
}
