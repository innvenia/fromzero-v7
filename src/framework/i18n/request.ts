import { getRequestConfig } from "next-intl/server";
import { isAppLocale, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isAppLocale(requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {
      common: (await import(`./${locale}/common.json`)).default,
      dashboard: (await import(`../../web/i18n/${locale}/dashboard.json`)).default,
      layout: (await import(`./${locale}/layout.json`)).default,
      validation: (await import(`./${locale}/validation.json`)).default
    },
    timeZone: "UTC"
  };
});
