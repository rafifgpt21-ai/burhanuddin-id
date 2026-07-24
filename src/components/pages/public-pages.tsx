import Link from "next/link";

import { ContactChannelList } from "@/components/contact-channel-list";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { PublicAgendaList } from "@/components/public-agenda-list";
import { ResearchLedger } from "@/components/research-ledger";
import { aboutProfile } from "@/data/about";
import { getDictionary } from "@/data/translations";
import { getPublishedAgenda } from "@/lib/content/agenda";
import { getRoutePath, type Locale } from "@/lib/i18n";

export function ResearchPage({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).researchPage;

  return (
    <main id="konten-utama">
      <PageHero {...copy} />
      <section className="page-content research-page">
        <div className="shell">
          <ResearchLedger locale={locale} showIntroduction={false} />
          <div className="research-page-closing">
            <p>{copy.closingText}</p>
            <Link
              className="button button-primary"
              href={getRoutePath(locale, "publications")}
            >
              {copy.publicationsAction}
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function OutreachPage({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).outreachPage;
  const agenda = await getPublishedAgenda(locale);
  const talks = aboutProfile[locale].talks;

  return (
    <main id="konten-utama">
      <PageHero {...copy} />
      <section className="page-content outreach-page">
        <div className="shell outreach-page-grid">
          <section id="agenda" className="outreach-agenda-section">
            <div className="outreach-section-heading">
              <p className="eyebrow">{copy.agendaEyebrow}</p>
              <h2>{copy.agendaTitle}</h2>
              <p>{copy.agendaDescription}</p>
            </div>
            <PublicAgendaList items={agenda} locale={locale} />
          </section>

          <section className="outreach-talks-section">
            <div className="outreach-section-heading">
              <p className="eyebrow">{copy.forumEyebrow}</p>
              <h2>{copy.forumTitle}</h2>
              <p>{copy.forumDescription}</p>
            </div>
            <div className="outreach-talk-list">
              {talks.map((talk) => (
                <article key={`${talk.year}-${talk.title}`}>
                  <span>{talk.year}</span>
                  <div>
                    <h3>{talk.title}</h3>
                    {talk.institution ? <p>{talk.institution}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="teaching-entry">
            <p className="eyebrow">{copy.teachingEyebrow}</p>
            <h2>{copy.teachingTitle}</h2>
            <p>{copy.teachingDescription}</p>
            <Link
              className="text-link"
              href={getRoutePath(locale, "materials")}
            >
              {copy.teachingAction}
              <ArrowRightIcon />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).contactPage;

  return (
    <main id="konten-utama">
      <PageHero {...copy} />
      <section className="page-content contact-page">
        <div className="shell contact-page-grid">
          <div className="contact-intro">
            <p className="eyebrow">{copy.channelsEyebrow}</p>
            <h2>{copy.channelsTitle}</h2>
            <p>{copy.channelsDescription}</p>
          </div>
          <ContactChannelList locale={locale} />
        </div>
      </section>
    </main>
  );
}
