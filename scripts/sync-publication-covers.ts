import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

import {
  preparePublicationCovers,
  uploadPublicationCovers,
} from "../prisma/seed-data/upload-publication-covers";
import sourceData from "../prisma/seed-data/publication-sources.json";

loadEnvConfig(process.cwd());

async function main() {
  if (process.env.DATABASE_READY !== "true") {
    throw new Error(
      "Sinkron cover dibatalkan. Gunakan kredensial yang sudah dirotasi dan DATABASE_READY=true.",
    );
  }

  const prepared = await preparePublicationCovers(sourceData.records);
  const uploaded = await uploadPublicationCovers(prepared);
  const prisma = new PrismaClient();
  let linkedPublicationCount = 0;

  try {
    await prisma.$transaction(async (transaction) => {
      for (const cover of uploaded.covers) {
        const asset = await transaction.mediaAsset.upsert({
          where: { storageKey: cover.storageKey },
          update: {
            url: cover.url,
            fileName: cover.fileName,
            mimeType: cover.mimeType,
            size: cover.size,
            rightsNote: cover.rightsNote,
          },
          create: {
            storageKey: cover.storageKey,
            url: cover.url,
            fileName: cover.fileName,
            mimeType: cover.mimeType,
            size: cover.size,
            rightsNote: cover.rightsNote,
          },
        });

        const result = await transaction.publication.updateMany({
          where: { sourceFingerprint: cover.fingerprint },
          data: { cardImageId: asset.id, coverImage: cover.url },
        });
        if (result.count !== 1) {
          throw new Error(
            `Publikasi kanonis untuk cover tidak ditemukan: ${cover.fileName}`,
          );
        }
        linkedPublicationCount += result.count;
      }
    });
  } finally {
    await prisma.$disconnect();
  }

  console.log(
    `Sinkron cover selesai: ${linkedPublicationCount} publikasi terhubung; ${uploaded.uploadedCount} unggahan baru; ${uploaded.reusedCount} aset digunakan ulang.`,
  );
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Sinkron cover gagal.",
  );
  process.exit(1);
});
