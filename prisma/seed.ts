import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

import { buildPublicationSeed } from "./seed-data/build-publications";
import {
  preparePublicationCovers,
  type SeededPublicationCover,
  uploadPublicationCovers,
} from "./seed-data/upload-publication-covers";
import {
  readSuperAdminSeed,
  upsertSuperAdmin,
} from "./seed-data/super-admin";
import sourceData from "./seed-data/publication-sources.json";

loadEnvConfig(process.cwd());

const shouldCheck = process.argv.includes("--check");
const shouldWrite = process.argv.includes("--write");

if (shouldCheck === shouldWrite) {
  console.error("Pilih tepat satu mode seed: --check atau --write.");
  process.exit(1);
}

async function seedSuperAdmin(prisma: PrismaClient) {
  const input = readSuperAdminSeed({ required: false });
  if (!input) return false;
  await upsertSuperAdmin(prisma, input);
  return true;
}

async function syncPublishedPublications(
  prisma: PrismaClient,
  publicationSeed: ReturnType<typeof buildPublicationSeed>,
  covers: readonly SeededPublicationCover[],
) {
  return prisma.$transaction(async (transaction) => {
    const coverAssetIds = new Map<string, string>();
    for (const cover of covers) {
      const publication = publicationSeed.find(
        (record) => record.sourceFingerprint === cover.fingerprint,
      );
      const asset = await transaction.mediaAsset.upsert({
        where: { storageKey: cover.storageKey },
        update: {
          url: cover.url,
          fileName: cover.fileName,
          mimeType: cover.mimeType,
          size: cover.size,
          altTextId: publication
            ? `Sampul publikasi ${publication.title}`
            : null,
          altTextEn: publication
            ? `Publication cover for ${publication.title}`
            : null,
          rightsNote: cover.rightsNote,
        },
        create: {
          storageKey: cover.storageKey,
          url: cover.url,
          fileName: cover.fileName,
          mimeType: cover.mimeType,
          size: cover.size,
          altTextId: publication
            ? `Sampul publikasi ${publication.title}`
            : null,
          altTextEn: publication
            ? `Publication cover for ${publication.title}`
            : null,
          rightsNote: cover.rightsNote,
        },
      });
      coverAssetIds.set(cover.fingerprint, asset.id);
    }

    for (const publication of publicationSeed) {
      const cardImageId =
        coverAssetIds.get(publication.sourceFingerprint) ?? null;
      const coverRightsNote =
        covers.find((cover) => cover.fingerprint === publication.sourceFingerprint)
          ?.rightsNote ?? "";
      const publishedSnapshot = {
        type: publication.type,
        title: publication.title,
        authors: publication.authors,
        editors: publication.editors,
        year: publication.year,
        dateLabel: publication.dateLabel ?? "",
        containerTitle: publication.containerTitle ?? "",
        venue: publication.venue ?? "",
        publisher: publication.publisher ?? "",
        publicationPlace: publication.publicationPlace ?? "",
        volume: publication.volume ?? "",
        issue: publication.issue ?? "",
        seriesNumber: publication.seriesNumber ?? "",
        pages: publication.pages ?? "",
        doi: publication.doi ?? "",
        externalUrl: publication.externalUrl ?? "",
        status: publication.status,
        coverImage: publication.coverImage ?? "",
        coverRightsNote,
        sourceName: publication.sourceName,
        sourceUrl: publication.sourceUrl ?? "",
        sourceNote: publication.sourceNote,
      };
      await transaction.publication.upsert({
        where: { sourceFingerprint: publication.sourceFingerprint },
        update: {
          ...publication,
          cardImageId,
          publishedSnapshot,
          publishedVersion: 1,
          hasUnpublishedChanges: false,
          publishedAt: publication.sourceCheckedAt,
        },
        create: {
          ...publication,
          cardImageId,
          publishedSnapshot,
          publishedVersion: 1,
          hasUnpublishedChanges: false,
          publishedAt: publication.sourceCheckedAt,
        },
      });
      const record = await transaction.publication.findUniqueOrThrow({
        where: { sourceFingerprint: publication.sourceFingerprint },
        select: { id: true },
      });
      await transaction.contentRevision.upsert({
        where: {
          kind_recordId_version: {
            kind: "PUBLICATION",
            recordId: record.id,
            version: 1,
          },
        },
        update: { snapshot: publishedSnapshot },
        create: {
          kind: "PUBLICATION",
          recordId: record.id,
          version: 1,
          snapshot: publishedSnapshot,
        },
      });
    }

    return publicationSeed.length;
  });
}

async function main() {
  const preparedCovers = await preparePublicationCovers(sourceData.records);
  const checkedSeed = buildPublicationSeed(sourceData.records);

  if (shouldCheck) {
    console.log(
      `Seed valid: ${checkedSeed.length} publikasi kanonis, semuanya memiliki tautan HTTPS, dan ${preparedCovers.length} cover buku cocok dengan fingerprint CV.`,
    );
    return;
  }

  if (process.env.DATABASE_READY !== "true") {
    throw new Error(
      "Seed dibatalkan. Gunakan kredensial yang sudah dirotasi dan DATABASE_READY=true.",
    );
  }

  const uploaded = await uploadPublicationCovers(preparedCovers);
  const coverUrls = Object.fromEntries(
    uploaded.covers.map((cover) => [cover.fingerprint, cover.url]),
  );
  const publicationSeed = buildPublicationSeed(sourceData.records, coverUrls);
  const prisma = new PrismaClient();

  try {
    const adminSeeded = await seedSuperAdmin(prisma);
    const publicationCount = await syncPublishedPublications(
      prisma,
      publicationSeed,
      uploaded.covers,
    );
    await prisma.adminSession.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
    console.log(
      `Seed sinkron selesai: ${adminSeeded ? "1 super admin diperbarui" : "akun pengguna dipertahankan"}, ${publicationCount} publikasi kanonis, dan ${uploaded.covers.length} cover buku (${uploaded.uploadedCount} baru, ${uploaded.reusedCount} digunakan ulang).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Seed gagal.");
  process.exit(1);
});
