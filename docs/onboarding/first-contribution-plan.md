# First contribution plan — PREIshare onboarding

## Author
- Name / GitHub handle: Sydni Warner / @Sjwarner516
- Feature branch: docs/first-contribution-sydni
- Date: 2026-09-03

## One-sentence goal
Add myself as a new contributor in a contributors doc and make one minimal, reviewable docs (or agreed low-risk UI) touch so the team can practice review on a small first PR.

## Why this surface (link to prior artifacts)
- From `docs/onboarding/repo-map.md`: Safe first-touch includes `docs/onboarding/` (“Docs-only; helps teammates onboard”) and top-level docs such as `README.md`. A new root `CONTRIBUTORS.md` is the same class of low-runtime-impact documentation; this plan stays off the do-not-edit-yet list (`package-lock.json`, `src/routeTree.gen.ts`, tooling configs, Supabase/migrations, auth, CI).
- From `docs/onboarding/team-orientation-notes.md`: Meets first-PR definition of done by staying **scoped** (contributors list / onboarding docs example), **isolated** (feature branch `docs/first-contribution-sydni`), **described** / **reviewable** (tiny Markdown diff), **verified** before review, and **aligned** with map + orientation conventions—without secrets, large refactors, or “while I was here” extras.
- From `docs/onboarding/ai-tooling-verification.md`: Decision is **GO** for using AI tooling on the first contribution; ST1–ST4 passed with context loaded, so agent rules are verified enough to assist implementation next (with accepted limitations that do not block a docs-first PR).

## In scope (only these)
1. Create or update `CONTRIBUTORS.md` with my name, GitHub handle, and a one-line role (e.g. "Onboarding engineer").
2. Optional second touch (pick at most one, or none):
   - **None** — keep this PR to a single beginner-safe contribution (`CONTRIBUTORS.md` only).
3. Capture implementation notes later in `docs/onboarding/first-contribution-notes.md` (next step—not done here).

## Out of scope (explicitly not this PR)
- Auth, sessions, or environment secrets
- Database schema, migrations, Supabase policies, or pgvector changes
- Dependency upgrades or lockfile churn unrelated to the contribution
- Multi-package refactors, renames, or formatting the whole repo
- CI/CD workflow edits unless a mentor explicitly assigns them

## Likely files to change
| File | Action | Why |
|------|--------|-----|
| CONTRIBUTORS.md | create or update | Add my contributor entry |
| n/a | n/a | No optional second touch |
| docs/onboarding/first-contribution-notes.md | create (next step) | Record what the agent did and what I verified |
| docs/onboarding/first-contribution-plan.md | create (this step) | Freeze scope before implementation |

## Acceptance criteria
- [ ] I am on feature branch `docs/first-contribution-sydni` (not the default branch).
- [ ] `CONTRIBUTORS.md` lists my name and GitHub handle in a consistent format.
- [ ] Any second touch is limited to the single file named above and does not change behavior beyond copy/docs.
- [ ] No secrets, `.env` files, or generated build artifacts are included.
- [ ] A teammate can review the diff in under 10 minutes without product-context deep dives.

## Verification plan (how I will know it worked)
1. `git status` / `git branch` show I am on the feature branch with only expected files modified.
2. Open `CONTRIBUTORS.md` and confirm my row/section renders as plain Markdown.
3. If a UI touch was included: run the app’s normal dev command from the setup log and visually confirm the copy change; otherwise skip.
4. Skim `git diff` and confirm nothing outside the likely-files table appears.

## Risks and mitigations
- Risk: Agent expands scope into app core. Mitigation: refuse diffs that touch files not listed above; re-prompt with the out-of-scope list.
- Risk: Editing default branch by mistake. Mitigation: check `git branch` before every edit session.

## Definition of done for this planning step
- [x] Feature branch created from updated default branch.
- [x] This plan file saved at `docs/onboarding/first-contribution-plan.md` with all sections filled (no angle-bracket placeholders left).
- [x] Ready to implement in the next step without re-deciding scope.
