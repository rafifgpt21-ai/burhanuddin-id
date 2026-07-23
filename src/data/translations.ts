import type { Locale, RouteKey } from "@/lib/i18n";

const id = {
  common: {
    skip: "Langsung ke konten",
    openSource: "Buka sumber untuk",
    collection: "Koleksi",
  },
  metadata: {
    description:
      "Situs akademik Burhanuddin Muhtadi untuk materi kuliah, tulisan, agenda, publikasi, dan profil.",
    openGraphDescription: "Materi kuliah, tulisan, agenda, publikasi, dan profil akademik.",
  },
  navigation: [
    { route: "home" as RouteKey, label: "Beranda" },
    { route: "materials" as RouteKey, label: "Materi kuliah" },
    { route: "posts" as RouteKey, label: "Tulisan" },
    { route: "agenda" as RouteKey, label: "Agenda" },
    { route: "publications" as RouteKey, label: "Publikasi" },
    { route: "about" as RouteKey, label: "Tentang" },
  ],
  header: {
    homeLabel: "Burhanuddin Muhtadi, beranda",
    navigationLabel: "Navigasi utama",
    mobileNavigationLabel: "Navigasi seluler",
    openMenu: "Buka menu navigasi",
    menu: "Menu",
    search: "Cari materi",
    language: "Bahasa situs",
    switchTo: "Tampilkan situs dalam English",
  },
  footer: {
    intro:
      "Arsip kerja akademik untuk mahasiswa, peneliti, dan pembaca yang mengikuti politik Indonesia.",
    explore: "Jelajahi",
    navigationLabel: "Navigasi footer",
    profiles: "Profil akademik",
    editor: "Akses editor",
  },
  home: {
    metadataTitle: "Beranda",
    indexLabel: "Indeks koleksi",
    index: "Indeks",
    indexRange: "01—04",
    indexTopic: "Politik Indonesia",
    eyebrow: "Ilmuwan politik · pendidik · penulis",
    lead:
      "Profesor Ilmu Politik yang meneliti pemilu, demokrasi, perilaku memilih, dan opini publik di Indonesia.",
    materialsAction: "Lihat materi kuliah",
    postsAction: "Baca tulisan",
    rolesLabel: "Peran saat ini",
    portraitLabel: "Profil",
    portraitTopic: "Ilmu politik & demokrasi",
    collectionsLabel: "Koleksi utama",
    collections: [
      {
        route: "materials" as RouteKey,
        code: "R–01",
        label: "Materi kuliah",
        description: "Slide, bacaan, silabus, dan tautan kelas.",
        icon: "file" as const,
      },
      {
        route: "posts" as RouteKey,
        code: "R–02",
        label: "Tulisan",
        description: "Catatan dan esai tentang politik Indonesia.",
        icon: "book" as const,
      },
      {
        route: "agenda" as RouteKey,
        code: "R–03",
        label: "Agenda",
        description: "Jadwal diskusi, kuliah umum, dan forum publik.",
        icon: "calendar" as const,
      },
    ],
    materials: {
      eyebrow: "Repositori mahasiswa",
      title: "Materi kuliah, tanpa banyak langkah.",
      description:
        "Setiap materi akan dilengkapi mata kuliah, topik, jenis berkas, semester, dan status akses yang jelas.",
      action: "Buka repositori",
      kicker: "Koleksi awal",
      noteTitle: "Materi sedang ditinjau sebelum diterbitkan.",
      note:
        "Berkas hanya akan tampil setelah metadata, hak distribusi, dan tujuan unduhnya dikonfirmasi.",
      anatomy: [
        ["Temukan lewat", "Mata kuliah, topik, jenis, semester"],
        ["Status berkas", "Buka, unduh, tautan luar, atau tidak tersedia"],
        ["Format awal", "PDF, slide, bacaan, silabus, data, video"],
      ],
    },
    publications: {
      eyebrow: "Pilihan dari rekam akademik",
      title: "Publikasi yang dapat ditelusuri.",
      description:
        "Judul, urutan penulis, tahun, dan sumber dipertahankan sesuai dokumen rujukan.",
      action: "Lihat indeks publikasi",
    },
    focus: {
      eyebrow: "Bidang kajian",
      title: "Membaca politik melalui data dan perilaku pemilih.",
      description:
        "Fokus ini dirangkum dari rekam publikasi dan pekerjaan akademik dalam CV Maret 2026.",
    },
    updates: {
      eyebrow: "Tulisan & agenda",
      title: "Ruang untuk gagasan baru dan pertemuan berikutnya.",
      description:
        "Tulisan panjang dan agenda publik dikelola sebagai koleksi terpisah agar mudah dibaca, dicari, dan diperbarui.",
      postLabel: "Tulisan terbaru",
      postTitle: "Belum ada tulisan yang diterbitkan.",
      postNote: "Koleksi akan muncul setelah naskah pertama selesai ditinjau.",
      agendaLabel: "Agenda terdekat",
      agendaTitle: "Belum ada agenda publik.",
      agendaNote: "Tanggal dan lokasi hanya ditampilkan dari data acara yang terverifikasi.",
    },
  },
  materials: {
    metadataTitle: "Materi kuliah",
    metadataDescription:
      "Temukan materi kuliah berdasarkan mata kuliah, topik, jenis, dan semester.",
    eyebrow: "Repositori mahasiswa",
    title: "Materi kuliah",
    description:
      "Cari slide, bacaan, silabus, tugas, data, video, dan tautan kelas dengan metadata yang jelas.",
    index: "Koleksi 01",
    indexLabel: "Cari · pahami · buka",
    searchLabel: "Cari materi",
    searchPlaceholder: "Judul, topik, atau deskripsi",
    courseLabel: "Mata kuliah",
    allCourses: "Semua mata kuliah",
    typeLabel: "Jenis",
    allTypes: "Semua jenis",
    types: ["Slide", "Bacaan", "Silabus", "Tugas", "Dataset", "Video"],
    periodLabel: "Periode",
    allPeriods: "Semua periode",
    apply: "Terapkan",
    emptyTitle: "Koleksi materi belum diterbitkan.",
    emptyDescription:
      "Struktur repositori sudah siap. Materi pertama akan tampil setelah nama mata kuliah, semester, deskripsi, berkas, dan hak distribusinya disetujui.",
  },
  posts: {
    metadataTitle: "Tulisan",
    metadataDescription: "Esai dan catatan Burhanuddin Muhtadi tentang politik Indonesia.",
    eyebrow: "Catatan & analisis",
    title: "Tulisan",
    description:
      "Ruang baca untuk esai, catatan pendek, dan analisis yang disusun agar nyaman diikuti dari telepon maupun layar besar.",
    index: "Koleksi 02",
    indexLabel: "Gagasan dalam konteks",
    searchLabel: "Cari tulisan",
    searchPlaceholder: "Judul, topik, atau kata kunci",
    topicLabel: "Topik",
    allTopics: "Semua topik",
    apply: "Cari",
    emptyTitle: "Belum ada tulisan yang diterbitkan.",
    emptyDescription:
      "Tulisan pertama akan muncul di sini setelah naskah, sumber, dan tanggal publikasinya selesai ditinjau.",
  },
  agenda: {
    metadataTitle: "Agenda",
    metadataDescription: "Agenda publik Burhanuddin Muhtadi dalam zona waktu WIB.",
    eyebrow: "Pertemuan publik",
    title: "Agenda",
    description:
      "Jadwal diskusi, kuliah umum, dan forum publik. Waktu ditampilkan dalam WIB dan agenda selesai akan dipindahkan ke arsip.",
    index: "Koleksi 03",
    indexLabel: "Mendatang · selesai",
    noteTitle: "Zona waktu WIB.",
    note:
      "Agenda hanya ditampilkan setelah tanggal, waktu mulai, dan keterangannya terverifikasi.",
    emptyTitle: "Belum ada agenda publik.",
    emptyDescription:
      "Acara mendatang akan muncul di sini. Tidak ada tanggal atau lokasi rekaan yang ditampilkan selama data agenda belum tersedia.",
  },
  publications: {
    metadataTitle: "Publikasi",
    metadataDescription: "Indeks publikasi Burhanuddin Muhtadi dari CV Maret 2026.",
    eyebrow: "Rekam akademik",
    title: "Publikasi",
    description:
      "Buku, artikel jurnal, bab buku, dan keluaran riset dengan judul asli, urutan penulis, tahun, serta tautan sumber.",
    index: "Koleksi 04",
    indexLabel: "Daftar dari CV",
    noteTitle: "Sitasi sumber ditampilkan apa adanya.",
    note:
      "Daftar ini memuat sitasi dari CV Maret 2026 dan pidato pengukuhan dari sumber resmi. Pemecahan metadata terstruktur tetap ditinjau agar urutan penulis dan redaksi sumber tidak berubah.",
    searchLabel: "Cari publikasi",
    searchPlaceholder: "Judul, penulis, venue, atau tahun",
    typeLabel: "Jenis",
    allTypes: "Semua jenis",
    typeNames: {
      book: "Buku",
      journal: "Artikel jurnal",
      chapter: "Bab buku",
      research: "Keluaran riset",
      "inaugural-address": "Pidato pengukuhan",
    },
    yearLabel: "Tahun",
    allYears: "Semua tahun",
    apply: "Terapkan",
    noResultsTitle: "Tidak ada publikasi yang cocok.",
    noResultsDescription: "Ubah kata kunci atau pilih kembali semua jenis dan tahun.",
  },
  about: {
    metadataTitle: "Tentang",
    metadataDescription: "Profil akademik singkat Burhanuddin Muhtadi.",
    eyebrow: "Profil akademik",
    title: "Tentang",
    description:
      "Latar akademik, peran saat ini, dan bidang kajian Burhanuddin Muhtadi berdasarkan CV Maret 2026.",
    index: "Profil",
    indexLabel: "Ditinjau Maret 2026",
    photoCaption:
      "Foto disediakan pemilik situs. Keterangan kredit akhir perlu dikonfirmasi sebelum peluncuran publik.",
    paragraphs: [
      "Burhanuddin Muhtadi adalah Profesor Ilmu Politik di FISIP UIN Syarif Hidayatullah Jakarta yang meneliti pemilu, perilaku politik, demokrasi, dan opini publik di Indonesia.",
      "Pekerjaan akademik dan publiknya menjembatani penelitian ilmiah, pendidikan, dan pembacaan data politik untuk khalayak yang lebih luas. Situs ini disusun sebagai arsip kerja yang mengutamakan materi untuk mahasiswa, tulisan, serta rekam publikasi.",
    ],
    rolesTitle: "Peran saat ini",
    roleDates: ["2010—kini", "2013—kini", "2021—kini"],
    educationTitle: "Pendidikan",
    education:
      "Ph.D. dalam Ilmu Politik dan M.A. dalam Asian Studies dari Australian National University, serta pendidikan sarjana di UIN Syarif Hidayatullah Jakarta.",
    researchTitle: "Bidang kajian",
  },
  admin: {
    metadataTitle: "Akses editor",
    eyebrow: "Area privat",
    title: "Akses editor",
    intro:
      "Area ini akan digunakan untuk menerbitkan materi, tulisan, agenda, dan pembaruan metadata publikasi.",
    lockTitle: "Masih terkunci pada fase fondasi.",
    lockText:
      "Autentikasi dan unggahan sengaja belum diaktifkan sampai kredensial basis data dirotasi dan otorisasi server selesai diterapkan.",
    flowLabel: "Alur unggah materi yang direncanakan",
    steps: ["1 · Pilih berkas", "2 · Isi metadata", "3 · Tinjau & terbitkan"],
    back: "Kembali ke beranda",
  },
} as const;

const en = {
  common: {
    skip: "Skip to content",
    openSource: "Open source for",
    collection: "Collection",
  },
  metadata: {
    description:
      "Burhanuddin Muhtadi’s academic website for course materials, writing, events, publications, and profile information.",
    openGraphDescription: "Course materials, writing, events, publications, and academic profile.",
  },
  navigation: [
    { route: "home", label: "Home" },
    { route: "materials", label: "Course materials" },
    { route: "posts", label: "Writing" },
    { route: "agenda", label: "Agenda" },
    { route: "publications", label: "Publications" },
    { route: "about", label: "About" },
  ],
  header: {
    homeLabel: "Burhanuddin Muhtadi, home",
    navigationLabel: "Main navigation",
    mobileNavigationLabel: "Mobile navigation",
    openMenu: "Open navigation menu",
    menu: "Menu",
    search: "Search course materials",
    language: "Site language",
    switchTo: "Tampilkan situs dalam Bahasa Indonesia",
  },
  footer: {
    intro:
      "A working academic archive for students, researchers, and readers following Indonesian politics.",
    explore: "Explore",
    navigationLabel: "Footer navigation",
    profiles: "Academic profiles",
    editor: "Editor access",
  },
  home: {
    metadataTitle: "Home",
    indexLabel: "Collection index",
    index: "Index",
    indexRange: "01—04",
    indexTopic: "Indonesian politics",
    eyebrow: "Political scientist · educator · author",
    lead:
      "Professor of Political Science studying elections, democracy, voting behavior, and public opinion in Indonesia.",
    materialsAction: "View course materials",
    postsAction: "Read the writing",
    rolesLabel: "Current roles",
    portraitLabel: "Profile",
    portraitTopic: "Political science & democracy",
    collectionsLabel: "Main collections",
    collections: [
      {
        route: "materials",
        code: "R–01",
        label: "Course materials",
        description: "Slides, readings, syllabi, and class links.",
        icon: "file",
      },
      {
        route: "posts",
        code: "R–02",
        label: "Writing",
        description: "Notes and essays on Indonesian politics.",
        icon: "book",
      },
      {
        route: "agenda",
        code: "R–03",
        label: "Agenda",
        description: "Discussions, public lectures, and public forums.",
        icon: "calendar",
      },
    ],
    materials: {
      eyebrow: "Student repository",
      title: "Course materials, without the runaround.",
      description:
        "Every resource will include its course, topic, file type, semester, and a clear access status.",
      action: "Open the repository",
      kicker: "Initial collection",
      noteTitle: "Materials are being reviewed before publication.",
      note:
        "Files will appear only after their metadata, distribution rights, and delivery method are confirmed.",
      anatomy: [
        ["Find by", "Course, topic, type, semester"],
        ["File status", "Open, download, external link, or unavailable"],
        ["Initial formats", "PDF, slides, readings, syllabi, data, video"],
      ],
    },
    publications: {
      eyebrow: "Selected academic record",
      title: "Publications you can trace.",
      description:
        "Titles, author order, years, and sources are retained from the approved records.",
      action: "View publication index",
    },
    focus: {
      eyebrow: "Research areas",
      title: "Reading politics through data and voter behavior.",
      description:
        "These areas are drawn from the publication record and academic work documented in the March 2026 CV.",
    },
    updates: {
      eyebrow: "Writing & agenda",
      title: "A place for new ideas and the next meeting.",
      description:
        "Long-form writing and public events are kept as separate collections so each remains easy to read, find, and update.",
      postLabel: "Latest writing",
      postTitle: "No writing has been published yet.",
      postNote: "The collection will appear after the first manuscript is reviewed.",
      agendaLabel: "Next event",
      agendaTitle: "There are no public events yet.",
      agendaNote: "Dates and locations appear only from verified event information.",
    },
  },
  materials: {
    metadataTitle: "Course materials",
    metadataDescription: "Find course materials by course, topic, type, and semester.",
    eyebrow: "Student repository",
    title: "Course materials",
    description:
      "Find slides, readings, syllabi, assignments, data, videos, and class links with clear metadata.",
    index: "Collection 01",
    indexLabel: "Find · understand · open",
    searchLabel: "Search materials",
    searchPlaceholder: "Title, topic, or description",
    courseLabel: "Course",
    allCourses: "All courses",
    typeLabel: "Type",
    allTypes: "All types",
    types: ["Slides", "Reading", "Syllabus", "Assignment", "Dataset", "Video"],
    periodLabel: "Period",
    allPeriods: "All periods",
    apply: "Apply filters",
    emptyTitle: "No course materials have been published yet.",
    emptyDescription:
      "The repository structure is ready. The first resource will appear after its course, semester, description, file, and distribution rights are approved.",
  },
  posts: {
    metadataTitle: "Writing",
    metadataDescription: "Essays and notes by Burhanuddin Muhtadi on Indonesian politics.",
    eyebrow: "Notes & analysis",
    title: "Writing",
    description:
      "A reading room for essays, short notes, and analysis designed to be comfortable on phones and larger screens.",
    index: "Collection 02",
    indexLabel: "Ideas in context",
    searchLabel: "Search writing",
    searchPlaceholder: "Title, topic, or keyword",
    topicLabel: "Topic",
    allTopics: "All topics",
    apply: "Search",
    emptyTitle: "No writing has been published yet.",
    emptyDescription:
      "The first piece will appear here after its manuscript, sources, and publication date have been reviewed.",
  },
  agenda: {
    metadataTitle: "Agenda",
    metadataDescription: "Burhanuddin Muhtadi’s public agenda in Western Indonesia Time.",
    eyebrow: "Public events",
    title: "Agenda",
    description:
      "Discussions, public lectures, and public forums. Times are shown in Western Indonesia Time (WIB), and completed events move to the archive.",
    index: "Collection 03",
    indexLabel: "Upcoming · completed",
    noteTitle: "Western Indonesia Time (WIB).",
    note:
      "Events appear only after their date, start time, and supporting information have been verified.",
    emptyTitle: "There are no public events yet.",
    emptyDescription:
      "Upcoming events will appear here. No invented dates or locations are shown while event information is unavailable.",
  },
  publications: {
    metadataTitle: "Publications",
    metadataDescription: "Burhanuddin Muhtadi's publication index from the March 2026 CV.",
    eyebrow: "Academic record",
    title: "Publications",
    description:
      "Books, journal articles, book chapters, and research outputs with original titles, author order, year, and source links.",
    index: "Collection 04",
    indexLabel: "CV-derived list",
    noteTitle: "Source citations are shown verbatim.",
    note:
      "This list includes citations from the March 2026 CV and the inaugural address from an official source. Structured metadata remains under review to preserve author order and source wording.",
    searchLabel: "Search publications",
    searchPlaceholder: "Title, author, venue, or year",
    typeLabel: "Type",
    allTypes: "All types",
    typeNames: {
      book: "Book",
      journal: "Journal article",
      chapter: "Book chapter",
      research: "Research output",
      "inaugural-address": "Inaugural address",
    },
    yearLabel: "Year",
    allYears: "All years",
    apply: "Apply filters",
    noResultsTitle: "No publications match these filters.",
    noResultsDescription: "Change the search term or reset the type and year filters.",
  },
  about: {
    metadataTitle: "About",
    metadataDescription: "A concise academic profile of Burhanuddin Muhtadi.",
    eyebrow: "Academic profile",
    title: "About",
    description:
      "Burhanuddin Muhtadi’s academic background, current roles, and research areas, based on the March 2026 CV.",
    index: "Profile",
    indexLabel: "Reviewed March 2026",
    photoCaption:
      "Photo supplied by the site owner. Final credit wording must be confirmed before public launch.",
    paragraphs: [
      "Burhanuddin Muhtadi is Professor of Political Science at FISIP UIN Syarif Hidayatullah Jakarta. His research covers elections, political behavior, democracy, and public opinion in Indonesia.",
      "His academic and public work connects scholarly research, education, and the interpretation of political data for a wider audience. This site is a working archive centered on student materials, writing, and his publication record.",
    ],
    rolesTitle: "Current roles",
    roleDates: ["2010—present", "2013—present", "2021—present"],
    educationTitle: "Education",
    education:
      "Ph.D. in Political Science and M.A. in Asian Studies from the Australian National University, with undergraduate study at UIN Syarif Hidayatullah Jakarta.",
    researchTitle: "Research areas",
  },
  admin: {
    metadataTitle: "Editor access",
    eyebrow: "Private area",
    title: "Editor access",
    intro:
      "This area will be used to publish course materials, writing, events, and publication metadata updates.",
    lockTitle: "Still locked during the foundation phase.",
    lockText:
      "Authentication and uploads remain disabled until the database credential is rotated and server authorization is complete.",
    flowLabel: "Planned material upload flow",
    steps: ["1 · Choose a file", "2 · Add metadata", "3 · Review & publish"],
    back: "Return home",
  },
} as const;

const dictionaries = { id, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
