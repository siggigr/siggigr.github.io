# siggigr.github.io: status

Last updated: 5 November 2026. Built from the git log, the reports in `.agent-reports/` and the owner's decisions of 4 and 5 November 2026.

## Current state

The site is live from `main` on GitHub Pages: main site, CV, the AI agent team page (`/agents/`, seven colleagues), privacy page and 404. `main` is protected by a GitHub ruleset (pull requests only). The pull request `chore/status-and-checks` adds this file, Dependabot, a CI check and print fixes for `/agents/`. The Icelandic version is parked.

## Done

- 17 October 2026: audit fixes (self-hosted fonts, privacy page, screen reader polish, CV print on A4), the animated office on the agents page.
- 4 November 2026: repository set up for the agent team (PR #4, `CLAUDE.md`, agent files).
- 5 November 2026: agents page rebuilt with seven colleagues and the approved copy (PR #5, merged).

## Open items

| # | Item | Owner |
|---|------|-------|
| 1 | "Tillslip on screen" returns when there are screenshots. | Owner |
| 2 | The agents-page figures are updated when a Tillslip milestone is merged. | Developer |
| 3 | Add the required status check `ci / build` to the ruleset once the CI pull request is merged. | Owner |
| 4 | Proofread the Icelandic text on `/agents/`. | Owner |

## Decisions

- 4 November 2026: dark theme kept. The Icelandic version is parked.
- 4 November 2026: `.impeccable` exceptions: Instrument Serif is allowed; the side-tab (left edge) is limited, with a reason, to `.agents-role` and `.team-lane-me`.
- 5 November 2026: eyebrow "Tölur og staðreyndir"; team-map labels in DM Sans; the team map is horizontal from 50em; the Tech Lead card sits outside the list.
- 5 November 2026: `main` is protected by a GitHub ruleset: no direct pushes, no force pushes, merges only through a pull request, 0 approvals.

## Log

One line per event: date, what, outcome.

- 2026-11-04 | PR #4 agent setup | merged
- 2026-11-05 | PR #5 agents page | merged (seven colleagues, approved copy, DM Sans map labels, em breakpoints)
- 2026-11-05 | PR chore/status-and-checks (developer) | opened: status file, Dependabot, CI (`ci / build`), CLAUDE.md rules, print fixes on /agents/; build green locally
