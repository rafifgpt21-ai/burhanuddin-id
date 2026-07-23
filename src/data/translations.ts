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
    login: "Masuk ke ruang editor",
    language: "Bahasa situs",
    switchTo: "Tampilkan situs dalam English",
  },
  footer: {
    intro:
      "Arsip akademik Burhanuddin Muhtadi mengenai politik Indonesia, pengajaran, dan karya ilmiah.",
    explore: "Koleksi",
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
      eyebrow: "Arsip pengajaran",
      title: "Materi & Bahan Ajar",
      description:
        "Daftar pustaka, silabus, slide, dan materi perkuliahan yang diampu.",
      action: "Indeks materi",
      kicker: "Status arsip",
      noteTitle: "Arsip dalam Proses Peninjauan",
      note:
        "Publikasi materi menunggu kelengkapan metadata, persetujuan hak distribusi, dan penetapan akses dokumen.",
      anatomy: [
        ["Kategori", "Mata kuliah, topik, jenis, dan semester"],
        ["Akses dokumen", "Baca daring, unduh, tautan luar, atau belum tersedia"],
        ["Format dokumen", "PDF, slide, bacaan, silabus, data, dan video"],
      ],
    },
    publications: {
      eyebrow: "Rekam akademik pilihan",
      title: "Publikasi & Karya Ilmiah",
      description:
        "Bibliografi pilihan dengan judul, urutan penulis, tahun, dan sumber sebagaimana tercatat dalam dokumen rujukan.",
      action: "Arsip publikasi",
    },
    focus: {
      eyebrow: "Bidang kajian",
      title: "Data Politik & Perilaku Pemilih",
      description:
        "Bidang kajian yang tercermin dalam publikasi dan pekerjaan akademik pada CV Maret 2026.",
    },
    updates: {
      eyebrow: "Tulisan & agenda",
      title: "Tulisan & Agenda Publik",
      description:
        "Esai dan catatan mengenai politik Indonesia, disertai agenda diskusi, kuliah umum, dan forum publik.",
      postLabel: "Tulisan terbaru",
      postTitle: "Arsip tulisan dalam proses kurasi.",
      postNote: "Naskah pertama masih dalam peninjauan editorial.",
      agendaLabel: "Agenda terdekat",
      agendaTitle: "Arsip agenda belum memuat kegiatan.",
      agendaNote: "Tanggal dan lokasi dicantumkan setelah informasi kegiatan terverifikasi.",
    },
  },
  materials: {
    metadataTitle: "Materi kuliah",
    metadataDescription:
      "Kumpulan materi kuliah berdasarkan mata kuliah, topik, jenis, dan semester.",
    eyebrow: "Arsip pengajaran",
    title: "Materi & Bahan Ajar",
    description:
      "Daftar pustaka, silabus, slide, tugas, data, video, dan bahan bacaan pendukung perkuliahan.",
    index: "Koleksi 01",
    indexLabel: "Bahan ajar & pengajaran",
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
    emptyTitle: "Arsip dalam Proses Peninjauan",
    emptyDescription:
      "Materi perkuliahan diterbitkan setelah data mata kuliah, semester, deskripsi, dokumen, dan hak distribusinya disetujui.",
  },
  posts: {
    metadataTitle: "Tulisan",
    metadataDescription: "Esai dan catatan Burhanuddin Muhtadi tentang politik Indonesia.",
    eyebrow: "Catatan & analisis",
    title: "Tulisan",
    description:
      "Kumpulan esai, catatan pendek, dan analisis mengenai politik Indonesia.",
    index: "Koleksi 02",
    indexLabel: "Catatan & analisis",
    searchLabel: "Cari tulisan",
    searchPlaceholder: "Judul, topik, atau kata kunci",
    topicLabel: "Topik",
    allTopics: "Semua topik",
    apply: "Cari",
    emptyTitle: "Arsip Tulisan dalam Proses Kurasi",
    emptyDescription:
      "Penerbitan tulisan pertama menunggu peninjauan naskah, sumber, dan tanggal publikasi.",
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
    emptyTitle: "Arsip Agenda Belum Memuat Kegiatan",
    emptyDescription:
      "Informasi diskusi, kuliah umum, dan forum publik dicantumkan setelah tanggal, waktu, dan lokasi terverifikasi.",
  },
  publications: {
    metadataTitle: "Publikasi",
    metadataDescription: "Indeks publikasi Burhanuddin Muhtadi dari CV Maret 2026.",
    eyebrow: "Rekam akademik",
    title: "Publikasi & Karya Ilmiah",
    description:
      "Buku, artikel jurnal, bab buku, dan keluaran riset dengan judul asli, urutan penulis, tahun, serta tautan sumber.",
    index: "Koleksi 04",
    indexLabel: "Bibliografi CV Maret 2026",
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
    noResultsTitle: "Publikasi tidak ditemukan.",
    noResultsDescription: "Periksa kata kunci, jenis publikasi, atau tahun yang dipilih.",
  },
  about: {
    metadataTitle: "Tentang",
    metadataDescription: "Profil akademik singkat Burhanuddin Muhtadi.",
    eyebrow: "Profil akademik",
    title: "Profil Akademik",
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
    login: "Sign in to the editorial area",
    language: "Site language",
    switchTo: "Tampilkan situs dalam Bahasa Indonesia",
  },
  footer: {
    intro:
      "Burhanuddin Muhtadi’s academic archive on Indonesian politics, teaching, and scholarly work.",
    explore: "Collections",
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
      eyebrow: "Teaching archive",
      title: "Teaching Materials & Resources",
      description:
        "Bibliographies, syllabi, slides, and materials from courses taught.",
      action: "Materials index",
      kicker: "Archive status",
      noteTitle: "Archive Under Review",
      note:
        "Publication awaits complete metadata, distribution approval, and a documented access designation.",
      anatomy: [
        ["Categories", "Course, topic, type, and semester"],
        ["Document access", "Read online, download, external link, or unavailable"],
        ["Document formats", "PDF, slides, readings, syllabi, data, and video"],
      ],
    },
    publications: {
      eyebrow: "Selected academic record",
      title: "Publications & Scholarly Work",
      description:
        "A selected bibliography retaining the titles, author order, years, and sources of the approved records.",
      action: "Publication archive",
    },
    focus: {
      eyebrow: "Research areas",
      title: "Political Data & Voting Behavior",
      description:
        "Research areas reflected in the publications and academic work documented in the March 2026 CV.",
    },
    updates: {
      eyebrow: "Writing & agenda",
      title: "Writing & Public Agenda",
      description:
        "Essays and notes on Indonesian politics, alongside discussions, public lectures, and public forums.",
      postLabel: "Latest writing",
      postTitle: "The writing archive is under curation.",
      postNote: "The first manuscript remains under editorial review.",
      agendaLabel: "Next event",
      agendaTitle: "The agenda archive contains no events yet.",
      agendaNote: "Dates and locations are listed after the event information is verified.",
    },
  },
  materials: {
    metadataTitle: "Course materials",
    metadataDescription: "Course materials arranged by course, topic, type, and semester.",
    eyebrow: "Teaching archive",
    title: "Teaching Materials & Resources",
    description:
      "Bibliographies, syllabi, slides, assignments, data, videos, and supporting course readings.",
    index: "Collection 01",
    indexLabel: "Teaching & course resources",
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
    emptyTitle: "Archive Under Review",
    emptyDescription:
      "Course materials are published after their course, semester, description, document, and distribution rights are approved.",
  },
  posts: {
    metadataTitle: "Writing",
    metadataDescription: "Essays and notes by Burhanuddin Muhtadi on Indonesian politics.",
    eyebrow: "Notes & analysis",
    title: "Writing",
    description:
      "A collection of essays, short notes, and analysis on Indonesian politics.",
    index: "Collection 02",
    indexLabel: "Notes & analysis",
    searchLabel: "Search writing",
    searchPlaceholder: "Title, topic, or keyword",
    topicLabel: "Topic",
    allTopics: "All topics",
    apply: "Search",
    emptyTitle: "Writing Archive Under Curation",
    emptyDescription:
      "Publication of the first piece awaits review of its manuscript, sources, and publication date.",
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
    emptyTitle: "The Agenda Archive Contains No Events",
    emptyDescription:
      "Discussions, public lectures, and forums are listed after their dates, times, and locations are verified.",
  },
  publications: {
    metadataTitle: "Publications",
    metadataDescription: "Burhanuddin Muhtadi's publication index from the March 2026 CV.",
    eyebrow: "Academic record",
    title: "Publications & Scholarly Work",
    description:
      "Books, journal articles, book chapters, and research outputs with original titles, author order, year, and source links.",
    index: "Collection 04",
    indexLabel: "March 2026 CV bibliography",
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
    noResultsTitle: "No publications found.",
    noResultsDescription: "Review the search term, publication type, or selected year.",
  },
  about: {
    metadataTitle: "About",
    metadataDescription: "A concise academic profile of Burhanuddin Muhtadi.",
    eyebrow: "Academic profile",
    title: "Academic Profile",
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
