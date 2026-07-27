import Link from "next/link";

import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import type {
  PublicMaterial,
  PublicPost,
} from "@/lib/content/collections";
import { getRoutePath, type Locale } from "@/lib/i18n";
import type { PostBlock } from "@/lib/validation/content";

function PostBlockView({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "heading":
      return block.level === 2 ? <h2>{block.text}</h2> : <h3>{block.text}</h3>;
    case "quote":
      return (
        <blockquote>
          <p>{block.text}</p>
          {block.citation ? <cite>{block.citation}</cite> : null}
        </blockquote>
      );
    case "link":
      return <p><a href={block.url}>{block.label}<ArrowUpRightIcon /></a></p>;
    case "image":
      return (
        <figure>
          {/* Uploaded editorial images retain their original proportions. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.alt} />
          <figcaption>{block.rightsNote}</figcaption>
        </figure>
      );
    case "file":
      return <p><a href={block.url}>{block.label}<ArrowUpRightIcon /></a></p>;
    case "video":
      return <p><a href={block.url}>{block.title}<ArrowUpRightIcon /></a></p>;
  }
}

export function PostDetailPage({
  locale,
  post,
}: {
  locale: Locale;
  post: PublicPost;
}) {
  return (
    <main id="konten-utama">
      <PageHero
        eyebrow={locale === "id" ? "Tulisan" : "Writing"}
        title={post.title}
        description={post.excerpt}
        showIndex={false}
      />
      <article className="page-content reading-page">
        <div className="reading-shell">
          <div className="reading-meta">
            {post.publishedAt ? (
              <time dateTime={post.publishedAt.toISOString()}>
                {new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
                  dateStyle: "long",
                }).format(post.publishedAt)}
              </time>
            ) : null}
            <span>{post.topics.join(" · ")}</span>
          </div>
          <div className="article-prose">
            {post.content.map((block, index) => (
              <PostBlockView block={block} key={`${block.type}-${index}`} />
            ))}
          </div>
          <Link className="text-link" href={getRoutePath(locale, "posts")}>
            {locale === "id" ? "Kembali ke semua tulisan" : "Back to all writing"}
            <ArrowRightIcon />
          </Link>
        </div>
      </article>
    </main>
  );
}

export function MaterialDetailPage({
  locale,
  material,
}: {
  locale: Locale;
  material: PublicMaterial;
}) {
  const action = material.target?.external
    ? locale === "id" ? "Kunjungi sumber" : "Visit source"
    : material.downloadAllowed
      ? locale === "id" ? "Unduh materi" : "Download material"
      : locale === "id" ? "Buka materi" : "Open material";

  return (
    <main id="konten-utama">
      <PageHero
        eyebrow={locale === "id" ? "Materi kuliah" : "Course material"}
        title={material.title}
        description={material.description}
        showIndex={false}
      />
      <section className="page-content material-detail">
        <div className="shell material-detail-grid">
          <dl>
            <div><dt>{locale === "id" ? "Mata kuliah" : "Course"}</dt><dd>{material.course}</dd></div>
            {material.topic ? <div><dt>{locale === "id" ? "Topik" : "Topic"}</dt><dd>{material.topic}</dd></div> : null}
            <div><dt>{locale === "id" ? "Jenis" : "Type"}</dt><dd>{material.resourceType.replaceAll("_", " ")}</dd></div>
            {material.semester ? <div><dt>{locale === "id" ? "Semester" : "Semester"}</dt><dd>{material.semester}</dd></div> : null}
            {material.academicYear ? <div><dt>{locale === "id" ? "Tahun akademik" : "Academic year"}</dt><dd>{material.academicYear}</dd></div> : null}
          </dl>
          <div className="material-action-card">
            {material.target ? (
              <a className="button button-primary" href={material.target.url}>
                {action}<ArrowUpRightIcon />
              </a>
            ) : (
              <p role="status">
                {locale === "id"
                  ? "Berkas materi sedang tidak tersedia."
                  : "The material file is currently unavailable."}
              </p>
            )}
            {material.target?.rightsNote ? <small>{material.target.rightsNote}</small> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

