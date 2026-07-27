import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import sourceData from "../prisma/seed-data/publication-sources.json";
import structuredPublicationData from "../prisma/seed-data/structured-publications.json";
import { buildPublicationSeed } from "../prisma/seed-data/build-publications";
import { publicationCoverSources } from "../prisma/seed-data/publication-covers";
import {
  agendaInputSchema,
  getPublishReadiness,
  homepageInputSchema,
  materialInputSchema,
  postInputSchema,
  publicationInputSchema,
} from "../src/lib/validation/content";
import { canTransitionEditorialStatus } from "../src/lib/content/editorial-state";
import { toJsonSnapshot } from "../src/lib/content/snapshots";
import {
  extractDoi,
  extractFirstHttpsUrl,
  extractFirstPublicationUrl,
} from "../src/lib/content/publication-url";
import {
  canAccessAdmin,
  canManageUsers,
  canPermanentlyDelete,
} from "../src/lib/auth/access";
import {
  createAdminUserSchema,
  updateOwnAccountSchema,
} from "../src/lib/validation/admin-users";
import {
  formatAgendaDate,
  partitionAgenda,
} from "../src/lib/content/agenda-utils";
import {
  getRoutePath,
  switchLocalePath,
} from "../src/lib/i18n";
import { getAdminCopy } from "../src/data/admin";
import { aboutProfile } from "../src/data/about";
import {
  featuredBooks,
  getHomepagePublicationSelection,
} from "../src/data/site";
import { getDictionary } from "../src/data/translations";
import {
  publicationGroupKey,
  publicationSearchText,
} from "../src/lib/content/publication-display";

test("publication source dataset is complete and unique", () => {
  assert.equal(sourceData.sourceCounts.cv, 81);
  assert.equal(sourceData.sourceCounts.researchGate, 82);
  assert.equal(sourceData.sourceCounts.academia, 12);
  assert.equal(sourceData.sourceCounts.professorialAddress, 1);
  assert.equal(sourceData.sourceCounts.studyMaterials, 0);
  assert.equal(sourceData.sourceCounts.agenda, 0);
  assert.equal(sourceData.records.length, 176);
  assert.equal(new Set(sourceData.records.map((item) => item.fingerprint)).size, 176);
});

test("all 81 CV publications have unique structured bibliographic metadata", () => {
  assert.equal(structuredPublicationData.sourceCount, 81);
  assert.equal(structuredPublicationData.records.length, 81);
  assert.equal(
    new Set(
      structuredPublicationData.records.map((record) => record.fingerprint),
    ).size,
    81,
  );
  assert.equal(
    structuredPublicationData.records.every(
      (record) =>
        record.title.length >= 3 &&
        !/https?:\/\//i.test(record.title) &&
        record.authors.length > 0 &&
        record.authors.includes("Burhanuddin Muhtadi"),
    ),
    true,
  );
});

test("ISEAS 2026 citation is separated into title, contributors, container, and number", () => {
  const publication = structuredPublicationData.records.find(
    (record) =>
      record.title ===
      "Indonesian Public Support for Free and Nutritious Meals Stays Broad but Shallow",
  );
  assert.ok(publication);
  assert.deepEqual(publication.authors, [
    "Harry Dienes",
    "Burhanuddin Muhtadi",
  ]);
  assert.equal(publication.containerTitle, "ISEAS Perspective");
  assert.equal(publication.seriesNumber, "21");
  assert.equal(publication.year, 2026);
});

test("material requires exactly one delivery target", () => {
  const base = {
    titleId: "Materi contoh", titleEn: "Sample material", slugId: "materi-contoh", slugEn: "sample-material",
    descriptionId: "Deskripsi materi yang cukup panjang.", descriptionEn: "A sufficiently long material description.",
    courseId: "Ilmu Politik", courseEn: "Political Science", topicId: "Pemilu", topicEn: "Elections",
    resourceType: "SLIDE", semester: "Ganjil", academicYear: "2026/2027", tagsId: [], tagsEn: [],
    downloadAllowed: false, pinned: false, status: "DRAFT",
  } as const;
  assert.equal(materialInputSchema.safeParse({ ...base, assetId: "asset", externalUrl: "" }).success, true);
  assert.equal(materialInputSchema.safeParse({ ...base, assetId: "asset", externalUrl: "https://example.com" }).success, false);
  assert.equal(materialInputSchema.safeParse({ ...base, assetId: "", externalUrl: "" }).success, false);
});

test("post draft only requires Indonesian title and content", () => {
  const result = postInputSchema.safeParse({
    titleId: "Catatan tentang demokrasi",
    titleEn: "",
    slugId: "catatan-tentang-demokrasi",
    slugEn: "",
    excerptId: "",
    excerptEn: "",
    contentId: [{ type: "paragraph", text: "Isi naskah utama." }],
    contentEn: [],
    topics: [],
    coverImage: "",
    canonicalExternal: "",
    status: "DRAFT",
  });

  assert.equal(result.success, true);
});

test("post blocks allow safe editorial media and reject arbitrary video hosts", () => {
  const base = {
    titleId: "Catatan tentang demokrasi",
    titleEn: "Notes on democracy",
    slugId: "catatan-tentang-demokrasi",
    slugEn: "notes-on-democracy",
    excerptId: "Ringkasan tulisan yang telah ditinjau.",
    excerptEn: "A reviewed summary of the article.",
    topics: [],
    pinned: false,
    coverImage: "",
    canonicalExternal: "",
    status: "DRAFT",
  } as const;
  assert.equal(postInputSchema.safeParse({
    ...base,
    contentId: [{ type: "video", title: "Kuliah", url: "https://youtube.com/watch?v=abc" }],
    contentEn: [{ type: "paragraph", text: "English article." }],
  }).success, true);
  assert.equal(postInputSchema.safeParse({
    ...base,
    contentId: [{ type: "video", title: "Unsafe", url: "https://example.com/embed" }],
    contentEn: [],
  }).success, false);
});

test("post publishing allows empty English fields", () => {
  const issues = getPublishReadiness("POST", {
    titleId: "Catatan tentang demokrasi",
    titleEn: "",
    slugId: "catatan-tentang-demokrasi",
    slugEn: "",
    excerptId: "Ringkasan Indonesia yang telah ditinjau.",
    excerptEn: "",
    contentId: [{ type: "paragraph", text: "Isi naskah utama." }],
    contentEn: [],
    topics: [],
    pinned: false,
    coverImage: "",
    canonicalExternal: "",
    status: "DRAFT",
  });
  assert.deepEqual(issues, []);
});

test("agenda and material publishing allow empty English fields", () => {
  const agendaIssues = getPublishReadiness("AGENDA", {
    titleId: "Agenda akademik",
    titleEn: "",
    slugId: "agenda-akademik",
    slugEn: "",
    descriptionId: "Deskripsi agenda Indonesia yang cukup panjang.",
    descriptionEn: "",
    startsAt: "2026-08-03T09:00:00+07:00",
    endsAt: undefined,
    locationLabelId: "Jakarta",
    locationLabelEn: "",
    externalUrl: "",
    status: "DRAFT",
  });
  const materialIssues = getPublishReadiness("MATERIAL", {
    titleId: "Materi ilmu politik",
    titleEn: "",
    slugId: "materi-ilmu-politik",
    slugEn: "",
    descriptionId: "Deskripsi materi Indonesia yang cukup panjang.",
    descriptionEn: "",
    courseId: "Ilmu Politik",
    courseEn: "",
    topicId: "Pemilu",
    topicEn: "",
    resourceType: "SLIDE",
    semester: "",
    academicYear: "",
    tagsId: ["Pemilu"],
    tagsEn: [],
    assetId: "asset-id",
    externalUrl: "",
    downloadAllowed: true,
    pinned: false,
    status: "DRAFT",
  });

  assert.deepEqual(agendaIssues, []);
  assert.deepEqual(materialIssues, []);
});

test("homepage English fields may all be empty", () => {
  const id = {
    officialLabel: "Situs resmi Profesor Burhanuddin Muhtadi",
    tagline: "Mengawal kekuasaan dan menjaga kewarasan",
    quote: "Kutipan Indonesia yang cukup panjang untuk kebutuhan validasi beranda.",
    fields: "Politik Indonesia dan opini publik",
    continueAction: "Lanjutkan",
    academicPrefix: "Prof.",
    academicName: "Burhanuddin Muhtadi",
    academicSuffix: "M.A., Ph.D.",
    lead: "Profil akademik Indonesia yang cukup panjang untuk kebutuhan validasi.",
    profileAction: "Lihat profil",
    portraitCaption: "Profesor Ilmu Politik",
    roles: ["Profesor Ilmu Politik", "Direktur Eksekutif", "Pengajar"],
    publicationEyebrow: "Publikasi",
    publicationTitle: "Karya terpilih",
    publicationDescription: "Pilihan karya akademik dan buku yang telah diterbitkan.",
    publicationAction: "Semua publikasi",
    booksLabel: "Buku terbaru",
    outreachEyebrow: "Kiprah",
    outreachTitle: "Kiprah publik",
    outreachDescription: "Agenda dan forum akademik yang akan datang.",
    outreachAction: "Lihat kiprah",
    agendaLabel: "Agenda",
    forumLabel: "Forum",
    materialsAction: "Materi kuliah",
    closingEyebrow: "Kontak",
    closingTitle: "Terhubung",
    contactAction: "Hubungi",
    closingProfileAction: "Lihat profil",
  };
  const result = homepageInputSchema.safeParse({
    id,
    en: {},
    logoUrl: "https://example.com/logo.png",
    portraitUrl: "https://example.com/portrait.jpg",
    portraitAltId: "Potret resmi Burhanuddin Muhtadi",
    portraitAltEn: "",
    mediaRightsNote: "Aset disetujui pemilik situs.",
    research: ["money-politics", "democracy", "political-islam", "public-opinion"].map((key, index) => ({
      key,
      titleId: `Tema riset Indonesia ${index + 1}`,
      titleEn: "",
      descriptionId: "Deskripsi tema riset Indonesia yang cukup panjang untuk validasi.",
      descriptionEn: "",
      workYear: "2026",
      workTitle: `Karya terkait ${index + 1}`,
      workUrl: "",
    })),
    forums: [1, 2].map((index) => ({
      year: "2026",
      titleId: `Forum akademik ${index}`,
      titleEn: "",
      institutionId: "Institusi akademik",
      institutionEn: "",
    })),
    scholar: { label: "Google Scholar", href: "https://scholar.google.com" },
  });

  assert.equal(result.success, true);
});

test("homepage payload requires four research themes and two forums", () => {
  const schemaSource = readFileSync(
    new URL("../src/lib/validation/content.ts", import.meta.url),
    "utf8",
  );
  assert.match(schemaSource, /research:\s*z\.array\(homepageResearchSchema\)\.length\(4\)/);
  assert.match(schemaSource, /\.length\(2\)/);
  assert.equal(typeof homepageInputSchema.safeParse, "function");
});

test("agenda rejects an end time before its start time", () => {
  const result = agendaInputSchema.safeParse({
    titleId: "Agenda akademik", titleEn: "Academic agenda", slugId: "agenda-akademik", slugEn: "academic-agenda",
    descriptionId: "Deskripsi agenda yang cukup panjang.", descriptionEn: "A sufficiently long agenda description.",
    startsAt: "2026-07-20T12:00:00+07:00", endsAt: "2026-07-20T11:00:00+07:00",
    locationLabelId: "Jakarta", locationLabelEn: "Jakarta", externalUrl: "", status: "DRAFT",
  });
  assert.equal(result.success, false);
});

test("publication preserves author array order and requires HTTPS URLs", () => {
  const input = {
    type: "BOOK", title: "A Publication", authors: ["First Author", "Second Author"], year: 2026,
    publisher: "Publisher", doi: "", externalUrl: "https://example.com/publication", status: "PUBLISHED",
    sourceName: "CV March 2026", sourceUrl: "", sourceNote: "Source wording retained for review.",
  } as const;
  const valid = publicationInputSchema.parse(input);
  assert.deepEqual(valid.authors, ["First Author", "Second Author"]);
  assert.equal(publicationInputSchema.safeParse({ ...input, externalUrl: "http://example.com" }).success, false);
  assert.equal(
    publicationInputSchema.safeParse({
      ...input,
      title: "A Publication https://example.com",
    }).success,
    false,
  );
  assert.equal(
    publicationInputSchema.safeParse({
      ...input,
      doi: "https://doi.org/10.1000/example",
    }).success,
    false,
  );
  assert.equal(
    publicationInputSchema.safeParse({
      ...input,
      coverImage: "https://m0xcz6d4a4.ufs.sh/f/cover-image",
      coverRightsNote: "",
    }).success,
    false,
  );
  assert.equal(
    publicationInputSchema.safeParse({
      ...input,
      coverImage: "https://m0xcz6d4a4.ufs.sh/f/cover-image",
      coverRightsNote: "Official cover approved for the publication card.",
    }).success,
    true,
  );
  assert.equal(
    publicationInputSchema.safeParse({
      ...input,
      coverImage: "https://example.com/unapproved-cover.jpg",
      coverRightsNote: "Unknown external image.",
    }).success,
    false,
  );
});

test("publication URL extraction keeps the full HTTPS target and trims citation punctuation", () => {
  assert.equal(
    extractFirstHttpsUrl(
      "Citation, https://example.com/articles/a-long-publication-path/?ref=cv.",
    ),
    "https://example.com/articles/a-long-publication-path/?ref=cv",
  );
  assert.equal(extractFirstHttpsUrl("Citation, http://example.com/insecure"), undefined);
  assert.equal(extractFirstHttpsUrl("Citation without a link"), undefined);
});

test("publication link normalization recognizes bare DOI and upgrades legacy HTTP URLs", () => {
  assert.equal(
    extractDoi("Journal article. DOI: 10.1017/jea.2023.1."),
    "10.1017/jea.2023.1",
  );
  assert.equal(
    extractFirstPublicationUrl("Available at http://example.com/publication."),
    "https://example.com/publication",
  );
});

test("canonical publication seed produces linked records only", () => {
  const publications = buildPublicationSeed(sourceData.records);

  assert.equal(publications.length, 82);
  assert.equal(publications.every((publication) => publication.externalUrl.startsWith("https://")), true);
  assert.equal(
    new Set(publications.map((publication) => publication.sourceFingerprint)).size,
    publications.length,
  );
});

test("approved book covers map once to canonical CV book records", () => {
  const fingerprints = publicationCoverSources.map(
    (cover) => cover.fingerprint,
  );
  const canonicalBooks = sourceData.records.filter(
    (candidate) =>
      candidate.sourceName === "CV March 2026" &&
      candidate.rawPayload.suggestedType === "BOOK",
  );

  assert.equal(publicationCoverSources.length, 12);
  assert.equal(new Set(fingerprints).size, publicationCoverSources.length);
  assert.equal(
    publicationCoverSources.every((cover) =>
      canonicalBooks.some(
        (candidate) => candidate.fingerprint === cover.fingerprint,
      ),
    ),
    true,
  );

  const coverUrls = Object.fromEntries(
    publicationCoverSources.map((cover) => [
      cover.fingerprint,
      `https://m0xcz6d4a4.ufs.sh/f/${cover.fingerprint}`,
    ]),
  );
  const publications = buildPublicationSeed(sourceData.records, coverUrls);

  assert.equal(
    publications.filter((publication) => publication.coverImage).length,
    publicationCoverSources.length,
  );
  assert.equal(
    publications.every(
      (publication) =>
        publication.coverImage ===
        (coverUrls[publication.sourceFingerprint] ?? null),
    ),
    true,
  );
});

test("homepage supports ordered book curation with safe latest-book fallback", () => {
  const selection = getHomepagePublicationSelection();

  assert.deepEqual(
    selection.books.map((publication) => publication.year),
    ["2025", "2023", "2022"],
  );
  assert.equal(selection.books.length, 3);
  assert.equal(
    selection.books.every(
      (publication) =>
        publication.typeKey === "book" &&
        publication.image?.url.startsWith("https://m0xcz6d4a4.ufs.sh/f/"),
    ),
    true,
  );
  assert.equal(selection.nonBooks.length, 3);
  assert.equal(
    selection.nonBooks.every(
      (publication) => publication.typeKey !== "book",
    ),
    true,
  );

  const databaseBooks = featuredBooks.map((publication, index) => ({
    ...publication,
    id: `database-book-${index}`,
  }));
  assert.deepEqual(
    getHomepagePublicationSelection(databaseBooks).books.map(
      (publication) => publication.id,
    ),
    ["database-book-0", "database-book-1", "database-book-2"],
  );

  const editorialBookOrder = [2, 3, 1];
  const selectedBooks = databaseBooks.map((publication, index) => ({
    ...publication,
    homepageOrder: editorialBookOrder[index],
  }));
  assert.deepEqual(
    getHomepagePublicationSelection(selectedBooks).books.map(
      (publication) => publication.id,
    ),
    ["database-book-2", "database-book-0", "database-book-1"],
  );
});

test("publication search includes structured contributors, publisher, DOI, and grouped type", () => {
  const publication = {
    ...featuredBooks[0],
    containerTitle: "Academic Series",
    doi: "10.1000/structured",
  };
  const searchable = publicationSearchText(publication);
  assert.match(searchable, /Maria Monica Wihardja/);
  assert.match(searchable, /ISEAS/);
  assert.match(searchable, /10\.1000\/structured/);
  assert.equal(publicationGroupKey(publication), "book");
});

test("public publication loader never reads the internal raw citation", () => {
  const loaderSource = readFileSync(
    new URL("../src/lib/content/publications.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(loaderSource, /\brawCitation\b/);
  assert.match(loaderSource, /canonicalPublicationByFingerprint/);
  assert.match(loaderSource, /title:\s*migrationValue\.title/);
  assert.match(loaderSource, /approvedCoverRightsByFingerprint/);
  assert.doesNotMatch(loaderSource, /authors:\s*\{\s*isEmpty:/);
  assert.match(loaderSource, /\["published-publications-v3"\]/);
});

test("only super admin can manage users while every editorial role can sign in", () => {
  assert.equal(canAccessAdmin("SUPER_ADMIN"), true);
  assert.equal(canAccessAdmin("ADMIN"), true);
  assert.equal(canAccessAdmin("EDITOR"), true);
  assert.equal(canManageUsers("SUPER_ADMIN"), true);
  assert.equal(canManageUsers("ADMIN"), false);
  assert.equal(canManageUsers("EDITOR"), false);
  assert.equal(canPermanentlyDelete("SUPER_ADMIN"), true);
  assert.equal(canPermanentlyDelete("ADMIN"), true);
  assert.equal(canPermanentlyDelete("EDITOR"), false);
});

test("editorial state machine only permits approved transitions", () => {
  assert.equal(canTransitionEditorialStatus("DRAFT", "publish"), true);
  assert.equal(canTransitionEditorialStatus("PUBLISHED", "publish"), true);
  assert.equal(canTransitionEditorialStatus("PUBLISHED", "unpublish"), true);
  assert.equal(canTransitionEditorialStatus("ARCHIVED", "restore"), true);
  assert.equal(canTransitionEditorialStatus("ARCHIVED", "publish"), false);
  assert.equal(canTransitionEditorialStatus("DRAFT", "restore"), false);
});

test("agenda snapshots convert dates to JSON-safe ISO strings", () => {
  const startsAt = new Date("2026-08-03T02:00:00.000Z");
  assert.deepEqual(toJsonSnapshot({ startsAt }), {
    startsAt: "2026-08-03T02:00:00.000Z",
  });
});

test("editorial schema contains snapshots, revisions, redirects, and homepage selection", () => {
  const schema = readFileSync(
    new URL("../prisma/schema.prisma", import.meta.url),
    "utf8",
  );
  assert.match(schema, /model HomepageContent/);
  assert.match(schema, /model ContentRevision/);
  assert.match(schema, /model SlugRedirect/);
  assert.match(schema, /homepageOrder\s+Int\?/);
  assert.match(schema, /publishedSnapshot\s+Json\?/);
});

test("new users require a normalized username and a confirmed strong password", () => {
  const valid = createAdminUserSchema.parse({
    name: "Editor Satu",
    username: "Editor.Satu",
    password: "password-panjang-2026",
    passwordConfirmation: "password-panjang-2026",
    role: "EDITOR",
  });
  assert.equal(valid.username, "editor.satu");
  assert.equal(
    createAdminUserSchema.safeParse({
      ...valid,
      password: "pendek",
      passwordConfirmation: "pendek",
    }).success,
    false,
  );
  assert.equal(
    createAdminUserSchema.safeParse({
      ...valid,
      passwordConfirmation: "password-yang-berbeda",
    }).success,
    false,
  );
});

test("self-service account changes cannot carry a role or another user id", () => {
  const parsed = updateOwnAccountSchema.parse({
    username: "akun.sendiri",
    currentPassword: "password-lama",
    newPassword: "",
    passwordConfirmation: "",
    role: "SUPER_ADMIN",
    userId: "pengguna-lain",
  });
  assert.deepEqual(Object.keys(parsed).sort(), [
    "currentPassword",
    "newPassword",
    "passwordConfirmation",
    "username",
  ]);
});

test("public route map exposes the redesigned bilingual information architecture", () => {
  assert.equal(getRoutePath("id", "about"), "/id/profil");
  assert.equal(getRoutePath("en", "about"), "/en/about");
  assert.equal(getRoutePath("id", "research"), "/id/riset");
  assert.equal(getRoutePath("en", "research"), "/en/research");
  assert.equal(
    getRoutePath("id", "outreach"),
    "/id/outreach-dan-kiprah",
  );
  assert.equal(
    getRoutePath("en", "outreach"),
    "/en/outreach-and-engagement",
  );
  assert.equal(getRoutePath("id", "contact"), "/id/kontak");
  assert.equal(getRoutePath("en", "contact"), "/en/contact");
});

test("public engagement labels use Kiprah in Indonesian and Outreach in English", () => {
  const id = getDictionary("id");
  const en = getDictionary("en");

  assert.equal(id.navigation.find((item) => item.route === "outreach")?.label, "Kiprah");
  assert.equal(id.home.outreach.title, "Kiprah");
  assert.equal(id.outreachPage.title, "Kiprah");

  assert.equal(en.navigation.find((item) => item.route === "outreach")?.label, "Outreach");
  assert.equal(en.home.outreach.title, "Outreach");
  assert.equal(en.outreachPage.title, "Outreach");
});

test("public navigation prioritizes Publications and About omits publication sections", () => {
  const id = getDictionary("id");
  const en = getDictionary("en");

  assert.deepEqual(
    id.navigation.map((item) => item.route),
    ["home", "about", "publications", "research", "outreach", "contact"],
  );
  assert.deepEqual(
    en.navigation.map((item) => item.route),
    ["home", "about", "publications", "research", "outreach", "contact"],
  );
  assert.deepEqual(
    id.about.contents.map((item) => item.href),
    ["#biografi", "#peran", "#pendidikan", "#karier", "#penghargaan"],
  );
  assert.deepEqual(
    en.about.contents.map((item) => item.href),
    ["#biography", "#roles", "#education", "#career", "#honours"],
  );
  assert.equal(aboutProfile.id.career[0]?.title, "Guru Besar bidang Ilmu Politik");
  assert.equal(aboutProfile.en.career[0]?.title, "Full Professor of Political Science");
});

test("admin navigation places agenda inside Kiprah and Outreach", () => {
  assert.equal(getAdminCopy("id").workspace.agenda, "Kiprah · Agenda");
  assert.equal(getAdminCopy("en").workspace.agenda, "Outreach · Agenda");
});

test("homepage admin uses a dedicated section map and automatic-source controls", () => {
  const managerSource = readFileSync(
    new URL(
      "../src/components/admin/homepage-management.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const editorSource = readFileSync(
    new URL("../src/components/admin/homepage-editor.tsx", import.meta.url),
    "utf8",
  );
  const selectionSource = readFileSync(
    new URL(
      "../src/components/admin/homepage-publication-selection.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const actionSource = readFileSync(
    new URL(
      "../src/app/[locale]/admin/(workspace)/editor-actions.ts",
      import.meta.url,
    ),
    "utf8",
  );

  for (const anchor of [
    "identitas",
    "profil",
    "publikasi",
    "riset",
    "kiprah",
    "penutup",
  ]) {
    assert.match(managerSource, new RegExp(`anchor: "${anchor}"`));
    assert.match(editorSource, new RegExp(`id="${anchor}"`));
  }
  assert.match(managerSource, /Konten yang tampil/);
  assert.match(managerSource, /HomepagePublicationSelection/);
  assert.match(selectionSource, /Tiga buku pilihan/);
  assert.match(selectionSource, /setHomepageBooksAction/);
  assert.match(actionSource, /updateTag\("content:publication"\)/);
  assert.match(editorSource, /English · opsional/);
});

test("homepage section titles stay direct and descriptive", () => {
  const id = getDictionary("id");
  const en = getDictionary("en");

  assert.equal(id.researchPage.ledgerTitle, "Riset");
  assert.equal(en.researchPage.ledgerTitle, "Research");
  assert.equal(id.home.publications.title, "Publikasi");
  assert.equal(en.home.publications.title, "Publications");
  assert.equal(id.home.closing.title, "Profil dan Kontak");
  assert.equal(en.home.closing.title, "Profile and Contact");
});

test("locale switching maps canonical and legacy profile paths", () => {
  assert.equal(switchLocalePath("/id/riset", "en"), "/en/research");
  assert.equal(
    switchLocalePath("/en/outreach-and-engagement", "id"),
    "/id/outreach-dan-kiprah",
  );
  assert.equal(switchLocalePath("/id/tentang", "en"), "/en/about");
});

test("agenda partitions upcoming and completed records and formats WIB", () => {
  const items = [
    {
      id: "future",
      title: "Future",
      description: "Future agenda",
      startsAt: new Date("2026-08-01T03:00:00.000Z"),
    },
    {
      id: "past-later",
      title: "Past later",
      description: "Past agenda",
      startsAt: new Date("2026-07-10T03:00:00.000Z"),
    },
    {
      id: "past-earlier",
      title: "Past earlier",
      description: "Past agenda",
      startsAt: new Date("2026-07-01T03:00:00.000Z"),
    },
  ];
  const result = partitionAgenda(items, new Date("2026-07-24T00:00:00.000Z"));

  assert.deepEqual(result.upcoming.map((item) => item.id), ["future"]);
  assert.deepEqual(result.completed.map((item) => item.id), [
    "past-later",
    "past-earlier",
  ]);
  assert.match(formatAgendaDate(items[0].startsAt, "id"), /10\.00/);
});
