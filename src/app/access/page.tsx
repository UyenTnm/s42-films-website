import type { Metadata } from "next";
import PrivateAccessForm from "@/components/access/PrivateAccessForm";

export const metadata: Metadata = {
  title: "Private Access | S•42 Films",
  description: "Private access to the S•42 Films development slate.",
  robots: { index: false, follow: false },
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
    error?: string | string[];
  }>;
}) {
  const query = await searchParams;

  return (
    <PrivateAccessForm
      destination={safeDestination(query.next)}
      initialMessage={
        query.error === "invalid"
          ? "That access code is not recognised."
          : ""
      }
    />
  );
}
