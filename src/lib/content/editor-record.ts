import "server-only";

import { prisma } from "@/lib/prisma";
import type { EditorialKind } from "@/lib/content/admin-records";

function wibDateTimeLocal(value: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

export async function getEditorRecord(kind: EditorialKind, id: string) {
  if (process.env.DATABASE_READY !== "true") return null;
  if (kind === "post") {
    const record = await prisma.post.findUnique({ where: { id } });
    return record
      ? {
          ...record,
          excerptId: record.excerptId ?? "",
          excerptEn: record.excerptEn ?? "",
          titleEn: record.titleEn ?? "",
          slugEn: record.slugEn ?? "",
          contentEn: record.contentEn ?? [],
          coverImage: record.coverImage ?? "",
          canonicalExternal: record.canonicalExternal ?? "",
        }
      : null;
  }
  if (kind === "agenda") {
    const record = await prisma.agendaItem.findUnique({ where: { id } });
    return record
      ? {
          ...record,
          titleEn: record.titleEn ?? "",
          slugEn: record.slugEn ?? "",
          descriptionEn: record.descriptionEn ?? "",
          locationLabelId: record.locationLabelId ?? "",
          locationLabelEn: record.locationLabelEn ?? "",
          externalUrl: record.externalUrl ?? "",
          startsAt: wibDateTimeLocal(record.startsAt),
          endsAt: record.endsAt ? wibDateTimeLocal(record.endsAt) : "",
        }
      : null;
  }
  if (kind === "material") {
    const record = await prisma.studyMaterial.findUnique({
      where: { id },
      include: { asset: true },
    });
    return record
      ? {
          ...record,
          titleEn: record.titleEn ?? "",
          slugEn: record.slugEn ?? "",
          descriptionEn: record.descriptionEn ?? "",
          courseEn: record.courseEn ?? "",
          topicId: record.topicId ?? "",
          topicEn: record.topicEn ?? "",
          semester: record.semester ?? "",
          academicYear: record.academicYear ?? "",
          externalUrl: record.externalUrl ?? "",
          assetId: record.assetId ?? "",
        }
      : null;
  }
  if (kind === "publication") {
    const record = await prisma.publication.findUnique({
      where: { id },
      include: { cardImage: true },
    });
    return record
      ? {
          ...record,
          dateLabel: record.dateLabel ?? "",
          containerTitle: record.containerTitle ?? "",
          publisher: record.publisher ?? "",
          publicationPlace: record.publicationPlace ?? "",
          volume: record.volume ?? "",
          issue: record.issue ?? "",
          seriesNumber: record.seriesNumber ?? "",
          pages: record.pages ?? "",
          doi: record.doi ?? "",
          externalUrl: record.externalUrl ?? "",
          coverImage: record.cardImage?.url ?? record.coverImage ?? "",
          coverRightsNote: record.cardImage?.rightsNote ?? "",
          sourceUrl: record.sourceUrl ?? "",
        }
      : null;
  }
  return null;
}
