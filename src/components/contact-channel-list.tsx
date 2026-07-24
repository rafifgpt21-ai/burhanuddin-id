import { ArrowUpRightIcon } from "@/components/icons";
import { contactChannels, publicCv } from "@/data/public";
import type { Locale } from "@/lib/i18n";

export function ContactChannelList({ locale }: { locale: Locale }) {
  const channels = contactChannels[locale];

  return (
    <div className="contact-channel-list">
      {channels.map((channel) => (
        <a
          href={channel.href}
          key={channel.href}
          target="_blank"
          rel="noreferrer"
        >
          <span>
            {channel.kind === "institution"
              ? locale === "id"
                ? "Institusi"
                : "Institution"
              : locale === "id"
                ? "Profil akademik"
                : "Academic profile"}
          </span>
          <strong>{channel.label}</strong>
          <p>{channel.description}</p>
          <ArrowUpRightIcon />
        </a>
      ))}
      {publicCv ? (
        <a href={publicCv.href} target="_blank" rel="noreferrer">
          <span>CV</span>
          <strong>{publicCv.label[locale]}</strong>
          <ArrowUpRightIcon />
        </a>
      ) : null}
    </div>
  );
}
