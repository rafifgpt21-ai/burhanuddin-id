import type { PublicationStatus, PublicationType } from "@prisma/client";

import { extractDoi, extractFirstPublicationUrl } from "../../src/lib/content/publication-url";
import { curatedPublicationLinks } from "./publication-links";

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
    const isAddress = record.sourceName.startsWith("Professorial-address");
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

    return {
      type: asPublicationType(record.rawPayload.suggestedType),
      title: record.rawText,
      rawCitation: record.rawText,
      authors: isAddress ? ["Burhanuddin Muhtadi"] : [],
      year,
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
