import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { ArrowRightIcon } from "@/components/icons";
import { getAdminCopy } from "@/data/admin";
import { getDictionary } from "@/data/translations";
import { getAuthReadiness, readAdminSession } from "@/lib/auth/session";
import { getRoutePath, hasLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return {
    title: getDictionary(locale).admin.metadataTitle,
    robots: { index: false, follow: false },
  };
}

export default async function LocalizedAdminLogin({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  if (await readAdminSession()) redirect(`/${locale}/admin`);

  const copy = getAdminCopy(locale).login;
  const readiness = getAuthReadiness();

  return (
    <main id="konten-utama" className="login-wrap">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-index" aria-hidden="true">
          <span>BM / ADMIN</span>
          <strong>01</strong>
        </div>
        <div className="login-copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 id="login-title">{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>

        {!readiness.ready ? (
          <div className="foundation-lock" role="status">
            <strong>Database admin belum siap</strong>
            Login akan aktif setelah database tersedia dan akun administrator selesai di-seed.
          </div>
        ) : null}

        <LoginForm locale={locale} />

        <div className="login-meta">
          <small>{copy.privacy}</small>
          <Link className="text-link" href={getRoutePath(locale, "home")}>
            {copy.back} <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </main>
  );
}
