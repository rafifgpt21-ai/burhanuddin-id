import Image from "next/image";
import Link from "next/link";

import { FeaturedPublicationGrid } from "@/components/featured-publication-grid";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "@/components/icons";
import { PublicAgendaList } from "@/components/public-agenda-list";
import { ResearchLedger } from "@/components/research-ledger";
import { SectionHeading } from "@/components/section-heading";
import {
  getHomepagePublicationSelection,
} from "@/data/site";
import { getDictionary } from "@/data/translations";
import { getPublishedAgenda } from "@/lib/content/agenda";
import {
  getPublishedHomepage,
  resolveHomepageLocaleContent,
} from "@/lib/content/homepage";
import { getPublishedPublications } from "@/lib/content/publications";
import { getRoutePath, type Locale } from "@/lib/i18n";

export async function HomePage({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.home;
  const [agenda, publishedPublications, homepage] = await Promise.all([
    getPublishedAgenda(locale),
    getPublishedPublications(),
    getPublishedHomepage(),
  ]);
  const content = resolveHomepageLocaleContent(homepage, locale);
  const talks = homepage.forums.map((forum) => ({
    year: forum.year,
    title:
      locale === "id" ? forum.titleId : forum.titleEn || forum.titleId,
    institution:
      locale === "id"
        ? forum.institutionId
        : forum.institutionEn || forum.institutionId,
  }));
  const research = homepage.research.map((cluster) => ({
    key: cluster.key,
    title:
      locale === "id" ? cluster.titleId : cluster.titleEn || cluster.titleId,
    description:
      locale === "id"
        ? cluster.descriptionId
        : cluster.descriptionEn || cluster.descriptionId,
    work: {
      year: cluster.workYear,
      title: cluster.workTitle,
      href: cluster.workUrl || undefined,
    },
  }));
  const { books: latestBooks, nonBooks: selectedNonBooks } =
    getHomepagePublicationSelection(publishedPublications);

  return (
    <main id="konten-utama">
      <div className="brand-intro">
        <div className="brand-intro-inner">
          <div className="brand-intro-primary">
            <p className="brand-intro-label">{content.officialLabel}</p>
            <div className="brand-intro-logo">
              <Image
                src={homepage.logoUrl}
                alt=""
                width={2000}
                height={1000}
                preload
                sizes="(max-width: 720px) calc(100vw - 40px), 44vw"
              />
            </div>
            <p className="brand-intro-tagline">{content.tagline}</p>
          </div>
          <blockquote className="brand-intro-quote" lang="id">
            <p>{content.quote}</p>
          </blockquote>
        </div>
        <div className="brand-intro-folio shell">
          <p>{content.fields}</p>
          <a href="#profil-akademik">
            <span>{content.continueAction}</span>
            <ArrowDownIcon />
          </a>
        </div>
      </div>

      <section className="editorial-hero" id="profil-akademik">
        <div className="shell editorial-hero-grid">
          <div className="editorial-hero-copy">
            <h1 className="editorial-academic-name">
              <span className="editorial-academic-prefix">
                {content.academicPrefix}
              </span>{" "}
              <span className="editorial-academic-primary">
                {content.academicName}
              </span>{" "}
              <span className="editorial-academic-suffix">
                {content.academicSuffix}
              </span>
            </h1>
            <p className="editorial-hero-lead">{content.lead}</p>
            <div className="editorial-hero-actions editorial-hero-profile-action">
              <Link
                className="button button-primary"
                href={getRoutePath(locale, "about")}
              >
                {content.profileAction}
                <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <figure className="editorial-portrait">
            <div className="editorial-portrait-frame">
              <Image
                src={homepage.portraitUrl}
                alt={
                  locale === "id"
                    ? homepage.portraitAltId
                    : homepage.portraitAltEn || homepage.portraitAltId
                }
                fill
                sizes="(max-width: 840px) 92vw, 42vw"
              />
            </div>
            <figcaption>
              <strong>Burhanuddin Muhtadi</strong>
              <span>{content.portraitCaption}</span>
            </figcaption>
          </figure>

        </div>
      </section>

      <aside className="editorial-role-strip" aria-label={copy.rolesLabel}>
        <div className="shell editorial-role-rail">
          {content.roles.map((role, index) => (
            <div key={role}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>{role}</p>
            </div>
          ))}
        </div>
      </aside>

      <section className="section featured-publications-section">
        <div className="shell">
          <SectionHeading
            eyebrow={content.publicationEyebrow}
            title={content.publicationTitle}
            description={content.publicationDescription}
            action={
              <Link
                className="text-link"
                href={getRoutePath(locale, "publications")}
              >
                {content.publicationAction}
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
                  {content.booksLabel}
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

      <section className="section research-ledger-section">
        <div className="shell">
          <ResearchLedger locale={locale} clusters={research} />
        </div>
      </section>

      <section className="section outreach-home-section">
        <div className="shell">
          <SectionHeading
            eyebrow={content.outreachEyebrow}
            title={content.outreachTitle}
            description={content.outreachDescription}
            action={
              <Link
                className="text-link"
                href={getRoutePath(locale, "outreach")}
              >
                {content.outreachAction}
                <ArrowRightIcon />
              </Link>
            }
          />
          <div className="outreach-home-grid">
            <div className="outreach-agenda-preview">
              <p className="outreach-column-label">{content.agendaLabel}</p>
              <PublicAgendaList
                items={agenda}
                locale={locale}
                compact
                showAdminShortcut
              />
            </div>
            <div className="outreach-forum-preview">
              <p className="outreach-column-label">{content.forumLabel}</p>
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
                {content.materialsAction}
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-closing">
        <div className="shell home-closing-grid">
          <p>{content.closingEyebrow}</p>
          <h2>{content.closingTitle}</h2>
          <div className="home-closing-actions">
            <Link
              className="button button-on-dark"
              href={getRoutePath(locale, "contact")}
            >
              {content.contactAction}
              <ArrowRightIcon />
            </Link>
            <Link
              className="text-link text-link-on-dark"
              href={getRoutePath(locale, "about")}
            >
              {content.closingProfileAction}
            </Link>
            <a
              className="text-link text-link-on-dark"
              href={homepage.scholar.href}
              target="_blank"
              rel="noreferrer"
            >
              {homepage.scholar.label}
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
