import Link from "next/link";
import { Bell, Boxes, Gauge, Globe2, Search, Settings, ShieldCheck } from "lucide-react";
import type { AppLocale } from "@fw/i18n/routing";

type AppShellCopy = {
  navAriaLabel: string;
  searchPlaceholder: string;
};

type AppShellProps = {
  children: React.ReactNode;
  copy: AppShellCopy;
  locale: AppLocale;
};

const navigation = [
  { href: "", icon: Gauge, labelKey: "Overview" },
  { href: "modules", icon: Boxes, labelKey: "Modules" },
  { href: "security", icon: ShieldCheck, labelKey: "Security" },
  { href: "settings", icon: Settings, labelKey: "Settings" }
];

export function AppShell({ children, copy, locale }: AppShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-[var(--bg)] md:grid-cols-[var(--sidebar-w)_1fr]">
      <aside className="hidden border-r border-[var(--border)] bg-[var(--surface)] md:block">
        <div className="flex h-[var(--header-h)] items-center gap-3 border-b border-[var(--divider)] px-5">
          <div className="grid size-9 place-items-center rounded-[var(--r-input)] bg-[var(--text-strong)] text-sm font-bold text-white">
            FZ
          </div>
          <div className="min-w-0">
            <p className="m-0 text-sm font-bold text-[var(--text-strong)]">From Zero</p>
            <p className="m-0 text-xs font-semibold uppercase text-[var(--text-muted)]">Framework</p>
          </div>
        </div>
        <nav aria-label={copy.navAriaLabel} className="flex flex-col gap-1 p-3">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const href = item.href ? `/${locale}/${item.href}` : `/${locale}`;
            return (
              <Link
                aria-current={index === 0 ? "page" : undefined}
                className="flex h-10 items-center gap-3 rounded-[var(--r-input)] px-3 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text)] aria-[current=page]:bg-[var(--accent-soft)] aria-[current=page]:text-[var(--accent)]"
                href={href}
                key={item.href}
              >
                <Icon aria-hidden="true" size={18} />
                <span>{item.labelKey}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-[var(--header-h)] items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 md:px-6">
          <div className="relative flex min-w-0 flex-1 items-center">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 text-[var(--text-faint)]" size={16} />
            <input
              aria-label={copy.searchPlaceholder}
              className="h-10 w-full max-w-xl rounded-[var(--r-input)] border border-[var(--border)] bg-[var(--surface-sunken)] pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-transparent sm:placeholder:text-[var(--text-muted)]"
              placeholder={copy.searchPlaceholder}
              type="search"
            />
          </div>
          <Link
            aria-label={locale === "es" ? "Switch to English" : "Cambiar a español"}
            className="grid size-10 place-items-center rounded-[var(--r-input)] border border-[var(--border-strong)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
            href={locale === "es" ? "/en" : "/es"}
          >
            <Globe2 aria-hidden="true" size={18} />
          </Link>
          <button
            aria-label="Notifications"
            className="grid size-10 place-items-center rounded-[var(--r-input)] border border-[var(--border-strong)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
            type="button"
          >
            <Bell aria-hidden="true" size={18} />
          </button>
        </header>
        <main className="px-4 py-5 md:px-[var(--content-px)] md:py-[var(--content-py)]">
          {children}
        </main>
      </div>
    </div>
  );
}
