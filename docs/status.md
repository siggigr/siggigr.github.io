# siggigr.github.io: status

Last updated: 5 November 2026. Built from the git log, the reports in `.agent-reports/` and the owner's decisions of 4 and 5 November 2026.

## Current state

The site is live from `main` on GitHub Pages: main site, CV, the AI agent team page (`/agents/`, seven colleagues), privacy page and 404. `main` is protected by a GitHub ruleset (pull requests only, and the `site-build` check must pass). PR #6 (`chore/status-and-checks`) adds this file, Dependabot, a CI check, print fixes for `/agents/` and a team-map fix (role names never break inside a word). The Icelandic version is parked.

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

## Decisions

- 4 November 2026: dark theme kept. The Icelandic version is parked.
- 4-5 November 2026: `.impeccable` exception: Instrument Serif is allowed.
- 5 November 2026: .impeccable side-tab exception covers src/styles/agents.css; its reason names .agents-role and .team-lane-me, and any other side edge in that file needs the owner's approval.
- 5 November 2026: eyebrow "Tölur og staðreyndir"; team-map labels in DM Sans; the team map is horizontal from 50em; the Tech Lead card sits outside the list.
- 5 November 2026: print is best effort. The pages must print readably, but print layout gets no further polish unless the owner asks.
- 5 November 2026: `main` is protected by a GitHub ruleset: no direct pushes, no force pushes, merges only through a pull request, no branch deletion, 0 approvals, and the `site-build` check must pass.
- 5 November 2026: `deploy.yml` actions stay pinned by tag for now (owner); revisit if a third-party action is added.

## Log

One line per event: date, what, outcome.

- 2026-11-05 | PR #4 agent setup | merged
- 2026-11-05 | PR #5 agents page | merged (seven colleagues, approved copy, DM Sans map labels, em breakpoints)
- 2026-11-05 | PR #6 chore/status-and-checks (developer) | opened: status file, Dependabot, CI, CLAUDE.md rules, print fixes on /agents/; build green locally
- 2026-11-05 | PR #6 round 2 (developer) | status.md wording fixed, CI job renamed `build` to `site-build`; build green locally
- 2026-11-05 | PR #6 round 3 (developer) | team-map role names no longer break inside a word (Developer/Develope-r); wide-layout node side padding 0.9rem to 0.6rem; build green locally
- 2026-11-05 | PR #6 review (reviewer, e00ea3e) | Approved with minor changes: status.md item 3 out of date (site-build already required), PR #4 merge date, CLAUDE.md ruleset line missing the required check; CI and Dependabot OK; build and site-build green
- 2026-11-05 | PR #6 round 4 (developer) | reviewer findings 1-4 fixed (status.md and CLAUDE.md only); `deploy.yml` tag-pinning decision recorded; build green locally
