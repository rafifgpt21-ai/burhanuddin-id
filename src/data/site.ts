import type { Locale } from "@/lib/i18n";

export const faviconSource =
  "https://m0xcz6d4a4.ufs.sh/f/HbK7H1AIAYm2SWNdXKJXDvaNs9yjUSuRdpiQLmxr4zAKH5oW";

export const brandLogoSource =
  "https://m0xcz6d4a4.ufs.sh/f/HbK7H1AIAYm2PcqPrVKzwJBOZHKsm5tXYFbI17p24W60x9lV";

export const portraitSource =
  "https://m0xcz6d4a4.ufs.sh/f/HbK7H1AIAYm2NQUVII7E0AjYnxm7VuMtCHo41fBdPclwyOs9";

export const roles: Record<Locale, readonly string[]> = {
  id: [
    "Profesor Ilmu Politik, FISIP UIN Syarif Hidayatullah Jakarta",
    "Pendiri dan Direktur Eksekutif Indikator Politik Indonesia",
    "Visiting Senior Research Fellow, ISEAS – Yusof Ishak Institute",
  ],
  en: [
    "Professor of Political Science, FISIP UIN Syarif Hidayatullah Jakarta",
    "Founder and Executive Director of Indikator Politik Indonesia",
    "Visiting Senior Research Fellow, ISEAS – Yusof Ishak Institute",
  ],
};

export const researchAreas: Record<Locale, readonly string[]> = {
  id: [
    "Pemilu Indonesia",
    "Perilaku memilih",
    "Politik uang & klientelisme",
    "Demokrasi & kemunduran demokrasi",
    "Opini publik",
    "Politik Islam",
    "Polarisasi",
    "Misinformasi",
  ],
  en: [
    "Indonesian elections",
    "Voting behavior",
    "Vote buying & clientelism",
    "Democracy & democratic decline",
    "Public opinion",
    "Political Islam",
    "Polarization",
    "Misinformation",
  ],
};

export type Publication = {
  id?: string;
  typeKey: "book" | "journal" | "chapter" | "research" | "inaugural-address";
  type: string;
  year: string;
  dateLabel?: string;
  title: string;
  authors: readonly string[];
  editors?: readonly string[];
  containerTitle?: string;
  publisher?: string;
  publicationPlace?: string;
  volume?: string;
  issue?: string;
  seriesNumber?: string;
  pages?: string;
  doi?: string;
  status: "PUBLISHED" | "FORTHCOMING" | "PREPRINT" | "ERRATUM" | "REVIEW";
  href?: string;
  image?: {
    url: string;
    altId?: string;
    altEn?: string;
  };
};

export const featuredBooks: Publication[] = [
  {
    typeKey: "book",
    type: "BOOK",
    year: "2025",
    title:
      "Disinformation and Election Propaganda: Impact on Voter Perceptions and Behaviours in Indonesia’s 2024 Presidential Election",
    authors: ["Maria Monica Wihardja", "Burhanuddin Muhtadi", "Lee Sue-Ann"],
    publisher: "ISEAS – Yusof Ishak Institute",
    publicationPlace: "Singapore",
    status: "PUBLISHED",
    href: "https://doi.org/10.1355/9789815306682",
    image: {
      url: "https://m0xcz6d4a4.ufs.sh/f/HbK7H1AIAYm2RInEROfXt0aWO3zZP1JA9fLxYR8IQbF5vHTg",
    },
  },
  {
    typeKey: "book",
    type: "BOOK",
    year: "2023",
    title:
      "The Indonesia National Survey Project 2022: Engaging with Developments in the Political, Economic and Social Spheres",
    authors: ["Burhanuddin Muhtadi", "Hui Yew-Foong", "Siwage Dharma Negara"],
    publisher: "ISEAS – Yusof Ishak Institute",
    publicationPlace: "Singapore",
    status: "PUBLISHED",
    href: "https://doi.org/10.1355/9789815104103",
    image: {
      url: "https://m0xcz6d4a4.ufs.sh/f/HbK7H1AIAYm2FJanRNLDajxINmzbZu6X41Bg5wWlQLk2GTvR",
    },
  },
  {
    typeKey: "book",
    type: "BOOK",
    year: "2022",
    title:
      "The Indonesian Military Enjoys Strong Public Trust and Support: Reasons and Implications",
    authors: ["Burhanuddin Muhtadi"],
    publisher: "ISEAS – Yusof Ishak Institute",
    publicationPlace: "Singapore",
    status: "PUBLISHED",
    href: "https://doi.org/10.1355/9789815104004",
    image: {
      url: "https://m0xcz6d4a4.ufs.sh/f/HbK7H1AIAYm2GnEAPEZ1lLcXjm8UBKCVS3dGEs6Jgw0IY4Hr",
    },
  },
];

export const selectedPublications: Publication[] = [
  {
    typeKey: "book",
    type: "Buku",
    year: "2020",
    title: "Kuasa Uang: Politik Uang dalam Pemilu Pasca-Orde Baru",
    authors: ["Burhanuddin Muhtadi"],
    publisher: "Penerbit Gramedia",
    publicationPlace: "Jakarta",
    status: "PUBLISHED",
    href: "https://uinjkt.academia.edu/BurhanuddinMuhtadi/Books",
  },
  {
    typeKey: "journal",
    type: "Artikel jurnal",
    year: "2019",
    title: "Elites, Masses and Democratic Decline in Indonesia",
    authors: ["Edward Aspinall", "Diego Fossati", "Burhanuddin Muhtadi", "Eve Warburton"],
    containerTitle: "Democratization",
    doi: "10.1080/13510347.2019.1680971",
    status: "PUBLISHED",
    href: "https://doi.org/10.1080/13510347.2019.1680971",
  },
  {
    typeKey: "research",
    type: "Keluaran riset",
    year: "2020",
    title: "Populism, Islamism, and Democratic Decline in Indonesia",
    authors: ["Burhanuddin Muhtadi"],
    containerTitle: "The Middle East Institute",
    status: "PUBLISHED",
    href: "https://www.mei.edu/publications/populism-islamism-and-democratic-decline-indonesia",
  },
  {
    typeKey: "inaugural-address",
    type: "Pidato pengukuhan",
    year: "2023",
    title: "Votes for Sale: Klientelisme, Defisit Demokrasi, dan Institusi",
    authors: ["Burhanuddin Muhtadi"],
    containerTitle: "FISIP UIN Syarif Hidayatullah Jakarta",
    dateLabel: "29 November 2023",
    status: "PUBLISHED",
    href: "https://indikator.co.id/wp-content/uploads/2023/11/Pidato-Pengukuhan-Gubes-Prof-Burhanuddin-Muhtadi-Votes-for-Sale.pdf",
  },
];

export function getHomepagePublicationSelection(
  publishedPublications: readonly Publication[] = [],
) {
  const databaseBooks = publishedPublications
    .filter(
      (publication) =>
        publication.typeKey === "book" && Boolean(publication.image),
    )
    .slice(0, 3);
  const nonBooks = selectedPublications
    .filter((publication) => publication.typeKey !== "book")
    .sort((first, second) => Number(second.year) - Number(first.year))
    .slice(0, 3);

  return {
    books: databaseBooks.length === 3 ? databaseBooks : featuredBooks,
    nonBooks,
  };
}

export const googleScholarProfile = {
  label: "Google Scholar",
  href: "https://scholar.google.com/citations?user=6lIR9E4AAAAJ&hl=en",
} as const;

export const externalProfiles = [
  googleScholarProfile,
  {
    label: "ResearchGate",
    href: "https://www.researchgate.net/profile/Burhanuddin-Muhtadi/research",
  },
  {
    label: "Academia.edu",
    href: "https://uinjkt.academia.edu/BurhanuddinMuhtadi/Books",
  },
] as const;
