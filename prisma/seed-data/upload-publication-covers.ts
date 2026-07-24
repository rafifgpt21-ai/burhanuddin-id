import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import { UTApi, UTFile } from "uploadthing/server";

import {
  publicationCoverSources,
  type PublicationCoverSource,
} from "./publication-covers";

type SourceRecordForCoverValidation = {
  fingerprint: string;
  sourceName: string;
  rawPayload: {
    suggestedType: string;
  };
};

export type PreparedPublicationCover = PublicationCoverSource & {
  absolutePath: string;
  bytes: Buffer;
  customId: string;
  mimeType: "image/jpeg";
  size: number;
};

export type SeededPublicationCover = PreparedPublicationCover & {
  storageKey: string;
  url: string;
};

const coverDirectory = path.resolve(process.cwd(), ".material", "books");
const maximumCoverSize = 4 * 1024 * 1024;

function isJpeg(bytes: Buffer) {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function assertUploadThingUrl(value: string) {
  const url = new URL(value);
  const validHostname =
    url.hostname === "m0xcz6d4a4.ufs.sh" || url.hostname === "utfs.io";
  if (
    url.protocol !== "https:" ||
    !validHostname ||
    !url.pathname.startsWith("/f/")
  ) {
    throw new Error(`URL cover hasil unggahan tidak dikenali: ${url.hostname}`);
  }
  return url.toString();
}

export async function preparePublicationCovers(
  sourceRecords: readonly SourceRecordForCoverValidation[],
): Promise<PreparedPublicationCover[]> {
  const canonicalBooks = new Map(
    sourceRecords
      .filter(
        (record) =>
          record.sourceName === "CV March 2026" &&
          record.rawPayload.suggestedType === "BOOK",
      )
      .map((record) => [record.fingerprint, record]),
  );
  const mappedFingerprints = new Set<string>();
  const mappedFileNames = new Set<string>();

  for (const cover of publicationCoverSources) {
    if (!canonicalBooks.has(cover.fingerprint)) {
      throw new Error(
        `Cover tidak cocok dengan buku kanonis: ${cover.fileName}`,
      );
    }
    if (mappedFingerprints.has(cover.fingerprint)) {
      throw new Error(`Fingerprint cover ganda: ${cover.fingerprint}`);
    }
    if (mappedFileNames.has(cover.fileName)) {
      throw new Error(`Nama file cover ganda: ${cover.fileName}`);
    }
    mappedFingerprints.add(cover.fingerprint);
    mappedFileNames.add(cover.fileName);
  }

  const availableFiles = (await readdir(coverDirectory))
    .filter((fileName) => /\.jpe?g$/i.test(fileName))
    .sort();
  const unmappedFiles = availableFiles.filter(
    (fileName) => !mappedFileNames.has(fileName),
  );
  if (unmappedFiles.length) {
    throw new Error(
      `Cover belum dipetakan: ${unmappedFiles.join(", ")}`,
    );
  }

  return Promise.all(
    publicationCoverSources.map(async (cover) => {
      const absolutePath = path.join(coverDirectory, cover.fileName);
      const [fileStats, bytes] = await Promise.all([
        stat(absolutePath),
        readFile(absolutePath),
      ]);
      if (!fileStats.isFile() || !isJpeg(bytes)) {
        throw new Error(`Cover bukan JPEG yang valid: ${cover.fileName}`);
      }
      if (fileStats.size <= 0 || fileStats.size > maximumCoverSize) {
        throw new Error(
          `Ukuran cover harus di antara 1 byte dan 4 MB: ${cover.fileName}`,
        );
      }

      const contentHash = createHash("sha256").update(bytes).digest("hex");
      return {
        ...cover,
        absolutePath,
        bytes,
        customId: `bm-book-${cover.fingerprint.slice(0, 16)}-${contentHash.slice(0, 16)}`,
        mimeType: "image/jpeg" as const,
        size: fileStats.size,
      };
    }),
  );
}

export async function uploadPublicationCovers(
  covers: readonly PreparedPublicationCover[],
): Promise<{
  covers: SeededPublicationCover[];
  uploadedCount: number;
  reusedCount: number;
}> {
  if (!process.env.UPLOADTHING_TOKEN) {
    throw new Error("UPLOADTHING_TOKEN belum tersedia untuk seed cover.");
  }

  const uploadThing = new UTApi({ logLevel: "Error" });
  const existing = await uploadThing.listFiles({ limit: 500 });
  let uploadedCount = 0;
  let reusedCount = 0;
  const seeded: SeededPublicationCover[] = [];

  for (const cover of covers) {
    const existingFile = existing.files.find(
      (file) => file.customId === cover.customId && file.status === "Uploaded",
    );

    if (existingFile) {
      const result = await uploadThing.getFileUrls(existingFile.key);
      const url = result.data[0]?.url;
      if (!url) {
        throw new Error(`URL cover tidak ditemukan: ${cover.fileName}`);
      }
      seeded.push({
        ...cover,
        storageKey: existingFile.key,
        url: assertUploadThingUrl(url),
      });
      reusedCount += 1;
      continue;
    }

    const result = await uploadThing.uploadFiles(
      new UTFile([Uint8Array.from(cover.bytes)], cover.fileName, {
        customId: cover.customId,
        type: cover.mimeType,
      }),
      { acl: "public-read" },
    );
    if (result.error) {
      throw new Error(
        `Upload cover gagal (${cover.fileName}): ${result.error.message}`,
      );
    }

    seeded.push({
      ...cover,
      storageKey: result.data.key,
      url: assertUploadThingUrl(result.data.ufsUrl),
    });
    uploadedCount += 1;
  }

  return { covers: seeded, uploadedCount, reusedCount };
}
