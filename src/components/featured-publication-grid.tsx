import Image from "next/image";

import { ArrowUpRightIcon } from "@/components/icons";
import type { Publication } from "@/data/site";
import { getDictionary } from "@/data/translations";
import {
  formatContributors,
  publicationImprint,
} from "@/lib/content/publication-display";
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
                    ? publication.image.altId || `Sampul buku ${publication.title}`
                    : publication.image.altEn || `Book cover for ${publication.title}`
                }
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                src={publication.image.url}
              />
            </div>
          ) : null}
          <div className="featured-publication-meta">
            <span>{copy.publications.typeNames[publication.typeKey]}</span>
            <strong>{publication.year}</strong>
          </div>
          <h3>{publication.title}</h3>
          <p>{formatContributors(publication.authors, locale)}</p>
          <small>{publicationImprint(publication)}</small>
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
