import type { Publication } from "@/data/site";
import type { Locale } from "@/lib/i18n";

export const publicationGroupOrder = [
  "book",
  "journal",
  "chapter",
  "research",
] as const;

export type PublicationGroupKey = (typeof publicationGroupOrder)[number];

export function publicationGroupKey(
  publication: Publication,
): PublicationGroupKey {
  return publication.typeKey === "inaugural-address"
    ? "research"
    : publication.typeKey;
}

export function formatContributors(
  contributors: readonly string[],
  locale: Locale,
) {
  return new Intl.ListFormat(locale === "id" ? "id-ID" : "en", {
    style: "long",
    type: "conjunction",
  }).format(contributors);
}

export function publicationImprint(publication: Publication) {
  if (publication.typeKey === "book") {
    return [publication.publicationPlace, publication.publisher]
      .filter(Boolean)
      .join(": ");
  }
  return publication.containerTitle || publication.publisher || "";
}

export function publicationSearchText(publication: Publication) {
  return [
    publication.title,
    ...publication.authors,
    ...(publication.editors ?? []),
    publication.containerTitle,
    publication.publisher,
    publication.publicationPlace,
    publication.volume,
    publication.issue,
    publication.seriesNumber,
    publication.pages,
    publication.doi,
    publication.year,
  ]
    .filter(Boolean)
    .join(" ");
}

export function publicationSourceLabel(publication: Publication) {
  if (publication.doi) return `DOI ${publication.doi}`;
  if (!publication.href) return "";
  try {
    return new URL(publication.href).hostname.replace(/^www\./, "");
  } catch {
    return publication.href;
  }
}
