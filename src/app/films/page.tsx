import type { Metadata } from "next";
import FilmIndex from "@/components/landing/FilmIndex";

export const metadata: Metadata = {
  title: "Our Films | S•42",
  description:
    "Explore the active S•42 film roster: original worlds developed with cinematic ambition and technical excellence.",
};

export default function FilmsPage() {
  return <FilmIndex />;
}
