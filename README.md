# siggi-site

Personal website of Sigurður G. Hjálmarsson. A React + Vite frontend with
Firebase providing authentication, database, file storage, and hosting.
No server to maintain: all access control is enforced by Firestore and
Storage security rules.

## Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | React 18 + Vite                     |
| Auth      | Firebase Authentication (Google)    |
| Database  | Cloud Firestore                     |
| Files     | Firebase Storage (pet photos)       |
| Hosting   | Firebase Hosting (free tier, HTTPS) |

## Project structure

```
siggi-site/
├── index.html               Entry HTML, fonts
├── firebase.json            Hosting + rules deployment config
├── firestore.rules          Database access control
├── storage.rules            File upload access control
├── .env.example             Template for Firebase config
└── src/
    ├── main.jsx             React bootstrap
    ├── App.jsx              Page composition
    ├── firebase.js          Firebase initialization
    ├── hooks/
    │   ├── useAuth.jsx      Sign-in state + admin check
    │   └── useFirestore.js  Live document/collection hooks
    ├── components/          Nav, Section, EditableText, AdminBar, Footer
    ├── sections/            Hero, About, Professional, Interests,
    │                        Family, Pets, Apps
    └── styles/global.css    Design tokens and all styling
```

## Data model

| Firestore path            | Contents                                        |
| ------------------------- | ----------------------------------------------- |
| `siteContent/hero`        | `{ headline, subline }`                         |
| `siteContent/about`       | `{ body }`                                      |
| `siteContent/professional`| `{ body }`                                      |
| `family/{id}`             | `{ name, description, order }`                  |
| `pets/{id}`               | `{ name, description, photoUrl, photoPath, order }` |
| `interests/{id}`          | `{ title, blurb, order, items: [{id, title, note}] }` |
| `apps/{id}`               | `{ name, description, url, order }`             |
| `admins/{uid}`            | Presence of the document = admin. Console-only. |

Photos live in Storage under `pets/`.

## Setup, step by step

### 1. Prerequisites

Node.js 20 or newer, and the Firebase CLI:

```bash
npm install -g firebase-tools
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the Firebase project

1. Go to https://console.firebase.google.com and create a project
   (e.g. `siggi-site`). Google Analytics is not needed.
2. **Authentication** → Get started → Sign-in method → enable **Google**.
3. **Firestore Database** → Create database → production mode →
   choose `europe-west` region.
4. **Storage** → Get started → production mode, same region.
5. Project settings → General → Your apps → add a **Web app**. Copy the
   config values it shows you.

### 4. Configure the app

```bash
cp .env.example .env
```

Paste the config values from step 3.5 into `.env`.

### 5. Deploy the security rules

```bash
firebase login
firebase use --add        # select your project
firebase deploy --only firestore:rules,storage
```

### 6. Add the two admin accounts

1. Run the site locally (`npm run dev`), open it, and use the
   **Admin sign-in** link in the footer to sign in with your Google
   account. Have your spouse do the same.
2. In the Firebase console → Authentication → Users, copy each
   account's **User UID**.
3. In Firestore, create a collection named `admins`. For each of you,
   add a document whose **document ID is the UID**, with any field,
   e.g. `role: "admin"`.

Sign out and back in on the site: the admin bar appears and every
section shows its edit controls. Any other Google account that signs in
sees a "no admin access" notice, and the security rules reject its
writes regardless of what the UI shows.

### 7. Run and deploy

```bash
npm run dev                          # local development
npm run build                        # production build into dist/
firebase deploy --only hosting       # publish to <project>.web.app
```

## Security notes

- **HTTPS** is automatic on Firebase Hosting.
- **MFA**: enable 2-step verification on both Google accounts
  (https://myaccount.google.com/security). Because the site only
  accepts Google sign-in, admin access inherits that protection.
- **Brute force / rate limiting**: handled by Firebase Authentication.
- **Least privilege**: enforced server-side by `firestore.rules` and
  `storage.rules`, not by the UI. The `admins` collection cannot be
  modified from the client at all.
- **Logging**: sign-in activity is visible under Authentication → Users;
  request logs are in Google Cloud Console → Logging.
- The Firebase config in `.env` is not a secret (it ships to every
  visitor's browser); keeping it out of git is simply hygiene.

## Custom domain (optional)

The site works immediately on the free `<project>.web.app` domain. To
use your own domain, e.g. a `.is` domain registered through ISNIC
(https://www.isnic.is), go to Hosting → Add custom domain in the
Firebase console and follow the DNS instructions. HTTPS certificates
are issued automatically.
