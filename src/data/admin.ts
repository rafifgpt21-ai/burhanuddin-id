import type { Locale } from "@/lib/i18n";

const copy = {
  id: {
    login: {
      eyebrow: "Ruang kerja privat",
      title: "Masuk sebagai editor",
      intro: "Kelola materi kuliah, agenda, dan rekam publikasi dalam satu meja kerja.",
      email: "Email admin",
      password: "Kata sandi",
      submit: "Masuk ke ruang kerja",
      pending: "Memeriksa akses…",
      back: "Kembali ke situs publik",
      privacy: "Sesi privat berakhir otomatis setelah 8 jam.",
    },
    workspace: {
      name: "Meja redaksi",
      dashboard: "Ringkasan",
      materials: "Materi",
      agenda: "Agenda",
      publications: "Publikasi",
      logout: "Keluar",
    },
  },
  en: {
    login: {
      eyebrow: "Private workspace",
      title: "Sign in as editor",
      intro: "Manage course materials, agenda entries, and publication records from one workspace.",
      email: "Admin email",
      password: "Password",
      submit: "Enter workspace",
      pending: "Checking access…",
      back: "Return to the public site",
      privacy: "Private sessions expire automatically after 8 hours.",
    },
    workspace: {
      name: "Editorial desk",
      dashboard: "Overview",
      materials: "Materials",
      agenda: "Agenda",
      publications: "Publications",
      logout: "Sign out",
    },
  },
} as const;

export function getAdminCopy(locale: Locale) {
  return copy[locale];
}
