# siggigr.github.io

Personal website and CV of Sigurður G. Hjálmarsson. A fully static
React + Vite site: all content lives in simple data files in the
repository, and every push to `main` deploys automatically to GitHub
Pages. No backend, no database, no accounts — nothing to secure and
nothing to pay for.

Live at **https://siggigr.github.io/**.

## Pages

- **`index.html`** — the main site: Hero, About, Family, Professional
  life, Interests, Pets, Apps.
- **`cv.html`** — a standalone, print-ready CV/resume, linked from the
  Professional section and the main nav. Includes a "Print / Save as
  PDF" button with its own dense print stylesheet tuned to fit one page.

## How to change the site

| To change…                        | Edit…                                      |
| ---------------------------------- | ------------------------------------------- |
| Hero / About / Work text           | `src/content/site.js`                       |
| Family intro text                  | `src/content/site.js` (`familyIntro`)       |
| Family member cards (optional)     | `src/content/family.js`                     |
| Pets intro text                    | `src/content/site.js` (`petsIntro`)         |
| Pets (and photos)                  | `src/content/pets.js` + `src/assets/pets/`  |
| Interests intro text               | `src/content/site.js` (`interestsIntro`)    |
| Interest subsections (books, etc.) | `src/content/interests.js`                  |
| App cards                          | `src/content/apps.js`                       |
| Footer contact links               | `src/content/site.js` (`contact`)           |
| CV content (experience, education, skills, etc.) | `src/content/cv.js`   |
| Design and layout                  | `src/styles/global.css`, section components |

Each content file documents its own format with a commented example.
The main page's text sections (Hero, About, Family, Professional,
Interests, Pets) all live together in `src/content/site.js` as arrays
of paragraph strings — one array export per section's intro text.

The workflow for any change:

```bash
npm run dev        # preview at http://localhost:5173 while editing
git add .
git commit -m "Describe the change"
git push           # GitHub Actions builds and deploys automatically
```

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

The CV's print stylesheet (`@media print` in `global.css`) is tuned
to fit one A4 page at the current content length. Adding a
significant amount of new text (another job, a long bullet list) can
push it to two pages — check with the browser's print preview
(Ctrl/Cmd+P) after any substantial CV edit.

## Project structure

```
siggigr.github.io/
├── index.html                  Main site entry HTML, fonts, meta description
├── cv.html                     CV page entry HTML
├── vite.config.js              Build config (two-page build: index + cv)
├── .github/workflows/deploy.yml  Auto-deploy to GitHub Pages
├── PRODUCT.md                  Product context (audience, goals, brand)
│                                — read by the Impeccable design skill
└── src/
    ├── App.jsx                 Main page composition
    ├── CVPage.jsx               CV page composition
    ├── main.jsx / cv-main.jsx  React entry points for each page
    ├── content/                ← the "database": all editable content
    │   ├── site.js             Hero/About/Family/Professional/
    │   │                       Interests/Pets text + footer contact
    │   ├── family.js, pets.js, interests.js, apps.js, cv.js
    ├── assets/                 Portrait, pet photos, CV avatar
    ├── components/             Nav, Section, Footer (shared by both pages)
    ├── sections/               Hero, About, Professional, Interests,
    │                           Family, Pets, Apps
    └── styles/global.css       Design tokens and all styling,
                                 including the CV's print stylesheet
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
- `.claude/skills/impeccable` and `PRODUCT.md` support the Impeccable
  design skill (audit/polish/critique passes) when working on this
  project with Claude Code. Not required reading to just edit content.
