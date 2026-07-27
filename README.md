# Burhanuddin Muhtadi

Fondasi teknis situs akademik Burhanuddin Muhtadi. Ruang lingkup produk,
sumber konten, dan kriteria penerimaan berada di `design.md`.

## Stack

- Next.js App Router, React, TypeScript, dan Tailwind CSS.
- MongoDB melalui Prisma ORM 6.19. Prisma 7 belum mendukung MongoDB.
- UploadThing untuk aset yang sudah mendapat keputusan hak penggunaan.

## Persiapan lokal

Persyaratan: Node.js 20.9 atau lebih baru dan deployment MongoDB dengan replica
set. Jangan gunakan kredensial lama dari `.material/environment.txt`; kredensial
tersebut harus dirotasi sebelum aplikasi tersambung ke basis data.

1. Salin `.env.example` menjadi `.env.local`.
2. Isi `DATABASE_URL` hanya dengan kredensial MongoDB yang sudah dirotasi.
3. Isi `UPLOADTHING_TOKEN` dari secret store/dashboard UploadThing.
4. Setelah rotasi dan pemeriksaan target selesai, set `DATABASE_READY=true`.
5. Jalankan `npm install`, lalu `npm run dev`.

Username dan hash password pengguna editorial disimpan di `AdminUser`; sesi acak yang dapat dicabut
disimpan di `AdminSession`. Browser hanya menerima cookie token HTTP-only, same-site,
berumur delapan jam. Semua halaman admin memeriksa sesi pada server. UploadThing
menolak unggahan tanpa sesi admin atau selama `DATABASE_READY` belum aktif.

Role yang tersedia adalah `SUPER_ADMIN`, `ADMIN`, dan `EDITOR`. Semua role dapat
masuk ke ruang editorial dan mengubah username/password miliknya sendiri. Hanya
`SUPER_ADMIN` yang dapat membuka menu **Pengguna**, membuat akun `ADMIN`/`EDITOR`,
mengubah username/role akun lain, atau mereset password akun lain.

## Workflow editorial

- **Beranda**, Publikasi, Agenda, Tulisan, dan Materi memiliki daftar privat,
  filter status, rute create/edit, preview 15 menit, draft, publish/unpublish,
  archive/restore, duplicate, dan revision restore.
- Field terstruktur adalah working draft. Situs publik membaca
  `publishedSnapshot`, sehingga penyimpanan draft pada record terbit tidak
  mengubah halaman publik sampai **Terbitkan perubahan** dijalankan.
- Penerbitan memerlukan konten Indonesia yang lengkap. Seluruh field English
  bersifat opsional dan rute English memakai fallback Indonesia per field.
  Tulisan hanya menerima blok allowlist; Materi wajib memiliki tepat satu target
  dan keputusan hak penggunaan; Publikasi wajib memiliki sumber keluar HTTPS.
- `ADMIN` dan `SUPER_ADMIN` dapat menghapus permanen record manual yang sudah
  diarsipkan. `EDITOR` hanya dapat mengarsipkan/memulihkan, sedangkan publikasi
  kanonis dengan fingerprint sumber tidak pernah dapat dihapus permanen.
- Beranda otomatis mengambil tiga buku terbaru dengan cover berizin dan satu
  agenda mendatang terdekat. Tiga karya non-buku dipilih serta diurutkan dari
  koleksi Publikasi.

Saat mengaktifkan persistence untuk pertama kali: putar kredensial, buat backup,
verifikasi target database, jalankan `npm run db:push`, lalu `npm run db:seed`.
Seed publikasi mengisi snapshot/revisi awal secara idempoten dan tidak menghapus
record manual. Jangan menjalankan langkah ini terhadap kredensial lama.

## Dataset sumber dan seeding

- `npm run seed:sources` membangun ulang dataset sumber dari bagian publikasi CV
  Maret 2026 dan indeks audit di `source-research.md`, lalu memvalidasi pemetaan
  bibliografis 81 record CV.
- Dataset berada di `prisma/seed-data/publication-sources.json`. Hanya record
  kanonis dari sumber yang disetujui yang digunakan oleh seed publikasi.
- Metadata publik yang telah dipisahkan berada di
  `prisma/seed-data/structured-publications.json`; `rawCitation` tetap berasal
  dari dataset sumber dan tidak digunakan sebagai judul publik.
- `npm run seed:publications:structure` membangun ulang hanya dataset terstruktur
  dan gagal bila fingerprint, judul, penulis, tipe, atau wadah bibliografis tidak
  memenuhi kontrak.
- Sesuai keputusan pemilik, materi kuliah dan agenda awal tetap kosong.
- `npm run db:seed` meng-upsert super admin (bila variabel seed diberikan),
  metadata publikasi terstruktur, aset, dan cover buku yang telah disetujui.
- `npm run db:sync:publication-covers` mengunggah atau menggunakan kembali cover
  buku yang telah disetujui, lalu menghubungkannya ke publikasi kanonis tanpa
  mengubah metadata sitasi atau akun pengguna.
- `npm run db:migrate:publications:check` mencetak laporan migrasi statis tanpa
  koneksi database. Tambahkan `-- --database` hanya setelah rotasi kredensial dan
  backup untuk membandingkan record secara read-only; perintah ini tidak menulis.
- `npm run db:seed:super-admin` hanya membuat atau memperbarui akun super admin.
  Berikan `SEED_SUPER_ADMIN_USERNAME`, `SEED_SUPER_ADMIN_PASSWORD`, dan opsional
  `SEED_SUPER_ADMIN_NAME` hanya pada proses seed;
  jangan menyimpannya di file `.env` atau source control.

## Bahasa dan routing

- Halaman publik tersedia dalam Bahasa Indonesia (`/id/...`) dan English
  (`/en/...`) dengan slug navigasi yang dilokalkan.
- Permintaan tanpa prefiks memilih bahasa dari cookie manual, lalu header negara
  hosting, bahasa browser, dan akhirnya fallback Bahasa Indonesia. Implementasi
  tidak meminta atau menyimpan lokasi presisi.
- Switcher `ID / EN` menyimpan pilihan selama satu tahun dan mempertahankan query
  filter saat berpindah ke route bahasa yang setara.
- Salinan UI berada di `src/data/translations.ts`. Konten Indonesia adalah
  sumber kanonis; seluruh field `En` editor bersifat opsional. Terjemahan yang
  diisi harus ditinjau pemilik, sedangkan field kosong tampil memakai fallback
  Indonesia pada rute English.
- Judul publikasi bibliografis tetap memakai bahasa terbit aslinya.

## Perintah

- `npm run dev` menjalankan server pengembangan.
- `npm run check` menjalankan lint dan pemeriksaan tipe.
- `npm test` menjalankan pengujian validasi dan integritas dataset review.
- `npm run build` membuat build produksi.
- `npm run prisma:format` memformat skema Prisma.
- `npm run prisma:generate` membuat Prisma Client.
- `npm run db:push` menyinkronkan skema ke MongoDB. Jalankan hanya setelah
  kredensial dirotasi dan target basis data diverifikasi.
