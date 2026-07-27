import { notFound } from "next/navigation";
import Link from "next/link";

import {
  CreateUserForm,
  ManagedUserForm,
  type ManagedUser,
} from "@/components/admin/user-forms";
import { canManageUsers } from "@/lib/auth/access";
import { readAdminSession } from "@/lib/auth/session";
import { hasLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { getAdminQolCopy, adminText } from "@/data/admin-qol";

export default async function UsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ locale: value }, query] = await Promise.all([params, searchParams]);
  const locale = hasLocale(value) ? value : "id";
  const q = query.q?.trim().slice(0, 80) ?? "";
  const copy = getAdminQolCopy(locale);
  const session = await readAdminSession();
  if (!session || !canManageUsers(session.role)) notFound();

  let users: ManagedUser[] = [];
  let unavailable = false;
  try {
    const records = await prisma.adminUser.findMany({
      where: {
        id: { not: session.id },
        role: { in: ["ADMIN", "EDITOR"] },
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" as const } },
                { username: { contains: q, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: [{ role: "asc" }, { username: "asc" }],
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        updatedAt: true,
        sessions: {
          where: { expiresAt: { gt: new Date() } },
          select: { id: true },
        },
      },
    });
    users = records.map((user) => ({
      ...user,
      role: user.role as ManagedUser["role"],
      activeSessions: user.sessions.length,
      updatedAt: new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
        dateStyle: "medium",
      }).format(user.updatedAt),
    }));
  } catch {
    unavailable = true;
  }

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">{adminText(locale, "Kontrol akses · Super admin", "Access control · Super admin")}</p>
          <h1>{adminText(locale, "Manajemen pengguna", "User management")}</h1>
          <p>{adminText(locale, "Tambahkan akun editorial dan atur ulang akses tanpa membagikan satu kredensial bersama.", "Add editorial accounts and manage access without sharing a single credential.")}</p>
        </div>
        <span className="access-badge">{adminText(locale, "Khusus super admin", "Super admin only")}</span>
      </header>

      <section className="user-create-panel" aria-labelledby="new-user-title">
        <div className="user-panel-intro">
          <p className="eyebrow">{adminText(locale, "Akun baru", "New account")}</p>
          <h2 id="new-user-title">{adminText(locale, "Tambahkan pengguna", "Add user")}</h2>
          <p>{adminText(locale, "Admin dan editor dapat masuk ke ruang editorial. Hanya super admin yang melihat halaman ini.", "Admins and editors can access the workspace. Only the super admin can view this page.")}</p>
        </div>
        <CreateUserForm locale={locale} />
      </section>

      <section className="user-ledger" aria-labelledby="user-ledger-title">
        <div className="user-ledger-heading">
          <div>
            <p className="eyebrow">{adminText(locale, "Daftar akses", "Access roster")}</p>
            <h2 id="user-ledger-title">{adminText(locale, "Pengguna aktif", "Active users")}</h2>
          </div>
          <span>{users.length} {adminText(locale, "akun dikelola", "managed accounts")}</span>
        </div>

        <form className="user-search-form" method="get">
          <label>
            {copy.users.search}
            <input defaultValue={q} name="q" type="search" />
          </label>
          <button className="button button-secondary" type="submit">
            {adminText(locale, "Cari", "Search")}
          </button>
          {q ? <Link href={`/${locale}/admin/users`}>{adminText(locale, "Reset", "Reset")}</Link> : null}
        </form>

        {unavailable ? (
          <div className="admin-notice" role="alert">
            <span aria-hidden="true">!</span>
            <div>
              <h2>{adminText(locale, "Daftar pengguna belum dapat dibuka", "The user roster is unavailable")}</h2>
              <p>{adminText(locale, "Periksa koneksi database, lalu muat ulang halaman.", "Check the database connection, then reload the page.")}</p>
            </div>
          </div>
        ) : users.length ? (
          <div className="managed-user-list">
            {users.map((user) => (
              <details className="managed-user-disclosure" key={user.id}>
                <summary>
                  <span className={`role-stamp role-${user.role.toLowerCase()}`}>{user.role}</span>
                  <strong>{user.name}</strong>
                  <small>@{user.username} · {user.activeSessions} {copy.users.activeSessions}</small>
                  <span>{copy.users.editAccount}</span>
                </summary>
                <ManagedUserForm locale={locale} user={user} />
              </details>
            ))}
          </div>
        ) : (
          <div className="admin-empty compact">
            <span aria-hidden="true">00</span>
            <div>
              <h2>{adminText(locale, "Belum ada pengguna lain", "No other users yet")}</h2>
              <p>{adminText(locale, "Gunakan formulir di atas untuk membuat akun admin atau editor pertama.", "Use the form above to create the first admin or editor account.")}</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
