# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and prospective employers in Iceland and abroad,
evaluating Sigurður as a candidate — typically arriving from a CV link,
application, or search, scanning quickly on desktop or phone.
Secondary: professional network, friends, and family getting to know him.

## Product Purpose

Personal website of Sigurður G. Hjálmarsson (Siggi): introduces who he
is professionally and personally, and showcases apps he builds. Success:
a visitor forms a clear, credible picture of him and contacts him about
work.

## Positioning

A real person, not a template: 20 years of software quality and
development experience presented alongside genuine personal texture
(family, pets, aviation, literature) — bilingual Icelandic professional
identity as a distinguishing thread.

## Operating Context

Static React + Vite site deployed to GitHub Pages via GitHub Actions on
push to main (served at the domain root, https://siggigr.github.io/,
base path `/`). All content lives in data files
under `src/content/`; sole maintainer is the owner, editing code
directly. No backend, no database, no accounts.

## Capabilities and Constraints

- Main page layout: icon rail (section links, CV link, "Download CV
  as PDF" button), sticky profile card (portrait, name, role, contact
  icons), and a content panel: Intro (headline, meta line, "What I do"
  grid), About, Family, Professional life, Interests (nested
  sections/items), Pets (photo cards), Apps (cards with optional link,
  "coming soon" tag, "In the hangar" empty state).
- CV page (`cv.html`): dark on screen, plain white one-page A4 when
  printed or saved as PDF.
- Content: real copy from the owner, in `src/content/`.
- One app exists: Nextpost (Android, Kotlin/Compose/Firebase), linked
  to its GitHub repository. No other apps may be implied.
- Undecided: timing and mechanism of full bilingual (Icelandic/English)
  version — planned "later"; current content is English with Icelandic
  section eyebrows.
- Contact: email, LinkedIn and GitHub on the profile card, in the
  footer and in the CV header (phone on the CV only), all from
  `contact` in `src/content/site.js`.

## Brand Commitments

- Name: rendered as "Sigurður G. Hjálmarsson"; brand mark "SGH"; site
  known as siggi-site.
- Visual direction (owner-chosen, October 2026): dark profile layout.
  Near-black canvas with faint diagonal texture, icon rail, tall
  profile card with the colour cut-out portrait, dark content panel,
  glacial-teal accent (#3fb8c4 on dark). Owner explicitly removed
  section numbering. Light and glassmorphism variants were tried and
  set aside.
- Signature element: Icelandic name for each section (Um mig,
  Fjölskyldan, Starfsferill, Áhugamál, Dýrin, Smíðar) shown in teal
  italics under the English heading.
- Type: Instrument Serif for the main headline and the CV name; DM Sans
  for everything else (bold, lowercase section headings); DM Mono for
  small labels on the CV.
- Aviation as a personality motif ("Aviation know-how" card,
  "In the hangar" empty state).

## Evidence on Hand

- Real portrait assets, cut out with transparency:
  `src/assets/siggi-portrait.webp` (full-length, colour, used on the
  profile card) and `src/assets/cv-avatar.webp` (head and shoulders,
  CV page, shown on light teal #e3eff0).
- Professional facts available from owner's CV/history (20 years:
  14 QA/testing, 6 development; safety-critical ATC systems; airline
  tech), already used in the site and CV copy.
- No testimonials, logos, metrics, or app screenshots exist; none may
  be fabricated.

## Product Principles

1. Credible first: a recruiter must find professional substance within
   one scroll; personal texture supports, never obscures.
2. Everything shown is true: no invented apps, claims, or evidence.
3. One maintainer, low ceremony: content changes must stay as simple as
   editing a data file.
4. The personal signature (bilingual labels, aviation motifs, real
   photos) is the differentiator — keep it specific, never generic.
5. Static and portable: no runtime dependencies beyond the built files.

## Accessibility & Inclusion

No formal standard mandated. Practical bar: comfortably readable dark
theme, keyboard navigable, honest alt text — appropriate for a public
professional site.
