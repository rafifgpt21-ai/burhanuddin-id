import "server-only";

import type { PublicationType } from "@prisma/client";

import sourceData from "../../../prisma/seed-data/publication-sources.json";
import { buildPublicationSeed } from "../../../prisma/seed-data/build-publications";
import { featuredBooks, type Publication } from "@/data/site";
import { prisma } from "@/lib/prisma";

const typeKeys: Record<PublicationType, Publication["typeKey"]> = {
  BOOK: "book",
  JOURNAL_ARTICLE: "journal",
  BOOK_CHAPTER: "chapter",
  ADDITIONAL_RESEARCH_OUTPUT: "research",
};

let publicationDatabaseUnavailable = false;

function getCanonicalPublicationFallback(): Publication[] {
  const fallbackImages = new Map(
    featuredBooks
      .filter((publication) => publication.image)
      .map((publication) => [publication.title, publication.image!]),
  );
  return buildPublicationSeed(sourceData.records).map((record) => ({
    typeKey:
      record.sourceName === "Professorial-address audit 19 July 2026"
        ? "inaugural-address"
        : typeKeys[record.type],
    type: record.type,
    year: String(record.year),
    dateLabel: record.dateLabel || undefined,
    title: record.title,
    authors: record.authors,
    editors: record.editors,
    containerTitle: record.containerTitle || undefined,
    publisher: record.publisher || undefined,
    publicationPlace: record.publicationPlace || undefined,
    volume: record.volume || undefined,
    issue: record.issue || undefined,
    seriesNumber: record.seriesNumber || undefined,
    pages: record.pages || undefined,
    doi: record.doi || undefined,
    status: record.status,
    href:
      (record.doi ? `https://doi.org/${record.doi}` : undefined) ||
      record.externalUrl ||
      record.sourceUrl ||
      undefined,
    image: fallbackImages.get(record.title),
  }));
}

export async function getPublishedPublications(): Promise<Publication[]> {
  if (
    process.env.DATABASE_READY !== "true" ||
    publicationDatabaseUnavailable
  ) {
    return getCanonicalPublicationFallback();
  }

  const records = await prisma.publication
    .findMany({
      where: {
        contentStatus: "PUBLISHED",
        title: { not: "" },
        authors: { isEmpty: false },
      },
      include: { cardImage: true },
      orderBy: [{ year: "desc" }, { createdAt: "asc" }],
    })
    .catch(() => {
      publicationDatabaseUnavailable = true;
      return [];
    });
  if (publicationDatabaseUnavailable) {
    return getCanonicalPublicationFallback();
  }

  const publications = records
    .filter(
      (record) =>
        !/https?:\/\//i.test(record.title) &&
        (record.type === "BOOK" || Boolean(record.containerTitle)),
    )
    .map((record) => {
      const imageUrl = record.cardImage?.url || record.coverImage || undefined;
      return {
        id: record.id,
        typeKey:
          record.sourceName === "Professorial-address audit 19 July 2026"
            ? "inaugural-address"
            : typeKeys[record.type],
        type: record.type,
        year: String(record.year),
        dateLabel: record.dateLabel || undefined,
        title: record.title,
        authors: record.authors,
        editors: record.editors,
        containerTitle: record.containerTitle || undefined,
        publisher: record.publisher || undefined,
        publicationPlace: record.publicationPlace || undefined,
        volume: record.volume || undefined,
        issue: record.issue || undefined,
        seriesNumber: record.seriesNumber || undefined,
        pages: record.pages || undefined,
        doi: record.doi || undefined,
        status: record.status,
        href:
          (record.doi ? `https://doi.org/${record.doi}` : undefined) ||
          record.externalUrl ||
          record.sourceUrl ||
          undefined,
        image: imageUrl
          ? {
              url: imageUrl,
              altId: record.cardImage?.altTextId || undefined,
              altEn: record.cardImage?.altTextEn || undefined,
            }
          : undefined,
      } satisfies Publication;
    });
  return publications.length ? publications : getCanonicalPublicationFallback();
}
