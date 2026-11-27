import type { ReactNode } from "react";
import FilmContentProtection from "@/components/security/FilmContentProtection";

export default function FilmsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <FilmContentProtection />
    </>
  );
}
