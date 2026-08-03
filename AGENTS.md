# Repository Instructions

## Scope

These instructions apply to the entire repository. Read `design.md` before planning or implementing any change.

## Project purpose

This repository will contain the official academic website for **Prof. Burhanuddin Muhtadi, S.Th.I., M.A., Ph.D.** Its primary product goals are:

1. Make study materials easy for students to find and open.
2. Let the lecturer/editor publish simple posts without developer help.
3. Present an accurate profile and publication record derived from approved source material.

Keep the site focused, fast, accessible, and maintainable. Do not expand it into a social network, learning-management system, or AI product unless the user explicitly changes the scope.

## Current phase

Implementation was authorized on 20 July 2026. The repository is now in Phase 1 (foundation and design system). Next.js, Tailwind CSS, Prisma for MongoDB, and UploadThing may be configured, but do not connect to MongoDB until the exposed credential has been rotated. Authentication, content ingestion, public feature work, and deployment remain separate scoped changes.

## Source-of-truth hierarchy

1. The user's latest explicit instructions.
2. `design.md` for agreed product scope, routes, content model, design direction, phases, and acceptance criteria.
3. `.material/Burhanuddin Muhtadi CV_March_2026.docx` for biographical and bibliographic facts.
4. `source-research.md` for the dated live-source extraction, platform record indexes, PDF summary, and discrepancy queue.
5. `.material/more-material.md` for the original external profile/reference links.
6. `.reference-project/brh-co-id-master` for selective implementation and interaction patterns only.

When sources disagree, do not guess. Preserve the source value, flag the discrepancy, and ask for owner approval when it affects public content.

## Identity boundary

The subject is Burhanuddin Muhtadi. The reference project is for **Budi Rahman Hakim**, a different person.

Never copy the reference project's biography, publications, research themes, quotations, images, institution claims, contact details, or branding into this site. Reference code and layout patterns may be adapted only after checking that they fit `design.md` and do not carry subject-specific content.

Search new or changed files for `Budi Rahman Hakim`, `B. Rahman Hakim`, `Jagat 'Arsy`, `tasawuf`, and other reference-only identity markers before declaring content work complete. A match is acceptable only in clearly labeled internal documentation explaining the boundary.

## Protected inputs

- Treat `.material` as read-only source material unless the user explicitly requests a source edit.
- Treat `.reference-project` as read-only. Do not repair, format, upgrade, or commit changes inside it.
- Do not use either directory as the runtime application directory.
- Do not expose or reproduce private document metadata, contact information, or credentials found in source files.

## Secrets

`.material/environment.txt` contains exposed, live-looking database credentials.

- Do not print, quote, copy, transform, validate, test, or connect with those values.
- Require password rotation before connecting the application to any database.
- Never place secrets in committed files, fixtures, tests, screenshots, logs, generated documentation, or client-visible environment variables.
- Before the first commit, ignore `.material/environment.txt`, `.env*` secrets, database dumps, local exports, and temporary upload artifacts.
- Use server-only environment access and the deployment platform's encrypted secret store.

If a secret is accidentally copied into a tracked or generated file, stop work, remove it safely, report the affected file, and request rotation. Do not merely hide it in a later commit.

## Product constraints

The MVP includes:

- Home.
- Study-material index and detail pages.
- Post index and readable post pages.
- Publication index.
- About/profile page.
- Private single-admin publishing workflow.

The MVP excludes chatbot/RAG, public accounts, comments, likes, student tracking, event management, heavy animation, custom smooth scrolling, and false PDF protection. The user approved Indonesian/English localization on 20 July 2026; follow the locale-prefixed routing, country-level detection, manual switcher, and editorial-review rules in `design.md`. Do not add machine-translation APIs or publish unreviewed translations.

## Implementation principles

- Prioritize the student path over decorative presentation.
- Use server-rendered, cacheable public pages and keep client JavaScript narrowly scoped.
- Keep dependencies lean. Do not add a library for behavior that can be implemented clearly with the platform or small local utilities.
- Model materials, posts, publications, and media as separate concepts; do not force them into one overloaded record type.
- Use stable human-readable slugs and internal IDs that never appear as the only public locator.
- Validate all inputs at server write boundaries.
- Sanitize rich text and allowlist embed providers.
- Show honest file availability and rights states. Never imply that a file is secured merely because browser controls are hidden.
- Preserve publication author order, source wording, dates, DOI/URL values, and `forthcoming` status during import.
- Do not invent abstracts, biography claims, course metadata, citations, portraits, contact information, or unsupported translations. Working English translations must remain traceable to approved source copy and be owner-reviewed before launch.

## Framework guidance

The intended direction is Next.js App Router, TypeScript, Tailwind CSS, a validated server-side data layer, MongoDB/Prisma if retained by the owner, private admin authentication, and an approved object-storage provider.

The reference project uses a version of Next.js with conventions that may differ from model memory. Once packages exist, read the relevant local framework documentation in `node_modules/next/dist/docs/` before writing or reviewing framework-sensitive code. Heed deprecation notices. Verify authentication and ORM compatibility rather than blindly copying the reference project's versions.

The site supports Indonesian and English through canonical locale-prefixed routes. Indonesian and English variants share one underlying content identity; do not create unrelated duplicate records. Bibliographic titles remain in their original published language unless an official translated title exists. UI and authored-content translations require editorial review under `design.md`.

## Design and UX rules

- Use the warm editorial direction in `design.md`, but validate contrast before finalizing tokens.
- Put real content and the Materi Kuliah action in the first viewport; do not create a nearly empty full-screen hero.
- Use a readable article measure of roughly 68-72 characters.
- Default body text to at least 16px and preserve comfortable line height.
- Prefer borders, spacing, and typography to excessive shadows, glass effects, or rounded containers.
- Use an approved portrait only. A typographic layout is the fallback.
- Use minimal CSS transitions, respect `prefers-reduced-motion`, and avoid scroll-jacking.
- Design loading, empty, error, unauthorized, unavailable-file, and zero-result states alongside the success state.
- Preserve filter state in URLs.

## Hallmark design workflow

- The repository-local Hallmark skill lives at `.agents/skills/hallmark/SKILL.md`. Use it for new pages, substantial visual redesigns, UI audits, and design-DNA studies from screenshots or URLs.
- `hallmark audit` is read-only unless the user separately asks to implement its findings. `hallmark study` must diagnose the reference before any rebuild, following the skill's source and ownership safeguards.
- `design.md`, the source-of-truth hierarchy, the Burhanuddin Muhtadi identity boundary, accessibility requirements, and the user's latest instructions override Hallmark defaults.
- Treat narrow visual adjustments to an existing element as component-scope work. Make in-place edits within the established design system; do not rotate the page macrostructure, replace routes or copy, create Hallmark project-memory files, or export a new token system unless the user explicitly requests a comprehensive Hallmark redesign.
- Before Hallmark-driven implementation, name the files expected to change. Never delete production files or remove multiple existing components without explicit user approval.
- Verify Hallmark-driven UI changes at 320px, 375px, 414px, 768px, and a representative desktop width, in addition to the repository's accessibility and visual QA requirements.

## Accessibility

Target WCAG 2.2 AA.

- Use semantic landmarks and one logical `h1` per page.
- Keep all workflows keyboard operable with visible focus.
- Use links for navigation/downloads and buttons for actions.
- Give form controls persistent labels and associate validation errors programmatically.
- Give meaningful images approved alt text; mark decorative assets with empty alt text.
- Do not rely on color, hover, animation, icons, or PDF previews alone to convey meaning.
- Keep touch targets at least 44 by 44 CSS pixels where practical.
- Test reduced motion, 200% zoom, keyboard-only use, and at least one screen reader before launch.

## Security and privacy

- Authorize every admin query and mutation on the server.
- Keep draft and preview access private and short-lived.
- Use secure, HTTP-only, same-site cookies and CSRF-safe mutations.
- Rate-limit authentication and sensitive write/upload endpoints.
- Validate upload size, extension, MIME type, and file signature where practical.
- Never build a generic URL proxy. Apply SSRF defenses to any server-side remote fetch.
- Do not expose admin, preview, draft, or internal asset-management URLs in sitemaps.
- Avoid collecting student identity. Analytics, if added, must be aggregate and privacy-respecting.
- Require an explicit rights/download decision before hosting third-party publications or teaching files.

## Content workflow

- Extract CV records into a reviewable intermediate dataset; never seed unreviewed facts directly into production.
- Keep an import/source note so later editors can distinguish CV-derived data from owner edits.
- Flag possible duplicates or inconsistent titles for review. Do not silently normalize away meaningful differences.
- Do not scrape the URLs in `.material/more-material.md` unless the user explicitly requests it and the site's terms and rights permit it.
- Any public CV download needs a privacy review and owner approval.
- Course materials must have a course, topic, type, short description, delivery target, and rights decision before publication.

## File and change discipline

- Keep unrelated user changes intact.
- Use `apply_patch` for deliberate text-file edits.
- Do not modify generated artifacts by hand.
- Do not add scratch files, extraction output, document renders, screenshots, or credentials to the repository.
- Store temporary inspection artifacts outside the workspace and remove them when safe.
- When a decision changes routes, models, scope, security posture, or acceptance criteria, update `design.md` in the same change.
- Use absolute local file links in final handoffs when referencing repository files.

## Required workflow after implementation begins

1. Read `design.md` and the relevant source material.
2. Inspect only the relevant reference-project files; do not copy entire components by default.
3. State assumptions and identify any content/security blocker.
4. Make the smallest coherent implementation change.
5. Run formatting, lint, type checking, focused tests, and a production build as supported by the repository.
6. Visually inspect every changed page at representative phone and desktop widths.
7. Test keyboard navigation and error/empty/loading states.
8. Review changed files for identity leakage, secrets, unsafe URLs, and unapproved placeholder content.
9. Report the outcome, verification performed, and remaining content decisions.

When scripts are eventually defined, use repository scripts rather than ad hoc global tooling. Do not claim a check passed if it was not run.

## Test expectations

- Unit-test validation, permission logic, slug collisions, filter parsing, URL allowlists, and publication normalization.
- Integration-test authentication, draft/publish/archive transitions, file metadata, cache invalidation, and unavailable assets.
- End-to-end-test the student material path and admin publishing path.
- Include edge cases for long Indonesian titles, many co-authors, DOI wrapping, missing images, external-only resources, zero results, and invalid files.
- Add automated accessibility checks, but always complement them with manual keyboard and screen-reader review.

## Definition of done

A change is done only when:

- It matches the current approved scope in `design.md`.
- Content is traceable to an approved source and belongs to Burhanuddin Muhtadi.
- It works across the intended responsive layouts and key non-success states.
- Relevant automated and manual checks pass.
- Accessibility, security, privacy, and file-rights implications have been reviewed.
- No secret, wrong-person content, unapproved placeholder, or temporary artifact is present.
- Documentation is updated for material decisions or operational changes.
