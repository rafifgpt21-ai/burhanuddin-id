import type { Locale } from "@/lib/i18n";

const copy = {
  id: {
    login: {
      eyebrow: "Ruang editorial privat",
      title: "Masuk sebagai editor",
      intro: "Pengelolaan materi kuliah, agenda, dan rekam publikasi.",
      email: "Email admin",
      password: "Kata sandi",
      submit: "Masuk ke ruang editorial",
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
      eyebrow: "Private editorial area",
      title: "Sign in as editor",
      intro: "Editorial management for course materials, agenda entries, and publication records.",
      email: "Admin email",
      password: "Password",
      submit: "Enter editorial area",
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
