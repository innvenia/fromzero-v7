import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isAppLocale, routing } from "@fw/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "From Zero Framework",
  description: "Reusable multi-tenant SaaS framework base."
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
