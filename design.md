# Burhanuddin Muhtadi Website Design and Delivery Plan

## Document status

- Implementation began on 20 July 2026 with the Phase 1 technical foundation.
- On 20 July 2026, the owner approved a blue-first visual identity, supplied an approved portrait URL for the site, and added a lightweight agenda publishing feature modeled on the reference project's agenda posts.
- On 20 July 2026, the owner expanded the site to Indonesian and English, with country-level automatic language selection and a persistent manual language switcher.
- On 20 July 2026, the owner asked that the study-material collection remain empty until real course files and metadata are supplied. The initial seed therefore covers canonical publication sources only.
- On 20 July 2026, the owner authorized the initial private admin workspace and publication seed pipeline. Login, server authorization, and editor forms may be implemented now, but database writes and uploads remain locked behind `DATABASE_READY` until the exposed MongoDB credential is rotated.
- On 20 July 2026, the owner selected database-backed admin credentials and sessions. Credential hashes and revocable session records live in MongoDB; `.env` retains infrastructure connection values only.
- On 23 July 2026, the owner expanded the private admin workspace to multiple named users. Login uses a unique username and password; `SUPER_ADMIN` alone manages other accounts, while every signed-in user may change only their own username and password after confirming the current password.
- On 23 July 2026, the owner authorized an expanded About page using the Indonesian Wikipedia biography as an attributed discovery source. The page retains Wikipedia's education, early career, and honours while time-sensitive appointments are reconciled against the March 2026 CV and official institutional sources.
- On 23 July 2026, the owner simplified the homepage by removing the course-material collection card, the teaching-archive preview, and the writing/agenda empty-state section. Course materials remain available through the hero action and footer.
- On 24 July 2026, the owner approved a total public-layout redesign that makes the academic and public-intellectual profile the homepage priority. The canonical public navigation now contains Home, About, Research, Publications, Outreach, and Contact. Course materials and writing remain available as secondary routes, while Agenda is presented inside Outreach.
- On 24 July 2026, the owner simplified the public label for the engagement area to **Kiprah** in Indonesian and **Outreach** in English. Existing localized route segments remain unchanged for compatibility.
- On 24 July 2026, the owner approved a mobile-wide public-layout pass. At 840px and below the header uses the `BM` mark, language switcher, and Menu only; editor access moves into the mobile menu. At 720px and below all public page templates use a dedicated compact type and spacing scale rather than inheriting the desktop composition.
- On 24 July 2026, the owner aligned the private editorial workspace with the redesigned public information architecture. Publications lead the managed collections, Agenda is identified as content for Kiprah / Outreach, Writing and Materials remain secondary, and About, Research, and Contact are identified as curated application content outside the current editor forms.
- On 24 July 2026, the owner approved an optional UploadThing-hosted image for publication cards. A publication remains typographic when no image is supplied, and every uploaded image requires a source/rights note before its draft can be saved.
- On 24 July 2026, the owner supplied twelve approved book-cover files and authorized their UploadThing upload and association with the matching canonical book records. The forthcoming 2026 book remains without a cover until an approved asset is supplied.
- On 24 July 2026, the owner redesigned the homepage publication section to show the three most recent books with approved covers followed directly by three selected non-book works. Only the book group retains a visible label; the non-book group is identified by its card metadata without an extra heading or item count. Database records are preferred when three eligible covered books are available; the approved featured-book dataset is the fallback while database access is unavailable.
- On 24 July 2026, the owner removed the `Needs Review` status and source-candidate queue from the product. The private editor works directly with canonical publication records; the static source extraction remains an internal, reproducible seed input and is never exposed as an application workflow.
- On 25 July 2026, the owner approved a compact mobile-homepage pass. At 720px and below the academic name, lead, profile action, and portrait form a one-screen hero from 375x812 upward; the desktop role strip is omitted and the portrait expands to a larger 4:3 field. Research, publications, outreach, and the closing action use a denser homepage-only rhythm without shortening approved copy or changing data order.
- On 25 July 2026, the owner supplied and approved Burhanuddin Muhtadi's Google Scholar profile URL. It appears as a secondary academic-profile link in the homepage closing action, the Contact channel directory, and the shared footer profile list.
- On 25 July 2026, the owner approved a complete publication-system redesign. All 81 CV records use reviewed structured bibliographic fields; raw citations remain internal audit evidence and never become public titles. The public index uses grouped horizontal dossier cards with a permanent 4:5 image or bibliographic-placeholder column, while publication media references `MediaAsset`.
- On 25 July 2026, the owner approved a nearly full-viewport homepage identity section before the editorial hero. It uses the owner-supplied UploadThing `BM` logo, localized official-site copy, and the tagline `Mengawal Kekuasaan. Menjaga Kewarasan.` without search or action controls.
- On 25 July 2026, the owner added a restrained folio rail to the identity section. Desktop shows the approved research-field summary and a localized anchor to the academic hero; mobile retains only the anchor so the logo remains dominant.
- On 25 July 2026, the owner removed the logo and `Burhanuddin Muhtadi` wordmark from the public header and centered the six-link desktop navigation. Language and editor controls remain separate on the right; mobile retains the language switcher and menu without a brand mark.
- On 25 July 2026, the owner removed publication and source-list sections from the About page because the canonical record belongs on Publications. The public navigation now places Publications before Research, and the 2023 career title begins directly with `Guru Besar bidang Ilmu Politik`.
- On 25 July 2026, the owner left-aligned the homepage identity composition and added the approved Indonesian public-opinion quotation to the right of the logo and tagline. The quote moves below the identity block on narrow screens and remains in Indonesian on both locale variants until an English translation receives editorial approval.
- On 25 July 2026, the owner replaced the homepage editorial-hero thesis with an academic name lockup: `Profesor / Professor` above, `Burhanuddin Muhtadi` as the primary display line, and `M.A., Ph.D.` below.
- On 25 July 2026, the owner changed the About biography opening from oversized display copy into the first paragraph of the regular biography reading flow.
- On 25 July 2026, the owner removed the dated dossier/review folio from the About page hero.
- On 25 July 2026, the owner removed the Research and Publications buttons from the homepage editorial hero and replaced them with a single shortcut to the full Profile/About page.
- On 25 July 2026, the owner required both the homepage official-site label and editorial-hero name lockup to spell out `Profesor / Professor` rather than abbreviating it as `Prof.`.
- On 25 July 2026, the owner removed the secondary hero folios from the About, Publications, Research, Outreach, and Contact pages.
- On 20 July 2026, the owner required every public publication record to have an outbound source. The seed upserts the canonical CV set without deleting manually authored records, prefers DOI URLs, then publisher or institutional-repository records, and uses an official project page for forthcoming work without a dedicated landing page.
- The approved foundation is Next.js App Router, TypeScript, Tailwind CSS, MongoDB through Prisma, and UploadThing for uploads.
- Prisma is pinned to the latest MongoDB-compatible 6.19 release until Prisma 7 adds MongoDB support.
- UploadThing routes remain closed until private admin authentication and server authorization are implemented.
- Prepared from the contents of `.material` and a selective review of `.reference-project/brh-co-id-master`.
- The website subject is **Prof. Burhanuddin Muhtadi, M.A., Ph.D.**
- The reference project is for a different person, Budi Rahman Hakim. It is a UX and architecture reference only; none of its biography, research themes, books, quotations, images, or branding may be reused as Burhanuddin Muhtadi content.

## Product summary

Build a calm, fast, mobile-friendly academic website that presents Prof. Burhanuddin Muhtadi's research, publication record, and verified public engagement as its primary public experience. The site also lets editors publish posts, agendas, and study materials without developer help.

The homepage editorial hero has one direct action: open the full Profile/About page. Research and Publications remain prominent through the global navigation and their dedicated homepage sections.

Student materials remain available through Kiprah / Outreach and the footer, but do not compete with the public profile in the homepage hero. The product should feel like a working academic dossier, not a corporate brochure, news portal, or complex social network.

## Source inventory and authority

### Authoritative content

- `.material/Burhanuddin Muhtadi CV_March_2026.docx`
  - Primary source for name, titles, employment, education, awards, publications, research outputs, and invited talks.
  - The source date, March 2026, should be retained internally so time-sensitive profile claims can be reviewed later.
- `.material/more-material.md`
  - Contains links to ResearchGate research/publication pages, Academia.edu books, and an Indikator-hosted PDF.
  - Treat these as outbound references and possible metadata-verification sources, not permission to copy or republish third-party files.
- `source-research.md`
  - Contains the 19 July 2026 browser audit of every URL in `more-material.md`, including the 82-record ResearchGate index, the 12-record Academia Books-tab index, and a structured extraction of the 88-page professorial address.
  - This is a discovery and reconciliation source. The March 2026 CV remains primary for current roles and canonical chronology until the owner approves discrepancies.

### Sensitive material

- `.material/environment.txt` contains live-looking database credentials.
  - Rotate the exposed password before implementation or deployment.
  - Never copy the current value into source code, documentation, logs, screenshots, fixtures, or client-side environment variables.
  - Keep runtime secrets in an ignored local environment file and in the hosting platform's encrypted secret store.

### Reference implementation

`.reference-project/brh-co-id-master` demonstrates useful patterns:

- Next.js App Router with TypeScript and Tailwind CSS.
- MongoDB through Prisma.
- Draft/published content, admin authentication, block-based posts, media upload, search, SEO, and selected localized-routing patterns. Subject-specific copy and locale behavior must still be implemented independently.
- A warm editorial palette, compact fixed navigation, publication cards, and mobile layouts.

Use those patterns selectively. Do not copy the project wholesale. The new site needs fewer dependencies, fewer content types, less motion, no public account system, a direct public research path, and a clear secondary student workflow.

## Facts the initial site can safely derive from the CV

- Professor of Political Science at the Faculty of Political and Social Sciences, Syarif Hidayatullah State Islamic University, Jakarta (2010-present in the March 2026 CV).
- Founder and Executive Director of Indikator Politik Indonesia (2013-present in the CV).
- Visiting Senior Research Fellow at ISEAS - Yusof Ishak Institute (2021-present in the CV).
- Ph.D. in Political Science and M.A. in Asian Studies from the Australian National University; B.A. in Theology/Quranic Exegesis from Syarif Hidayatullah State Islamic University.
- Core subject areas evident from the publication record: Indonesian elections, vote buying and clientelism, democracy and democratic decline, political behavior and public opinion, political Islam, polarization, inequality, misinformation, and identity politics.
- The CV contains books, refereed journal articles, book chapters, additional research outputs, honours, and invited talks through 2026.

All dates, titles, author order, DOI values, and `forthcoming` labels should be imported exactly and then reviewed by the owner. Do not silently repair apparent inconsistencies in the CV.

## Audience and primary jobs

### Primary: researchers, journalists, institutional peers, and the public

- Understand the subject's research agenda and current academic roles.
- Browse or search the publication record.
- Follow DOI, publisher, institutional, ResearchGate, or Academia.edu links.
- Find verified institutional and academic-profile channels.
- Distinguish current appointments from historical roles and external organisations.

### Secondary: students

- Find a file by course, topic, type, or semester.
- Understand what a resource is before opening it.
- Open or download an approved file with minimal friction.
- Read related posts or references from the lecturer.
- Use the site comfortably on a phone and on limited bandwidth.

### Tertiary: lecturer/editor

- Create, edit, preview, publish, unpublish, and archive posts.
- Upload study files and maintain their course metadata.
- Add an external resource without uploading a file.
- Correct publication metadata without editing code.

## MVP goals

- Make the research agenda, public profile, and publication record the most prominent public paths.
- Keep study materials easy to reach from Kiprah / Outreach and the footer without placing them in the primary navigation.
- Provide a simple post publishing workflow.
- Publish a concise, CV-derived profile.
- Publish a searchable/filterable publication index.
- Support private, named editorial accounts with server-enforced role boundaries.
- Deliver strong mobile usability, accessibility, search discoverability, and safe file handling.

## Explicit non-goals for the MVP

- No chatbot, AI assistant, vector search, embeddings, indexing pipeline, or RAG system.
- No student accounts, comments, likes, messaging, or social feed.
- No public registration or public account directory. User management remains private and restricted to `SUPER_ADMIN`.
- No event registration, ticketing, attendance tracking, calendar synchronization, or venue-discovery system. The MVP agenda is a lightweight editor-managed public listing only; no agenda entry may be published until real event data is supplied and reviewed.
- No machine-generated translation at request time and no automatic translation publishing. Indonesian and English UI/content variants are editor-reviewed. Bibliographic titles remain in their original published language unless the publication itself supplies an official translated title.
- No heavy animation library or custom smooth-scrolling behavior.
- No custom DRM or pseudo-secure PDF viewer. Use normal browser viewing/download rules and honest access controls.
- No automatic scraping of ResearchGate, Academia.edu, publishers, or Google Scholar.

## Information architecture

### Public navigation

The top bar contains six public destinations:

1. **Beranda / Home** (`/id`, `/en`)
2. **Profil / About** (`/id/profil`, `/en/about`)
3. **Publikasi / Publications** (`/id/publikasi`, `/en/publications`)
4. **Riset / Research** (`/id/riset`, `/en/research`)
5. **Kiprah / Outreach** (`/id/outreach-dan-kiprah`, `/en/outreach-and-engagement`)
6. **Kontak / Contact** (`/id/kontak`, `/en/contact`)

**Materi Kuliah / Course Materials** (`/id/materi`, `/en/materials`) is linked from the
Kiprah / Outreach page and the footer instead of the top bar. **Tulisan / Writing**
is linked from the footer but not the primary navigation; its existing route and editorial
records remain intact.

Legacy `/id/tentang` permanently redirects to `/id/profil`. Legacy `/id/agenda` and
`/en/agenda` permanently redirect to the `#agenda` section of the localized Kiprah /
Outreach page.

Unprefixed routes, including `/`, select a locale before redirecting. A valid manual preference cookie wins; otherwise country-level hosting headers select Indonesian for Indonesia and English elsewhere, then the browser language is used as fallback. Do not request precise device location or retain country data. Admin access is localized at `/id/admin/login` and `/en/admin/login`, but should not compete with public navigation. Put a discreet link in the footer.

### Route plan

| Route | Purpose |
| --- | --- |
| `/id`, `/en` | Public-intellectual overview with direct paths to research and publications. |
| `/id/profil`, `/en/about` | Biography, current roles, education, selected awards, expertise, and approved CV download. |
| `/id/riset`, `/en/research` | Four CV-derived research clusters with related scholarly work. |
| `/id/materi`, `/en/materials` | Searchable and filterable teaching-material library. |
| `/id/materi/[slug]`, `/en/materials/[slug]` | Material summary, course metadata, file/link action, and related resources. |
| `/id/tulisan`, `/en/writing` | Reverse-chronological post index with topic filters. |
| `/id/tulisan/[slug]`, `/en/writing/[slug]` | Accessible long-form reading page. |
| `/id/outreach-dan-kiprah`, `/en/outreach-and-engagement` | Verified public agenda, selected academic forums, and secondary teaching access. |
| `/id/publikasi`, `/en/publications` | CV-derived bibliography grouped by type and year. |
| `/id/kontak`, `/en/contact` | Verified institutional and academic-profile channels without a public contact form. |
| `/id/admin/login`, `/en/admin/login` | Private editor sign-in. |
| `/[locale]/admin` | Content overview and draft/published status. |
| `/[locale]/admin/account` | Self-service username and password settings for the signed-in user. |
| `/[locale]/admin/users` | Private user management, available only to `SUPER_ADMIN`. |
| `/[locale]/admin/materi/...` | Create and edit study materials. |
| `/[locale]/admin/tulisan/...` | Create and edit posts. |
| `/[locale]/admin/agenda/...` | Create and edit lightweight agenda entries. |
| `/[locale]/admin/publikasi/...` | Correct or add publication metadata. |

Do not add a separate global search page initially. A header search action may open a small search interface that searches materials, posts, and publications and links to their existing indexes.

## Page design

### Header

- Do not show a logo or `Burhanuddin Muhtadi` wordmark in the public header.
- Center the six public links as one navigation group. Keep the visible `ID / EN` language switcher and editor access separate on the right, and let the mobile menu take over before the links become crowded.
- Keep course-material access in the footer and do not place a material search control in the top bar.
- The language switcher changes to the equivalent localized route, preserves active filters, and stores a manual preference for one year. It must remain keyboard operable and understandable without flags or color alone.
- Sticky only if it remains visually quiet and does not obscure anchors or reading content.
- No visible `Sign in` call to action in the primary header.
- Above 840px, admin access uses a discreet icon-only control in the top bar with an accessible text label. At 840px and below, the top bar contains only `ID / EN` and Menu; a labeled editor-access link appears as the secondary final item inside the menu.

### Homepage

The first viewport is a quiet identity title page rather than a portrait splash or generic credibility block. It leads directly into the academic name lockup, profile summary, and current roles.

1. **Identity title page**
   - Nearly fills the viewport below the sticky header. The localized official-site label names `Profesor Burhanuddin Muhtadi, M.A., Ph.D.` / `Professor Burhanuddin Muhtadi, M.A., Ph.D.` in one clear line; it, the approved UploadThing `BM` logo, and tagline form a left-aligned identity block while the quotation occupies a quieter column to its right.
   - Indonesian tagline: `Mengawal Kekuasaan. Menjaga Kewarasan.` English tagline: `Watching Power. Safeguarding Sanity`.
   - The approved quotation appears in Indonesian on both locale variants until its English translation is editorially reviewed. At 720px and below it moves beneath the identity block.
   - A bottom folio rail shows `Ilmu politik · demokrasi · opini publik / Political science · democracy · public opinion` and a localized anchor to the academic hero. At 720px and below, omit the field summary and center the anchor.
   - Use the cool-paper, navy, blue-rule, and restrained-gold design system. The folio anchor is the only action; do not add search, portraiture, or decorative motion.
2. **Editorial hero**
   - Approved portrait on the left and an academic name lockup on the right at desktop widths; copy precedes the portrait on mobile.
   - The name lockup uses `Profesor / Professor` above, `Burhanuddin Muhtadi` as the primary display line, and `M.A., Ph.D.` below in smaller type.
   - Sole action: `Lihat profil lengkap / View full profile`.
   - Three current roles appear as source-backed text without affiliation logos on tablet and desktop. At 720px and below the role strip is omitted; the same information remains available on the full Profile page.
3. **Research ledger**
   - Four research clusters connect voting behaviour and vote buying, democratic decline and populism, political Islam, and electoral surveys/public opinion to related approved work.
   - A blue editorial spine is the signature structural device; it encodes the relationship between themes and evidence rather than serving as decoration.
4. **Selected publications**
   - Two static groups with no carousel: the three most recent books that have approved covers, followed directly by three selected non-book works. Do not show a visible `Karya non-buku / Non-book work` heading or `03` count above the second group.
   - Book covers lead the first group; non-book records remain typographic so the difference in publication format is explicit.
   - Cover art is omitted unless an approved, rights-cleared asset exists.
5. **Kiprah / Outreach preview**
   - Verified agenda state and selected academic forums in a two-column layout.
   - Course materials appear as a quiet secondary link.
6. **Closing action**
   - Direct paths to Contact and the full About profile.
   - Section headings use direct content labels—`Riset / Research`, `Publikasi / Publications`, `Kiprah / Outreach`, and `Profil dan Kontak / Profile and Contact`—while supporting descriptions carry the editorial context.

### Study-material library

- The search field and filters must appear before the list.
- Filters: course, topic, resource type, and academic year/semester.
- Useful resource types: slide, reading, syllabus, assignment, dataset, video, link, and other.
- Default sort: pinned first, then most recently updated.
- Every card should show enough metadata to distinguish similarly named files.
- Provide an informative empty state and a one-click `Reset filter` action.
- Preserve filter state in the URL so students can share a filtered view.

### Study-material detail

- Title, short description, course, topic, semester/academic year, resource type, and last-updated date.
- Primary action is either `Buka materi`, `Unduh`, or `Kunjungi sumber`; never show an action that cannot succeed.
- Optional inline PDF preview only if it is performant and accessible. Always keep a normal open/download fallback.
- Related materials and related posts should be based on explicit topic/course tags.
- Display an attribution or rights note when supplied.

### Posts index and post page

- Index: reverse chronological, search, topic filter, featured item only when manually pinned.
- Article page: 68-72 character reading measure, visible publication/update dates, heading hierarchy, footnote/link treatment, share/copy-link action, and related content.
- Support a deliberately small set of editor blocks: rich text, heading, image, file attachment, embedded video, quote, and external link.
- Sanitize rich text on write and render. Never accept arbitrary HTML, scripts, or unsafe iframe sources.

### Agenda

- Treat agenda as its own content type rather than overloading long-form posts.
- Each item has a title, short description, start date/time, optional end date/time, optional plain-text location, optional external registration/source URL, and Draft/Published/Archived state.
- Display all times in WIB (`Asia/Jakarta`) and clearly mark completed events.
- Do not add map search, geocoding, ticketing, attendance, or calendar synchronization in the MVP.

### Publications

- Group into Books, Refereed Journal Articles, Book Chapters, and Additional Research Outputs.
- Within each group, sort newest to oldest.
- Search across title, co-author, venue, year, and topic; filter by type and year.
- Each record can show the original publication title, authors in source order, year, venue/publisher, pages/volume when present, DOI or canonical URL, and publication status such as `forthcoming`.
- Do not host copyrighted publication PDFs unless the owner confirms redistribution rights. External links are the default.
- Selected publications may have cover art only when an approved cover asset is available.
- Never render a raw citation as a title. Present authors, editors, publication container, publisher/place, volume, issue, series number, pages, DOI/domain, and status as separate labeled information.
- Every index card reserves a 4:5 visual column. Use an approved linked media asset when available; otherwise show an editorial placeholder carrying only the already-visible type, year, and status.
- Use a compact outbound action instead of printing a canonical URL as a long text row. At 360-720px the card remains a 104px/remaining-width composition with the action below; below 360px and at constrained zoom it may stack.

### About

- Lead with a compact fact index and a regular-width biography reading flow rather than oversized biography display copy or a pasted full CV.
- Keep the About hero free of a dated dossier/review folio; review dates remain internal editorial context until the owner requests a public freshness marker.
- Present a comprehensive academic dossier: current roles, research interests, education from primary school through doctorate, early organisational and professional history, honours, and selected invited talks.
- Attribute Wikipedia-derived facts and distinguish historical roles from current appointments. Reconcile time-sensitive claims against the March 2026 CV and official UIN/ISEAS sources; do not silently present old roles as current.
- Keep publication records and publication-source links out of About; the canonical Publications index is their sole public collection.
- Offer the public CV only after checking it for private contact details and owner approval.
- State the CV/profile review date near time-sensitive appointments.

### Admin

- One dashboard with counts and recent drafts.
- Separate `Publikasi`, `Agenda`, `Tulisan`, and `Materi` collections, with a shared quick-start chooser on the dashboard. The workspace labels Agenda as part of Kiprah / Outreach and explains that About, Research, and Contact remain outside the current form-based editor.
- Dashboard counts come from the database only when it is explicitly ready; a locked or unavailable database is shown as unavailable rather than as a false zero count.
- Workspace navigation exposes the current page with `aria-current` and includes a direct return to the localized public site.
- Draft creation asks only for the minimum viable content first. Slugs are generated automatically; translations and secondary metadata remain optional while drafting and must pass publication-readiness validation before going public.
- Explicit Draft, Published, and Archived states.
- Preview before publish; confirmation before destructive deletion.
- Slugs generated from titles but editable with collision validation.
- File upload progress, type/size validation, friendly error messages, and the ability to replace a file without breaking the public URL when practical.
- `SUPER_ADMIN` can create `ADMIN` or `EDITOR` accounts and reset another user's username, role, or password. These mutations re-check authorization on the server.
- Every signed-in user can change only their own username and password after confirming the current password; self-service never accepts a role or target-user ID.
- User management is never public and does not expose password values or hashes.

## Content model

The exact database syntax should be decided during implementation. The conceptual model is:

### AdminUser

- `id`, `name`, unique `username`, `passwordHash`, `role`, `createdAt`, `updatedAt`
- Roles are `SUPER_ADMIN`, `ADMIN`, and `EDITOR`. All three can enter the editorial workspace; only `SUPER_ADMIN` can manage other accounts.
- The initial `SUPER_ADMIN` is created by an explicit server-side seed command using process-only environment values. Seed passwords are never committed.

### Post

- `id`, localized `title`, `slug`, `excerpt`, and `content`, plus `coverImage`, `topics[]`
- `status` (`DRAFT`, `PUBLISHED`, `ARCHIVED`)
- `publishedAt`, `createdAt`, `updatedAt`
- Optional canonical external source. Indonesian and English variants share one content identity, status, source note, and canonical relationship; both language variants require editorial review before publication.

### StudyMaterial

- `id`, `title`, `slug`, `description`
- Localize visitor-facing title and description in Indonesian and English while keeping one shared material identity, file target, rights decision, and source metadata.
- `course`, `topic`, `resourceType`
- `semester`, `academicYear`, `tags[]`
- Exactly one primary delivery target: uploaded asset or external URL.
- `fileName`, `fileUrl/storageKey`, `mimeType`, `fileSize`, `externalUrl`
- `downloadAllowed`, `pinned`, `status`, `publishedAt`, `createdAt`, `updatedAt`

### Publication

- `id`, `type`, `title`, `authors[]`, `editors[]`, `year`, optional source-faithful `dateLabel`
- `containerTitle`, `publisher`, `publicationPlace`, `volume`, `issue`, `seriesNumber`, `pages`
- `doi` stored without its resolver prefix, `externalUrl`, `status`
- `abstract` only when supplied or approved; do not invent one.
- Optional `cardImageId` relates to `MediaAsset`; its asset metadata retains a mandatory rights/source note and localized alt text. Legacy `coverImage` remains only during the additive migration.
- `featured`, editorial `contentStatus`, `sourceName`, `sourceUrl`, `sourceCheckedAt`, `alternateUrls[]`, `sourceNote`, `createdAt`, `updatedAt`
- `rawCitation` and `sourceFingerprint` remain internal audit/import fields and are excluded from the public view model.

### AgendaItem

- `id`, `title`, `slug`, `description`
- Localize visitor-facing title and description in Indonesian and English while sharing dates, location, status, and source URL.
- `startsAt`, optional `endsAt`, optional `locationLabel`, optional `externalUrl`
- `status` (`DRAFT`, `PUBLISHED`, `ARCHIVED`), `publishedAt`, `createdAt`, `updatedAt`

### MediaAsset

- `id`, `storageKey`, `url`, `fileName`, `mimeType`, `size`, `altText`, `rightsNote`, `createdAt`
- Store provider keys so assets can be replaced or audited; do not rely only on opaque public URLs.

## Content gaps to resolve before launch

The current `.material` folder contains a rich CV and external research links, but it does **not** contain actual course-material files or the course metadata needed for a useful student library. Before population/launch, obtain:

- Course names and codes.
- Semester and academic-year conventions.
- Initial lecture PDFs/slides/readings/assignments or approved external URLs.
- Short descriptions for each material.
- Download/redistribution permissions.
- Image-rights/credit wording for the owner-supplied portrait URL. The image itself is approved for this implementation.
- Approved short biography in Indonesian.
- Preferred site name, domain, public contact method, and institutional/social links.
- Confirmation of which CV/publications may be downloadable versus linked externally.

The plan may proceed with placeholders in a development environment, but placeholder biography, portrait, contact information, and course data must never ship to production.

## Content ingestion plan

1. Convert the CV into a reviewable structured dataset without changing source wording.
2. Separate publications by the CV's four publication categories.
3. Preserve author order, year, punctuation, DOI/URL, and `forthcoming` state.
4. Flag duplicates and apparent inconsistencies for human review rather than automatically merging or correcting them.
5. Reconcile the live-source findings in `source-research.md`: ResearchGate's 82 platform records include duplicates and mixed publication types; Academia's 12 Books-tab records include chapters/reports; the Indikator link is an 88-page professorial address.
6. Add ResearchGate, Academia.edu, and the supplied Indikator PDF as external profile/resource links after checking their labels and ownership.
7. Have the owner approve the short biography, selected publications, web-only 2026 records, and current-role wording.
8. Ingest teaching files only after each has course metadata and a rights/download decision.

## Visual direction

### Character

- Editorial, academic, trustworthy, and contemporary.
- A blue-first contemporary academic dossier with the clarity of a research notebook, not a generic magazine or institutional brochure.
- Content density should be moderate: easy to scan, but never waste the first viewport.
- Desktop layouts use a wide editorial grid up to roughly 1520px for general content. The homepage hero and its primary collection rail expand nearly edge-to-edge with bounded gutters so the introduction and portrait make full use of wide screens. Tablet and mobile layouts collapse in reading order without losing actions or metadata.
- At 720px and below, use 20-24px side gutters, approximately 44px homepage-section spacing, 40-50px dedicated page-hero titles, and compact accessible actions. The homepage academic name remains the primary display element at approximately 38-43px, followed by a single 48px profile action and a larger 4:3 portrait field with its caption overlaid inside the image. Profile, research ledger, collection filters, outreach, contact channels, and footer navigation must recompose for mobile instead of merely shrinking desktop columns.
- From 375x812 upward, the 64px header and complete homepage hero fit within one viewport. The hero may expand naturally on shorter devices and at 200% zoom; content must never be clipped or made artificially small to satisfy the one-screen target.

### Design tokens to validate during implementation

- Background: cool paper/off-white (`#F5F7FA` range).
- Primary text: deep blue-black ink (`#172235` range).
- Primary: institutional blue (`#1557A0` range), with a darker navy (`#102C4C`) for high-contrast surfaces.
- Secondary neutral: blue-gray for metadata and borders, plus a restrained gold used only as a small editorial marker.
- Headings: an editorial serif or humanist display face, self-hosted through the framework font system.
- Body/UI: a highly legible sans serif, self-hosted.
- Body reading size: at least 16px, with generous line height.
- Corners and shadows: restrained; use borders and whitespace before elevation.
- Signature pattern: a research ledger with a blue spine, bibliographic annotations, and evidence-linked themes.
- Publication signature: a navy bibliographic folio occupies the same 4:5 visual area as a real cover when no rights-cleared image exists, giving the collection a stable research-dossier rhythm without inventing artwork.

Final colors are not approved until WCAG contrast checks pass in real components.

### Reusable patterns

- Compact section eyebrow + clear heading.
- Document card with a small type icon, course label, title, and metadata.
- Publication row optimized for citations rather than marketing cards.
- Topic chips that remain usable with keyboard focus and long Indonesian labels.
- Consistent empty, loading, error, and unavailable-file states.

### Motion

- Use short CSS transitions only for focus, hover, disclosure, and navigation feedback.
- Respect `prefers-reduced-motion`.
- Do not add Lenis, auto-rotating hero content, scroll-jacking, or decorative motion in the MVP.

## Technical approach

Use the reference stack where it reduces risk, while keeping dependencies lean:

- Next.js App Router and TypeScript.
- Tailwind CSS for the design system.
- Server-rendered public pages with targeted client components only for filters, editor interactions, and upload progress.
- Locale-prefixed, server-rendered public routes with small local dictionaries for interface copy. The language switcher is the only client-side locale control.
- MongoDB with Prisma if the supplied database service remains the owner's choice after credentials are rotated. Keep the persistence layer replaceable and do not let database-specific IDs leak into URLs.
- A maintained authentication library for the private admin session.
- Zod or equivalent validation at every write boundary.
- UploadThing is the approved upload provider for files and images. Keep its token server-only, authorize every upload, retain provider storage keys, and apply the file validation and rights rules in this document.
- Prefer plain database-backed search for the expected content volume. Do not add Elasticsearch, embeddings, or an AI search dependency.

Pin exact package versions only during implementation after checking the locally installed framework documentation and compatibility. Do not assume the reference project's beta authentication version is still the best choice.

## Rendering and data-flow principles

- Public collection/detail pages should be server-rendered and cacheable.
- Locale detection runs only on unprefixed requests. Locale-prefixed pages remain independently cacheable and must not vary by IP address or cookie.
- Detection order is manual `bm_locale` preference, country header, browser `Accept-Language`, then Indonesian fallback. Country data is used transiently and is not stored.
- Only published records are available to unauthenticated users.
- Draft preview must require an authenticated, short-lived preview mechanism.
- Mutations run on the server, revalidate affected lists/details, and produce an audit-friendly timestamp.
- Material filters are URL query parameters and are validated before use.
- Downloads should use stable asset identifiers or signed URLs according to the chosen rights model.
- Broken or removed assets must fail with a useful page, not a blank viewer.

## Security and privacy requirements

1. Rotate the exposed database secret before any environment is connected.
2. Add `.material/environment.txt`, all `.env*` secrets, exports, and local database dumps to ignore rules before repository initialization or the first commit.
3. Never expose database, storage, email, or auth secrets through `NEXT_PUBLIC_*` variables.
4. Use strong password hashing, secure/HTTP-only/same-site cookies, CSRF-safe mutations, and login rate limiting.
5. Validate file extension, MIME type, file signature where practical, and size on the server.
6. Allowlist safe embedded-video hosts. Do not build a generic remote URL proxy.
7. Sanitize rich text and restrict iframe attributes.
8. Apply authorization to every admin read/write action, not only to admin page routing.
9. Keep private phone, email, address, student information, and document metadata out of public output unless explicitly approved.
10. Back up content metadata and document an asset-recovery process before launch.

## Accessibility requirements

- Meet WCAG 2.2 AA for color contrast, keyboard access, focus visibility, labels, landmarks, and error identification.
- Maintain a logical single-`h1` heading hierarchy.
- Provide descriptive alt text for meaningful images; decorative images use empty alt text.
- Use native links for navigation/downloads and buttons for actions.
- Ensure all touch targets are at least 44 by 44 CSS pixels where practical.
- Announce upload, filter, validation, and save-state changes to assistive technology.
- Do not make a PDF preview the only way to access material.
- Test keyboard-only navigation at mobile and desktop breakpoints.

## Performance requirements

- Set a launch target of Lighthouse 90+ for Performance, Accessibility, Best Practices, and SEO on representative public pages, understanding that lab scores are diagnostic rather than the sole acceptance measure.
- Target Core Web Vitals at the 75th percentile: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.
- Keep the public bundle small by defaulting to server components and avoiding animation/editor code on public routes.
- Optimize and size images; never load original publication covers as oversized hero assets.
- Lazy-load below-the-fold previews and embeds.
- Confirm the primary study-material path works on a throttled mobile connection.

## SEO and sharing

- Unique localized title, description, canonical URL, Open Graph locale, and social metadata for every public detail page.
- Every localized page declares Indonesian/English `hreflang` alternates; `/` is the `x-default` automatic entry route.
- XML sitemap and robots rules that exclude admin, preview, draft, and internal asset-management routes.
- Structured data where accurate: `Person` on About, `Article`/`BlogPosting` on posts, and `Book` or `ScholarlyArticle` on relevant publication pages/records.
- Stable, human-readable slugs; redirect intentionally when a published slug changes.
- Do not put `noindex` on downloadable teaching files unless the owner chooses restricted discoverability.

## Analytics and operations

- Analytics are optional and must be privacy-respecting. Track page views, material opens/downloads, outbound publication links, and search terms without collecting student identity.
- Admin dashboard should show operational content counts, not surveillance-style student analytics.
- Add error monitoring for failed uploads, broken links, authentication failures, and server errors.
- Establish database backup, asset inventory, dependency update, and secret-rotation routines.

## Implementation phases

### Phase 0 - Security and content decisions

- Rotate exposed credentials and define environment-variable ownership.
- Confirm site name, admin identity, hosting, storage, portrait, download policy, and the editor-review process for Indonesian/English content.
- Create a content spreadsheet/JSON review export from the CV; do not yet import unreviewed records to production.
- Gather at least five representative study materials across the expected resource types.

**Exit criteria:** no exposed credential is in use; the owner has approved the MVP scope and representative content.

### Phase 1 - Foundation and design system

- Initialize the application and repository safeguards.
- Establish typography, colors, spacing, layout, focus states, responsive header/footer, and empty/loading/error patterns.
- Implement the database schema, validation, seed/import boundary, storage adapter, and authentication foundation.
- Add automated checks for formatting, types, linting, and unit tests.

**Exit criteria:** the design shell works at phone/tablet/desktop sizes; data writes are server-validated; no secret reaches the client bundle.

### Phase 2 - Public reading experience

- Build Home, Materi index/detail, Tulisan index/detail, Agenda, Publikasi, and Tentang.
- Add filters, search, SEO metadata, sitemap, structured data, and unavailable-file handling.
- Import owner-reviewed CV data and representative study content.

**Exit criteria:** a student can find and open a material from a phone in three interactions or fewer; all public states are accessible and indexable as intended.

### Phase 3 - Admin publishing workflow

- Build private login and dashboard.
- Add material, post, and publication create/edit/preview/publish/archive flows.
- Add upload replacement, slug protection, destructive-action confirmation, and error recovery.

**Exit criteria:** the lecturer or designated editor can publish a post and a material without developer help, and drafts cannot be accessed publicly.

### Phase 4 - Hardening and launch

- Complete security review, accessibility audit, responsive browser/device QA, metadata review, link checker, backup/restore rehearsal, and performance profiling.
- Verify all profile claims, selected publication metadata, rights notes, and contact information with the owner.
- Configure production secrets, domain, monitoring, and rollback procedure.

**Exit criteria:** acceptance checklist passes on production-like infrastructure and launch content is owner-approved.

### Phase 5 - Optional enhancements after usage evidence

- Course landing pages if the material collection becomes large.
- Bulk publication import with review/deduplication.
- Lightweight email/RSS updates.
- Editor role or scheduled publishing.
- Restricted materials only if there is a real requirement and an approved student identity source.

## Verification plan

### Automated

- Unit tests for validation, slug behavior, publication normalization, filter parsing, permissions, and safe URL handling.
- Integration tests for draft/publish transitions, file metadata, login throttling, and cache invalidation.
- End-to-end tests for the critical paths:
  - Student finds and opens a material.
  - Visitor reads and shares a post.
  - Visitor finds a publication by author/title/year.
  - Admin creates, previews, publishes, replaces, archives, and restores content.
- Accessibility automation on all page templates, followed by manual keyboard and screen-reader checks.

### Manual

- Verify at 320px, 375px, 390px, 430px, 477px, 720px, 768px, 1024px, and wide desktop layouts.
- Test slow mobile networking and large-but-valid files.
- Check long Indonesian titles, many co-authors, DOI wrapping, missing thumbnails, external-only materials, and zero-result filters.
- Confirm no Budi Rahman Hakim content or BRH-specific imagery/branding appears in the new site.
- Confirm all CV-derived records against the owner-approved import review.

## MVP acceptance checklist

- [ ] At 375x812 and 390x844, the localized identity title page fills the viewport below the 64px header without clipping, distortion, or horizontal scrolling; the editorial hero follows immediately after it.
- [ ] The localized official-site label includes the fully written `Profesor / Professor Burhanuddin Muhtadi, M.A., Ph.D.`, remains on one line, and stays legible without causing horizontal overflow.
- [ ] The identity folio anchor scrolls to the academic hero without placing its heading beneath the sticky header; its field summary is hidden at 720px and below.
- [ ] Once reached, the homepage academic name lockup, lead, profile action, and complete 4:3 portrait fit within one mobile viewport without horizontal scrolling.
- [ ] At 720px and below, the homepage role strip is not rendered; current roles remain available on the Profile page and at wider breakpoints.
- [ ] At 320x568 and 200% zoom, both the identity title page and homepage hero expand naturally without clipping copy, logo, actions, or portrait content.
- [ ] The public header has no logo or name wordmark, and its six-link desktop navigation is centered independently of the right-side controls.
- [ ] At 840px and below, the public header presents only `ID / EN` and Menu; editor access remains available as a secondary menu item.
- [ ] Materi Kuliah is available from the footer and remains easy to reach from relevant page content without appearing in the top bar.
- [ ] Students can search and filter materials and share the resulting URL.
- [ ] Every material action accurately reflects open/download/external availability.
- [ ] Posts are readable and keyboard accessible on mobile and desktop.
- [ ] Publications retain author order, year, venue, DOI/URL, and forthcoming status.
- [ ] All 81 CV publication fingerprints have exactly one structured record, and no public publication heading contains its authors, venue, year, or URL.
- [ ] Publication cards separate contributors and bibliographic details, reserve a 4:5 visual area, use a truthful placeholder without an image, and remain readable at 320px and 200% zoom.
- [ ] Every published publication exposes a working HTTPS DOI, publisher, institutional-repository, or official project link; seed validation fails when any record lacks one.
- [ ] Drafts, previews, admin pages, and secret values are never public or indexed.
- [ ] No content from the wrong person in the reference project has leaked into production.
- [ ] Owner approves biography, roles, portrait, contact links, and publication import.
- [ ] Accessibility, security, performance, backup, and rollback checks pass.
- [ ] Country-level detection selects Indonesian for Indonesia and English elsewhere, with browser-language fallback when country data is absent.
- [ ] Manual language choice persists, takes precedence over automatic detection, preserves active filters, and lands on the equivalent localized route.
- [ ] Localized pages expose correct `lang`, canonical, Open Graph locale, and `hreflang` metadata.

## Decisions to confirm with the owner

Use these planning defaults until the owner decides otherwise:

| Decision | Default |
| --- | --- |
| Site name | `Burhanuddin Muhtadi` |
| Primary audience | Current students |
| Language | Indonesian and English; country-level automatic selection plus persistent `ID / EN` switcher; locale-prefixed canonical routes |
| Public content | Materials, posts, publications, profile |
| Authentication | Private named users; `SUPER_ADMIN` manages accounts, while `ADMIN` and `EDITOR` manage content |
| Material access | Public unless explicitly restricted |
| Publication files | External links unless redistribution rights are confirmed |
| Portrait | Owner-supplied UploadThing portrait URL approved for implementation; final credit wording remains pending |
| Search | Simple database-backed search |
| Motion | Minimal CSS transitions |
| Comments/community | Not included |


These decisions should be recorded in this file as they are approved so implementation and content work share one source of truth.
