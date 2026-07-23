import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { readAdminSession } from "@/lib/auth/session";

const upload = createUploadthing();

export const uploadRouter = {
  academicAsset: upload({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await readAdminSession();
      if (!session) throw new UploadThingError("Akses admin diperlukan.");
      if (process.env.DATABASE_READY !== "true") {
        throw new UploadThingError("Upload tetap terkunci sampai kredensial database dirotasi.");
      }
      return { uploadedBy: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => ({
      uploaded: true,
      uploadedBy: metadata.uploadedBy,
      storageKey: file.key,
      url: file.ufsUrl,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
