"use client";

import Link from "next/link";

interface BackToHomeLinkProps {
  className?: string;
  children: React.ReactNode;
}

export default function BackToHomeLink({
  className,
  children,
}: BackToHomeLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/";
  };

  return (
    <Link href="/" onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
