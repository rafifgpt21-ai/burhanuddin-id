import "server-only";

import type { PublicationType } from "@prisma/client";

import type { Publication } from "@/data/site";
import { extractFirstHttpsUrl } from "@/lib/content/publication-url";
import { prisma } from "@/lib/prisma";

const typeKeys: Record<PublicationType, Publication["typeKey"]> = {
  BOOK: "book",
  JOURNAL_ARTICLE: "journal",
  BOOK_CHAPTER: "chapter",
  ADDITIONAL_RESEARCH_OUTPUT: "research",
};

export async function getPublishedPublications(): Promise<Publication[]> {
  if (process.env.DATABASE_READY !== "true") return [];

  const records = await prisma.publication.findMany({
    where: { contentStatus: "PUBLISHED" },
    orderBy: [{ year: "desc" }, { createdAt: "asc" }],
  });

  return records.map((record) => ({
    id: record.id,
    typeKey:
      record.sourceName === "Professorial-address audit 19 July 2026"
        ? "inaugural-address"
        : typeKeys[record.type],
    type: record.type,
    year: String(record.year),
    title: record.rawCitation || record.title,
    authors: record.rawCitation ? "" : record.authors.join(", "),
    venue: record.rawCitation
      ? record.status === "FORTHCOMING"
        ? "CV Maret 2026 · forthcoming"
        : "CV Maret 2026"
      : [record.venue, record.publisher].filter(Boolean).join(" · "),
    href:
      record.externalUrl ||
      extractFirstHttpsUrl(record.rawCitation) ||
      record.sourceUrl ||
      undefined,
  }));
}
