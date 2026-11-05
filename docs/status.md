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
- 5 November 2026: print is not checked or worked on any more (owner): no print checks in reviews, QA or pull requests, and no print fixes unless the owner asks. Replaces the "best effort" decision of the same day.
- 5 November 2026: `main` is protected by a GitHub ruleset: no direct pushes, no force pushes, merges only through a pull request, no branch deletion, 0 approvals, and the `site-build` check must pass.
- 5 November 2026: `deploy.yml` actions stay pinned by tag for now (owner); revisit if a third-party action is added.
- 5 November 2026: the prose sections ("What I learned", "In 30 seconds") keep the 40rem text width, as in the approved design (owner).
- 5 November 2026: "Grouped security updates" stays off in the repository settings; `dependabot.yml` does the grouping.
- 5 November 2026: Vite 8's default browser targets (Chrome/Edge 111, Firefox 114, Safari 16.4) and the larger shared React 19 chunk (about +23 kB gzip) are accepted; no `build.target` is set (owner).

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
