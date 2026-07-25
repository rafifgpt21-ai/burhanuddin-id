import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

import { buildPublicationSeed } from "../prisma/seed-data/build-publications";
import sourceData from "../prisma/seed-data/publication-sources.json";

loadEnvConfig(process.cwd());

const compareDatabase = process.argv.includes("--database");
const seed = buildPublicationSeed(sourceData.records);
const cvRecords = seed.filter(
  (publication) => publication.sourceName === "CV March 2026",
);

function staticReport() {
  const count = (type: (typeof cvRecords)[number]["type"]) =>
    cvRecords.filter((publication) => publication.type === type).length;
  console.log("Rencana migrasi publikasi (read-only)");
  console.log(`- 81 fingerprint CV terstruktur: ${cvRecords.length === 81 ? "ya" : "tidak"}`);
  console.log(`- Buku: ${count("BOOK")}`);
  console.log(`- Artikel jurnal: ${count("JOURNAL_ARTICLE")}`);
  console.log(`- Bab buku: ${count("BOOK_CHAPTER")}`);
  console.log(
    `- Output riset lain: ${count("ADDITIONAL_RESEARCH_OUTPUT")}`,
  );
  console.log(`- Total seed termasuk pidato pengukuhan: ${seed.length}`);
}

async function databaseReport() {
  if (process.env.DATABASE_READY !== "true") {
    throw new Error(
      "Perbandingan database dibatalkan. Rotasi kredensial lalu set DATABASE_READY=true.",
    );
  }
  const prisma = new PrismaClient();
  try {
    const current = await prisma.publication.findMany({
      include: { cardImage: true },
      orderBy: { createdAt: "asc" },
    });
    const byFingerprint = new Map(
      current
        .filter((publication) => publication.sourceFingerprint)
        .map((publication) => [publication.sourceFingerprint!, publication]),
    );
    const missing = seed.filter(
      (publication) => !byFingerprint.has(publication.sourceFingerprint),
    );
    const manual = current.filter(
      (publication) => !publication.sourceFingerprint,
    );
    const conflicts = seed.flatMap((publication) => {
      const existing = byFingerprint.get(publication.sourceFingerprint);
      if (!existing) return [];
      const changed = [
        "type",
        "title",
        "authors",
        "editors",
        "year",
        "containerTitle",
        "publisher",
        "publicationPlace",
        "volume",
        "issue",
        "seriesNumber",
        "pages",
        "doi",
        "externalUrl",
        "status",
      ].filter((field) => {
        const existingValue = (existing as unknown as Record<string, unknown>)[
          field
        ];
        const seedValue = (
          publication as unknown as Record<string, unknown>
        )[field];
        return JSON.stringify(existingValue) !== JSON.stringify(seedValue);
      });
      return changed.length
        ? [{ fingerprint: publication.sourceFingerprint, fields: changed }]
        : [];
    });
    const incompleteManual = manual.filter(
      (publication) =>
        !publication.title ||
        !publication.authors.length ||
        /https?:\/\//i.test(publication.title) ||
        (publication.type !== "BOOK" && !publication.containerTitle),
    );

    console.log(`- Record database saat ini: ${current.length}`);
    console.log(`- Fingerprint cocok: ${seed.length - missing.length}`);
    console.log(`- Belum ada di database: ${missing.length}`);
    console.log(`- Record manual tanpa fingerprint: ${manual.length}`);
    console.log(`- Record manual belum lengkap: ${incompleteManual.length}`);
    console.log(`- Record kanonis yang akan diperbarui: ${conflicts.length}`);
    for (const conflict of conflicts) {
      console.log(
        `  ${conflict.fingerprint}: ${conflict.fields.join(", ")}`,
      );
    }
    console.log("- Tidak ada perubahan database yang dilakukan.");
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  staticReport();
  if (compareDatabase) {
    await databaseReport();
  } else {
    console.log(
      "- Perbandingan database dilewati; gunakan --database hanya setelah rotasi kredensial dan backup.",
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
