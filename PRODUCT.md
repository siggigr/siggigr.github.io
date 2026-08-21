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
push to main (base path `/siggi-site/`). All content lives in data files
under `src/content/`; sole maintainer is the owner, editing code
directly. No backend, no database, no accounts.

## Capabilities and Constraints

- Sections: Hero, About, Professional life, Interests (nested
  sections/items), Family, Pets (photo cards), Apps (cards with
  optional link, "coming soon" tag, "In the hangar" empty state).
- Content: currently placeholder text in `src/content/site.js`; real
  copy pending from owner.
- No apps exist yet; the Apps section must not imply otherwise.
- Undecided: timing and mechanism of full bilingual (Icelandic/English)
  version — planned "later"; current content is English with Icelandic
  section eyebrows.
- Missing (confirmed gap): no contact affordance exists (no email,
  LinkedIn, or GitHub link anywhere on the site) despite "contact about
  work" being the success action. Owner's actual contact
  details/profile URLs not yet provided; must not be invented.

## Brand Commitments

- Name: rendered as "Sigurður G. Hjálmarsson"; brand mark "SGH"; site
  known as siggi-site.
- Visual direction (owner-pinned): dark editorial look inspired by a
  Morozov portfolio reference — near-black canvas, large Instrument
  Serif display type, monochrome cut-out portrait emerging from the
  dark, restrained glacial-teal accent. Owner explicitly removed
  section numbering.
- Signature element: Icelandic eyebrow labels above English section
  headings (Um mig, Starfsferill, Áhugamál, Fjölskyldan, Dýrin,
  Smíðar); hero coordinates line "64°07′N 21°55′W — Kópavogur".
- Type: Instrument Serif (display), DM Sans (body), DM Mono (labels).
- Aviation as a personality motif (horizon divider, "In the hangar").

## Evidence on Hand

- Real portrait assets: `src/assets/siggi-portrait.webp` (color) and
  `siggi-portrait-bw.webp` (monochrome, in use), extracted with
  transparency.
- Professional facts available from owner's CV/history (20 years:
  14 QA/testing, 6 development; safety-critical ATC systems; airline
  tech) — usable once owner finalizes copy.
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
