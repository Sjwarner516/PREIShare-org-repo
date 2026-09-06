# Pull request description — first PREIshare contribution

**PR URL:** https://github.com/EdTechForLearning/PREIShare-org-repo/pull/5
**Base repository:** EdTechForLearning/PREIShare-org-repo
**Base branch:** main
**Head repository (my fork):** Sjwarner516/PREIShare-org-repo
**Compare branch:** docs/first-contribution-sydni-pr
**Author:** Sydni Warner / @Sjwarner516
**Date opened:** 2026-09-06

**PR title:** `docs: add Sydni Warner to the CONTRIBUTORS roster`

## Problem
PREIshare had no reviewed onboarding contribution from this engineer yet.
The team needs a small, docs-only change to practice the Git → review → merge path
without touching product runtime code.

## Approach
- Added Sydni Warner (`Sjwarner516`, Onboarding engineer, onboarded 2026-09-06) to `CONTRIBUTORS.md`.
- Recorded this reviewer checklist in `docs/onboarding/pr-description.md`.
- Recorded agent-cycle decisions in `docs/onboarding/first-contribution-notes.md`.
- No app, package, or config files changed.
- Opened a cross-fork PR from `docs/first-contribution-sydni-pr` on the fork into team `main`.

## What reviewers should look at
- [ ] `CONTRIBUTORS.md` — new row is accurate (Sydni Warner / Sjwarner516 / Onboarding engineer / 2026-09-06), formatted as a table, and free of secrets
- [ ] `docs/onboarding/pr-description.md` — problem, approach, test plan, and checklist are filled in (no placeholders)
- [ ] `docs/onboarding/first-contribution-notes.md` — Cycle 1–3 accept / reshape / reject notes match the diff
- [ ] Diff stays docs-only: `CONTRIBUTORS.md`, `docs/onboarding/pr-description.md`, and `docs/onboarding/first-contribution-notes.md`
- [ ] Commit messages explain why this onboarding change exists

## Test plan
A reviewer can do all of this on GitHub without cloning.

1. Open **Files changed** and confirm only these paths appear:
   - `CONTRIBUTORS.md`
   - `docs/onboarding/pr-description.md`
   - `docs/onboarding/first-contribution-notes.md`
2. Skim the contributors table: name, GitHub handle, role, and date look correct.
3. Confirm this file has a live PR URL, a specific title, and a test plan that lists every path in Files changed.
4. Search the diff for tokens, passwords, or private keys — expect none.
5. (Optional) Check out `docs/first-contribution-sydni-pr` and preview the Markdown files.

## Screenshots / notes
No UI screenshots (docs-only change).

## Checklist before requesting review
- [x] Feature branch pushed to the fork and PR opened
- [x] PR title is specific (not "update" or "fixes")
- [x] Description states problem, approach, and test plan
- [x] Live PR URL recorded: https://github.com/EdTechForLearning/PREIShare-org-repo/pull/5
- [x] This file is committed on the GitHub fork so PAUL can review it
