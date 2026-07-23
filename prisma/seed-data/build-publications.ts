import type { PublicationStatus, PublicationType } from "@prisma/client";

import { extractDoi, extractFirstPublicationUrl } from "../../src/lib/content/publication-url";
import { curatedPublicationLinks } from "./publication-links";

type ReviewCandidate = {
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

export function buildPublicationSeed(candidates: ReviewCandidate[]) {
  const canonicalCandidates = candidates.filter(
    (candidate) =>
      candidate.sourceName === "CV March 2026" ||
      candidate.sourceName === "Professorial-address audit 19 July 2026",
  );
  const canonicalFingerprints = new Set(
    canonicalCandidates.map((candidate) => candidate.fingerprint),
  );
  const unknownCuratedFingerprints = Object.keys(curatedPublicationLinks).filter(
    (fingerprint) => !canonicalFingerprints.has(fingerprint),
  );

  if (unknownCuratedFingerprints.length > 0) {
    throw new Error(
      `Fingerprint tautan kurasi tidak ditemukan di dataset kanonis: ${unknownCuratedFingerprints.join(", ")}`,
    );
  }

  const records = canonicalCandidates.map((candidate) => {
    const isAddress = candidate.sourceName.startsWith("Professorial-address");
    const curated = curatedPublicationLinks[candidate.fingerprint];
    const extractedDoi = extractDoi(candidate.rawText);
    const doi = curated?.doi ?? extractedDoi;
    const citationUrl = extractFirstPublicationUrl(candidate.rawText);
    const externalUrl = assertHttpsUrl(
      curated?.externalUrl ??
        (doi ? `https://doi.org/${doi}` : citationUrl) ??
        candidate.sourceUrl ??
        "",
      candidate.fingerprint,
    );
    const alternateUrls = [curated?.ignoreCitationUrl ? undefined : citationUrl, candidate.sourceUrl]
      .filter((url): url is string => Boolean(url) && url !== externalUrl)
      .map((url) => assertHttpsUrl(url, candidate.fingerprint));
    const year = candidate.rawPayload.year;

    if (!year) {
      throw new Error(`Tahun publikasi kanonis tidak tersedia: ${candidate.fingerprint}`);
    }

    const linkNote = curated
      ? `Tautan diverifikasi 20 Juli 2026 melalui ${curated.source}.`
      : "Tautan dinormalisasi dari sitasi sumber; DOI diprioritaskan sebagai URL kanonis.";

    return {
      type: asPublicationType(candidate.rawPayload.suggestedType),
      title: candidate.rawText,
      rawCitation: candidate.rawText,
      authors: isAddress ? ["Burhanuddin Muhtadi"] : [],
      year,
      doi: doi ?? null,
      externalUrl,
      status: asPublicationStatus(candidate.rawPayload.suggestedStatus),
      contentStatus: "PUBLISHED" as const,
      sourceName: candidate.sourceName,
      sourceUrl: candidate.sourceUrl,
      sourceCheckedAt: candidate.sourceCheckedAt
        ? new Date(candidate.sourceCheckedAt)
        : curated
          ? new Date(`${curated.checkedAt}T00:00:00.000Z`)
          : null,
      alternateUrls: [...new Set(alternateUrls)],
      sourceNote: `${candidate.note} ${linkNote}`,
      sourceFingerprint: candidate.fingerprint,
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
