# siggi-site

Personal website of Sigurður G. Hjálmarsson. A fully static React + Vite
site: all content lives in simple data files in the repository, and every
push to `main` deploys automatically to GitHub Pages. No backend, no
database, no accounts — nothing to secure and nothing to pay for.

## How to change the site

| To change…            | Edit…                                        |
| --------------------- | -------------------------------------------- |
| Hero / About / Work text | `src/content/site.js`                     |
| Family members        | `src/content/family.js`                      |
| Pets (and photos)     | `src/content/pets.js` + `src/assets/pets/`   |
| Interests and items   | `src/content/interests.js`                   |
| App cards             | `src/content/apps.js`                        |
| Design and layout     | `src/styles/global.css`, section components  |

Each content file documents its own format with a commented example.
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

## Project structure

```
siggi-site/
├── index.html                  Entry HTML, fonts, meta description
├── vite.config.js              Build config (note the `base` path)
├── .github/workflows/deploy.yml  Auto-deploy to GitHub Pages
└── src/
    ├── App.jsx                 Page composition
    ├── content/                ← the "database": all editable content
    ├── assets/                 Portrait, pet photos
    ├── components/             Nav, Section, Footer
    ├── sections/               Hero, About, Professional, Interests,
    │                           Family, Pets, Apps
    └── styles/global.css       Design tokens and all styling
```

## One-time setup

1. `npm install`
2. Push the repository to GitHub.
3. On the repo page: **Settings → Pages → Build and deployment →
   Source: GitHub Actions**.
4. Push to `main` (or run the workflow manually from the Actions tab).

The site appears at `https://<username>.github.io/siggi-site/`.
Deployment status is visible in the **Actions** tab.

## Custom domain (optional)

Settings → Pages → Custom domain, then set the DNS records GitHub shows
you at your registrar (e.g. ISNIC for a `.is` domain). GitHub Pages
provides HTTPS automatically. When a custom domain is active, change
`base` in `vite.config.js` to `"/"` and push.

## Notes

- The `base: "/siggi-site/"` setting in `vite.config.js` matches the
  repository name. If the repo is renamed, update it to match, or the
  deployed site will load a blank page with 404s for its assets.
- This project previously used Firebase (auth, database, storage). If
  the Firebase project still exists, it can be deleted in the Firebase
  console — or at minimum downgraded from the Blaze plan — so the
  billing account has nothing attached to it.
