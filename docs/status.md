# siggigr.github.io: status

Last updated: 5 November 2026. Built from the git log, the reports in `.agent-reports/` and the owner's decisions of 4 and 5 November 2026.

## Current state

The site is live from `main` on GitHub Pages: main site, CV, the AI agent team page (`/agents/`, seven colleagues), privacy page and 404. `main` is protected by a GitHub ruleset (pull requests only, and the `site-build` check must pass). PR #6 (`chore/status-and-checks`, merged) added this file, Dependabot, the `site-build` CI check, print fixes for `/agents/` and a team-map fix (role names never break inside a word). The Icelandic version is parked.

## Done

- 16-17 October 2026: audit fixes (self-hosted fonts, privacy page, screen reader polish, CV print on A4), the animated office on the agents page.
- 4-5 November 2026: repository set up for the agent team (PR #4, merged 5 November, `CLAUDE.md`, agent files).
- 5 November 2026: agents page rebuilt with seven colleagues and the approved copy (PR #5, merged).

## Open items

| # | Item | Owner |
|---|------|-------|
| 1 | "Tillslip on screen" returns when there are screenshots. | Owner |
| 2 | The agents-page figures are updated when a Tillslip milestone is merged. | Developer |
| 3 | Done: `site-build` is already a required check in the ruleset. | Owner |
| 4 | Proofread the Icelandic text on `/agents/`. | Owner |
| 5 | Secret Protection is off; the Tech Lead recommends turning it on. | Owner |

## Decisions

- 4 November 2026: dark theme kept. The Icelandic version is parked.
- 4-5 November 2026: `.impeccable` exception: Instrument Serif is allowed.
- 5 November 2026: .impeccable side-tab exception covers src/styles/agents.css; its reason names .agents-role and .team-lane-me, and any other side edge in that file needs the owner's approval.
- 5 November 2026: eyebrow "Tölur og staðreyndir"; team-map labels in DM Sans; the team map is horizontal from 50em; the Tech Lead card sits outside the list.
- 5 November 2026: print is not checked or worked on any more (owner). The existing print styles stay as they are; no print checks in reviews or pull requests, and no print fixes unless the owner asks. Replaces the "best effort" decision of the same day.
- 5 November 2026: `main` is protected by a GitHub ruleset: no direct pushes, no force pushes, merges only through a pull request, no branch deletion, 0 approvals, and the `site-build` check must pass.
- 5 November 2026: `deploy.yml` actions stay pinned by tag for now (owner); revisit if a third-party action is added.
- 5 November 2026: the prose sections ("What I learned", "In 30 seconds") keep the 40rem text width, as in the approved design (owner).
- 5 November 2026: "Grouped security updates" stays off in the repository settings; `dependabot.yml` does the grouping.
- 5 November 2026: Vite 8's default browser targets (Chrome/Edge 111, Firefox 114, Safari 16.4) and the larger shared React 19 chunk (about +23 kB gzip) are accepted; no `build.target` is set (owner).
- 15 November 2026: the Family section on the main page gives the spouse's nickname (owner). This is an agreed exception to the "no real personal data of other people" rule; reviews do not raise it again.

## Log

One line per event: date, what, outcome.

- 2026-11-05 | PR #4 agent setup | merged
- 2026-11-05 | PR #5 agents page | merged (seven colleagues, approved copy, DM Sans map labels, em breakpoints)
- 2026-11-05 | PR #6 chore/status-and-checks (developer) | opened: status file, Dependabot, CI, CLAUDE.md rules, print fixes on /agents/; build green locally
- 2026-11-05 | PR #6 round 2 (developer) | status.md wording fixed, CI job renamed `build` to `site-build`; build green locally
- 2026-11-05 | PR #6 round 3 (developer) | team-map role names no longer break inside a word (Developer/Develope-r); wide-layout node side padding 0.9rem to 0.6rem; build green locally
- 2026-11-05 | PR #6 review (reviewer, e00ea3e) | Approved with minor changes: status.md item 3 out of date (site-build already required), PR #4 merge date, CLAUDE.md ruleset line missing the required check; CI and Dependabot OK; build and site-build green
- 2026-11-05 | PR #6 round 4 (developer) | reviewer findings 1-4 fixed (status.md and CLAUDE.md only); `deploy.yml` tag-pinning decision recorded; build green locally
- 2026-11-05 | PR #6 chore/status-and-checks | merged (5a7a232); Dependabot alerts and security updates on
- 2026-11-05 | PR #11 vite 6.4.4 to 6.4.5 (npm-security, Dependabot) | merged (cce9604)
- 2026-11-05 | PR #12 chore/react-19-vite-8 (developer) | opened: react/react-dom 19.3.1, vite 8.3.5, plugin-react 6.2.1 together (replaces Dependabot #7 to #10); build green locally, npm audit 0
- 2026-11-05 | PR #12 round 2 (developer) | production build checked with `npm run preview` at 375 and 1280 on all five pages (office, Pause/Play, team map, flipbook, no console errors); Current state wording fixed; print decision replaced; browser targets and React size accepted (owner)
- 2026-11-05 | PR #12 round 3 (developer) | print decision reworded as the owner gave it; no print work in progress, existing print styles untouched
- 2026-11-09 | PR feat/new-portrait-5-1 | opened: new main-page portrait (Siggi-5.1, background removed), card CSS adapted for a head-and-shoulders photo; build green locally, checked at 375 and 1440
- 2026-11-15 | PR feat/hiring-polish | opened: agent team feature card under the intro, CV and email buttons, work and apps sections first, "Get in touch" block on /agents/; build green locally, checked at 375 and 1440
- 2026-11-15 | PR feat/portrait-photo-correction | opened: main-page portrait corrected (colour cast, light, eye reflections, cut-out edge, cheek patch, tie band under the collar removed); same file and size, no code change; build green locally, checked at phone and desktop width
- 2026-11-15 | PR feat/cv-results-and-link-previews | opened: CV page text matched to the new Word CV (results in the Sabre and Tern bullets, summary, skills, aviation background; retail job and secondary school removed), link preview images and Open Graph tags for the main page, CV and /agents/; build green locally, not checked in a browser
- 2026-11-15 | PR feat/main-page-text | opened: main-page text matched to the new CV (Professional life rewritten as three paragraphs, "20 years in software", Backend development and Learning new stacks cards, Nextpost description, Icelandic Flight Academy, birth and licence years removed from About and Family), longer og:description on the main page and /agents/; build green locally, checked at 375 and 1440
- 2026-11-15 | PR #19 round 2 | em dashes replaced with commas in the older main-page text (hero subline, interests intro, Family, pets intro, Krummi card); build green locally, checked at 375 and 1440
- 2026-11-15 | PR #19 round 3 | em dashes removed from the page titles (CV, /agents/, privacy, 404: now "Page | Name") and from the meta descriptions of the main page and the CV page; build green locally, titles checked in the browser
- 2026-11-15 | PR #19 round 4 | Apps section: Tillslip added as a second card with the "coming soon" tag; unused "In the hangar" empty-state card removed from Apps.jsx; build green locally, checked at 375 and 1440
- 2026-11-15 | PR #19 round 5 | Apps section: Tillslip is no longer a normal app card; the "In the hangar" card is back (same heading and dashed style), shown after the Nextpost card with new Tillslip text, its text now in src/content/apps.js; build green locally, checked at 375 and 1440
- 2026-11-15 | PR #19 round 6 | Apps section: the "In the hangar" card for Tillslip gets the tag "in development" and a "See the case study" link to /agents/ (same tab), texts in src/content/apps.js; Nextpost card unchanged; build green locally, checked at 375 and 1440
- 2026-11-15 | PR #19 round 7 | Apps section: Tillslip is a normal app card again (heading "Tillslip", tag "in development", "See the case study" link to /agents/ in the same tab), the "In the hangar" card is removed; texts in src/content/apps.js; Nextpost card unchanged; build green locally, checked at 375 and 1440
- 2026-11-15 | PR fix/tillslip-tag-spacing | opened: Apps section, the "in development" tag on the Tillslip card now has a space before it and even padding on both sides (the space was inside the pill before); build green locally, checked at 375 and 1024
- 2026-11-15 | PR #20 round 2 | CV: the two Personal projects chips use a colon instead of an en dash; /agents/: the office legend says "QA" instead of "QA Engineer"; Decisions: the spouse's nickname in the Family section recorded as an agreed exception; build green locally, checked at 375 and desktop width
- 2026-11-15 | PR #20 round 3 | main page: hero subline ends with its own sentence ("Away from work, I have a lifelong weakness..."), the Aviation know-how and Learning new stacks cards are in the first person; meta descriptions of the main page and the CV say "senior software engineer"; CV: the Nextpost chip links to its GitHub repository (new tab) and the Tillslip chip to /agents/ (same tab), targets in src/content/cv.js; build green locally, checked at 375 and desktop width
- 2026-11-15 | PR feat/cv-education-note | opened: CV Education, the Reykjavík University entry gets a small line under the degree ("Final year alongside full-time work at Tern Systems"), text in src/content/cv.js; the colon in the Personal projects chips was already on main from PR #20; build green locally, checked at 375 and desktop width
- 2026-11-15 | PR claude/remove-customer-names-5tozo3 | opened: two customer names removed for confidentiality from the Sabre bullets on the CV and from Professional life on the main page (now "a major US airline and a fraud-prevention company"); text only; build green locally, checked at 375 and 1440
- 2026-11-16 | PR feat/cv-android-studio | opened: CV Technical skills, "Android Studio" added after "IntelliJ IDEA" in the Tools group, text in src/content/cv.js; build green locally, checked at 375 and desktop width
- 2026-11-16 | PR #23 round 2 | CV print: the Personal projects chips spilled onto a second page; print-only spacing tightened (header, summary, section gaps, job bullet line height, skill chips), text sizes unchanged; build green locally, prints on one A4 page in headless Chrome and Edge
- 2026-11-18 | PR content/agents-m2 | opened: /agents/ updated for Tillslip M2 (v0.4.0, receipt scanning): hero fact, test counts in "How I keep it honest" and "By the numbers" (852 app, 253 receipt logic, 163 rules, 1,268 total), "What's next" now M3, lastUpdated 18 November 2026; build green locally, checked at 375 and desktop width
