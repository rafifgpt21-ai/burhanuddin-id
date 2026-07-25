import { writeFile } from "node:fs/promises";
import path from "node:path";

import sourceData from "../prisma/seed-data/publication-sources.json";

type PublicationType =
  | "BOOK"
  | "JOURNAL_ARTICLE"
  | "BOOK_CHAPTER"
  | "ADDITIONAL_RESEARCH_OUTPUT";

type SourceRecord = (typeof sourceData.records)[number];

type StructuredPublication = {
  fingerprint: string;
  type: PublicationType;
  title: string;
  authors: string[];
  editors: string[];
  year: number;
  dateLabel: string | null;
  containerTitle: string | null;
  publisher: string | null;
  publicationPlace: string | null;
  volume: string | null;
  issue: string | null;
  seriesNumber: string | null;
  pages: string | null;
};

const workspace = process.cwd();
const outputPath = path.join(
  workspace,
  "prisma",
  "seed-data",
  "structured-publications.json",
);

const bookAuthorPrefixes = new Map<string, string>([
  [
    "The 2024 Indonesian Elections and the Future of Indonesian Politics",
    "Burhanuddin Muhtadi and Hui Yew-Foong",
  ],
  [
    "Disinformation and Election Propaganda",
    "Maria Monica Wihardja, Burhanuddin Muhtadi, Lee Sue-Ann",
  ],
  [
    "The Indonesia National Survey Project 2022",
    "Burhanuddin Muhtadi, Hui Yew-Foong and Siwage Dharma Negara",
  ],
  [
    "The Indonesian Military Enjoys Strong Public Trust and Support",
    "Burhanuddin Muhtadi",
  ],
]);

type ChapterOverride = Pick<
  StructuredPublication,
  | "title"
  | "authors"
  | "editors"
  | "containerTitle"
  | "publisher"
  | "publicationPlace"
  | "pages"
>;

const chapterOverrides: Record<string, ChapterOverride> = {
  "04c29014c7963eafda4791e1220c0e47fadbe53b8231fd0231859287b8446673": {
    title: "Voting Patterns of the 2024 Indonesian Elections: An Overview",
    authors: ["Burhanuddin Muhtadi", "Hui Yew-Foong"],
    editors: ["Burhanuddin Muhtadi", "Hui Yew-Foong"],
    containerTitle: "The 2024 Indonesian Elections and the Future of Indonesian Politics",
    publisher: "ISEAS – Yusof Ishak Institute",
    publicationPlace: "Singapore",
    pages: null,
  },
  "95e6facc3dc0e3c6cf791df1222e859ed3b03fbdeae8c74a3b77641a5884e742": {
    title: "Vote-Buying Pattern in Concurrent Elections Era: Clientelism in Competitive Electoral Environments",
    authors: ["Burhanuddin Muhtadi"],
    editors: ["Elena Burgos Martinez", "Rizal Shidiq", "Irene Hadiprayitno"],
    containerTitle: "Indonesia 2014-2024",
    publisher: null,
    publicationPlace: null,
    pages: null,
  },
  "db75933b0d77fe9257d200a702964234f562809e1419feaf436048dc8eca6c51": {
    title: "Selective Exposure, Selective Belief and Self-Reporting Bias in Indonesia’s 2024 Presidential Election",
    authors: ["Maria Monica Wihardja", "Burhanuddin Muhtadi"],
    editors: ["Burhanuddin Muhtadi", "Hui Yew-Foong"],
    containerTitle: "The 2024 Indonesian Elections and the Future of Indonesian Politics",
    publisher: "ISEAS – Yusof Ishak Institute",
    publicationPlace: "Singapore",
    pages: null,
  },
  "550201da53e92ecad9459753e553350c09eefd50080472cad862c634902fa125": {
    title: "Kepercayaan Politik, Tekanan Ekonomi dan Sikap Partisan: Mendiskusikan Approval Presiden Pada Masa Krisis COVID-19",
    authors: ["Burhanuddin Muhtadi", "Taberez A. Neyazi", "Sourabh B. Paul"],
    editors: ["Agung Firman Sampurna"],
    containerTitle: "Scenario Planning, Dampak, dan Proyeksi di Bertbagai Bidang pada Masa dan Pasca Pandemi COVID-19",
    publisher: "BPK RI",
    publicationPlace: "Jakarta",
    pages: null,
  },
  "a5c149d8db5068b4e506b4ceea4ca02ca8df628a5559a1e112d5a1d36ccca190": {
    title: "Representasi Ideologis dalam Demokrasi Klientelistik: Studi Kasus Indonesia",
    authors: ["Burhanuddin Muhtadi", "Diego Fossati", "Edward Aspinall", "Eve Warburton"],
    editors: ["Amelia Fauzia", "Sukron Kamil"],
    containerTitle: "Agama dan Negara di Indonesia Kontemporer: Persepktif Teoretis, Sosial, Politik dan Ekonomi",
    publisher: "Social Trust Fund UIN Jakarta dan Fakultas Adab dan Humaniora UIN Jakarta",
    publicationPlace: "Jakarta",
    pages: null,
  },
  "5467ed9baad80c6b2ecb754ee6509263a75809acc92505edfde67f302baff165": {
    title: "Pecundang elektoral, dukungan terhadap demokrasi, dan nostalgia otoriter",
    authors: ["Burhanuddin Muhtadi"],
    editors: ["Thomas Power", "Eve Warburton"],
    containerTitle: "Demokrasi di Indonesia: Dari Stagnasi ke Regresi",
    publisher: "KPG (Kepustakaan Populer Gramedia), Public Virtue, & Kurawal Foundation",
    publicationPlace: "Jakarta",
    pages: null,
  },
  "573ad0010a81f1dd34f42fa136c6691919fdbb02fcab308d9a3984d252115a05": {
    title: "Electoral Losers, Democratic Support and Authoritarian Nostalgia",
    authors: ["Burhanuddin Muhtadi"],
    editors: ["Thomas Power", "Eve Warburton"],
    containerTitle: "Democracy in Indonesia: From Stagnation to Regression",
    publisher: "ISEAS-Yusof Ishak Institute",
    publicationPlace: "Singapore",
    pages: "141-165",
  },
  "1b79f4b206ebd264587e2ee58bcd16680e6b5004ff99cfcc6bde917c25259ab7": {
    title: "Muslim Identity and Deprivation: Socio-Psychological Sources of Support for Islamist Radical Groups in Indonesia",
    authors: ["Burhanuddin Muhtadi", "Rizka Halida"],
    editors: ["Alexander R. Arifianto", "Leornard Sebastian", "Syafiq Hasyim"],
    containerTitle: "Islamic Conservatism in Indonesia: Islamic Groups and Identity Politics",
    publisher: "Routledge",
    publicationPlace: "London",
    pages: null,
  },
  "9bc5134ce326f5285e4cc83780a1437676bb8e01567b641f2616933301e0bb77": {
    title: "Populisme, Polarisasi, dan Normalitas Baru dalam Politik Elektoral Kita (Populism, Polarization, and New Normal in Our Electoral Politics)",
    authors: ["Burhanuddin Muhtadi"],
    editors: [],
    containerTitle: "Bergerak Bergerak Berdampak",
    publisher: "Narasi TV",
    publicationPlace: "Jakarta",
    pages: null,
  },
  "3ef9b5f9db0f1af9a116589a8b7a37f1239160f03de6b4923ef969e2882707f7": {
    title: "The Mobilization of Intolerance and its Trajectories: Indonesian Muslims’ Views of Religious Minorities and Ethnic Chinese",
    authors: ["Marcus Mietzner", "Burhanuddin Muhtadi"],
    editors: ["Greg Fealy", "Ronit Ricci"],
    containerTitle: "Contentious Belonging: The Place of Minorities in Indonesia",
    publisher: "ISEAS Yusof Ishak Institute",
    publicationPlace: "Singapore",
    pages: "155-174",
  },
  "1e23497ddc489c4003e1d9127795489a8d609a12d3fa36ad9ed3dab77a2bf4fc": {
    title: "Violent Extremism dalam Sudut Pandang Studi Agama (Violent Extremism from the Perspective of Religious Studies)",
    authors: ["Burhanuddin Muhtadi"],
    editors: ["Philips J. Vermonte", "Arya Fernandes"],
    containerTitle: "Asking Sensitive Questions: Panduan Pelaksanaan Survei dengan Tema Tindakan Ekstrem Berbasis Agama dan Non-Agama (Guidelines for Conducting Surveys on Extremism Based on Religion and Non-Religion)",
    publisher: "CSIS",
    publicationPlace: "Jakarta",
    pages: "21-30",
  },
  "41ea62510031d213a40e2c11154a4a294a408a3e202491b050f4165f2a65d2fb": {
    title: "Komoditas Demokrasi: Efek Sistem Pemilu terhadap Maraknya Jual Beli Suara (Democratic Commodities: The Effects of Electoral System on the Prevalence of Vote Buying Practices)",
    authors: ["Burhanuddin Muhtadi"],
    editors: ["Mada Sukmajati", "Aditya Perdana"],
    containerTitle: "Pembiayaan Pemilu di Indonesia",
    publisher: "Bawaslu",
    publicationPlace: "Jakarta",
    pages: "95-118",
  },
  "1838eec7b01f91c2d1b1d2f23b6214833ead880ab10f3f747335881582f1dbcc": {
    title: "Divided Government: Tantangan Pemerintahan Jokowi- (Divided Government: The Challenges for Jokowi Government)",
    authors: ["Burhanuddin Muhtadi", "Adam Kamil"],
    editors: [],
    containerTitle: "Proyeksi Ekonomi Indonesia 2015: Tantangan Kabinet Kerja Memenuhi Ekspektasi",
    publisher: "INDEF",
    publicationPlace: "Jakarta",
    pages: null,
  },
  "542ecc60c4e8b7dc12142c56599b8dfb4978dde098a3de2d3b96139e63c65ff2": {
    title: "Resep Machiavelli dan Defisit Kepemimpinan Transformatif (The Machiavelli Recipe and the Deficit of Transformative Leadership)",
    authors: ["Burhanuddin Muhtadi"],
    editors: [],
    containerTitle: "Memperbaiki Mutu Demokrasi di Indonesia: Sebuah Perdebatan",
    publisher: "Paramadina",
    publicationPlace: "Jakarta",
    pages: "141-150",
  },
  "9ac9cf87b31518aa1f4208e432980616d6fad6aa894c3cbe28dfc3bc06abbfb9": {
    title: "Ke Cak Nur, Saya Mengaji (To Cak Nur, I Recite)",
    authors: ["Burhanuddin Muhtadi"],
    editors: [],
    containerTitle: "All You Need is Love: Cak Nur di Mata Kaum Muda",
    publisher: "Penerbit Paramadina",
    publicationPlace: "Jakarta",
    pages: null,
  },
  "43a7ea9361f160e6ea274ba7227861da9a2a2a89296621b3c1a7149ce42b4d1b": {
    title: "The 1998 Student Uprising in Indonesia: A Social Movement Theory Approach",
    authors: ["Burhanuddin Muhtadi"],
    editors: ["Faried Saenong", "Eko Nugroho"],
    containerTitle: "Enlightenment from Within",
    publisher: "Minaret",
    publicationPlace: "Canberra",
    pages: null,
  },
  "74af43e08c23f4a4ec34c4524ef58618ff18e7f58709719f4341025aa1cfd851": {
    title: "Tantangan Pluralisme Keagamaan dan Sistem Pendidikan Agama (The Challenges of Religious Pluralism and the Religious Educational System)",
    authors: ["Burhanuddin Muhtadi"],
    editors: ["Aryo Danusiri", "Wasmi Alhaziri"],
    containerTitle: "Pendidikan Memang Multikultural: Beberapa Gagasan",
    publisher: "Yayasan Sains Estetika dan Teknologi (SET)",
    publicationPlace: "Jakarta",
    pages: null,
  },
};

function clean(value: string | null | undefined) {
  const result = value
    ?.replace(/\s+/g, " ")
    .replace(/^[\s,.;:]+|[\s,.;:]+$/g, "")
    .trim();
  return result || null;
}

function contributors(value: string | null | undefined) {
  const normalized = clean(value);
  if (!normalized) return [];
  return normalized
    .replace(/\s*&\s*/g, " and ")
    .replace(/,\s+(?:and|dan)\s+/gi, ", ")
    .split(/\s*,\s*|\s+(?:and|dan)\s+/gi)
    .map((item) => clean(item?.replace(/\s+20\d{2}$/, "")))
    .filter((item): item is string => Boolean(item));
}

function openingQuoteIndex(value: string) {
  const indexes = [value.indexOf("\u2018"), value.indexOf("\u201c")].filter(
    (index) => index >= 0,
  );
  return indexes.length ? Math.min(...indexes) : -1;
}

function trimTitle(value: string) {
  return value
    .replace(/^[\u2018\u201c"']+/, "")
    .replace(/[\u2019\u201d"']+$/g, "")
    .replace(/[\u2019\u201d]\s+\(/g, " (")
    .replace(/[\s,.;]+$/g, "")
    .trim();
}

function lastPublisherParenthesis(value: string) {
  const match = value.match(/\(([^()]*(?:Jakarta|Singapore|London|Canberra|Malang)[^()]*)\)\s*[,.]?\s*(?:forthcoming\.?)?$/i);
  if (!match || match.index === undefined) {
    return { before: value, place: null, publisher: null };
  }
  const imprint = match[1].trim();
  const separator = imprint.includes(":") ? ":" : ",";
  const [place, ...publisher] = imprint.split(separator);
  return {
    before: value.slice(0, match.index).trim(),
    place: clean(place),
    publisher: clean(publisher.join(separator)),
  };
}

function pagesFrom(value: string) {
  const withoutUrls = value.replace(/https?:\/\/\S+/gi, "");
  return clean(
    withoutUrls.match(/\bpp?\.?\s*(\d+\s*[\u2013-]\s*\d+)\b/i)?.[1] ??
      withoutUrls.match(/:\s*(\d+\s*[\u2013-]\s*\d+)\b/)?.[1] ??
      withoutUrls.match(/,\s*(\d+\s*[\u2013-]\s*\d+)\s*(?:,|\.|doi|$)/i)?.[1],
  );
}

function volumeFrom(value: string) {
  return clean(
    value.match(/\b(?:vol(?:ume)?\.?\s*)(\d+)\b/i)?.[1] ??
      value.match(/\bno\.?\s*\d+\s*\(\s*(\d+)\s*\)/i)?.[1] ??
      value.match(/\b(\d+)\s*\(\s*\d+\s*\)/)?.[1],
  );
}

function issueFrom(value: string) {
  return clean(
    value.match(/\b(?:no\.?|issue)\s*(\d+(?:\s*[-\u2013]\s*\d+)?)\b/i)?.[1] ??
      value.match(/\b\d+\s*\(\s*(\d+)\s*\)\s*[:;,]/)?.[1],
  );
}

function dateLabelFrom(value: string) {
  return clean(
    value.match(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan\.|Feb\.|Mar\.|Apr\.|Jun\.|Jul\.|Aug\.|Sep\.|Sept\.|Oct\.|Nov\.|Dec\.)\b/i,
    )?.[1],
  );
}

function stripLinksAndDetails(value: string) {
  return clean(
    value
      .replace(/https?:\/\/\S+/gi, "")
      .replace(/\b(?:doi|available at|at)\s*:\s*\S+/gi, "")
      .replace(/\b(?:pp?\.?\s*)?\d+\s*[\u2013-]\s*\d+\b/gi, "")
      .replace(/\b(?:vol(?:ume)?\.?\s*)\d+\b/gi, "")
      .replace(/\b(?:no\.?|issue)\s*\d+(?:\s*[-\u2013]\s*\d+)?\b/gi, "")
      .replace(/\b\d+\s*\(\s*\d+\s*\)/g, "")
      .replace(/\b(?:published online)\b[^,]*/gi, "")
      .replace(
        /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan\.|Feb\.|Mar\.|Apr\.|Jun\.|Jul\.|Aug\.|Sep\.|Sept\.|Oct\.|Nov\.|Dec\.)\b/gi,
        "",
      )
      .replace(/\(\s*\d{4}\s*\)/g, "")
      .replace(/\b\d{1,2}\s+20\d{2}\b/g, "")
      .replace(/\bdoi\b.*$/gi, "")
      .replace(/\bor\s*$/gi, ""),
  );
}

function quotedParts(
  rawText: string,
  type: Exclude<PublicationType, "BOOK">,
) {
  const start = openingQuoteIndex(rawText);
  if (start < 0) {
    throw new Error(`Judul bertanda kutip tidak ditemukan: ${rawText}`);
  }

  const before = rawText.slice(0, start);
  const quoted = rawText.slice(start + 1);
  let titleEnd = -1;
  let remainderStart = -1;

  if (type === "BOOK_CHAPTER") {
    const chapterMarker = quoted.search(
      /(?:[\u2019\u201d"']?\s*,?\s+)(?:in|dalam)\s+/i,
    );
    if (chapterMarker >= 0) {
      const marker = quoted
        .slice(chapterMarker)
        .match(/(?:[\u2019\u201d"']?\s*,?\s+)(?:in|dalam)\s+/i);
      titleEnd = chapterMarker;
      remainderStart = chapterMarker + (marker?.[0].length ?? 0);
    }
  }

  if (titleEnd < 0) {
    const closingIndexes = ["\u2019", "\u201d"]
      .flatMap((quote) => {
        const indexes: number[] = [];
        let index = quoted.indexOf(quote);
        while (index >= 0) {
          indexes.push(index);
          index = quoted.indexOf(quote, index + 1);
        }
        return indexes;
      })
      .sort((first, second) => first - second);
    titleEnd = Math.max(...closingIndexes);
    remainderStart = titleEnd + 1;
  }

  if (titleEnd < 0 || remainderStart < 0) {
    throw new Error(`Akhir judul tidak ditemukan: ${rawText}`);
  }

  return {
    authors: contributors(before),
    title: trimTitle(quoted.slice(0, titleEnd)),
    remainder: clean(quoted.slice(remainderStart)) ?? "",
  };
}

function parseBook(record: SourceRecord): StructuredPublication {
  const raw = record.rawText.replace(/,\s* forthcoming\.?$/i, "");
  const imprint = lastPublisherParenthesis(raw);
  let titleWithAuthors = imprint.before;
  let authors = ["Burhanuddin Muhtadi"];

  for (const [titleStart, authorText] of bookAuthorPrefixes) {
    const index = titleWithAuthors.indexOf(titleStart);
    if (index >= 0) {
      authors = contributors(authorText);
      titleWithAuthors = titleWithAuthors.slice(index);
      break;
    }
  }

  return {
    fingerprint: record.fingerprint,
    type: "BOOK",
    title: trimTitle(titleWithAuthors),
    authors,
    editors: [],
    year: record.rawPayload.year!,
    dateLabel: null,
    containerTitle: null,
    publisher: imprint.publisher,
    publicationPlace: imprint.place,
    volume: null,
    issue: null,
    seriesNumber: null,
    pages: null,
  };
}

function seriesNumberFrom(value: string) {
  return clean(
    value.match(/\bISEAS Perspective(?:,|\s)+(20\d{2}\/\d+|\d+)\b/i)?.[1],
  );
}

function journalContainer(value: string) {
  const stripped = stripLinksAndDetails(value) ?? "";
  const withoutSeriesNumber = stripped
    .replace(/\bISEAS Perspective(?:,|\s)+(?:20\d{2}\/\d+|\d+)\b/i, "ISEAS Perspective")
    .replace(/\b20\d{2}\b/g, "");
  const segments = withoutSeriesNumber
    .split(",")
    .map((item) => clean(item))
    .filter((item): item is string => Boolean(item));

  if (/book review edited by/i.test(value)) {
    return clean(value.match(/published by\s+(.+?)\s+\d+\s*\(/i)?.[1]);
  }
  if (/^Book Review,/i.test(withoutSeriesNumber) && segments[1]) {
    return segments[1];
  }
  if (/Available at SSRN/i.test(withoutSeriesNumber)) {
    return "SSRN";
  }
  if (/Bijdragen tot de taal-/i.test(withoutSeriesNumber)) {
    return "Bijdragen tot de taal-, land- en volkenkunde/Journal of the Humanities and Social Sciences of Southeast Asia";
  }
  return segments[0] ?? clean(withoutSeriesNumber);
}

function leadingParenthetical(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("(")) {
    return { label: null, remainder: value };
  }
  let depth = 0;
  for (let index = 0; index < trimmed.length; index += 1) {
    if (trimmed[index] === "(") depth += 1;
    if (trimmed[index] === ")") depth -= 1;
    if (depth === 0) {
      return {
        label: trimmed.slice(0, index + 1),
        remainder: trimmed.slice(index + 1),
      };
    }
  }
  return { label: null, remainder: value };
}

function parseJournal(record: SourceRecord): StructuredPublication {
  const parts = quotedParts(record.rawText, "JOURNAL_ARTICLE");
  const translation = leadingParenthetical(parts.remainder);
  const remainder = translation.remainder;
  const bookReviewEditors = /book review edited by\s+(.+?),\s+/i.exec(remainder);
  const publisher =
    clean(bookReviewEditors?.input.match(/,\s*([^,]+?),\s*published by/i)?.[1]) ??
    (remainder.includes("Cambridge University Press")
      ? "Cambridge University Press"
      : null);

  return {
    fingerprint: record.fingerprint,
    type: "JOURNAL_ARTICLE",
    title: [parts.title, translation.label].filter(Boolean).join(" "),
    authors: parts.authors,
    editors: contributors(bookReviewEditors?.[1]),
    year: record.rawPayload.year!,
    dateLabel: dateLabelFrom(remainder),
    containerTitle: journalContainer(remainder),
    publisher,
    publicationPlace: null,
    volume: volumeFrom(remainder),
    issue: issueFrom(remainder),
    seriesNumber: seriesNumberFrom(remainder),
    pages: pagesFrom(remainder),
  };
}

function parseChapter(record: SourceRecord): StructuredPublication {
  const override = chapterOverrides[record.fingerprint];
  if (!override) {
    throw new Error(`Kurasi bab buku belum tersedia: ${record.fingerprint}`);
  }
  return {
    fingerprint: record.fingerprint,
    type: "BOOK_CHAPTER",
    title: override.title,
    authors: override.authors,
    editors: override.editors,
    year: record.rawPayload.year!,
    dateLabel: null,
    containerTitle: override.containerTitle,
    publisher: override.publisher,
    publicationPlace: override.publicationPlace,
    volume: null,
    issue: null,
    seriesNumber: null,
    pages: override.pages,
  };
}

function parseResearchOutput(record: SourceRecord): StructuredPublication {
  const parts = quotedParts(record.rawText, "ADDITIONAL_RESEARCH_OUTPUT");
  const container = stripLinksAndDetails(parts.remainder)
    ?.replace(/\b(?:available at|at)\b.*$/i, "")
    .replace(/\bISEAS Perspective(?:,|\s)+(?:20\d{2}\/\d+|\d+)\b/i, "ISEAS Perspective")
    .split(",")
    .map((item) => clean(item))
    .find((item): item is string => Boolean(item));
  const linkedInstitution = /scholar\.harvard\.edu/i.test(parts.remainder)
    ? "Harvard Scholar"
    : null;

  return {
    fingerprint: record.fingerprint,
    type: "ADDITIONAL_RESEARCH_OUTPUT",
    title: parts.title,
    authors: parts.authors,
    editors: [],
    year: record.rawPayload.year!,
    dateLabel: dateLabelFrom(parts.remainder),
    containerTitle: container ?? linkedInstitution,
    publisher: null,
    publicationPlace: null,
    volume: volumeFrom(parts.remainder),
    issue: issueFrom(parts.remainder),
    seriesNumber: seriesNumberFrom(parts.remainder),
    pages: pagesFrom(parts.remainder),
  };
}

function parseRecord(record: SourceRecord) {
  const type = record.rawPayload.suggestedType as PublicationType;
  switch (type) {
    case "BOOK":
      return parseBook(record);
    case "JOURNAL_ARTICLE":
      return parseJournal(record);
    case "BOOK_CHAPTER":
      return parseChapter(record);
    case "ADDITIONAL_RESEARCH_OUTPUT":
      return parseResearchOutput(record);
  }
}

function validate(records: StructuredPublication[]) {
  const errors: string[] = [];
  if (records.length !== 81) {
    errors.push(`Dataset harus memuat 81 record CV, ditemukan ${records.length}.`);
  }
  if (new Set(records.map((record) => record.fingerprint)).size !== records.length) {
    errors.push("Fingerprint dataset terstruktur harus unik.");
  }
  for (const record of records) {
    if (!record.title || record.title.length < 3) {
      errors.push(`${record.fingerprint}: judul kosong atau terlalu pendek.`);
    }
    if (/https?:\/\//i.test(record.title)) {
      errors.push(`${record.fingerprint}: URL masih berada di dalam judul.`);
    }
    if (
      record.title.startsWith("Burhanuddin Muhtadi") ||
      record.title.startsWith("Harry Dienes")
    ) {
      errors.push(`${record.fingerprint}: nama penulis masih berada di dalam judul.`);
    }
    if (!record.authors.length || !record.authors.includes("Burhanuddin Muhtadi")) {
      errors.push(`${record.fingerprint}: daftar penulis tidak memuat Burhanuddin Muhtadi.`);
    }
    if (
      record.type !== "BOOK" &&
      (!record.containerTitle || record.containerTitle.length < 2)
    ) {
      errors.push(`${record.fingerprint}: containerTitle wajib untuk karya non-buku.`);
    }
  }
  if (errors.length) {
    throw new Error(errors.join("\n"));
  }
}

async function main() {
  const records = sourceData.records
    .filter((record) => record.sourceName === "CV March 2026")
    .map(parseRecord);
  validate(records);
  const payload = {
    generatedFrom: sourceData.generatedAt,
    sourceCount: records.length,
    records,
  };
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Dataset bibliografis dibuat: ${records.length} record di ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
