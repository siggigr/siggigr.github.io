# siggigr.github.io: notes for Claude

Claude Code reads this file at the start of every session in this
repository. It holds the working rules every role follows here. Role
instructions come from the agent files.

## What this is

The owner's personal website and CV: a static React + Vite site. All
text lives in data files in `src/content/`. Every push to `main` deploys
to GitHub Pages through `.github/workflows/deploy.yml`, so `main` is
always live. `README.md` describes the pages; `PRODUCT.md` holds the
design context.

## Working rules

- Run `git fetch` before reporting the repository's state, and before
  saying that something does or does not exist.
- One Claude Code session per repository folder at a time.
- Run agents in the foreground, so the owner can approve their commands.
- Never push to `main`. Every change goes through a pull request, and only
  the owner merges, unless the owner allows an agent to for that task.
  A merge to `main` publishes the site.
- `main` is protected by a GitHub ruleset: no direct pushes, no force
  pushes, no branch deletion, merges only through a pull request with 0
  approvals, and the `site-build` check must pass (owner, 5 November 2026).
- Run `npm run build` before every push; it must finish without errors.
  For a change that shows on a page, also check it with `npm run dev` at
  phone width and desktop width.
- Text changes go in `src/content/`, not in the page components.
- The owner proofreads all Icelandic text.
- Never print or ask for secrets. Nothing in this repository needs any.
- No real personal data of other people on the site (names, emails,
  addresses), and no store or company promoted by name in the app case
  studies.

## Reporting

- `docs/status.md` is the current state. Read it first in every session.
  It gets a one-line Log entry (date, what was done, the outcome) each
  time work is handed on: a pull request opened, each round of fixes,
  and the merge. The developer commits the lines.
- Every role ends its report with: what was done, what is still open, and
  any questions for the owner.
- The pull request description says what changed, which pages it
  touches, and what the owner should check in the browser.
- Every role also saves its full final report, unchanged, as
  `.agent-reports/<YYYY-MM-DD>-<branch>-<role>[-round-N].md` (slashes in
  the branch name become dashes). `.agent-reports/` is in `.gitignore`,
  so the reports are never committed; the Tech Lead chat reads them
  there.

## Site-specific notes

- Pages: `index.html` (main site), `cv.html`, `agents/index.html` (the AI
  agent team page), `privacy.html`, `404.html`.
- The Icelandic version of the site is parked until the whole site gets one (owner, 5 November 2026).
