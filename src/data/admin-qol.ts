import type { Locale } from "@/lib/i18n";

export const adminQolCopy = {
  id: {
    search: {
      button: "Cari konten",
      dialogTitle: "Cari di ruang editorial",
      placeholder: "Cari judul, penulis, mata kuliah, atau metadata…",
      hint: "Ketik minimal 2 karakter. Gunakan panah untuk memilih.",
      empty: "Tidak ada konten yang cocok.",
      loading: "Mencari…",
      error: "Pencarian belum dapat dijalankan.",
      close: "Tutup pencarian",
    },
    common: {
      edit: "Edit",
      preview: "Preview",
      save: "Simpan draft",
      saving: "Menyimpan…",
      publish: "Terbitkan",
      publishChanges: "Terbitkan perubahan",
      duplicate: "Duplikasi",
      archive: "Arsipkan",
      restore: "Pulihkan",
      unpublish: "Batalkan terbit",
      deletePermanent: "Hapus permanen",
      moreActions: "Tindakan lainnya",
      resetFilters: "Reset filter",
      applyFilters: "Terapkan",
      selectPage: "Pilih semua pada halaman ini",
      selected: "dipilih",
      records: "record",
      back: "Kembali",
      optional: "Opsional",
      lastEditedBy: "Terakhir disunting oleh",
      unknownEditor: "Editor tidak diketahui",
    },
    editor: {
      unsaved: "Ada perubahan yang belum disimpan.",
      saved: "Draft tersimpan",
      saveBeforePreview: "Simpan draft sebelum preview atau menerbitkan.",
      readiness: "Kesiapan terbit",
      ready: "Siap diterbitkan",
      notReady: "Masih perlu dilengkapi",
      errorTitle: "Periksa kembali bagian berikut",
      conflictTitle: "Draft telah berubah di tempat lain",
      conflictBody:
        "Perubahan Anda tetap tersimpan di perangkat dan belum menimpa versi terbaru.",
      reloadLatest: "Muat versi terbaru",
      recoverTitle: "Cadangan lokal ditemukan",
      recoverBody:
        "Cadangan ini lebih baru daripada draft server. Pulihkan sebelum melanjutkan.",
      recover: "Pulihkan cadangan",
      discard: "Buang cadangan",
      leaveWarning: "Perubahan belum disimpan. Tinggalkan halaman ini?",
      created: "Draft baru dibuat.",
      slugWarning:
        "Mengubah slug yang pernah diterbitkan akan membuat redirect dari alamat lama.",
    },
    users: {
      search: "Cari pengguna",
      activeSessions: "sesi aktif",
      revoke: "Cabut semua sesi",
      revokeConfirm: "Cabut seluruh sesi aktif pengguna ini?",
      editAccount: "Kelola akun",
      roleAdmin: "Dapat mengelola konten dan menghapus record yang telah diarsipkan.",
      roleEditor: "Dapat membuat, menyunting, dan menerbitkan konten.",
    },
  },
  en: {
    search: {
      button: "Find content",
      dialogTitle: "Search the editorial workspace",
      placeholder: "Search titles, authors, courses, or metadata…",
      hint: "Enter at least 2 characters. Use arrow keys to choose.",
      empty: "No matching content found.",
      loading: "Searching…",
      error: "Search is currently unavailable.",
      close: "Close search",
    },
    common: {
      edit: "Edit",
      preview: "Preview",
      save: "Save draft",
      saving: "Saving…",
      publish: "Publish",
      publishChanges: "Publish changes",
      duplicate: "Duplicate",
      archive: "Archive",
      restore: "Restore",
      unpublish: "Unpublish",
      deletePermanent: "Delete permanently",
      moreActions: "More actions",
      resetFilters: "Reset filters",
      applyFilters: "Apply",
      selectPage: "Select everything on this page",
      selected: "selected",
      records: "records",
      back: "Back",
      optional: "Optional",
      lastEditedBy: "Last edited by",
      unknownEditor: "Unknown editor",
    },
    editor: {
      unsaved: "There are unsaved changes.",
      saved: "Draft saved",
      saveBeforePreview: "Save the draft before previewing or publishing.",
      readiness: "Publishing readiness",
      ready: "Ready to publish",
      notReady: "More information is required",
      errorTitle: "Review the following fields",
      conflictTitle: "This draft changed elsewhere",
      conflictBody:
        "Your changes remain on this device and have not overwritten the latest version.",
      reloadLatest: "Load latest version",
      recoverTitle: "Local recovery found",
      recoverBody:
        "This recovery is newer than the server draft. Restore it before continuing.",
      recover: "Restore recovery",
      discard: "Discard recovery",
      leaveWarning: "You have unsaved changes. Leave this page?",
      created: "New draft created.",
      slugWarning:
        "Changing a previously published slug will create a redirect from the old address.",
    },
    users: {
      search: "Search users",
      activeSessions: "active sessions",
      revoke: "Revoke all sessions",
      revokeConfirm: "Revoke all active sessions for this user?",
      editAccount: "Manage account",
      roleAdmin: "Can manage content and delete records after they are archived.",
      roleEditor: "Can create, edit, and publish content.",
    },
  },
} as const;

export function getAdminQolCopy(locale: Locale) {
  return adminQolCopy[locale];
}

export function adminText(locale: Locale, id: string, en: string) {
  return locale === "id" ? id : en;
}
