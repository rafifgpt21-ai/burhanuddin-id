import Image from "next/image";

import { ArrowUpRightIcon } from "@/components/icons";
import type { Publication } from "@/data/site";
import { getDictionary } from "@/data/translations";
import type { Locale } from "@/lib/i18n";

export function FeaturedPublicationGrid({
  publications,
  locale,
  variant = "text",
}: {
  publications: readonly Publication[];
  locale: Locale;
  variant?: "books" | "text";
}) {
  const copy = getDictionary(locale);

  return (
    <div
      className={`featured-publication-grid featured-publication-grid-${variant}`}
    >
      {publications.map((publication) => (
        <article
          className={publication.image ? "has-cover" : undefined}
          key={`${publication.year}-${publication.title}`}
        >
          {publication.image ? (
            <div className="featured-publication-cover">
              <Image
                alt={
                  locale === "id"
                    ? `Sampul buku ${publication.title}`
                    : `Book cover for ${publication.title}`
                }
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                src={publication.image}
              />
            </div>
          ) : null}
          <div className="featured-publication-meta">
            <span>{copy.publications.typeNames[publication.typeKey]}</span>
            <strong>{publication.year}</strong>
          </div>
          <h3>{publication.title}</h3>
          <p>{publication.authors}</p>
          <small>{publication.venue}</small>
          {publication.href ? (
            <a
              href={publication.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${copy.common.openSource} ${publication.title}`}
            >
              {locale === "id" ? "Buka sumber" : "Open source"}
              <ArrowUpRightIcon />
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}
