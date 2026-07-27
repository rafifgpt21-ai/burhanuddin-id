import Link from "next/link";

import { AdminCommandSearch } from "@/components/admin/admin-command-search";
import { AdminLogout } from "@/components/admin/admin-logout";
import {
  AdminNavigation,
  type AdminNavigationItem,
} from "@/components/admin/admin-navigation";
import { getAdminCopy } from "@/data/admin";
import { canManageUsers } from "@/lib/auth/access";
import type { AdminSession } from "@/lib/auth/session";
import { getRoutePath, type Locale } from "@/lib/i18n";

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
  const links: AdminNavigationItem[] = [
    { href: base, label: copy.dashboard, meta: copy.dashboardMeta },
    { href: `${base}/beranda`, label: copy.homepage, meta: copy.homepageMeta },
    {
      href: `${base}/publikasi`,
      label: copy.publications,
      meta: copy.publicationsMeta,
    },
    { href: `${base}/agenda`, label: copy.agenda, meta: copy.agendaMeta },
    { href: `${base}/tulisan`, label: copy.posts, meta: copy.postsMeta },
    { href: `${base}/materi`, label: copy.materials, meta: copy.materialsMeta },
    { href: `${base}/account`, label: copy.account, meta: copy.accountMeta },
  ];
  if (canManageUsers(session.role)) {
    links.push({ href: `${base}/users`, label: copy.users, meta: copy.usersMeta });
  }

  return (
    <div className="admin-workspace">
      <header className="admin-workspace-header">
        <div>
          <span className="admin-monogram" aria-hidden="true">BM</span>
          <div>
            <p>{copy.name}</p>
            <small>@{session.username} · {session.role.replace("_", " ")}</small>
          </div>
        </div>
        <div className="admin-header-actions">
          <AdminCommandSearch locale={locale} />
          <Link className="admin-public-link" href={getRoutePath(locale, "home")}>
            {copy.publicSite}
          </Link>
          <AdminLogout
            label={copy.logout}
            locale={locale}
            userId={session.id}
          />
        </div>
      </header>
      <div className="admin-workspace-grid">
        <aside className="admin-sidebar">
          <AdminNavigation items={links} label={copy.navigationLabel} />
          <div className="admin-status-rail" aria-label={copy.workflowLabel}>
            <small>{copy.workflowLabel}</small>
            <span>{copy.draft}</span>
            <span>{copy.review}</span>
            <span>{copy.published}</span>
          </div>
        </aside>
        <main id="konten-utama" className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
