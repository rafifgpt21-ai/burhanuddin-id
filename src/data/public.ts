import { googleScholarProfile } from "@/data/site";
import type { Locale } from "@/lib/i18n";

export type ResearchCluster = {
  key: "money-politics" | "democracy" | "political-islam" | "public-opinion";
  title: string;
  description: string;
  work: {
    year: string;
    title: string;
    href?: string;
  };
};

export type ContactChannel = {
  label: string;
  description: string;
  href: string;
  kind: "institution" | "academic-profile";
};

export const researchClusters: Record<Locale, readonly ResearchCluster[]> = {
  id: [
    {
      key: "money-politics",
      title: "Perilaku Pemilih & Politik Uang",
      description:
        "Menelaah bagaimana jaringan partisan, relasi personal, dan insentif material membentuk pilihan elektoral di Indonesia.",
      work: {
        year: "2020",
        title: "Kuasa Uang: Politik Uang dalam Pemilu Pasca-Orde Baru",
        href: "https://uinjkt.academia.edu/BurhanuddinMuhtadi/Books",
      },
    },
    {
      key: "democracy",
      title: "Kemunduran Demokrasi & Populisme",
      description:
        "Membaca perubahan dukungan publik, perilaku elite, polarisasi, dan tekanan terhadap kualitas demokrasi.",
      work: {
        year: "2019",
        title: "Elites, Masses and Democratic Decline in Indonesia",
        href: "https://doi.org/10.1080/13510347.2019.1680971",
      },
    },
    {
      key: "political-islam",
      title: "Politik Islam",
      description:
        "Mengkaji mobilisasi Islam, partai politik, intoleransi, identitas, dan pertautannya dengan demokrasi Indonesia.",
      work: {
        year: "2020",
        title: "Populism, Islamism, and Democratic Decline in Indonesia",
        href: "https://www.mei.edu/publications/populism-islamism-and-democratic-decline-indonesia",
      },
    },
    {
      key: "public-opinion",
      title: "Survei Elektoral & Opini Publik",
      description:
        "Menggunakan data opini publik untuk memahami kepercayaan, persepsi, dan perilaku politik warga.",
      work: {
        year: "2023",
        title: "The Indonesia National Survey Project 2022",
      },
    },
  ],
  en: [
    {
      key: "money-politics",
      title: "Voting Behaviour & Vote Buying",
      description:
        "Examining how partisan networks, personal ties, and material incentives shape electoral choice in Indonesia.",
      work: {
        year: "2020",
        title: "Kuasa Uang: Politik Uang dalam Pemilu Pasca-Orde Baru",
        href: "https://uinjkt.academia.edu/BurhanuddinMuhtadi/Books",
      },
    },
    {
      key: "democracy",
      title: "Democratic Decline & Populism",
      description:
        "Reading shifts in public support, elite behaviour, polarisation, and pressure on democratic quality.",
      work: {
        year: "2019",
        title: "Elites, Masses and Democratic Decline in Indonesia",
        href: "https://doi.org/10.1080/13510347.2019.1680971",
      },
    },
    {
      key: "political-islam",
      title: "Political Islam",
      description:
        "Studying Islamist mobilisation, political parties, intolerance, identity, and their relationship with Indonesian democracy.",
      work: {
        year: "2020",
        title: "Populism, Islamism, and Democratic Decline in Indonesia",
        href: "https://www.mei.edu/publications/populism-islamism-and-democratic-decline-indonesia",
      },
    },
    {
      key: "public-opinion",
      title: "Electoral Surveys & Public Opinion",
      description:
        "Using public-opinion data to understand citizens’ trust, perceptions, and political behaviour.",
      work: {
        year: "2023",
        title: "The Indonesia National Survey Project 2022",
      },
    },
  ],
};

export const contactChannels: Record<Locale, readonly ContactChannel[]> = {
  id: [
    {
      label: "FISIP UIN Syarif Hidayatullah Jakarta",
      description: "Profil institusional dan kabar akademik.",
      href: "https://www.fisip.uinjkt.ac.id/id/fisip-uin-jakarta-sambut-guru-besar-baru",
      kind: "institution",
    },
    {
      label: "ISEAS – Yusof Ishak Institute",
      description: "Profil peneliti pada Indonesia Studies Programme.",
      href: "https://www.iseas.edu.sg/about-us/researchers/burhanuddin-muhtadi/",
      kind: "institution",
    },
    {
      label: "Indikator Politik Indonesia",
      description: "Profil resmi pada lembaga survei dan riset kebijakan.",
      href: "https://indikator.co.id/who-we-are-2/bm/",
      kind: "institution",
    },
    {
      label: googleScholarProfile.label,
      description: "Profil sitasi dan karya akademik.",
      href: googleScholarProfile.href,
      kind: "academic-profile",
    },
    {
      label: "ResearchGate",
      description: "Jejak publikasi dan keluaran riset.",
      href: "https://www.researchgate.net/profile/Burhanuddin-Muhtadi/research",
      kind: "academic-profile",
    },
    {
      label: "Academia.edu",
      description: "Daftar buku dan profil akademik.",
      href: "https://uinjkt.academia.edu/BurhanuddinMuhtadi/Books",
      kind: "academic-profile",
    },
  ],
  en: [
    {
      label: "FISIP UIN Syarif Hidayatullah Jakarta",
      description: "Institutional profile and academic news.",
      href: "https://www.fisip.uinjkt.ac.id/id/fisip-uin-jakarta-sambut-guru-besar-baru",
      kind: "institution",
    },
    {
      label: "ISEAS – Yusof Ishak Institute",
      description: "Researcher profile in the Indonesia Studies Programme.",
      href: "https://www.iseas.edu.sg/about-us/researchers/burhanuddin-muhtadi/",
      kind: "institution",
    },
    {
      label: "Indikator Politik Indonesia",
      description: "Official profile at the survey and policy-research institute.",
      href: "https://indikator.co.id/who-we-are-2/bm/",
      kind: "institution",
    },
    {
      label: googleScholarProfile.label,
      description: "Citation profile and scholarly work.",
      href: googleScholarProfile.href,
      kind: "academic-profile",
    },
    {
      label: "ResearchGate",
      description: "Publication and research-output record.",
      href: "https://www.researchgate.net/profile/Burhanuddin-Muhtadi/research",
      kind: "academic-profile",
    },
    {
      label: "Academia.edu",
      description: "Book list and academic profile.",
      href: "https://uinjkt.academia.edu/BurhanuddinMuhtadi/Books",
      kind: "academic-profile",
    },
  ],
};

// Intentionally disabled until an owner-approved, privacy-reviewed file exists.
export const publicCv: { href: string; label: Record<Locale, string> } | null = null;
