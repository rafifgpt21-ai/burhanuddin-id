import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePage } from "@/components/pages/home-page";
import { getRoutePath, hasLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};

  return {
    title: { absolute: "Burhanuddin Muhtadi" },
    alternates: {
      canonical: getRoutePath(locale, "home"),
      languages: {
        id: getRoutePath("id", "home"),
        en: getRoutePath("en", "home"),
        "x-default": "/",
      },
    },
  };
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return <HomePage locale={locale} />;
}
