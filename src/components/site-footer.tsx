import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons";
import { externalProfiles } from "@/data/site";
import { getDictionary } from "@/data/translations";
import { getRoutePath, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const navigation = dictionary.navigation.filter(
    (item) => item.route !== "home" && item.route !== "posts",
  );

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-intro">
          <span className="wordmark-mark footer-mark" aria-hidden="true">
            BM
          </span>
          <p className="footer-title">Burhanuddin Muhtadi</p>
          <p>{dictionary.footer.intro}</p>
        </div>

        <div>
          <p className="footer-label">{dictionary.footer.explore}</p>
          <nav className="footer-links" aria-label={dictionary.footer.navigationLabel}>
            {navigation.map((item) => (
              <Link href={getRoutePath(locale, item.route)} key={item.route}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="footer-label">{dictionary.footer.profiles}</p>
          <div className="footer-links">
            {externalProfiles.map((profile) => (
              <a href={profile.href} key={profile.href} target="_blank" rel="noreferrer">
                {profile.label}
                <ArrowUpRightIcon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>© 2026 Burhanuddin Muhtadi.</p>
        <Link href={getRoutePath(locale, "admin")}>{dictionary.footer.editor}</Link>
      </div>
    </footer>
  );
}
