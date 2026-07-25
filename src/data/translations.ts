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
    { route: "about" as RouteKey, label: "Profil" },
    { route: "publications" as RouteKey, label: "Publikasi" },
    { route: "research" as RouteKey, label: "Riset" },
    { route: "outreach" as RouteKey, label: "Kiprah" },
    { route: "contact" as RouteKey, label: "Kontak" },
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
    materials: "Materi kuliah",
    writing: "Tulisan",
  },
  home: {
    metadataTitle: "Beranda",
    brandIntro: {
      label: "Situs resmi Burhanuddin Muhtadi",
      tagline: "Mengawal Kekuasaan. Menjaga Kewarasan.",
      quote:
        "Survei opini publik itu ibarat cermin. Tugasnya memantulkan realitas apa adanya. Kalau gambaran di cermin terlihat kurang menyenangkan, jangan cerminnya yang dipecahkan, melainkan perbaikilah tampilannya.",
      fields: "Ilmu politik · demokrasi · opini publik",
      continueAction: "Lanjut ke profil akademik",
    },
    indexLabel: "Indeks koleksi",
    index: "Indeks",
    indexRange: "01—04",
    indexTopic: "Politik Indonesia",
    eyebrow: "Ilmuwan politik · pendidik · penulis",
    thesis:
      "Membaca demokrasi Indonesia melalui data, pemilih, dan kekuasaan.",
    lead:
      "Burhanuddin Muhtadi adalah Profesor Ilmu Politik yang menghubungkan riset empiris tentang pemilu, politik uang, dan opini publik dengan perdebatan demokrasi Indonesia.",
    researchAction: "Jelajahi riset",
    publicationsAction: "Lihat publikasi",
    portraitCaption: "Ilmu politik · demokrasi · opini publik",
    materialsAction: "Lihat materi kuliah",
    postsAction: "Baca tulisan",
    rolesLabel: "Peran saat ini",
    portraitLabel: "Profil",
    portraitTopic: "Ilmu politik & demokrasi",
    collectionsLabel: "Koleksi utama",
    collections: [
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
    publications: {
      eyebrow: "Karya pilihan",
      title: "Publikasi",
      description:
        "Buku terbaru dan karya non-buku pilihan dari rekam publikasi.",
      action: "Lihat seluruh publikasi",
      booksLabel: "Buku terbaru",
    },
    focus: {
      eyebrow: "Bidang kajian",
      title: "Data Politik & Perilaku Pemilih",
      description:
        "Bidang kajian yang tercermin dalam publikasi dan pekerjaan akademik pada CV Maret 2026.",
    },
    outreach: {
      eyebrow: "Di luar halaman jurnal",
      title: "Kiprah",
      description:
        "Riset bergerak melalui forum akademik, diskusi publik, agenda, dan ruang pengajaran.",
      action: "Jelajahi kiprah",
      agendaLabel: "Agenda publik",
      forumLabel: "Forum akademik pilihan",
      materialsAction: "Akses materi kuliah",
    },
    closing: {
      eyebrow: "Profil akademik dan kanal resmi",
      title: "Profil dan Kontak",
      contactAction: "Buka kontak",
      profileAction: "Baca profil lengkap",
    },
  },
  researchPage: {
    metadataTitle: "Riset",
    metadataDescription:
      "Fokus riset Burhanuddin Muhtadi mengenai perilaku pemilih, politik uang, demokrasi, politik Islam, dan opini publik.",
    eyebrow: "Agenda intelektual",
    title: "Riset",
    description:
      "Empat jalur kajian yang menjelaskan bagaimana warga, elite, institusi, dan identitas membentuk politik Indonesia.",
    index: "Riset · 04 tema",
    indexLabel: "Berdasarkan CV Maret 2026",
    ledgerEyebrow: "Peta riset",
    ledgerTitle: "Riset",
    ledgerDescription:
      "Setiap tema dibaca bersama karya yang membantu menunjukkan perkembangan argumen dan bukti empirisnya.",
    ledgerAction: "Buka halaman riset",
    relatedWork: "Karya terkait",
    closingText:
      "Indeks publikasi mempertahankan judul, urutan penulis, tahun, venue, dan sumber dari rekam yang telah ditinjau.",
    publicationsAction: "Telusuri publikasi",
  },
  outreachPage: {
    metadataTitle: "Kiprah",
    metadataDescription:
      "Agenda publik, forum akademik, dan akses pengajaran Burhanuddin Muhtadi.",
    eyebrow: "Riset di ruang publik",
    title: "Kiprah",
    description:
      "Ruang temu antara penelitian, forum akademik, percakapan publik, dan pengajaran.",
    index: "Agenda · forum · pengajaran",
    indexLabel: "Informasi terverifikasi",
    agendaEyebrow: "Agenda publik",
    agendaTitle: "Pertemuan dan Forum",
    agendaDescription:
      "Waktu ditampilkan dalam WIB. Agenda hanya muncul setelah rincian kegiatannya diverifikasi.",
    forumEyebrow: "Jejak forum",
    forumTitle: "Forum Akademik Pilihan",
    forumDescription:
      "Pilihan undangan berbicara yang tercatat dalam sumber profil dan CV.",
    teachingEyebrow: "Untuk mahasiswa",
    teachingTitle: "Materi Kuliah",
    teachingDescription:
      "Silabus, bacaan, slide, dan sumber perkuliahan tersedia melalui arsip pengajaran ketika hak distribusinya telah disetujui.",
    teachingAction: "Buka arsip materi",
  },
  contactPage: {
    metadataTitle: "Kontak",
    metadataDescription:
      "Kanal institusional dan profil akademik terverifikasi Burhanuddin Muhtadi.",
    eyebrow: "Kanal resmi",
    title: "Kontak",
    description:
      "Gunakan profil institusional dan akademik berikut untuk memperoleh informasi resmi dan mutakhir.",
    index: "Tanpa formulir publik",
    indexLabel: "Tautan terverifikasi",
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
    noteTitle: "Metadata bibliografis telah dipisahkan.",
    note:
      "Judul, penulis, wadah terbitan, detail volume/nomor, dan tautan ditampilkan terpisah. Sitasi asli tetap disimpan sebagai jejak audit internal.",
    searchLabel: "Cari publikasi",
    searchPlaceholder: "Judul, penulis, jurnal, penerbit, DOI, atau tahun",
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
    metadataTitle: "Profil",
    metadataDescription:
      "Profil lengkap Prof. Burhanuddin Muhtadi: biografi, pendidikan, karier, penghargaan, dan bidang kajian.",
    eyebrow: "Ilmuwan politik Indonesia",
    title: "Burhanuddin Muhtadi",
    description:
      "Biografi, perjalanan akademik, karier, dan penghargaan—ditelusuri dari Wikipedia dan diperbarui dengan sumber resmi.",
    index: "Dossier 1977—kini",
    indexLabel: "Ditinjau 23 Juli 2026",
    photoAlt: "Potret resmi Prof. Burhanuddin Muhtadi",
    photoCaption:
      "Foto disediakan pemilik situs. Keterangan kredit akhir perlu dikonfirmasi sebelum peluncuran publik.",
    contentsLabel: "Jelajahi profil",
    contents: [
      { href: "#biografi", label: "Biografi" },
      { href: "#peran", label: "Peran saat ini" },
      { href: "#pendidikan", label: "Pendidikan" },
      { href: "#karier", label: "Jejak karier" },
      { href: "#penghargaan", label: "Penghargaan" },
    ],
    biographyTitle: "Biografi",
    rolesTitle: "Peran saat ini",
    educationTitle: "Pendidikan",
    careerTitle: "Jejak karier & organisasi",
    careerIntro:
      "Riwayat berikut mempertahankan pengalaman awal yang dicatat Wikipedia sekaligus menempatkan jabatan mutakhir dari CV Maret 2026 dan sumber institusi resmi.",
    awardsTitle: "Penghargaan & fellowship",
    researchTitle: "Bidang kajian",
    talksTitle: "Forum akademik pilihan",
    talksIntro:
      "Beberapa undangan berbicara mutakhir yang membantu menggambarkan jangkauan kerja akademiknya.",
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
    { route: "about", label: "About" },
    { route: "publications", label: "Publications" },
    { route: "research", label: "Research" },
    { route: "outreach", label: "Outreach" },
    { route: "contact", label: "Contact" },
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
    materials: "Course materials",
    writing: "Writing",
  },
  home: {
    metadataTitle: "Home",
    brandIntro: {
      label: "The official website of Burhanuddin Muhtadi",
      tagline: "Watching Power. Safeguarding Sanity",
      quote:
        "Survei opini publik itu ibarat cermin. Tugasnya memantulkan realitas apa adanya. Kalau gambaran di cermin terlihat kurang menyenangkan, jangan cerminnya yang dipecahkan, melainkan perbaikilah tampilannya.",
      fields: "Political science · democracy · public opinion",
      continueAction: "Continue to the academic profile",
    },
    indexLabel: "Collection index",
    index: "Index",
    indexRange: "01—04",
    indexTopic: "Indonesian politics",
    eyebrow: "Political scientist · educator · author",
    thesis:
      "Reading Indonesian democracy through data, voters, and power.",
    lead:
      "Burhanuddin Muhtadi is a Professor of Political Science connecting empirical research on elections, vote buying, and public opinion with debates on Indonesian democracy.",
    researchAction: "Explore the research",
    publicationsAction: "View publications",
    portraitCaption: "Political science · democracy · public opinion",
    materialsAction: "View course materials",
    postsAction: "Read the writing",
    rolesLabel: "Current roles",
    portraitLabel: "Profile",
    portraitTopic: "Political science & democracy",
    collectionsLabel: "Main collections",
    collections: [
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
    publications: {
      eyebrow: "Selected work",
      title: "Publications",
      description:
        "Recent books and selected non-book work from the publication record.",
      action: "View all publications",
      booksLabel: "Latest books",
    },
    focus: {
      eyebrow: "Research areas",
      title: "Political Data & Voting Behavior",
      description:
        "Research areas reflected in the publications and academic work documented in the March 2026 CV.",
    },
    outreach: {
      eyebrow: "Beyond the journal page",
      title: "Outreach",
      description:
        "Research moves through academic forums, public discussion, events, and teaching.",
      action: "Explore outreach",
      agendaLabel: "Public agenda",
      forumLabel: "Selected academic forums",
      materialsAction: "Access course materials",
    },
    closing: {
      eyebrow: "Academic profile and official channels",
      title: "Profile and Contact",
      contactAction: "Open contact",
      profileAction: "Read the full profile",
    },
  },
  researchPage: {
    metadataTitle: "Research",
    metadataDescription:
      "Burhanuddin Muhtadi’s research on voting behaviour, vote buying, democracy, political Islam, and public opinion.",
    eyebrow: "Intellectual agenda",
    title: "Research",
    description:
      "Four lines of inquiry into how citizens, elites, institutions, and identity shape Indonesian politics.",
    index: "Research · 04 themes",
    indexLabel: "Based on the March 2026 CV",
    ledgerEyebrow: "Research map",
    ledgerTitle: "Research",
    ledgerDescription:
      "Each theme is read alongside a work that shows the development of its argument and empirical evidence.",
    ledgerAction: "Open the research page",
    relatedWork: "Related work",
    closingText:
      "The publication index preserves titles, author order, years, venues, and sources from the reviewed record.",
    publicationsAction: "Browse publications",
  },
  outreachPage: {
    metadataTitle: "Outreach",
    metadataDescription:
      "Burhanuddin Muhtadi’s public agenda, academic forums, and teaching access.",
    eyebrow: "Research in public",
    title: "Outreach",
    description:
      "A meeting point for research, academic forums, public conversation, and teaching.",
    index: "Agenda · forums · teaching",
    indexLabel: "Verified information",
    agendaEyebrow: "Public agenda",
    agendaTitle: "Meetings and Forums",
    agendaDescription:
      "Times are shown in Western Indonesia Time (WIB). Events appear only after their details are verified.",
    forumEyebrow: "Forum record",
    forumTitle: "Selected Academic Forums",
    forumDescription:
      "A selection of invited talks recorded in the profile sources and CV.",
    teachingEyebrow: "For students",
    teachingTitle: "Course Materials",
    teachingDescription:
      "Syllabi, readings, slides, and course resources are available through the teaching archive once distribution rights are approved.",
    teachingAction: "Open the materials archive",
  },
  contactPage: {
    metadataTitle: "Contact",
    metadataDescription:
      "Burhanuddin Muhtadi’s verified institutional channels and academic profiles.",
    eyebrow: "Official channels",
    title: "Contact",
    description:
      "Use the institutional and academic profiles below for current, official information.",
    index: "No public form",
    indexLabel: "Verified links",
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
    noteTitle: "Bibliographic metadata is structured.",
    note:
      "Titles, contributors, publication containers, volume/issue details, and links are presented separately. Original citations remain available as an internal audit trail.",
    searchLabel: "Search publications",
    searchPlaceholder: "Title, author, journal, publisher, DOI, or year",
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
    metadataDescription:
      "A complete profile of Prof. Burhanuddin Muhtadi: biography, education, career, honours, and research areas.",
    eyebrow: "Indonesian political scientist",
    title: "Burhanuddin Muhtadi",
    description:
      "Biography, academic journey, career, and honours—traced from Wikipedia and updated with official sources.",
    index: "Dossier 1977—present",
    indexLabel: "Reviewed 23 July 2026",
    photoAlt: "Official portrait of Prof. Burhanuddin Muhtadi",
    photoCaption:
      "Photo supplied by the site owner. Final credit wording must be confirmed before public launch.",
    contentsLabel: "Explore the profile",
    contents: [
      { href: "#biography", label: "Biography" },
      { href: "#roles", label: "Current roles" },
      { href: "#education", label: "Education" },
      { href: "#career", label: "Career" },
      { href: "#honours", label: "Honours" },
    ],
    biographyTitle: "Biography",
    rolesTitle: "Current roles",
    educationTitle: "Education",
    careerTitle: "Career & organisations",
    careerIntro:
      "This record retains the early experience documented by Wikipedia and places it alongside current appointments from the March 2026 CV and official institutional sources.",
    awardsTitle: "Honours & fellowships",
    researchTitle: "Research areas",
    talksTitle: "Selected academic forums",
    talksIntro:
      "Recent invited talks that help show the international reach of his academic work.",
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
