import type { ReactNode } from "react";

type PageHeaderProps = Readonly<{
  actions?: ReactNode;
  breadcrumb: string;
  subtitle: string;
  title: string;
}>;

export function PageHeader({ actions, breadcrumb, subtitle, title }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[var(--divider)] pb-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="m-0 text-xs font-semibold uppercase text-[var(--text-muted)]">
          {breadcrumb}
        </p>
        <h1 className="m-0 mt-2 text-2xl font-bold text-[var(--text-strong)]">
          {title}
        </h1>
        <p className="m-0 mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          {subtitle}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
