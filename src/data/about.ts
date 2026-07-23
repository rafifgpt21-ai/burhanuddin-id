import type { Locale } from "@/lib/i18n";

type TimelineEntry = {
  year: string;
  title: string;
  institution?: string;
  detail?: string;
};

type BibliographyEntry = {
  year: string;
  citation: string;
};

const wikipediaBooks: BibliographyEntry[] = [
  {
    year: "2020",
    citation:
      "Kuasa Uang: Politik Uang dalam Pemilu Pasca-Orde Baru. Jakarta: Kepustakaan Populer Gramedia.",
  },
  {
    year: "2019",
    citation:
      "Vote Buying in Indonesia: The Mechanics of Electoral Bribery. Singapore: Palgrave Macmillan.",
  },
  {
    year: "2019",
    citation:
      "Populisme, Politik Identitas dan Dinamika Elektoral. Malang: Intrans Publishing.",
  },
  {
    year: "2013",
    citation:
      "Perang Bintang 2014: Konstelasi dan Prediksi Pemilu dan Pilpres. Jakarta: Noura Books.",
  },
  {
    year: "2012",
    citation: "Dilema PKS: Suara dan Syariah. Jakarta: Penerbit Gramedia.",
  },
  {
    year: "2005",
    citation:
      "Defisit Pelayanan Publik: Survei Persepsi Masyarakat terhadap Pelayanan Publik. Jakarta: INCIS-Partnership Kemitraan.",
  },
  {
    year: "2004",
    citation:
      "Mencari Akar Kultural Civil Society di Indonesia. Jakarta: INCIS-CSSP USAID.",
  },
  {
    year: "2003",
    citation:
      "Civil Society dan Demokrasi: Survey tentang Partisipasi Sosial-Politik Warga Jakarta. Jakarta: INCIS-CSSP USAID.",
  },
  {
    year: "2003",
    citation:
      "Syariat Islam: Pandangan Muslim Liberal. Jakarta: JIL-The Asia Foundation.",
  },
];

const wikipediaJournalArticles: BibliographyEntry[] = [
  {
    year: "2020",
    citation:
      "Bersama Eve Warburton, “Inequality and Democratic Support in Indonesia.” Pacific Affairs 93(1), 31–58.",
  },
  {
    year: "2020",
    citation:
      "Bersama Diego Fossati, Edward Aspinall, dan Eve Warburton, “Ideological Representation in Clientelistic Democracies: The Indonesian Case.” Electoral Studies 63.",
  },
  {
    year: "2019",
    citation:
      "“Politik Uang dan New Normal dalam Pemilu Paska-Orde Baru.” Jurnal Antikorupsi INTEGRITAS 5(1), 55–74.",
  },
  {
    year: "2019",
    citation:
      "Bersama Edward Aspinall, Diego Fossati, dan Eve Warburton, “Elites, Masses and Democratic Decline in Indonesia.” Democratization.",
  },
  {
    year: "2018",
    citation:
      "Bersama Marcus Mietzner, “Explaining the 2016 Islamist Mobilisation in Indonesia: Religious Intolerance, Militant Groups and the Politics of Accommodation.” Asian Studies Review 42(3), 479–497.",
  },
  {
    year: "2018",
    citation:
      "“Politik Identitas dan Mitos Pemilih Rasional.” Jurnal MAARIF 13(2), 68–86.",
  },
  {
    year: "2018",
    citation:
      "Bersama Marcus Mietzner dan Rizka Halida, “Entrepreneurs of Grievance: Drivers and Effects of Indonesia’s Islamist Mobilization.” Bijdragen tot de Taal-, Land- en Volkenkunde 174(2–3).",
  },
  {
    year: "2015",
    citation:
      "“Jokowi’s First Year: A Weak President Caught between Reform and Oligarchic Politics.” Bulletin of Indonesian Economic Studies 51(3), 349–368.",
  },
  {
    year: "2013",
    citation:
      "“Politik Uang dan Dinamika Elektoral di Indonesia: Sebuah Kajian Awal Interaksi antara Party ID dan Patron-Klien.” Jurnal Penelitian Politik 10(1), 41–57.",
  },
  {
    year: "2009",
    citation:
      "“The Quest for Hizbut Tahrir Indonesia.” Asian Journal of Social Science 37(4), 623–645.",
  },
  {
    year: "2009",
    citation:
      "“Islamism and Women in Politics: Analysing Female Political Participation and Representation of Indonesia’s Prosperous Justice Party (PKS).” Jurnal Substansia 1(1).",
  },
  {
    year: "2007",
    citation:
      "“The Conspiracy of Jews: The Quest for Anti-Semitism in Media Dakwah.” Graduate Journal of Asia-Pacific Studies 5(2), 53–76.",
  },
  {
    year: "2007",
    citation:
      "“Yudhoyono and Kalla: Two Distinctive Styles of Policy-Making in the Case of Fuel Subsidy Reduction in Indonesia.” Asian Journal of Social Policy 3(2), 1–10.",
  },
];

const wikipediaBookChapters: BibliographyEntry[] = [
  {
    year: "2020",
    citation:
      "“Electoral Losers, Democratic Support and Authoritarian Nostalgia,” dalam Democracy in Indonesia: From Stagnation to Regression, suntingan Eve Warburton dan Thomas Power. ISEAS–Yusof Ishak Institute.",
  },
  {
    year: "2020",
    citation:
      "“Populisme, Polarisasi, dan Normalitas Baru dalam Politik Elektoral Kita,” dalam Bergerak, Bergerak, Berdampak oleh Najwa Shihab dkk. Narasi TV.",
  },
  {
    year: "2020",
    citation:
      "Bersama Rizka Halida, “Muslim Identity and Deprivation: Socio-Psychological Sources of Support for Islamist Radical Groups in Indonesia,” dalam Islamic Conservatism in Indonesia. Routledge.",
  },
  {
    year: "2019",
    citation:
      "Bersama Marcus Mietzner, “The Mobilization of Intolerance and its Trajectories: Indonesian Muslims’ Views of Religious Minorities and Ethnic Chinese,” dalam Contentious Belonging. ISEAS–Yusof Ishak Institute, 155–174.",
  },
  {
    year: "2019",
    citation:
      "“Violent Extremism dalam Sudut Pandang Studi Agama,” dalam Asking Sensitive Questions, suntingan Philips J. Vermonte dan Arya Fernandes. CSIS, 21–30.",
  },
  {
    year: "2018",
    citation:
      "“Komoditas Demokrasi: Efek Sistem Pemilu terhadap Maraknya Jual Beli Suara,” dalam Pembiayaan Pemilu di Indonesia, suntingan Mada Sukmajati dan Aditya Perdana. Bawaslu, 95–118.",
  },
  {
    year: "2015",
    citation:
      "Bersama Adam Kamil, “Divided Government: Tantangan Pemerintahan Jokowi,” dalam Proyeksi Ekonomi Indonesia 2015. INDEF.",
  },
  {
    year: "2012",
    citation:
      "“Resep Machiavelli dan Defisit Kepemimpinan Transformatif,” dalam Memperbaiki Mutu Demokrasi di Indonesia: Sebuah Perdebatan. Paramadina, 141–150.",
  },
  {
    year: "2008",
    citation:
      "“Ke Cak Nur, Saya Mengaji,” dalam All You Need is Love: Cak Nur di Mata Kaum Muda. Paramadina.",
  },
  {
    year: "2007",
    citation:
      "“The 1998 Student Uprising in Indonesia: A Social Movement Theory Approach,” dalam Enlightenment from Within. Minaret.",
  },
  {
    year: "2002",
    citation:
      "“Tantangan Pluralisme Keagamaan dan Sistem Pendidikan Agama,” dalam Pendidikan Memang Multikultural: Beberapa Gagasan. Yayasan SET.",
  },
];

function englishWikipediaCitation(entry: BibliographyEntry): BibliographyEntry {
  return {
    ...entry,
    citation: entry.citation
      .replace(/^Bersama /, "With ")
      .replace(/, dan /g, ", and ")
      .replace(/ dan (?=[A-Z])/g, " and ")
      .replace(/,” dalam /g, ",” in ")
      .replace(/, suntingan /g, ", edited by ")
      .replace(/ oleh /g, " by "),
  };
}

const wikipediaJournalArticlesEn = wikipediaJournalArticles.map(englishWikipediaCitation);
const wikipediaBookChaptersEn = wikipediaBookChapters.map(englishWikipediaCitation);

const sharedLinks = [
  {
    label: "Wikipedia bahasa Indonesia",
    href: "https://id.wikipedia.org/wiki/Burhanuddin_Muhtadi",
  },
  {
    label: "FISIP UIN Syarif Hidayatullah Jakarta",
    href: "https://www.fisip.uinjkt.ac.id/id/fisip-uin-jakarta-sambut-guru-besar-baru",
  },
  {
    label: "ISEAS – Yusof Ishak Institute",
    href: "https://www.iseas.edu.sg/about-us/researchers/burhanuddin-muhtadi/",
  },
  {
    label: "Indikator Politik Indonesia",
    href: "https://indikator.co.id/who-we-are-2/bm/",
  },
  {
    label: "Repositori riset ANU",
    href: "https://openresearch-repository.anu.edu.au/items/17762e9f-c7b2-486a-bbb0-6c2c2f9035b7",
  },
  {
    label: "ResearchGate",
    href: "https://www.researchgate.net/profile/Burhanuddin-Muhtadi/research",
  },
  {
    label: "Academia.edu",
    href: "https://uinjkt.academia.edu/BurhanuddinMuhtadi/Books",
  },
] as const;

const educationId: TimelineEntry[] = [
  {
    year: "2018",
    title: "Ph.D. Ilmu Politik",
    institution: "Australian National University",
    detail:
      "Disertasi: “Buying Votes in Indonesia: Partisans, Personal Networks and Winning Margins.”",
  },
  {
    year: "2009",
    title: "M.A. Asian Studies, spesialisasi Ilmu Politik",
    institution: "Australian National University",
    detail:
      "Tesis: “Thinking Globally, Acting Locally: A Social Movement Theory Approach of the Prosperous Justice Party (PKS) and Its Islamist Transnational Framing.”",
  },
  {
    year: "2002",
    title: "Sarjana Teologi, Tafsir Al-Qur’an",
    institution: "UIN Syarif Hidayatullah Jakarta",
    detail:
      "Skripsi: “Farid Esack: Raison D’etre Hermeneutika Pembebasan Al-Qur’an.”",
  },
  {
    year: "1996",
    title: "MAN Program Khusus",
    institution: "Surakarta",
  },
  {
    year: "1993",
    title: "MTs Muallimin/at NU",
    institution: "Rembang",
  },
  {
    year: "1990",
    title: "SDN Kutoharjo 1",
    institution: "Rembang",
  },
];

const educationEn: TimelineEntry[] = [
  {
    year: "2018",
    title: "Ph.D. in Political Science",
    institution: "Australian National University",
    detail:
      "Dissertation: “Buying Votes in Indonesia: Partisans, Personal Networks and Winning Margins.”",
  },
  {
    year: "2009",
    title: "M.A. in Asian Studies, specialising in Political Science",
    institution: "Australian National University",
    detail:
      "Thesis: “Thinking Globally, Acting Locally: A Social Movement Theory Approach of the Prosperous Justice Party (PKS) and Its Islamist Transnational Framing.”",
  },
  {
    year: "2002",
    title: "B.A. in Theology, Quranic Exegesis",
    institution: "UIN Syarif Hidayatullah Jakarta",
    detail:
      "Undergraduate thesis: “Farid Esack: Raison D’etre Hermeneutika Pembebasan Al-Qur’an.”",
  },
  {
    year: "1996",
    title: "Special Programme State Islamic Senior High School",
    institution: "Surakarta",
  },
  {
    year: "1993",
    title: "MTs Muallimin/at NU",
    institution: "Rembang",
  },
  {
    year: "1990",
    title: "SDN Kutoharjo 1",
    institution: "Rembang",
  },
];

const careerId: TimelineEntry[] = [
  {
    year: "2023",
    title: "Ditetapkan sebagai Guru Besar bidang Ilmu Politik",
    institution: "FISIP UIN Syarif Hidayatullah Jakarta",
    detail: "Penetapan melalui SK Mendikbudristek pada 25 Agustus 2023.",
  },
  {
    year: "2021—kini",
    title: "Visiting Senior Research Fellow",
    institution: "ISEAS – Yusof Ishak Institute, Indonesia Studies Programme",
  },
  {
    year: "2013—kini",
    title: "Pendiri dan Direktur Eksekutif",
    institution: "Indikator Politik Indonesia",
  },
  {
    year: "2010—kini",
    title: "Dosen Ilmu Politik",
    institution: "FISIP UIN Syarif Hidayatullah Jakarta",
  },
  {
    year: "Riwayat",
    title:
      "Dosen Pascasarjana Universitas Paramadina, peneliti senior LSI, dan peneliti CENSIS",
    detail: "Peran ini tercantum dalam profil biografis Wikipedia.",
  },
  {
    year: "2004—2005",
    title: "Anggota National Consortium of People’s Voter Education Network (JPPR)",
  },
  {
    year: "2004",
    title: "Program pendidikan pemilih dan riset opini publik",
    detail:
      "Mengelola program bersama UNDP, The Asia Foundation, JIL, dan JICA; serta mengoordinasikan riset persepsi Muslim atas politik luar negeri Amerika Serikat.",
  },
  {
    year: "2003—2006",
    title: "Koordinator daerah dan peneliti LSI; peneliti INCIS",
  },
  {
    year: "2003—2004",
    title: "Editor-in-Chief, Bulletin of Islam and Good Governance",
    institution: "UIN Syarif Hidayatullah Jakarta",
  },
  {
    year: "Mulai 2001",
    title: "Editor di Jaringan Islam Liberal",
  },
  {
    year: "2000—2002",
    title: "Aliansi Lembaga-lembaga Formal Kemahasiswaan Se-Indonesia",
  },
  {
    year: "2000—2001",
    title: "Presiden BEM UIN Syarif Hidayatullah Jakarta",
  },
  {
    year: "1999—2000",
    title: "Ketua Departemen Penelitian dan Pengembangan Intelektual BEM UIN Jakarta",
  },
  {
    year: "1998—1999",
    title: "Forum Mahasiswa Ciputat (FORMACI)",
  },
  {
    year: "1996—2002",
    title: "Aktivis Himpunan Mahasiswa Islam",
  },
  {
    year: "1994—1995",
    title: "Majelis Pengembangan Tilawatil Qur’an",
    institution: "Surakarta",
  },
];

const careerEn: TimelineEntry[] = [
  {
    year: "2023",
    title: "Appointed Full Professor of Political Science",
    institution: "FISIP UIN Syarif Hidayatullah Jakarta",
    detail: "The ministerial appointment was dated 25 August 2023.",
  },
  {
    year: "2021—present",
    title: "Visiting Senior Research Fellow",
    institution: "ISEAS – Yusof Ishak Institute, Indonesia Studies Programme",
  },
  {
    year: "2013—present",
    title: "Founder and Executive Director",
    institution: "Indikator Politik Indonesia",
  },
  {
    year: "2010—present",
    title: "Political Science lecturer",
    institution: "FISIP UIN Syarif Hidayatullah Jakarta",
  },
  {
    year: "Earlier role",
    title:
      "Postgraduate lecturer at Universitas Paramadina, senior researcher at LSI, and CENSIS researcher",
    detail: "These roles are recorded in the Wikipedia biographical profile.",
  },
  {
    year: "2004—2005",
    title: "Member, National Consortium of People’s Voter Education Network (JPPR)",
  },
  {
    year: "2004",
    title: "Voter education and public-opinion research programmes",
    detail:
      "Managed programmes involving UNDP, The Asia Foundation, JIL, and JICA, and coordinated research on Muslim perceptions of United States foreign policy.",
  },
  {
    year: "2003—2006",
    title: "LSI regional coordinator and researcher; INCIS researcher",
  },
  {
    year: "2003—2004",
    title: "Editor-in-Chief, Bulletin of Islam and Good Governance",
    institution: "UIN Syarif Hidayatullah Jakarta",
  },
  {
    year: "From 2001",
    title: "Editor at Jaringan Islam Liberal",
  },
  {
    year: "2000—2002",
    title: "Alliance of Indonesian Formal Student Organisations",
  },
  {
    year: "2000—2001",
    title: "Student Executive President, UIN Syarif Hidayatullah Jakarta",
  },
  {
    year: "1999—2000",
    title: "Head of Research and Intellectual Development, UIN Jakarta Student Executive",
  },
  {
    year: "1998—1999",
    title: "Forum Mahasiswa Ciputat (FORMACI)",
  },
  {
    year: "1996—2002",
    title: "Himpunan Mahasiswa Islam activist",
  },
  {
    year: "1994—1995",
    title: "Majelis Pengembangan Tilawatil Qur’an",
    institution: "Surakarta",
  },
];

const awardsId: TimelineEntry[] = [
  {
    year: "2020",
    title: "Honourable Mention, ASAA Early Career Book Prize",
    detail:
      "Untuk Vote Buying in Indonesia: The Mechanics of Electoral Bribery. Catatan penting dari CV Maret 2026 yang belum tercantum di Wikipedia.",
  },
  {
    year: "2019",
    title: "Indonesian Platinum and Best Corporate Award",
    detail: "Kategori The Most Trusted Survey Institution Company of the Year.",
  },
  {
    year: "2018",
    title: "Young Southeast Asia Fellow Award",
    detail: "Diberikan oleh Southeast Asia Research Group (SEAREG).",
  },
  {
    year: "2016",
    title: "The 11th Singapore Graduate Forum on Southeast Asian Studies",
    detail: "Program Asian Research Scholars, National University of Singapore.",
  },
  {
    year: "2016",
    title: "Indonesia–Singapore Young Leaders Award",
    detail: "S Rajaratnam Endowment, RSIS, dan RSIS Indonesia Programme.",
  },
  {
    year: "2013",
    title: "Australia Awards Scholarship",
    detail: "Beasiswa program doktoral di Australian National University.",
  },
  {
    year: "2010",
    title: "Charta Politika Award",
    detail: "Analis Politik Terbaik.",
  },
  {
    year: "2009",
    title: "Anugerah Media dan Komunikator Terbaik Pilpres",
    detail: "Kategori pengamat dari Strategy Public Relations.",
  },
  {
    year: "2008",
    title: "Australian Development Scholarship",
    detail: "Beasiswa program magister di Australian National University.",
  },
  {
    year: "2008",
    title: "The Asia Foundation Young Leaders Fellowship Grant",
    detail: "Dukungan studi pascasarjana bagi intelektual muda.",
  },
];

const awardsEn: TimelineEntry[] = [
  {
    year: "2020",
    title: "Honourable Mention, ASAA Early Career Book Prize",
    detail:
      "For Vote Buying in Indonesia: The Mechanics of Electoral Bribery. A March 2026 CV update not yet included on Wikipedia.",
  },
  {
    year: "2019",
    title: "Indonesian Platinum and Best Corporate Award",
    detail: "The Most Trusted Survey Institution Company of the Year category.",
  },
  {
    year: "2018",
    title: "Young Southeast Asia Fellow Award",
    detail: "Awarded by the Southeast Asia Research Group (SEAREG).",
  },
  {
    year: "2016",
    title: "The 11th Singapore Graduate Forum on Southeast Asian Studies",
    detail: "Asian Research Scholars programme, National University of Singapore.",
  },
  {
    year: "2016",
    title: "Indonesia–Singapore Young Leaders Award",
    detail: "S Rajaratnam Endowment, RSIS, and the RSIS Indonesia Programme.",
  },
  {
    year: "2013",
    title: "Australia Awards Scholarship",
    detail: "Scholarship for doctoral study at the Australian National University.",
  },
  {
    year: "2010",
    title: "Charta Politika Award",
    detail: "Best Political Analyst.",
  },
  {
    year: "2009",
    title: "Best Presidential Election Media Communicator",
    detail: "Observer category, awarded by Strategy Public Relations.",
  },
  {
    year: "2008",
    title: "Australian Development Scholarship",
    detail: "Scholarship for master’s study at the Australian National University.",
  },
  {
    year: "2008",
    title: "The Asia Foundation Young Leaders Fellowship Grant",
    detail: "Postgraduate study support for a young intellectual.",
  },
];

const recentWorksId: TimelineEntry[] = [
  {
    year: "2026",
    title: "The 2024 Indonesian Elections and the Future of Indonesian Politics",
    institution: "Bersama Hui Yew-Foong · ISEAS – Yusof Ishak Institute · forthcoming",
  },
  {
    year: "2025",
    title:
      "Disinformation and Election Propaganda: Impact on Voter Perceptions and Behaviours in Indonesia’s 2024 Presidential Election",
    institution:
      "Bersama Maria Monica Wihardja dan Lee Sue-Ann · ISEAS – Yusof Ishak Institute",
  },
  {
    year: "2023",
    title: "The Indonesia National Survey Project 2022",
    institution:
      "Bersama Hui Yew-Foong dan Siwage Dharma Negara · ISEAS – Yusof Ishak Institute",
  },
  {
    year: "2023",
    title: "Votes for Sale: Klientelisme, Defisit Demokrasi, dan Institusi",
    institution: "Pidato pengukuhan Guru Besar Ilmu Politik, UIN Jakarta",
  },
  {
    year: "2022",
    title: "The Indonesian Military Enjoys Strong Public Trust and Support",
    institution: "ISEAS – Yusof Ishak Institute",
  },
];

const recentWorksEn: TimelineEntry[] = [
  {
    year: "2026",
    title: "The 2024 Indonesian Elections and the Future of Indonesian Politics",
    institution: "With Hui Yew-Foong · ISEAS – Yusof Ishak Institute · forthcoming",
  },
  {
    year: "2025",
    title:
      "Disinformation and Election Propaganda: Impact on Voter Perceptions and Behaviours in Indonesia’s 2024 Presidential Election",
    institution:
      "With Maria Monica Wihardja and Lee Sue-Ann · ISEAS – Yusof Ishak Institute",
  },
  {
    year: "2023",
    title: "The Indonesia National Survey Project 2022",
    institution:
      "With Hui Yew-Foong and Siwage Dharma Negara · ISEAS – Yusof Ishak Institute",
  },
  {
    year: "2023",
    title: "Votes for Sale: Clientelism, Democratic Deficit, and Institutions",
    institution: "Inaugural address as Professor of Political Science, UIN Jakarta",
  },
  {
    year: "2022",
    title: "The Indonesian Military Enjoys Strong Public Trust and Support",
    institution: "ISEAS – Yusof Ishak Institute",
  },
];

const talksId: TimelineEntry[] = [
  {
    year: "2025",
    title: "Between Faith and Freedom: Muslims’ Attitudes and the Decline of Democracy in Indonesia",
    institution: "Universität Münster, Jerman",
  },
  {
    year: "2024",
    title: "The State of Indonesian Democracy",
    institution: "Southeast Asia Program, Cornell University, Amerika Serikat",
  },
  {
    year: "2021",
    title: "Indonesia Forum 2021: National Politics and the Future of Decentralization",
    institution: "ISEAS – Yusof Ishak Institute, Singapura",
  },
];

const talksEn: TimelineEntry[] = [
  {
    year: "2025",
    title: "Between Faith and Freedom: Muslims’ Attitudes and the Decline of Democracy in Indonesia",
    institution: "Universität Münster, Germany",
  },
  {
    year: "2024",
    title: "The State of Indonesian Democracy",
    institution: "Southeast Asia Program, Cornell University, United States",
  },
  {
    year: "2021",
    title: "Indonesia Forum 2021: National Politics and the Future of Decentralization",
    institution: "ISEAS – Yusof Ishak Institute, Singapore",
  },
];

export const aboutProfile: Record<
  Locale,
  {
    lead: string;
    biography: readonly string[];
    facts: readonly { label: string; value: string }[];
    currentRoles: readonly TimelineEntry[];
    education: readonly TimelineEntry[];
    career: readonly TimelineEntry[];
    awards: readonly TimelineEntry[];
    recentWorks: readonly TimelineEntry[];
    talks: readonly TimelineEntry[];
    bibliography: readonly {
      key: "books" | "journals" | "chapters";
      entries: readonly BibliographyEntry[];
    }[];
    links: typeof sharedLinks;
  }
> = {
  id: {
    lead:
      "Prof. Burhanuddin Muhtadi, M.A., Ph.D. adalah ilmuwan politik Indonesia yang memadukan riset akademik, pengajaran, dan pembacaan opini publik.",
    biography: [
      "Lahir di Rembang, Jawa Tengah, pada 15 Desember 1977, ia mulai akrab dengan dunia tulis-menulis sejak sekolah dasar. Setelah menyelesaikan pendidikan menengah di Rembang dan Surakarta, ia pindah ke Jakarta pada 1996 untuk menempuh studi di IAIN Syarif Hidayatullah, yang kemudian menjadi UIN.",
      "Artikel media pertamanya, “Keterbukaan Pasca Insiden 27 Juli”, terbit di Harian Terbit. Sepanjang 1996–2004, ratusan artikelnya dalam bahasa Indonesia dan Inggris dimuat media lokal maupun nasional. Jalur kepenulisan itu berkembang menjadi kerja ilmiah mengenai pemilu, perilaku memilih, politik uang, demokrasi, opini publik, politik Islam, polarisasi, dan misinformasi.",
      "Riset doktoralnya di Australian National University menelaah bagaimana jaringan partisan dan personal membentuk praktik politik uang. Disertasi tersebut menjadi buku Vote Buying in Indonesia: The Mechanics of Electoral Bribery, yang kemudian hadir dalam bahasa Indonesia sebagai Kuasa Uang: Politik Uang dalam Pemilu Pasca-Orde Baru.",
    ],
    facts: [
      { label: "Lahir", value: "15 Desember 1977" },
      { label: "Asal", value: "Rembang, Jawa Tengah" },
      { label: "Bidang", value: "Ilmu politik" },
      { label: "Fokus", value: "Pemilu & perilaku politik" },
    ],
    currentRoles: careerId.slice(0, 4),
    education: educationId,
    career: careerId,
    awards: awardsId,
    recentWorks: recentWorksId,
    talks: talksId,
    bibliography: [
      { key: "books", entries: wikipediaBooks },
      { key: "journals", entries: wikipediaJournalArticles },
      { key: "chapters", entries: wikipediaBookChapters },
    ],
    links: sharedLinks,
  },
  en: {
    lead:
      "Prof. Burhanuddin Muhtadi, M.A., Ph.D. is an Indonesian political scientist whose work connects academic research, teaching, and the interpretation of public opinion.",
    biography: [
      "Born in Rembang, Central Java, on 15 December 1977, he became interested in writing while still at primary school. After secondary education in Rembang and Surakarta, he moved to Jakarta in 1996 to study at IAIN Syarif Hidayatullah, now UIN.",
      "His first media article, “Keterbukaan Pasca Insiden 27 Juli”, was published by Harian Terbit. Between 1996 and 2004, hundreds of his Indonesian- and English-language articles appeared in local and national media. That writing practice developed into research on elections, voting behaviour, vote buying, democracy, public opinion, political Islam, polarisation, and misinformation.",
      "His doctoral research at the Australian National University examined how partisan and personal networks shape vote buying. The dissertation became Vote Buying in Indonesia: The Mechanics of Electoral Bribery, later published in Indonesian as Kuasa Uang: Politik Uang dalam Pemilu Pasca-Orde Baru.",
    ],
    facts: [
      { label: "Born", value: "15 December 1977" },
      { label: "From", value: "Rembang, Central Java" },
      { label: "Field", value: "Political science" },
      { label: "Focus", value: "Elections & political behaviour" },
    ],
    currentRoles: careerEn.slice(0, 4),
    education: educationEn,
    career: careerEn,
    awards: awardsEn,
    recentWorks: recentWorksEn,
    talks: talksEn,
    bibliography: [
      { key: "books", entries: wikipediaBooks },
      { key: "journals", entries: wikipediaJournalArticlesEn },
      { key: "chapters", entries: wikipediaBookChaptersEn },
    ],
    links: sharedLinks,
  },
};
