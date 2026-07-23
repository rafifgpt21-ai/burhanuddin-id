import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Candidate = {
  fingerprint: string;
  kind: "PUBLICATION";
  sourceName: string;
  sourcePath: string;
  sourceUrl: string | null;
  sourceCheckedAt: string | null;
  rawText: string;
  rawPayload: {
    year: number | null;
    suggestedType: string;
    suggestedStatus: string;
    platformIndex: number | null;
  };
  note: string;
};

const workspace = process.cwd();
const cvPath = path.join(workspace, ".material", "Burhanuddin Muhtadi CV_March_2026.md");
const researchPath = path.join(workspace, "source-research.md");
const outputDirectory = path.join(workspace, "prisma", "review-data");
const outputPath = path.join(outputDirectory, "import-candidates.json");

function fingerprint(parts: string[]) {
  return createHash("sha256").update(parts.join("\u0000")).digest("hex");
}

function sliceBetween(source: string, start: string, end?: string) {
  const startIndex = source.indexOf(start);
  if (startIndex < 0) throw new Error(`Bagian sumber tidak ditemukan: ${start}`);
  const from = startIndex + start.length;
  const endIndex = end ? source.indexOf(end, from) : source.length;
  return source.slice(from, endIndex < 0 ? source.length : endIndex);
}

function cvCandidates(cv: string): Candidate[] {
  const sections = [
    ["### Books", "### Refereed journal articles", "BOOK"],
    ["### Refereed journal articles", "### Book chapters", "JOURNAL_ARTICLE"],
    ["### Book chapters", "### Additional Research Outputs", "BOOK_CHAPTER"],
    ["### Additional Research Outputs", "### Invited keynote and speaker addresses", "ADDITIONAL_RESEARCH_OUTPUT"],
  ] as const;

  return sections.flatMap(([start, end, suggestedType]) =>
    sliceBetween(cv, start, end)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^-\s+\d{4}\s+/.test(line))
      .map((line) => {
        const year = Number(line.match(/^-\s+(\d{4})/)?.[1]);
        const rawText = line.replace(/^-\s+\d{4}\s+/, "").trim();
        const suggestedStatus = /forthcoming/i.test(rawText) ? "FORTHCOMING" : "PUBLISHED";
        return {
          fingerprint: fingerprint(["cv-march-2026", suggestedType, String(year), rawText]),
          kind: "PUBLICATION" as const,
          sourceName: "CV March 2026",
          sourcePath: ".material/Burhanuddin Muhtadi CV_March_2026.md",
          sourceUrl: null,
          sourceCheckedAt: null,
          rawText,
          rawPayload: {
            year,
            suggestedType,
            suggestedStatus,
            platformIndex: null,
          },
          note: "Kandidat kanonis dari CV; pertahankan susunan penulis dan redaksi sumber saat direview.",
        };
      }),
  );
}

function linkedCandidates(
  source: string,
  start: string,
  end: string,
  sourceName: string,
  note: string,
): Candidate[] {
  return sliceBetween(source, start, end)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .flatMap((line) => {
      const match = line.match(/^(\d+)\. \[(.+)\]\((https?:\/\/.+)\)$/);
      if (!match) return [];
      const [, index, title, sourceUrl] = match;
      return [
        {
          fingerprint: fingerprint([sourceName, index, title, sourceUrl]),
          kind: "PUBLICATION" as const,
          sourceName,
          sourcePath: "source-research.md",
          sourceUrl,
          sourceCheckedAt: "2026-07-19T00:00:00.000Z",
          rawText: title,
          rawPayload: {
            year: null,
            suggestedType: "UNRESOLVED",
            suggestedStatus: "NEEDS_REVIEW",
            platformIndex: Number(index),
          },
          note,
        },
      ];
    });
}

function researchCandidates(source: string): Candidate[] {
  const researchGate = linkedCandidates(
    source,
    "### Publication index observed (82 records)",
    "### Reconciliation notes",
    "ResearchGate audit 19 July 2026",
    "Temuan platform; dapat berupa duplikat, erratum, ulasan, bab, atau versi alternatif. Jangan terbitkan sebelum rekonsiliasi CV.",
  );
  const academia = linkedCandidates(
    source,
    "### Books-tab records observed (12)",
    "### Reconciliation notes",
    "Academia Books-tab audit 19 July 2026",
    "Kategori Books dari platform bukan tipe bibliografis kanonis; tipe dan hak distribusi wajib direview.",
  );

  const addressTitle = "Votes for Sale: Klientelisme, Defisit Demokrasi, dan Institusi";
  const addressUrl =
    "https://indikator.co.id/wp-content/uploads/2023/11/Pidato-Pengukuhan-Gubes-Prof-Burhanuddin-Muhtadi-Votes-for-Sale.pdf";
  const address: Candidate = {
    fingerprint: fingerprint(["professorial-address", addressTitle, addressUrl]),
    kind: "PUBLICATION",
    sourceName: "Professorial-address audit 19 July 2026",
    sourcePath: "source-research.md",
    sourceUrl: addressUrl,
    sourceCheckedAt: "2026-07-19T00:00:00.000Z",
    rawText: addressTitle,
    rawPayload: {
      year: 2023,
      suggestedType: "ADDITIONAL_RESEARCH_OUTPUT",
      suggestedStatus: "NEEDS_REVIEW",
      platformIndex: null,
    },
    note: "Tautan eksternal dan status hak pakai/sematan harus disetujui pemilik sebelum publikasi.",
  };

  return [...researchGate, ...academia, address];
}

async function main() {
  const [cv, research] = await Promise.all([
    readFile(cvPath, "utf8"),
    readFile(researchPath, "utf8"),
  ]);
  const cvRecords = cvCandidates(cv);
  const researchRecords = researchCandidates(research);
  const payload = {
    generatedAt: new Date().toISOString(),
    reviewRequired: true,
    sourceCounts: {
      cv: cvRecords.length,
      researchGate: researchRecords.filter((item) => item.sourceName.startsWith("ResearchGate")).length,
      academia: researchRecords.filter((item) => item.sourceName.startsWith("Academia")).length,
      professorialAddress: 1,
      studyMaterials: 0,
      agenda: 0,
    },
    candidates: [...cvRecords, ...researchRecords],
  };

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Dataset review dibuat: ${payload.candidates.length} kandidat di prisma/review-data/import-candidates.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
