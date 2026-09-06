# Review response notes — first PREIshare PR

## PR under review
- Branch name: `docs/first-contribution-sydni-pr`
- PR title (after any edits): `docs: add Sydni Warner to the CONTRIBUTORS roster` (title left unchanged; it still names the user-facing roster change)
- Link or local identifier: https://github.com/EdTechForLearning/PREIShare-org-repo/pull/5
- Related files: CONTRIBUTORS.md, docs/onboarding/pr-description.md, docs/onboarding/first-contribution-notes.md, plus this file

## Simulated reviewer setup
- Tool used (chat-assistant / coding-agent): chat-assistant first (kind-but-strict PREIshare mentor role-play). Coding-agent / local edit only after triage, with a narrow prompt per accepted file fix.
- What context I pasted for the reviewer:
  - Full `docs/onboarding/pr-description.md` from `docs/first-contribution-sydni-pr` (Problem / Approach / Test plan / live URL)
  - `CONTRIBUTORS.md` contents: one table row — Sydni Warner / Sjwarner516 / Onboarding engineer / 2026-09-06
  - Cycle 1–3 from `docs/onboarding/first-contribution-notes.md`
  - Live Files changed on PR #5 (three Markdown files; no `src/` or lockfile)
  - Plan constraint pasted for the coding step: in-scope is `CONTRIBUTORS.md` plus onboarding docs; out of scope is auth, schema, lockfiles, `src/`, CI; do not invent feature requests
- Date of simulation: 2026-09-06

## Feedback received

### Comment 1
- **Theme:** verification
- **Blocking?** yes
- **Reviewer said:** The Test plan tells a stranger to “Open **Files changed** and confirm only these paths appear: `CONTRIBUTORS.md`, `docs/onboarding/pr-description.md`.” That is false on the live PR. Files changed also has `docs/onboarding/first-contribution-notes.md`. A reviewer who follows the written checklist would think the notes file is accidental.
- **My decision:** accept-now
- **Why:** Verification claims have to match the real diff. The notes file is an intended onboarding artifact from Cycle 3, not extra scope, so the test plan should list it.
- **Action taken:** follow-up commit on the same branch (`docs/first-contribution-sydni-pr`)
- **Evidence:** `087c3c2` `docs: align PR description test plan with the three-file diff` — Test plan step 1 now lists all three paths; “What reviewers should look at” no longer says the diff is only two files.

### Comment 2
- **Theme:** PR clarity
- **Blocking?** yes
- **Reviewer said:** Approach never mentions `first-contribution-notes.md`, and the checklist still said “Diff stays docs-only: `CONTRIBUTORS.md` and `docs/onboarding/pr-description.md`.” The GitHub PR form was worse: “confirm only CONTRIBUTORS.md appears.” A reviewer who only reads the GitHub box would miss two files that actually landed.
- **My decision:** accept-now
- **Why:** Same root cause as Comment 1. Smallest fix is to name the notes file in Approach / reviewer checklist, and to update the GitHub PR body so it matches `pr-description.md`.
- **Action taken:** edit PR description (in-repo file + GitHub PR form)
- **Evidence:** Same commit `087c3c2` added an Approach bullet for the notes file. GitHub PR body updated with `gh pr edit 5` so Test plan lists the onboarding docs that are actually in the diff, not “only CONTRIBUTORS.md.”

### Comment 3
- **Theme:** scope
- **Blocking?** no
- **Reviewer said:** Notes “Final diff summary” listed `docs/onboarding/first-contribution-plan.md` as a path changed. That file is not in PR #5. A stranger might think the PR is missing a file, or that they should add the fat feature-branch history.
- **My decision:** accept-now (clarify in notes) and decline (do not add `first-contribution-plan.md` to this PR)
- **Why:** The plan already froze the first PR as `CONTRIBUTORS.md` plus onboarding docs for review. Adding the plan file from `docs/first-contribution-sydni` would pull planning history that is not on team `main`. The smallest fix is to say, in the notes, that `plan.md` lives on the fat branch and is intentionally absent from #5.
- **Action taken:** follow-up commit
- **Evidence:** `9edf318` `docs: clarify plan.md is not in the first-PR diff` — Final diff summary now splits “paths on PR #5” from “paths not in this PR.”

### Comment 4
- **Theme:** commits
- **Blocking?** no
- **Reviewer said:** Commit hygiene on the branch is already specific (`docs: add Sydni Warner to the CONTRIBUTORS roster`, `docs: add first-contribution pull request description`, `docs: add first-contribution implementation notes`). The GitHub PR title still names only the roster. That is slightly narrower than the three-file diff, but it is not `update` or `fixes`.
- **My decision:** accept-later
- **Why:** The title still describes the user-facing change. Each supporting file has its own commit message. Renaming the PR title now would not change the diff and is not required to merge a beginner onboarding PR.
- **Action taken:** none (parked)
- **Evidence:** N/A — title left as `docs: add Sydni Warner to the CONTRIBUTORS roster`. Follow-up if a human mentor wants the title to list every onboarding doc.

### Comment 5
- **Theme:** other
- **Blocking?** no
- **Reviewer said:** Consider turning the GitHub cell into a profile link (`[Sjwarner516](https://github.com/Sjwarner516)`).
- **My decision:** decline
- **Why:** Cycle 1 already reshaped away from a linked handle. The plan asked for name, handle, role, and date in the official table. A markdown link is extra formatting, not a correctness fix, and it is the kind of “helpful” polish the first-contribution plan told the agent to refuse.
- **Action taken:** none
- **Evidence:** N/A — `CONTRIBUTORS.md` still has the plain handle `Sjwarner516`.

## Follow-up commits (if any)
| Commit message | Files touched | Addresses which comment # |
| --- | --- | --- |
| `docs: align PR description test plan with the three-file diff` (`087c3c2`) | `docs/onboarding/pr-description.md` | 1, 2 |
| `docs: clarify plan.md is not in the first-PR diff` (`9edf318`) | `docs/onboarding/first-contribution-notes.md` | 3 |
| `docs: record simulated mentor review decisions` (`ddecb9c`) | `docs/onboarding/review-response-notes.md`, `docs/onboarding/pr-description.md`, `docs/onboarding/first-contribution-notes.md` | scaffold / step 5 |

No second PR. All commits are on `docs/first-contribution-sydni-pr` so #5 updates in place.

## PR description edits (if any)
- Sections changed (summary / test plan / risk / other): Approach, What reviewers should look at, Test plan; GitHub PR form Problem / Approach / Test plan
- Before → after (short paraphrase is fine): Before, Test plan said only `CONTRIBUTORS.md` + `pr-description.md` (GitHub form said only `CONTRIBUTORS.md`). After, both lists name `CONTRIBUTORS.md`, `docs/onboarding/pr-description.md`, and `docs/onboarding/first-contribution-notes.md`, plus this review-response file once it lands.
- Why the edit helps a reviewer: A stranger can follow the checklist without treating an intended notes file as accidental scope.

## Re-verification checklist
- [x] Still on the same feature branch (not main): `docs/first-contribution-sydni-pr`
- [x] Latest commits pushed; PR shows updated head
- [x] Diff includes only intended onboarding files
- [x] No secrets, .env values, or machine-specific paths added
- [x] Manual or scripted checks claimed in the PR still pass (GitHub Files changed + table skim + secret search; no UI)
- [x] Blocking comments all have a written resolution
- [x] Non-blocking items either fixed or parked with a reason

## Merge-readiness statement
From a beginner-onboarding perspective this PR is ready for a human mentor to merge. The compare is still original-repo `main` ← fork `docs/first-contribution-sydni-pr`. The diff is docs-only: roster row, PR checklist, implementation notes, and these review-response notes. Blocking review comments were the stale file lists; those now match Files changed. I would still want a human mentor to confirm the roster row is the name and handle they expect, that they are fine leaving `first-contribution-plan.md` off this thin PR, and that they want the GitHub title left as the roster-only line.

## What I learned about review culture
- One habit I will keep: write the Test plan against Files changed, then re-read it after every follow-up commit so the checklist cannot go stale.
- One mistake I will avoid next time: treating “docs-only” as an excuse to let Approach and the GitHub PR form lag behind the real paths.
