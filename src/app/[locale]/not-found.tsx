"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowRightIcon } from "@/components/icons";
import { getRoutePath, hasLocale } from "@/lib/i18n";

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = hasLocale(params.locale) ? params.locale : "id";
  const copy =
    locale === "id"
      ? {
          eyebrow: "404 · Arsip tidak ditemukan",
          title: "Halaman ini tidak ada atau sudah dipindahkan.",
          description: "Kembali ke beranda atau buka indeks materi perkuliahan.",
          action: "Kembali ke beranda",
        }
      : {
          eyebrow: "404 · Archive not found",
          title: "This page does not exist or has moved.",
          description: "Return home or open the course-material index.",
          action: "Return home",
        };

  return (
    <main id="konten-utama" className="page-content">
      <div className="shell empty-state">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
          <Link className="text-link" href={getRoutePath(locale, "home")}>
            {copy.action} <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </main>
  );
}
