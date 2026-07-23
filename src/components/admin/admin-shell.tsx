import Link from "next/link";

import { logoutAction } from "@/app/[locale]/admin/actions";
import { getAdminCopy } from "@/data/admin";
import type { AdminSession } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n";

export function AdminShell({
  children,
  locale,
  session,
}: {
  children: React.ReactNode;
  locale: Locale;
  session: AdminSession;
}) {
  const copy = getAdminCopy(locale).workspace;
  const base = `/${locale}/admin`;
  const links = [
    { href: base, label: copy.dashboard },
    { href: `${base}/materi`, label: copy.materials },
    { href: `${base}/agenda`, label: copy.agenda },
    { href: `${base}/publikasi`, label: copy.publications },
  ];

  return (
    <div className="admin-workspace">
      <header className="admin-workspace-header">
        <div>
          <span className="admin-monogram" aria-hidden="true">BM</span>
          <div>
            <p>{copy.name}</p>
            <small>{session.email}</small>
          </div>
        </div>
        <form action={logoutAction}>
          <input name="locale" type="hidden" value={locale} />
          <button className="admin-logout" type="submit">{copy.logout}</button>
        </form>
      </header>
      <div className="admin-workspace-grid">
        <aside className="admin-sidebar">
          <nav aria-label={copy.name}>
            {links.map((item, index) => (
              <Link href={item.href} key={item.href}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="admin-status-rail" aria-label="Alur editorial">
            <span>Draft</span>
            <span>Review</span>
            <span>Terbit</span>
          </div>
        </aside>
        <main id="konten-utama" className="admin-main">{children}</main>
      </div>
    </div>
  );
}
