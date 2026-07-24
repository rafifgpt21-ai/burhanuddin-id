import assert from "node:assert/strict";
import test from "node:test";

import reviewData from "../prisma/review-data/import-candidates.json";
import { buildPublicationSeed } from "../prisma/seed-data/build-publications";
import {
  agendaInputSchema,
  materialInputSchema,
  postInputSchema,
  publicationInputSchema,
} from "../src/lib/validation/content";
import {
  extractDoi,
  extractFirstHttpsUrl,
  extractFirstPublicationUrl,
} from "../src/lib/content/publication-url";
import { canAccessAdmin, canManageUsers } from "../src/lib/auth/access";
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

test("review seed is complete, unique, and leaves materials and agenda empty", () => {
  assert.equal(reviewData.sourceCounts.cv, 81);
  assert.equal(reviewData.sourceCounts.researchGate, 82);
  assert.equal(reviewData.sourceCounts.academia, 12);
  assert.equal(reviewData.sourceCounts.professorialAddress, 1);
  assert.equal(reviewData.sourceCounts.studyMaterials, 0);
  assert.equal(reviewData.sourceCounts.agenda, 0);
  assert.equal(reviewData.candidates.length, 176);
  assert.equal(new Set(reviewData.candidates.map((item) => item.fingerprint)).size, 176);
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
    venue: "Publisher", doi: "", externalUrl: "https://example.com/publication", status: "PUBLISHED",
    sourceName: "CV March 2026", sourceUrl: "", sourceNote: "Source wording retained for review.",
  } as const;
  const valid = publicationInputSchema.parse(input);
  assert.deepEqual(valid.authors, ["First Author", "Second Author"]);
  assert.equal(publicationInputSchema.safeParse({ ...input, externalUrl: "http://example.com" }).success, false);
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

test("canonical publication seed resets to linked records only", () => {
  const publications = buildPublicationSeed(reviewData.candidates);

  assert.equal(publications.length, 82);
  assert.equal(publications.every((publication) => publication.externalUrl.startsWith("https://")), true);
  assert.equal(
    new Set(publications.map((publication) => publication.sourceFingerprint)).size,
    publications.length,
  );
});

test("only super admin can manage users while every editorial role can sign in", () => {
  assert.equal(canAccessAdmin("SUPER_ADMIN"), true);
  assert.equal(canAccessAdmin("ADMIN"), true);
  assert.equal(canAccessAdmin("EDITOR"), true);
  assert.equal(canManageUsers("SUPER_ADMIN"), true);
  assert.equal(canManageUsers("ADMIN"), false);
  assert.equal(canManageUsers("EDITOR"), false);
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
