import {
  ImportCandidateKind,
  PrismaClient,
} from "@prisma/client";

import { buildPublicationSeed } from "./seed-data/build-publications";
import {
  readSuperAdminSeed,
  upsertSuperAdmin,
} from "./seed-data/super-admin";
import reviewData from "./review-data/import-candidates.json";

const shouldCheck = process.argv.includes("--check");
const shouldWrite = process.argv.includes("--write");

if (shouldCheck === shouldWrite) {
  console.error("Pilih tepat satu mode seed: --check atau --write.");
  process.exit(1);
}

const publicationSeed = buildPublicationSeed(reviewData.candidates);

if (shouldCheck) {
  console.log(
    `Seed valid: ${publicationSeed.length} publikasi kanonis dan semuanya memiliki tautan HTTPS.`,
  );
  process.exit(0);
}

if (process.env.DATABASE_READY !== "true") {
  console.error(
    "Seed dibatalkan. Gunakan kredensial yang sudah dirotasi dan DATABASE_READY=true.",
  );
  process.exit(1);
}

const prisma = new PrismaClient();

async function seedSuperAdmin() {
  const input = readSuperAdminSeed({ required: false });
  if (!input) return false;
  await upsertSuperAdmin(prisma, input);
  return true;
}

async function seedReviewCandidates() {
  for (const candidate of reviewData.candidates) {
    await prisma.importCandidate.upsert({
      where: { fingerprint: candidate.fingerprint },
      update: {
        sourceName: candidate.sourceName,
        sourcePath: candidate.sourcePath,
        sourceUrl: candidate.sourceUrl,
        sourceCheckedAt: candidate.sourceCheckedAt
          ? new Date(candidate.sourceCheckedAt)
          : null,
        rawText: candidate.rawText,
        rawPayload: candidate.rawPayload,
        note: candidate.note,
      },
      create: {
        fingerprint: candidate.fingerprint,
        kind: ImportCandidateKind.PUBLICATION,
        sourceName: candidate.sourceName,
        sourcePath: candidate.sourcePath,
        sourceUrl: candidate.sourceUrl,
        sourceCheckedAt: candidate.sourceCheckedAt
          ? new Date(candidate.sourceCheckedAt)
          : null,
        rawText: candidate.rawText,
        rawPayload: candidate.rawPayload,
        note: candidate.note,
      },
    });
  }
}

async function resetPublishedPublications() {
  return prisma.$transaction(async (transaction) => {
    await transaction.publication.deleteMany();
    const result = await transaction.publication.createMany({ data: publicationSeed });
    return result.count;
  });
}

async function main() {
  try {
    const adminSeeded = await seedSuperAdmin();
    await seedReviewCandidates();
    const publicationCount = await resetPublishedPublications();
    await prisma.adminSession.deleteMany({ where: { expiresAt: { lte: new Date() } } });
    console.log(
      `Seed reset selesai: ${adminSeeded ? "1 super admin diperbarui" : "akun pengguna dipertahankan"}, ${reviewData.candidates.length} kandidat review, dan ${publicationCount} publikasi publik bertautan.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
