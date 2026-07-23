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

Email dan hash password admin disimpan di `AdminUser`; sesi acak yang dapat dicabut
disimpan di `AdminSession`. Browser hanya menerima cookie token HTTP-only, same-site,
berumur delapan jam. Semua halaman admin memeriksa sesi pada server. UploadThing
menolak unggahan tanpa sesi admin atau selama `DATABASE_READY` belum aktif.

## Dataset review dan seeding

- `npm run seed:review` membangun ulang dataset staging dari bagian publikasi CV
  Maret 2026 dan indeks audit di `source-research.md`.
- Dataset berada di `prisma/review-data/import-candidates.json`; semua record
  berstatus review dan tidak menjadi konten publik secara otomatis.
- Sesuai keputusan pemilik, materi kuliah dan agenda awal tetap kosong.
- `npm run db:seed` meng-upsert admin, kandidat review, dan sitasi publikasi CV.
  Berikan `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD` hanya pada proses seed;
  jangan menyimpannya di file `.env` atau source control.

## Bahasa dan routing

- Halaman publik tersedia dalam Bahasa Indonesia (`/id/...`) dan English
  (`/en/...`) dengan slug navigasi yang dilokalkan.
- Permintaan tanpa prefiks memilih bahasa dari cookie manual, lalu header negara
  hosting, bahasa browser, dan akhirnya fallback Bahasa Indonesia. Implementasi
  tidak meminta atau menyimpan lokasi presisi.
- Switcher `ID / EN` menyimpan pilihan selama satu tahun dan mempertahankan query
  filter saat berpindah ke route bahasa yang setara.
- Salinan UI berada di `src/data/translations.ts`. Konten editor disimpan sebagai
  pasangan `Id`/`En` dalam skema Prisma dan harus ditinjau pemilik sebelum terbit.
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
