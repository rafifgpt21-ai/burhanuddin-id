import { notFound } from "next/navigation";

import { getEditorRecord } from "@/lib/content/editor-record";
import { prisma } from "@/lib/prisma";
import { homepageInputSchema } from "@/lib/validation/content";
import { hasLocale } from "@/lib/i18n";
import { isExpiredPreview } from "@/lib/content/preview";
import { resolveHomepageLocaleContent } from "@/lib/content/homepage";

export default async function DraftPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; kind: string; id: string }>;
  searchParams: Promise<{ expires?: string }>;
}) {
  const [{ locale: localeValue, kind, id }, query] = await Promise.all([params, searchParams]);
  const locale = hasLocale(localeValue) ? localeValue : "id";
  const expires = Number(query.expires);
  if (isExpiredPreview(expires)) notFound();

  if (kind === "homepage") {
    const record = await prisma.homepageContent.findUnique({ where: { id } });
    const parsed = homepageInputSchema.safeParse(record?.payload);
    if (!parsed.success) notFound();
    const content = resolveHomepageLocaleContent(parsed.data, locale);
    return (
      <section className="admin-preview-surface">
        <div className="preview-banner"><strong>Preview draft</strong><span>Kedaluwarsa dalam 15 menit · tidak terindeks</span></div>
        <p className="eyebrow">{content.officialLabel}</p>
        <h1>{content.tagline}</h1>
        <blockquote>{content.quote}</blockquote>
        <h2>{content.academicPrefix} {content.academicName} {content.academicSuffix}</h2>
        <p>{content.lead}</p>
        <ol>{content.roles.map((role) => <li key={role}>{role}</li>)}</ol>
      </section>
    );
  }

  if (!["post", "agenda", "material", "publication"].includes(kind)) notFound();
  const record = await getEditorRecord(kind as "post" | "agenda" | "material" | "publication", id);
  if (!record) notFound();

  return (
    <section className="admin-preview-surface">
      <div className="preview-banner"><strong>Preview draft</strong><span>Kedaluwarsa dalam 15 menit · tidak terindeks</span></div>
      <p className="eyebrow">{kind}</p>
      <h1>{String("titleId" in record ? record.titleId : record.title)}</h1>
      {"descriptionId" in record ? <p>{String(record.descriptionId)}</p> : null}
      {"excerptId" in record && record.excerptId ? <p>{String(record.excerptId)}</p> : null}
      {"contentId" in record && Array.isArray(record.contentId) ? (
        <div className="article-prose">
          {record.contentId.map((block, index) => (
            <p key={index}>{typeof block === "object" && block && "text" in block ? String(block.text) : ""}</p>
          ))}
        </div>
      ) : null}
      {"authors" in record ? <p>{record.authors.join(", ")} · {record.year}</p> : null}
      {"courseId" in record ? <p><strong>{String(record.courseId)}</strong> · {String(record.resourceType)}</p> : null}
    </section>
  );
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
