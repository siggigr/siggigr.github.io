# siggigr.github.io

Personal website and CV of Sigurður G. Hjálmarsson. A fully static
React + Vite site: all content lives in simple data files in the
repository, and every push to `main` deploys automatically to GitHub
Pages. No backend, no database, no accounts — nothing to secure and
nothing to pay for.

Live at **https://siggigr.github.io/**.

## Pages

- **`index.html`** — the main site, in a dark profile layout:
  - an **icon rail** on the left (section links, a CV link, and a
    "Download CV as PDF" button at the bottom);
  - a sticky **profile card** with the portrait, name, role and
    contact icons;
  - a **content panel**: intro (headline, meta line, "What I do"),
    About, Family, Professional life, Interests, Pets, Apps.

  On phones the rail becomes a bar of icons along the top and the
  profile card sits above the content.
- **`cv.html`** — a standalone CV/resume. Dark on screen to match the
  site; printing or "Print / Save as PDF" always gives the plain white
  one-page A4 version. Opening `cv.html?print` (what the "Download CV
  as PDF" button does) goes straight to the print dialog.

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
| Interest subsections (books, etc.)           | `src/content/interests.js`                    |
| App cards                                    | `src/content/apps.js`                         |
| Contact links (profile card, footer, CV)     | `src/content/site.js` (`contact`)             |
| CV content (experience, education, skills…)  | `src/content/cv.js`                           |
| Icons (rail, "What I do", contact links)     | `src/components/Icon.jsx`                     |
| Main page look                               | `src/styles/dark.css`                         |
| CV look on screen                            | `src/styles/cv-dark.css`                      |
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

## Project structure

```
siggigr.github.io/
├── index.html                  Main site entry HTML, fonts, meta tags
├── cv.html                     CV page entry HTML
├── vite.config.js              Build config (two-page build: index + cv)
├── .github/workflows/deploy.yml  Auto-deploy to GitHub Pages
├── PRODUCT.md                  Product context (audience, goals, brand)
│                                — read by the Impeccable design skill
└── src/
    ├── App.jsx                 Main page layout (rail | card | panel)
    ├── CVPage.jsx              CV page (incl. the ?print behaviour)
    ├── main.jsx / cv-main.jsx  React entry points for each page
    ├── content/                ← the "database": all editable content
    │   ├── site.js             Headline, profile, "What I do", section
    │   │                       texts, contact links
    │   ├── family.js, pets.js, interests.js, apps.js, cv.js
    ├── assets/                 Portrait, CV avatar, pet photos
    ├── components/             Rail, ProfileCard, Icon, Section, Footer
    ├── sections/               Intro, About, Family, Professional,
    │                           Interests, Pets, Apps
    └── styles/
        ├── global.css          Base styles, components, CV print layout
        ├── dark.css            Main page theme and layout
        └── cv-dark.css         CV page theme (screen only)
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
  under `.claude/skills/`, not committed) context for audit, polish
  and critique passes when working on this project with Claude Code.
  Not required reading to just edit content.
