import type { Locale } from "@/lib/i18n";

const copy = {
  id: {
    login: {
      eyebrow: "Ruang editorial privat",
      title: "Masuk sebagai editor",
      intro: "Pengelolaan tulisan, materi kuliah, agenda, dan rekam publikasi.",
      username: "Username",
      password: "Kata sandi",
      submit: "Masuk ke ruang editorial",
      pending: "Memeriksa akses…",
      back: "Kembali ke situs publik",
      privacy: "Sesi privat berakhir otomatis setelah 8 jam.",
    },
    workspace: {
      name: "Meja redaksi",
      dashboard: "Ringkasan",
      posts: "Tulisan",
      materials: "Materi",
      agenda: "Agenda",
      publications: "Publikasi",
      account: "Akun saya",
      users: "Pengguna",
      logout: "Keluar",
    },
  },
  en: {
    login: {
      eyebrow: "Private editorial area",
      title: "Sign in as editor",
      intro: "Editorial management for writing, course materials, agenda entries, and publication records.",
      username: "Username",
      password: "Password",
      submit: "Enter editorial area",
      pending: "Checking access…",
      back: "Return to the public site",
      privacy: "Private sessions expire automatically after 8 hours.",
    },
    workspace: {
      name: "Editorial desk",
      dashboard: "Overview",
      posts: "Writing",
      materials: "Materials",
      agenda: "Agenda",
      publications: "Publications",
      account: "My account",
      users: "Users",
      logout: "Sign out",
    },
  },
} as const;

export function getAdminCopy(locale: Locale) {
  return copy[locale];
}
