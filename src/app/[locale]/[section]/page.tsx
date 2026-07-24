import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import {
  AboutPage,
  MaterialsPage,
  PostsPage,
  PublicationsPage,
} from "@/components/pages/collection-pages";
import {
  ContactPage,
  OutreachPage,
  ResearchPage,
} from "@/components/pages/public-pages";
import { getDictionary } from "@/data/translations";
import {
  getRoutePath,
  hasLocale,
  sectionMatchesLocale,
  type Locale,
  type RouteKey,
} from "@/lib/i18n";

type RouteParams = Promise<{ locale: string; section: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function metadataCopy(locale: Locale, route: RouteKey) {
  const dictionary = getDictionary(locale);
  switch (route) {
    case "materials":
      return dictionary.materials;
    case "posts":
      return dictionary.posts;
    case "agenda":
      return dictionary.agenda;
    case "publications":
      return dictionary.publications;
    case "about":
      return dictionary.about;
    case "research":
      return dictionary.researchPage;
    case "outreach":
      return dictionary.outreachPage;
    case "contact":
      return dictionary.contactPage;
    default:
      return undefined;
  }
}

export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { locale, section } = await params;
  if (!hasLocale(locale)) return {};
  const route = sectionMatchesLocale(section, locale);
  const copy = route ? metadataCopy(locale, route) : undefined;
  if (!route || !copy) return {};

  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    alternates: {
      canonical: getRoutePath(locale, route),
      languages: {
        id: getRoutePath("id", route),
        en: getRoutePath("en", route),
      },
    },
  };
}

export default async function LocalizedSectionPage({
  params,
  searchParams,
}: {
  params: RouteParams;
  searchParams: SearchParams;
}) {
  const [{ locale, section }, filters] = await Promise.all([params, searchParams]);
  if (!hasLocale(locale)) notFound();

  if (locale === "id" && section === "tentang") {
    permanentRedirect(getRoutePath(locale, "about"));
  }

  if (section === "agenda") {
    permanentRedirect(`${getRoutePath(locale, "outreach")}#agenda`);
  }

  const route = sectionMatchesLocale(section, locale);

  switch (route) {
    case "materials":
      return <MaterialsPage locale={locale} filters={filters} />;
    case "posts":
      return <PostsPage locale={locale} filters={filters} />;
    case "publications":
      return <PublicationsPage locale={locale} filters={filters} />;
    case "about":
      return <AboutPage locale={locale} />;
    case "research":
      return <ResearchPage locale={locale} />;
    case "outreach":
      return <OutreachPage locale={locale} />;
    case "contact":
      return <ContactPage locale={locale} />;
    default:
      notFound();
  }
}
