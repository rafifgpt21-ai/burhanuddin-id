import { notFound } from "next/navigation";

import {
  CreateUserForm,
  ManagedUserForm,
  type ManagedUser,
} from "@/components/admin/user-forms";
import { canManageUsers } from "@/lib/auth/access";
import { readAdminSession } from "@/lib/auth/session";
import { hasLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const session = await readAdminSession();
  if (!session || !canManageUsers(session.role)) notFound();

  let users: ManagedUser[] = [];
  let unavailable = false;
  try {
    const records = await prisma.adminUser.findMany({
      where: {
        id: { not: session.id },
        role: { in: ["ADMIN", "EDITOR"] },
      },
      orderBy: [{ role: "asc" }, { username: "asc" }],
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        updatedAt: true,
      },
    });
    users = records.map((user) => ({
      ...user,
      role: user.role as ManagedUser["role"],
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
          <p className="eyebrow">Kontrol akses · Super admin</p>
          <h1>Manajemen pengguna</h1>
          <p>Tambahkan akun editorial dan atur ulang akses tanpa membagikan satu kredensial bersama.</p>
        </div>
        <span className="access-badge">Khusus super admin</span>
      </header>

      <section className="user-create-panel" aria-labelledby="new-user-title">
        <div className="user-panel-intro">
          <p className="eyebrow">Akun baru</p>
          <h2 id="new-user-title">Tambahkan pengguna</h2>
          <p>Admin dan editor dapat masuk ke ruang editorial. Hanya super admin yang melihat halaman ini.</p>
        </div>
        <CreateUserForm locale={locale} />
      </section>

      <section className="user-ledger" aria-labelledby="user-ledger-title">
        <div className="user-ledger-heading">
          <div>
            <p className="eyebrow">Daftar akses</p>
            <h2 id="user-ledger-title">Pengguna aktif</h2>
          </div>
          <span>{users.length} akun dikelola</span>
        </div>

        {unavailable ? (
          <div className="admin-notice" role="alert">
            <span aria-hidden="true">!</span>
            <div>
              <h2>Daftar pengguna belum dapat dibuka</h2>
              <p>Periksa koneksi database, lalu muat ulang halaman.</p>
            </div>
          </div>
        ) : users.length ? (
          <div className="managed-user-list">
            {users.map((user) => (
              <ManagedUserForm key={user.id} locale={locale} user={user} />
            ))}
          </div>
        ) : (
          <div className="admin-empty compact">
            <span aria-hidden="true">00</span>
            <div>
              <h2>Belum ada pengguna lain</h2>
              <p>Gunakan formulir di atas untuk membuat akun admin atau editor pertama.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
