import { Download, Plus } from "lucide-react";
import type { AppLocale } from "@fw/i18n/routing";
import { AppShell } from "@fw/ui/layout/app-shell";
import { Badge, Button, Card, PageHeader, StatCard } from "@fw/ui/components";

type DashboardCopy = {
  activeUsersLabel: string;
  activeUsersValue: string;
  apiLatencyLabel: string;
  apiLatencyValue: string;
  billingLabel: string;
  billingValue: string;
  breadcrumb: string;
  buildStatusLabel: string;
  buildStatusValue: string;
  emptyDescription: string;
  emptyTitle: string;
  heading: string;
  navAriaLabel: string;
  primaryAction: string;
  searchPlaceholder: string;
  secondaryAction: string;
  status: string;
  subtitle: string;
};

type DashboardPageProps = {
  copy: DashboardCopy;
  locale: AppLocale;
};

export function DashboardPage({ copy, locale }: DashboardPageProps) {
  return (
    <AppShell
      copy={{
        navAriaLabel: copy.navAriaLabel,
        searchPlaceholder: copy.searchPlaceholder
      }}
      locale={locale}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <PageHeader
          actions={
            <>
              <Button variant="secondary">
                <Download aria-hidden="true" size={16} />
                {copy.secondaryAction}
              </Button>
              <Button variant="primary">
                <Plus aria-hidden="true" size={16} />
                {copy.primaryAction}
              </Button>
            </>
          }
          breadcrumb={copy.breadcrumb}
          subtitle={copy.subtitle}
          title={copy.heading}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={copy.activeUsersLabel} value={copy.activeUsersValue} />
          <StatCard label={copy.apiLatencyLabel} value={copy.apiLatencyValue} />
          <StatCard label={copy.billingLabel} value={copy.billingValue} />
          <StatCard label={copy.buildStatusLabel} value={copy.buildStatusValue} />
        </div>
        <Card className="grid min-h-[260px] place-items-center p-6 text-center">
          <div className="max-w-md">
            <Badge tone="info">{copy.status}</Badge>
            <h2 className="m-0 mt-4 text-lg font-bold text-[var(--text-strong)]">
              {copy.emptyTitle}
            </h2>
            <p className="m-0 mt-2 text-sm text-[var(--text-muted)]">
              {copy.emptyDescription}
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
