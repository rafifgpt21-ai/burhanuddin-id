import { AccountForm } from "@/components/admin/user-forms";
import { adminText } from "@/data/admin-qol";
import { readAdminSession } from "@/lib/auth/session";
import { hasLocale } from "@/lib/i18n";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const session = await readAdminSession();

  if (!session) return null;

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">{adminText(locale, "Identitas & keamanan", "Identity & security")}</p>
          <h1>{adminText(locale, "Akun saya", "My account")}</h1>
          <p>{adminText(locale, "Ubah hanya username dan password akun yang sedang Anda gunakan.", "Change only the username and password of the account you are currently using.")}</p>
        </div>
        <span className="role-stamp role-current">{session.role.replace("_", " ")}</span>
      </header>

      <section className="account-security-panel" aria-labelledby="account-security-title">
        <div className="account-identity">
          <span aria-hidden="true">{session.name.slice(0, 1).toUpperCase()}</span>
          <div>
            <p className="eyebrow">{adminText(locale, "Masuk sebagai", "Signed in as")}</p>
            <h2 id="account-security-title">{session.name}</h2>
            <p>@{session.username}</p>
          </div>
        </div>
        <div>
          <p className="security-note"><strong>{adminText(locale, "Konfirmasi keamanan.", "Security confirmation.")}</strong> {adminText(locale, "Password saat ini selalu diminta. Penggantian password akan mencabut sesi lain milik akun ini.", "Your current password is always required. Changing it revokes other sessions for this account.")}</p>
          <AccountForm locale={locale} username={session.username} />
        </div>
      </section>
    </>
  );
}
