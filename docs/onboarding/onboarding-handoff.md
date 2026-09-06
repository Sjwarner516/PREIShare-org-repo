# PREIshare onboarding handoff

**Author:** Sydni Warner / @Sjwarner516  
**Date:** 2026-09-06  
**Branch / PR:** `docs/first-contribution-sydni-pr` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/5  
**Audience:** mentor, future self, sprint lead

Planning and map/rules artifacts also live on the fatter fork branch `docs/first-contribution-sydni`. That branch is **not** the PR head. Do not treat it as the review compare.

## 1. Stakeholder summary (plain language)

I completed PREIshare engineering onboarding for Sprint 1 (dev environment and AI tooling). I forked the team repository, cloned my fork, wired up origin and upstream, verified my local toolchain, configured Cursor-style project rules and agent memory, mapped the repo well enough to choose a safe first contribution, and opened (or prepared) a small pull request that follows the team’s Git and review habits. PREIshare remains a real-estate intelligence product; this work does not ship a product feature—it proves I can join the team workflow safely.

**Definition of done met:**
- [x] Fork created, local clone of my fork, both remotes and toolchain verified (see setup log)
- [x] AI rules / project memory in place and smoke-tested
- [x] First contribution implemented and committed on a feature branch
- [x] PR opened (or description ready) and review feedback addressed

Simulated mentor review is recorded; a **human** mentor has not merged PR #5.

## 2. Deliverables index (what exists and where)

| Artifact | Path | Why it matters |
| --- | --- | --- |
| Team orientation notes | docs/onboarding/team-orientation-notes.md | Mission, workflow, first-PR definition of done |
| Setup log | docs/onboarding/setup-log.md | Auditable proof of accounts, fork, Git identity, clone, remotes |
| Repo map | docs/onboarding/repo-map.md | Safe contribution surfaces (apps, packages, config) |
| AI tooling verification | docs/onboarding/ai-tooling-verification.md | Evidence agents respect PREIshare stack/conventions |
| Project rules | .cursor/rules/preishare.mdc | Persistent IDE-agent constraints |
| Agent memory entrypoint | AGENTS.md | Cross-tool project context for coding-agents |
| First contribution plan | docs/onboarding/first-contribution-plan.md | Scoped input before code (on `docs/first-contribution-sydni`, not in PR #5) |
| Contribution notes | docs/onboarding/first-contribution-notes.md | What changed and why |
| Contributors credit | CONTRIBUTORS.md | Visible first contribution surface |
| PR description | docs/onboarding/pr-description.md | Reviewer-facing summary |
| Review response notes | docs/onboarding/review-response-notes.md | How feedback was handled |
| This handoff | docs/onboarding/onboarding-handoff.md | Single entry point for mentors |

Repo map, AI verification, `.cursor/rules/preishare.mdc`, `AGENTS.md`, and the plan file are on fork `main` / `docs/first-contribution-sydni`. PR #5’s thin head started from team `main`, so those files are **not** all in Files changed on #5.

## 3. Environment and toolchain snapshot

Copy only facts you verified in setup-log.md (do not invent versions):

- OS: Linux (Ubuntu 24.04.4 LTS) — setup-log date 2026-08-30
- Git user.name / user.email configured: yes (`Sydni` / `plions11@gmail.com`); `git version 2.43.0`
- Node / package manager versions: TODO — setup-log.md does not record Node, npm, or a package-manager version
- origin (my fork) URL: https://github.com/Sjwarner516/PREIShare-org-repo.git
- upstream (team repo) URL: https://github.com/EdTechForLearning/PREIShare-org-repo
- Install/build/test commands run and result: TODO — setup-log.md only records clone, remotes, and `git status` on `main`. The first PR skipped a UI/dev-server check (docs-only; plan verification step 3).
- Blockers hit and how resolved:
  - First clone used Cursor handle `plions11` → `repo not found`. Re-cloned `https://github.com/Sjwarner516/PREIShare-org-repo.git`.
  - `gh` had no GitHub login on the setup VM. Fork created in the browser; later `gh auth login` device flow as @Sjwarner516 so `git push origin` succeeded.
  - Later first-PR work: `nothing to commit, working tree clean` until `CONTRIBUTORS.md` was written without pasting markdown `|` into PowerShell; feature branch recut from `upstream/main` after a fat compare against team `main`.

## 4. AI tooling posture

- Rules file purpose (one sentence): from `.cursor/rules/preishare.mdc` — always-apply constraints for stack, safe vs do-not-edit paths, secrets, smallest diffs, and fork → PR workflow, grounded in the repo map and orientation notes.
- AGENTS.md purpose (one sentence): cross-tool entry that points agents at `.cursor/rules/preishare.mdc`, restates PREIshare / onboarding links / grounding obligations, and tells agents to say “I don’t know” instead of inventing Next.js, Prisma, `packages/`, or `apps/`.
- Smoke-test prompt used and whether the agent correctly named stack pieces (TypeScript, TanStack Start, React, Supabase, PostgreSQL, pgvector): ST1–ST4 in `docs/onboarding/ai-tooling-verification.md` all **pass** (2026-09-03, Cursor IDE agent, context loaded). ST4 named TypeScript, TanStack Start, React, Vite, Tailwind and treated Supabase / PostgreSQL / pgvector as **planned, not in the tree**.
- Context gaps found and fixes applied (link to ai-tooling-verification.md): created `.cursor/rules/preishare.mdc`, rewrote `AGENTS.md`, then added Grounding obligations. No further rule edits after the four smoke tests. Decision: **GO** for AI on the first contribution. Accepted limitation: no exhaustive denylist of rival stacks; protection is affirmative naming plus “do not invent folders not on the map.”

## 5. First contribution and review outcome

- Plan goal (from first-contribution-plan.md): “Add myself as a new contributor in a contributors doc and make one minimal, reviewable docs (or agreed low-risk UI) touch so the team can practice review on a small first PR.”
- Files touched (on PR #5 head `docs/first-contribution-sydni-pr`): `CONTRIBUTORS.md`; `docs/onboarding/pr-description.md`; `docs/onboarding/first-contribution-notes.md`; `docs/onboarding/review-response-notes.md`; plus this handoff once committed. Intentionally **not** in #5: `docs/onboarding/first-contribution-plan.md` (fat branch only).
- PR title and link: `docs: add Sydni Warner to the CONTRIBUTORS roster` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/5  
  Compare: `EdTechForLearning/PREIShare-org-repo:main` ← `Sjwarner516/PREIShare-org-repo:docs/first-contribution-sydni-pr`.
- Review-style feedback received (summary): simulated kind-but-strict mentor (2026-09-06). Blocking: Test plan / Approach / GitHub PR form listed fewer files than Files changed. Non-blocking: notes implied `first-contribution-plan.md` was in the PR; title names only the roster; suggestion to link the GitHub handle.
- Changes made in response: `087c3c2` aligned the test plan with the real paths; `9edf318` clarified that `plan.md` is not in #5; GitHub PR body updated; handle-link declined; title parked (accept-later). Evidence table in `docs/onboarding/review-response-notes.md`.
- Merge readiness: **ready with follow-ups** — beginner-onboarding work is reviewable and blocking simulated comments are resolved, but the PR is still open (`merged: false`). A human mentor still needs to confirm the roster identity, that leaving `plan.md` off #5 is acceptable, and whether the GitHub title should stay roster-only.

## 6. Open risks and environment gaps

List anything a mentor should know before assigning feature work:

1. Supabase / PostgreSQL / pgvector are **planned only** (rules + repo-map + ST4). No local `.env` / Supabase client is documented in the setup log. Do not assign data-layer or auth work until that gap is closed on purpose.
2. Full app install / `dev` / `build` / test suite: **not recorded** in setup-log.md. First contribution was docs-only; do not assume the TanStack app was run on this machine.
3. PR #5 is still awaiting a **human** mentor merge. Simulated review is not a substitute.
4. Two GitHub branches: `docs/first-contribution-sydni` (onboarding history, plan, map, rules) vs `docs/first-contribution-sydni-pr` (thin first-PR head). Feature work should start from updated `upstream/main`, not from a fat compare.
5. This Cursor Cloud workspace `origin` is not the GitHub fork. GitHub pushes for #5 were done as @Sjwarner516 against `Sjwarner516/PREIShare-org-repo`.
6. After this handoff lands, `pr-description.md` Test plan may need one more path line (`docs/onboarding/onboarding-handoff.md`) so Comment 1 does not regress.

If a mentor wants a day-one re-verify: confirm remotes (`origin` = fork, `upstream` = team), `git fetch upstream`, Node/npm versions (still TODO here), and whether `npm run dev` / `npm test` exist and pass on a clean checkout.

## 7. Decisions log (for stakeholders)

| Decision | Choice | Rationale |
| --- | --- | --- |
| First contribution surface | `CONTRIBUTORS.md` plus onboarding docs | Low risk, visible, matches first-contribution plan and repo-map safe first-touch (`docs/onboarding/`) |
| Branch naming | Plan branch `docs/first-contribution-sydni`; PR head `docs/first-contribution-sydni-pr` cut from `upstream/main` | Orientation: isolated feature branch, not default `main`; thin PR so team `main` is not compared to fork onboarding history |
| AI tool category used most | chat-assistant for mentor simulation; coding-agent / IDE agent for file edits and smoke tests (ST1–ST4) | Chat role-play is enough for review comments; file changes needed a narrow prompt so the agent would not rewrite unrelated docs |

## 8. Next-sprint preview (what this unlocks)

The next sprint topic can assume:

1. **Trusted local Git environment** — fork, clone, origin, and upstream are documented in setup-log.md. Re-run clone/remotes only if the machine or remotes change. **Do not** assume Node versions or a green app install; those are still TODO.
2. **AI alignment** — `.cursor/rules/preishare.mdc` and `AGENTS.md` exist on the fork (fat branch / fork `main`); ST1–ST4 passed. Extend rules when new packages appear; do not start from zero. Supabase is still not in the tree.
3. **Git habit** — feature branch → small named commits → cross-fork PR → respond to review was practiced once end-to-end on #5.
4. **First PR path** — merge-ready **with follow-ups** (human identity / title / plan-file scope). Feature work should use the same PR quality bar: Test plan matches Files changed; no secrets; no drive-by `src/` or lockfile edits.

**Explicitly out of scope until later:** large product features, production deployments, and database migrations you have not been trained on yet. Also out of scope until mentored: inventing a Supabase client, running destructive SQL, or treating fork `main`’s extra onboarding docs as already merged to the team repo.

## 9. Ask for mentor

- Questions still open:
  - Is the roster row (Sydni Warner / Sjwarner516 / Onboarding engineer / 2026-09-06) the identity you want on team `main`?
  - Should `docs/onboarding/first-contribution-plan.md` stay off PR #5 (current choice) or come in a later docs PR from `docs/first-contribution-sydni`?
  - Keep the GitHub title as the roster-only line, or rename it to mention the onboarding docs?
  - When should Node/npm versions and `dev`/`build`/`test` be recorded so feature work can assume a trusted app toolchain?
- Review of this handoff requested: yes
- Preferred follow-up time or channel: TODO — not recorded in onboarding notes

---

*End of handoff. Keep this file updated if merge status or env gaps change before the next sprint starts.*
