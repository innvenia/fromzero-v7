import { getTranslations } from "next-intl/server";
import { DashboardPage } from "@web/dashboard/dashboard-page";
import type { AppLocale } from "@fw/i18n/routing";

type HomePageProps = {
  params: Promise<{
    locale: AppLocale;
  }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const layout = await getTranslations({ locale, namespace: "layout" });

  return (
    <DashboardPage
      locale={locale}
      copy={{
        activeUsersLabel: t("metrics.activeUsers.label"),
        activeUsersValue: t("metrics.activeUsers.value"),
        apiLatencyLabel: t("metrics.apiLatency.label"),
        apiLatencyValue: t("metrics.apiLatency.value"),
        billingLabel: t("metrics.billing.label"),
        billingValue: t("metrics.billing.value"),
        breadcrumb: t("breadcrumb"),
        buildStatusLabel: t("metrics.buildStatus.label"),
        buildStatusValue: t("metrics.buildStatus.value"),
        emptyDescription: t("empty.description"),
        emptyTitle: t("empty.title"),
        gridActionsColumn: t("grid.columns.actions"),
        gridActiveStatus: t("grid.status.active"),
        gridAriaLabel: t("grid.ariaLabel"),
        gridCodeColumn: t("grid.columns.code"),
        gridEmptyCell: t("grid.emptyCell"),
        gridLoadingLabel: t("grid.loading"),
        gridNameColumn: t("grid.columns.name"),
        gridNextPage: t("grid.nextPage"),
        gridPageSummary: t("grid.pageSummary"),
        gridPreviousPage: t("grid.previousPage"),
        gridSelectAllRows: t("grid.selectAllRows"),
        gridSelectRow: t("grid.selectRow"),
        gridTableColumn: t("grid.columns.table"),
        heading: t("heading"),
        navAriaLabel: layout("navigation.ariaLabel"),
        primaryAction: t("actions.primary"),
        searchPlaceholder: layout("topbar.search"),
        secondaryAction: t("actions.secondary"),
        status: t("status"),
        subtitle: t("subtitle")
      }}
    />
  );
}
