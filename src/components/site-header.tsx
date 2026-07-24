import Link from "next/link";

import { LoginIcon, MenuIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PublicNavigation } from "@/components/public-navigation";
import { getDictionary } from "@/data/translations";
import { getRoutePath, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const navigation = dictionary.navigation.map((item) => ({
    href: getRoutePath(locale, item.route),
    label: item.label,
  }));

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          className="wordmark"
          href={getRoutePath(locale, "home")}
          aria-label={dictionary.header.homeLabel}
        >
          <span className="wordmark-mark" aria-hidden="true">
            BM
          </span>
          <span className="wordmark-name">
            Burhanuddin <strong>Muhtadi</strong>
          </span>
        </Link>

        <PublicNavigation
          className="desktop-nav"
          items={navigation}
          label={dictionary.header.navigationLabel}
        />

        <div className="header-actions">
          <LanguageSwitcher
            locale={locale}
            label={dictionary.header.language}
            switchLabel={dictionary.header.switchTo}
          />

          <Link
            aria-label={dictionary.header.login}
            className="login-link"
            href={`/${locale}/admin/login`}
            title={dictionary.header.login}
          >
            <LoginIcon />
          </Link>

          <details className="mobile-menu">
            <summary aria-label={dictionary.header.openMenu}>
              <MenuIcon />
              <span>{dictionary.header.menu}</span>
            </summary>
            <div className="mobile-menu-panel">
              <PublicNavigation
                className="mobile-public-nav"
                items={navigation}
                label={dictionary.header.mobileNavigationLabel}
              />
              <Link
                className="mobile-editor-link"
                href={getRoutePath(locale, "admin")}
              >
                <LoginIcon />
                <span>{dictionary.footer.editor}</span>
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
