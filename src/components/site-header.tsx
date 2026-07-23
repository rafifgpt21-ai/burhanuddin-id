import Link from "next/link";

import { LoginIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/data/translations";
import { getRoutePath, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

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

        <nav className="desktop-nav" aria-label={dictionary.header.navigationLabel}>
          {dictionary.navigation.map((item) => (
            <Link href={getRoutePath(locale, item.route)} key={item.route}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher
            locale={locale}
            label={dictionary.header.language}
            switchLabel={dictionary.header.switchTo}
          />

          <Link
            className="search-link"
            href={`${getRoutePath(locale, "materials")}#pencarian`}
          >
            <SearchIcon />
            <span className="sr-only">{dictionary.header.search}</span>
          </Link>

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
            <nav aria-label={dictionary.header.mobileNavigationLabel}>
              {dictionary.navigation.map((item) => (
                <Link href={getRoutePath(locale, item.route)} key={item.route}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
