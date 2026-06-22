import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: Readonly<HTMLAttributes<HTMLDivElement>>) {
  return (
    <section
      className={`rounded-[var(--r-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] ${className}`}
      {...props}
    />
  );
}
