# siggigr.github.io

Personal website and CV of Sigurður G. Hjálmarsson. A fully static
React + Vite site: all content lives in simple data files in the
repository, and every push to `main` deploys automatically to GitHub
Pages. No backend, no database, no accounts — nothing to secure and
nothing to pay for.

Live at **https://siggigr.github.io/**.

## Pages

- **`index.html`** — the main site, in a dark profile layout:
  - an **icon rail** on the left (section links, links to the CV and
    the AI agent team page, and a "Download CV as PDF" button at the
    bottom);
  - a sticky **profile card** with the portrait, name, role and
    contact icons;
  - a **content panel**: intro (headline, meta line, "What I do", and
    a teaser card for the AI agent team page), About, Family,
    Professional life, Interests (the book and game lists open as
    flip-books), Pets, Apps.

  On phones the rail becomes a bar of icons along the top and the
  profile card sits above the content.
- **`cv.html`** — a standalone CV/resume. Dark on screen to match the
  site; printing or "Print / Save as PDF" always gives the plain white
  one-page A4 version. Opening `cv.html?print` (what the "Download CV
  as PDF" button does) goes straight to the print dialog.
- **`agents/index.html`**, served at **`/agents/`** — a case study of
  my team of AI agents (Analyst, Architect, Designer, Developer,
  Reviewer, QA) building Tillslip, a grocery receipt scanner for
  Android. Same dark top bar and panel as the CV page: intro with
  "My part", the pipeline (one card per role), three key decisions,
  "The office" (an animated scene of the team, Siggi and Alan Isaac
  the office cat), and a placeholder for screenshots.

Every page is its own HTML file, so moving between pages is a full
page load (this matters for the visitor statistics below).

## How to change the site

| To change…                                   | Edit…                                         |
| -------------------------------------------- | --------------------------------------------- |
| Headline and intro text                      | `src/content/site.js` (`hero`)                |
| Name, role and meta line on the profile card | `src/content/site.js` (`profile`)             |
| "What I do" cards                            | `src/content/site.js` (`services`)            |
| About / Professional life text               | `src/content/site.js` (`about`, `professional`) |
| Family intro text                            | `src/content/site.js` (`familyIntro`)         |
| Family member cards (optional)               | `src/content/family.js`                       |
| Pets intro text                              | `src/content/site.js` (`petsIntro`)           |
| Pets (and photos)                            | `src/content/pets.js` + `src/assets/pets/`    |
| Interests intro text                         | `src/content/site.js` (`interestsIntro`)      |
| Book and game lists (the flip-books), notes  | `src/content/interests.js`                    |
| App cards                                    | `src/content/apps.js`                         |
| Contact links (profile card, footer, CV)     | `src/content/site.js` (`contact`)             |
| CV content (experience, education, skills…)  | `src/content/cv.js`                           |
| AI agent team page text                      | `src/content/agents.js`                       |
| "Updated …" date on the agents page          | `src/content/agents.js` (`lastUpdated`)       |
| Agents teaser card on the main page          | `src/content/agents.js` (`agentsTeaser`)      |
| "The office" intro text                      | `src/content/agents.js` (`officeIntro`)       |
| The office animation itself                  | `src/office/agentOffice.js`                   |
| Icons (rail, "What I do", contact links)     | `src/components/Icon.jsx`                     |
| Main page look                               | `src/styles/dark.css`                         |
| CV look on screen                            | `src/styles/cv-dark.css`                      |
| Agents page look                             | `src/styles/agents.css`                       |
| Shared base styles and the CV print layout   | `src/styles/global.css`                       |

The accent colour is one variable, `--accent`, at the top of
`dark.css` (and of `cv-dark.css` for the CV page).

Each content file documents its own format with a commented example.
Multi-paragraph text is an array of strings, one string per paragraph.

The workflow for any change:

```bash
npm run dev        # preview at http://localhost:5173 while editing
git add .
git commit -m "Describe the change"
git push           # GitHub Actions builds and deploys automatically
```

### Adding a "What I do" card

Add an entry to `services` in `src/content/site.js`. `icon` is one of
the names in `src/components/Icon.jsx` (for example `code`, `check`,
`terminal`, `plane`, `layers`):

```js
{
  icon: "code",
  title: "Backend development",
  text: "One or two short sentences.",
},
```

The grid has two columns; with an odd number of cards, the last one
spans the full width.

### Adding an app card

Open `src/content/apps.js` and add an entry:

```js
export const apps = [
  {
    name: "DayPlan",
    description: "Shared day itineraries for families.",
    url: "https://example.com",   // "" shows a "coming soon" tag instead
  },
];
```

### Adding a pet with a photo

1. Copy the photo into `src/assets/pets/`, e.g. `kisa.jpg`.
2. In `src/content/pets.js`:

```js
import kisa from "../assets/pets/kisa.jpg";

export const pets = [
  { name: "Kisa", description: "Chief mouse officer.", photo: kisa },
];
```

Photos are cropped to a 4:3 card automatically; any reasonable image works.

### Editing the CV

`src/content/cv.js` holds `experience`, `education`, `technicalSkills`,
`coreStrengths`, `languages`, `cvInterests`, and `referencesNote`.
References intentionally omit direct contact details on this public
page ("Available upon request").

The dark screen styles in `cv-dark.css` are wrapped in `@media screen`,
so they never affect printing. The print layout (`@media print` in
`global.css`) is tuned to fit one A4 page at the current content
length. Adding a significant amount of new text (another job, a long
bullet list) can push it to two pages — check with the browser's print
preview (Ctrl/Cmd+P) after any substantial CV edit.

### Updating the AI agent team page

All text is in `src/content/agents.js`. When you change it, also set
`lastUpdated` near the top (for example `"2 November 2026"`); it shows
at the end of the line under the headline.

To add screenshots or a screen recording, put the files in
`public/agents/` (create the folder; files in `public/` are copied
as-is) and list them in `screens`:

```js
export const screens = [
  { type: "image", src: "/agents/tillslip-scan.webp", alt: "Scanning a receipt" },
  { type: "video", src: "/agents/tillslip-demo.mp4", poster: "/agents/poster.webp", alt: "Short demo" },
];
```

While `screens` is empty, the section shows a "Still in the hangar"
placeholder card.

### The book and game flip-books

The two buttons under Interests open each list in `src/content/interests.js`
as a book, one favourite per page (`src/flipbook/flipBook.js`, styles in
`src/styles/flipbook.css`). To add your own words to a page, fill in its
`note`; an empty note simply isn't shown. `favourite: true` adds the red
ribbon and "All-time favourite".

### The office animation

"The office" is drawn on a canvas by `src/office/agentOffice.js`, with
no libraries; `src/components/AgentOffice.jsx` puts it on the page with
the Pause/Play button and the live list of what everyone is doing. It
is just for fun and not connected to the agents' real work. The team
(names, shirt colours, speech bubbles), Siggi, the cat's name, the
floor plan and the furniture are all defined near the top of
`agentOffice.js`. The animation pauses when it is scrolled out of view,
and starts paused for visitors whose device asks for reduced motion.

## Visitor statistics

Visits are counted with [GoatCounter](https://www.goatcounter.com/):
free and cookie-free, so no cookie banner is needed. The script is at
the bottom of `index.html`, `cv.html`, `agents/index.html` and
`privacy.html`; a one-line note in the footer says the site counts
visits and links to the privacy page (`src/PrivacyPage.jsx`), which
says what is sent. Keep that page in step if the tracking changes.

- **Dashboard:** https://siggigr.goatcounter.com (private: "Dashboard
  viewable by: Only logged in users" in the GoatCounter settings).
  Nothing is shown on the site itself.
- **Pages:** only the path is counted, without the query string, so
  `/cv.html` and `/cv.html?print` are one row. Jumps within the main
  page (`#about`, `#pets`) are not page views.
- **Where visitors come from:** add `?ref=` to links you share, e.g.
  `https://siggigr.github.io/agents/?ref=linkedin` or
  `?ref=application`. The value shows up as the source in the
  dashboard. Add `&utm_campaign=name` to group posts under Campaigns.
  Do not tag links between pages of the site itself.
- **Your own visits:** visits from `localhost` (`npm run dev`) are
  never counted. Your home IP is under *Ignore IPs* in the GoatCounter
  settings (add it again if your IP changes), and *disable for this
  browser* there stops counting in one browser anywhere.
- **New page?** Copy the two GoatCounter `<script>` tags from
  `index.html` into its HTML file. Fonts are self-hosted through
  `@fontsource` (`src/styles/fonts.css`, imported by `global.css`), so
  do not add Google Fonts links: they would send visitor IPs to Google.

## Project structure

```
siggigr.github.io/
├── index.html                  Main site entry HTML, meta tags
├── cv.html                     CV page entry HTML
├── agents/index.html           AI agent team page entry HTML (/agents/)
├── privacy.html                Privacy notice entry HTML
├── vite.config.js              Build config (three pages: index, cv, agents)
├── .github/workflows/deploy.yml  Auto-deploy to GitHub Pages
├── PRODUCT.md                  Product context (audience, goals, brand)
│                                — read by the Impeccable design skill
└── src/
    ├── App.jsx                 Main page layout (rail | card | panel)
    ├── CVPage.jsx              CV page (incl. the ?print behaviour)
    ├── AgentsPage.jsx          AI agent team page
    ├── office/agentOffice.js   "The office" animation (canvas, no libraries)
    ├── flipbook/flipBook.js    Book and game lists as flip-books
    ├── main.jsx, cv-main.jsx,
    │   agents-main.jsx         React entry points for each page
    ├── content/                ← the "database": all editable content
    │   ├── site.js             Headline, profile, "What I do", section
    │   │                       texts, contact links
    │   ├── agents.js           AI agent team page and its teaser card
    │   ├── family.js, pets.js, interests.js, apps.js, cv.js
    ├── assets/                 Portrait, CV avatar, pet photos
    ├── components/             Rail, ProfileCard, Icon, Section, Footer,
    │                           AgentOffice
    ├── sections/               Intro, About, Family, Professional,
    │                           Interests, Pets, Apps
    └── styles/
        ├── global.css          Base styles, components, CV print layout
        ├── dark.css            Main page theme and layout
        ├── cv-dark.css         CV page theme (screen only)
        └── agents.css          AI agent team page (on top of cv-dark.css)
```

## One-time setup

1. `npm install`
2. Push the repository to GitHub.
3. On the repo page: **Settings → Pages → Build and deployment →
   Source: GitHub Actions**.
4. Push to `main` (or run the workflow manually from the Actions tab).

Deployment status is visible in the **Actions** tab.

## Custom domain (optional)

Settings → Pages → Custom domain, then set the DNS records GitHub shows
you at your registrar (e.g. ISNIC for a `.is` domain). GitHub Pages
provides HTTPS automatically. `base` in `vite.config.js` is already
`"/"`, so no code change is needed either way.

## Notes

- This repository is named `siggigr.github.io` — GitHub serves a repo
  with exactly this name at the domain root instead of a subpath.
  `base: "/"` in `vite.config.js` matches this; if the repo is ever
  renamed away from `<username>.github.io`, `base` needs to change
  back to `"/<repo-name>/"` to match, or the deployed site will 404 on
  all its assets.
- `PRODUCT.md` gives the Impeccable design skill (installed locally
  under `.claude/` and `.agents/`; both folders, and `.codex/`, are in
  `.gitignore`) context for audit, polish
  and critique passes when working on this project with Claude Code.
  Not required reading to just edit content.
