import { ArrowUpRightIcon } from "@/components/icons";
import type { Publication } from "@/data/site";
import { getDictionary } from "@/data/translations";
import type { Locale } from "@/lib/i18n";

export function FeaturedPublicationGrid({
  publications,
  locale,
}: {
  publications: readonly Publication[];
  locale: Locale;
}) {
  const copy = getDictionary(locale);

  return (
    <div className="featured-publication-grid">
      {publications.map((publication) => (
        <article key={`${publication.year}-${publication.title}`}>
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
