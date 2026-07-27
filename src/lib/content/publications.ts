import "server-only";
import { unstable_cache } from "next/cache";

import type { PublicationType } from "@prisma/client";

import sourceData from "../../../prisma/seed-data/publication-sources.json";
import { buildPublicationSeed } from "../../../prisma/seed-data/build-publications";
import { publicationCoverSources } from "../../../prisma/seed-data/publication-covers";
import { featuredBooks, type Publication } from "@/data/site";
import { prisma } from "@/lib/prisma";
import { publicationInputSchema } from "@/lib/validation/content";

const typeKeys: Record<PublicationType, Publication["typeKey"]> = {
  BOOK: "book",
  JOURNAL_ARTICLE: "journal",
  BOOK_CHAPTER: "chapter",
  ADDITIONAL_RESEARCH_OUTPUT: "research",
};

let publicationDatabaseUnavailable = false;
const canonicalPublicationSeed = buildPublicationSeed(sourceData.records);
const canonicalPublicationByFingerprint = new Map(
  canonicalPublicationSeed.map((record) => [
    record.sourceFingerprint,
    record,
  ]),
);
const approvedCoverRightsByFingerprint = new Map(
  publicationCoverSources.map((cover) => [
    cover.fingerprint,
    cover.rightsNote,
  ]),
);

function getCanonicalPublicationFallback(): Publication[] {
  const fallbackImages = new Map(
    featuredBooks
      .filter((publication) => publication.image)
      .map((publication) => [publication.title, publication.image!]),
  );
  return canonicalPublicationSeed.map((record) => ({
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

  const records = await unstable_cache(() => prisma.publication.findMany({
      where: {
        contentStatus: "PUBLISHED",
        title: { not: "" },
      },
      include: { cardImage: true },
      orderBy: [{ year: "desc" }, { createdAt: "asc" }],
    }), ["published-publications-v3"], { tags: ["content:publication"] })().catch(() => {
      publicationDatabaseUnavailable = true;
      return [];
    });
  if (publicationDatabaseUnavailable) {
    return getCanonicalPublicationFallback();
  }

  const publications = records.flatMap((record) => {
      const canonical = record.sourceFingerprint
        ? canonicalPublicationByFingerprint.get(record.sourceFingerprint)
        : undefined;
      const migrationValue = canonical ?? record;
      const migrationCoverImage =
        record.cardImage?.url ?? record.coverImage ?? "";
      const migrationCoverRights =
        record.cardImage?.rightsNote ??
        (record.sourceFingerprint
          ? approvedCoverRightsByFingerprint.get(record.sourceFingerprint)
          : undefined) ??
        "";
      const parsed = publicationInputSchema.safeParse(
        record.publishedSnapshot ?? {
          type: migrationValue.type,
          title: migrationValue.title,
          authors: migrationValue.authors,
          editors: migrationValue.editors,
          year: migrationValue.year,
          dateLabel: migrationValue.dateLabel ?? "",
          containerTitle: migrationValue.containerTitle ?? "",
          venue: migrationValue.venue ?? "",
          publisher: migrationValue.publisher ?? "",
          publicationPlace: migrationValue.publicationPlace ?? "",
          volume: migrationValue.volume ?? "",
          issue: migrationValue.issue ?? "",
          seriesNumber: migrationValue.seriesNumber ?? "",
          pages: migrationValue.pages ?? "",
          doi: migrationValue.doi ?? "",
          externalUrl: migrationValue.externalUrl ?? "",
          status: migrationValue.status,
          coverImage: migrationCoverImage,
          coverRightsNote: migrationCoverRights,
          sourceName: migrationValue.sourceName,
          sourceUrl: migrationValue.sourceUrl ?? "",
          sourceNote: migrationValue.sourceNote,
        },
      );
      if (!parsed.success) return [];
      const value = parsed.data;
      const imageUrl = value.coverImage || undefined;
      return [{
        id: record.id,
        homepageOrder: record.homepageOrder ?? undefined,
        typeKey:
          record.sourceName === "Professorial-address audit 19 July 2026"
            ? "inaugural-address"
            : typeKeys[record.type],
        type: value.type,
        year: String(value.year),
        dateLabel: value.dateLabel || undefined,
        title: value.title,
        authors: value.authors,
        editors: value.editors,
        containerTitle: value.containerTitle || undefined,
        publisher: value.publisher || undefined,
        publicationPlace: value.publicationPlace || undefined,
        volume: value.volume || undefined,
        issue: value.issue || undefined,
        seriesNumber: value.seriesNumber || undefined,
        pages: value.pages || undefined,
        doi: value.doi || undefined,
        status: value.status,
        href:
          (value.doi ? `https://doi.org/${value.doi}` : undefined) ||
          value.externalUrl ||
          value.sourceUrl ||
          undefined,
        image: imageUrl
          ? {
              url: imageUrl,
              altId: record.cardImage?.altTextId || undefined,
              altEn: record.cardImage?.altTextEn || undefined,
            }
          : undefined,
      } satisfies Publication];
    });
  publications.sort((first, second) => {
    const year = Number(second.year) - Number(first.year);
    return year || first.title.localeCompare(second.title);
  });
  return publications.length ? publications : getCanonicalPublicationFallback();
}
