import Image from "next/image";
import Link from "next/link";

import { FeaturedPublicationGrid } from "@/components/featured-publication-grid";
import { ArrowRightIcon } from "@/components/icons";
import { PublicAgendaList } from "@/components/public-agenda-list";
import { ResearchLedger } from "@/components/research-ledger";
import { SectionHeading } from "@/components/section-heading";
import { aboutProfile } from "@/data/about";
import {
  getHomepagePublicationSelection,
  portraitSource,
  roles,
} from "@/data/site";
import { getDictionary } from "@/data/translations";
import { getPublishedAgenda } from "@/lib/content/agenda";
import { getPublishedPublications } from "@/lib/content/publications";
import { getRoutePath, type Locale } from "@/lib/i18n";

export async function HomePage({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.home;
  const [agenda, publishedPublications] = await Promise.all([
    getPublishedAgenda(locale),
    getPublishedPublications(),
  ]);
  const talks = aboutProfile[locale].talks.slice(0, 2);
  const { books: latestBooks, nonBooks: selectedNonBooks } =
    getHomepagePublicationSelection(publishedPublications);

  return (
    <main id="konten-utama">
      <section className="editorial-hero">
        <div className="shell editorial-hero-grid">
          <div className="editorial-hero-copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.thesis}</h1>
            <p className="editorial-hero-lead">{copy.lead}</p>
            <div className="editorial-hero-actions">
              <Link
                className="button button-primary"
                href={getRoutePath(locale, "research")}
              >
                {copy.researchAction}
                <ArrowRightIcon />
              </Link>
              <Link
                className="button button-secondary"
                href={getRoutePath(locale, "publications")}
              >
                {copy.publicationsAction}
              </Link>
            </div>
          </div>

          <figure className="editorial-portrait">
            <div className="editorial-portrait-frame">
              <Image
                src={portraitSource}
                alt="Prof. Burhanuddin Muhtadi"
                fill
                priority
                sizes="(max-width: 840px) 92vw, 42vw"
              />
            </div>
            <figcaption>
              <strong>Burhanuddin Muhtadi</strong>
              <span>{copy.portraitCaption}</span>
            </figcaption>
          </figure>

          <div className="editorial-role-rail" aria-label={copy.rolesLabel}>
            {roles[locale].map((role, index) => (
              <div key={role}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section research-ledger-section">
        <div className="shell">
          <ResearchLedger locale={locale} />
        </div>
      </section>

      <section className="section featured-publications-section">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.publications.eyebrow}
            title={copy.publications.title}
            description={copy.publications.description}
            action={
              <Link
                className="text-link"
                href={getRoutePath(locale, "publications")}
              >
                {copy.publications.action}
                <ArrowRightIcon />
              </Link>
            }
          />
          <div className="featured-publication-groups">
            <section
              className="featured-publication-group"
              aria-labelledby="featured-books-title"
            >
              <div className="featured-publication-group-heading">
                <h3 id="featured-books-title">
                  {copy.publications.booksLabel}
                </h3>
                <span aria-hidden="true">03</span>
              </div>
              <FeaturedPublicationGrid
                publications={latestBooks}
                locale={locale}
                variant="books"
              />
            </section>

            <section
              className="featured-publication-group"
              aria-labelledby="featured-non-books-title"
            >
              <h3 className="sr-only" id="featured-non-books-title">
                {locale === "id" ? "Karya non-buku" : "Non-book work"}
              </h3>
              <FeaturedPublicationGrid
                publications={selectedNonBooks}
                locale={locale}
              />
            </section>
          </div>
        </div>
      </section>

      <section className="section outreach-home-section">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.outreach.eyebrow}
            title={copy.outreach.title}
            description={copy.outreach.description}
            action={
              <Link
                className="text-link"
                href={getRoutePath(locale, "outreach")}
              >
                {copy.outreach.action}
                <ArrowRightIcon />
              </Link>
            }
          />
          <div className="outreach-home-grid">
            <div className="outreach-agenda-preview">
              <p className="outreach-column-label">{copy.outreach.agendaLabel}</p>
              <PublicAgendaList items={agenda} locale={locale} compact />
            </div>
            <div className="outreach-forum-preview">
              <p className="outreach-column-label">{copy.outreach.forumLabel}</p>
              <div className="forum-preview-list">
                {talks.map((talk) => (
                  <article key={`${talk.year}-${talk.title}`}>
                    <span>{talk.year}</span>
                    <h3>{talk.title}</h3>
                    {talk.institution ? <p>{talk.institution}</p> : null}
                  </article>
                ))}
              </div>
              <Link
                className="quiet-material-link"
                href={getRoutePath(locale, "materials")}
              >
                {copy.outreach.materialsAction}
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-closing">
        <div className="shell home-closing-grid">
          <p>{copy.closing.eyebrow}</p>
          <h2>{copy.closing.title}</h2>
          <div>
            <Link
              className="button button-on-dark"
              href={getRoutePath(locale, "contact")}
            >
              {copy.closing.contactAction}
              <ArrowRightIcon />
            </Link>
            <Link
              className="text-link text-link-on-dark"
              href={getRoutePath(locale, "about")}
            >
              {copy.closing.profileAction}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
