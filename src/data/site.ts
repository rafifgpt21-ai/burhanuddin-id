import type { Locale } from "@/lib/i18n";

export const portraitSource =
  "https://m0xcz6d4a4.ufs.sh/f/HbK7H1AIAYm2V45zUJQKTkbtMayRc9nfFA8JvOHYsBi174EX";

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
  title: string;
  authors: string;
  venue: string;
  href?: string;
};

export const selectedPublications: Publication[] = [
  {
    typeKey: "book",
    type: "Buku",
    year: "2020",
    title: "Kuasa Uang: Politik Uang dalam Pemilu Pasca-Orde Baru",
    authors: "Burhanuddin Muhtadi",
    venue: "Jakarta: Penerbit Gramedia",
    href: "https://uinjkt.academia.edu/BurhanuddinMuhtadi/Books",
  },
  {
    typeKey: "journal",
    type: "Artikel jurnal",
    year: "2019",
    title: "Elites, Masses and Democratic Decline in Indonesia",
    authors:
      "Edward Aspinall, Diego Fossati, Burhanuddin Muhtadi, dan Eve Warburton",
    venue: "Democratization · doi:10.1080/13510347.2019.1680971",
    href: "https://doi.org/10.1080/13510347.2019.1680971",
  },
  {
    typeKey: "research",
    type: "Keluaran riset",
    year: "2020",
    title: "Populism, Islamism, and Democratic Decline in Indonesia",
    authors: "Burhanuddin Muhtadi",
    venue: "The Middle East Institute",
    href: "https://www.mei.edu/publications/populism-islamism-and-democratic-decline-indonesia",
  },
  {
    typeKey: "inaugural-address",
    type: "Pidato pengukuhan",
    year: "2023",
    title: "Votes for Sale: Klientelisme, Defisit Demokrasi, dan Institusi",
    authors: "Burhanuddin Muhtadi",
    venue: "FISIP UIN Syarif Hidayatullah Jakarta · 29 November 2023",
    href: "https://indikator.co.id/wp-content/uploads/2023/11/Pidato-Pengukuhan-Gubes-Prof-Burhanuddin-Muhtadi-Votes-for-Sale.pdf",
  },
];

export const externalProfiles = [
  {
    label: "ResearchGate",
    href: "https://www.researchgate.net/profile/Burhanuddin-Muhtadi/research",
  },
  {
    label: "Academia.edu",
    href: "https://uinjkt.academia.edu/BurhanuddinMuhtadi/Books",
  },
] as const;
