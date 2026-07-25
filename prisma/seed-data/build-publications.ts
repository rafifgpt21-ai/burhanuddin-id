import type { PublicationStatus, PublicationType } from "@prisma/client";

import { extractDoi, extractFirstPublicationUrl } from "../../src/lib/content/publication-url";
import { curatedPublicationLinks } from "./publication-links";
import structuredData from "./structured-publications.json";

type PublicationSourceRecord = {
  fingerprint: string;
  sourceName: string;
  sourceUrl: string | null;
  sourceCheckedAt: string | null;
  rawText: string;
  rawPayload: {
    year: number | null;
    suggestedType: string;
    suggestedStatus: string;
  };
  note: string;
};

type StructuredPublication = (typeof structuredData.records)[number];

const publicationTypes = new Set<PublicationType>([
  "BOOK",
  "JOURNAL_ARTICLE",
  "BOOK_CHAPTER",
  "ADDITIONAL_RESEARCH_OUTPUT",
]);

function asPublicationType(value: string): PublicationType {
  if (!publicationTypes.has(value as PublicationType)) {
    throw new Error(`Tipe publikasi CV tidak dikenali: ${value}`);
  }
  return value as PublicationType;
}

function asPublicationStatus(value: string): PublicationStatus {
  return value === "FORTHCOMING" ? "FORTHCOMING" : "PUBLISHED";
}

function assertHttpsUrl(value: string, fingerprint: string) {
  if (!value) {
    throw new Error(`Publikasi tanpa tautan: ${fingerprint}`);
  }
  const url = new URL(value);
  if (url.protocol !== "https:") {
    throw new Error(`URL publikasi harus HTTPS (${fingerprint}): ${value}`);
  }
  return url.toString();
}

export function buildPublicationSeed(
  sourceRecords: PublicationSourceRecord[],
  coverUrls: Readonly<Record<string, string>> = {},
) {
  const canonicalRecords = sourceRecords.filter(
    (record) =>
      record.sourceName === "CV March 2026" ||
      record.sourceName === "Professorial-address audit 19 July 2026",
  );
  const cvRecords = canonicalRecords.filter(
    (record) => record.sourceName === "CV March 2026",
  );
  const structuredByFingerprint = new Map(
    structuredData.records.map((record) => [record.fingerprint, record]),
  );
  const missingStructuredRecords = cvRecords.filter(
    (record) => !structuredByFingerprint.has(record.fingerprint),
  );
  const unknownStructuredRecords = structuredData.records.filter(
    (record) =>
      !cvRecords.some((source) => source.fingerprint === record.fingerprint),
  );
  if (
    cvRecords.length !== 81 ||
    structuredData.sourceCount !== 81 ||
    missingStructuredRecords.length ||
    unknownStructuredRecords.length
  ) {
    throw new Error(
      [
        `Dataset CV harus memuat tepat 81 record (sumber: ${cvRecords.length}, terstruktur: ${structuredData.sourceCount}).`,
        missingStructuredRecords.length
          ? `Fingerprint tanpa metadata: ${missingStructuredRecords.map((record) => record.fingerprint).join(", ")}.`
          : "",
        unknownStructuredRecords.length
          ? `Fingerprint metadata tanpa sumber: ${unknownStructuredRecords.map((record) => record.fingerprint).join(", ")}.`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }
  const canonicalFingerprints = new Set(
    canonicalRecords.map((record) => record.fingerprint),
  );
  const unknownCuratedFingerprints = Object.keys(curatedPublicationLinks).filter(
    (fingerprint) => !canonicalFingerprints.has(fingerprint),
  );

  if (unknownCuratedFingerprints.length > 0) {
    throw new Error(
      `Fingerprint tautan kurasi tidak ditemukan di dataset kanonis: ${unknownCuratedFingerprints.join(", ")}`,
    );
  }

  const records = canonicalRecords.map((record) => {
    const structured = structuredByFingerprint.get(record.fingerprint);
    const curated = curatedPublicationLinks[record.fingerprint];
    const extractedDoi = extractDoi(record.rawText);
    const doi = curated?.doi ?? extractedDoi;
    const citationUrl = extractFirstPublicationUrl(record.rawText);
    const externalUrl = assertHttpsUrl(
      curated?.externalUrl ??
        (doi ? `https://doi.org/${doi}` : citationUrl) ??
        record.sourceUrl ??
        "",
      record.fingerprint,
    );
    const alternateUrls = [curated?.ignoreCitationUrl ? undefined : citationUrl, record.sourceUrl]
      .filter((url): url is string => Boolean(url) && url !== externalUrl)
      .map((url) => assertHttpsUrl(url, record.fingerprint));
    const year = record.rawPayload.year;

    if (!year) {
      throw new Error(`Tahun publikasi kanonis tidak tersedia: ${record.fingerprint}`);
    }

    const linkNote = curated
      ? `Tautan diverifikasi 20 Juli 2026 melalui ${curated.source}.`
      : "Tautan dinormalisasi dari sitasi sumber; DOI diprioritaskan sebagai URL kanonis.";

    const bibliographic: Omit<
      StructuredPublication,
      "fingerprint" | "type"
    > = structured ?? {
      title: record.rawText,
      authors: ["Burhanuddin Muhtadi"],
      editors: [],
      year,
      dateLabel: "29 November 2023",
      containerTitle: "FISIP UIN Syarif Hidayatullah Jakarta",
      publisher: null,
      publicationPlace: "Jakarta",
      volume: null,
      issue: null,
      seriesNumber: null,
      pages: null,
    };
    const type = asPublicationType(record.rawPayload.suggestedType);
    if (
      structured &&
      (structured.type !== type ||
        structured.year !== year ||
        !structured.title ||
        !structured.authors.length ||
        /https?:\/\//i.test(structured.title))
    ) {
      throw new Error(
        `Metadata bibliografis tidak konsisten dengan sumber: ${record.fingerprint}`,
      );
    }
    if (
      type !== "BOOK" &&
      !bibliographic.containerTitle
    ) {
      throw new Error(
        `Karya non-buku wajib memiliki wadah bibliografis: ${record.fingerprint}`,
      );
    }

    return {
      type,
      title: bibliographic.title,
      rawCitation: record.rawText,
      authors: bibliographic.authors,
      editors: bibliographic.editors,
      year,
      dateLabel: bibliographic.dateLabel,
      containerTitle: bibliographic.containerTitle,
      venue: bibliographic.containerTitle,
      publisher: bibliographic.publisher,
      publicationPlace: bibliographic.publicationPlace,
      volume: bibliographic.volume,
      issue: bibliographic.issue,
      seriesNumber: bibliographic.seriesNumber,
      pages: bibliographic.pages,
      doi: doi ?? null,
      externalUrl,
      status: asPublicationStatus(record.rawPayload.suggestedStatus),
      contentStatus: "PUBLISHED" as const,
      coverImage: coverUrls[record.fingerprint] ?? null,
      sourceName: record.sourceName,
      sourceUrl: record.sourceUrl,
      sourceCheckedAt: record.sourceCheckedAt
        ? new Date(record.sourceCheckedAt)
        : curated
          ? new Date(`${curated.checkedAt}T00:00:00.000Z`)
          : null,
      alternateUrls: [...new Set(alternateUrls)],
      sourceNote: `${record.note} ${linkNote}`,
      sourceFingerprint: record.fingerprint,
    };
  });

  const fingerprints = records.map((record) => record.sourceFingerprint);
  if (new Set(fingerprints).size !== fingerprints.length) {
    throw new Error("Fingerprint publikasi seed harus unik.");
  }
  if (records.some((record) => !record.externalUrl)) {
    throw new Error("Setiap publikasi seed wajib memiliki externalUrl.");
  }

  return records;
}
