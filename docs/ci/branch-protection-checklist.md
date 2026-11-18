# Branch protection checklist (PREIshare PR CI)

## Purpose

Connect the automated green/red signal from `.github/workflows/pr-ci.yml` to
merge policy on protected branches. This document is for **maintainers with
admin access**. Contributors without admin rights prepare and verify this
checklist only. Completing this file does **not** mean branch protection is
already on.

Sprint 6 pain (`docs/ci/pr-pain-and-goals.md`) is about **proposed changes on
pull requests** into `main`, not every random push.

## Protected branches

- [ ] Protect **`main`** (the only merge target named in
      `docs/ci/pipeline-design.md` — do not invent `develop`)

## Required status checks

After the workflow has run at least once on a PR, GitHub will show the check
name. Use the name from that run if it differs slightly from the YAML.

- [ ] Require status checks to pass before merging
- [ ] Required check: **`Quality checks`**
      (workflow `name:` is `PR CI`; job id `ci`; job `name:` is
      `Quality checks`. GitHub often displays this as `PR CI / Quality checks`.
      Copy the exact string from a real PR Checks tab after one run.)
- [ ] Prefer “Require branches to be up to date before merging” so the last
      CI run reflects the merge base

## What CI already enforces (automated)

These are the required steps in `.github/workflows/pr-ci.yml` (any failure
fails the job; no `continue-on-error`):

- Dependency install (`npm ci`)
- Typecheck (`npm run typecheck`)
- Production build (`npm run build`)
- Lint (`npm run lint`)
- Tests (`npm run test` — Vitest run, non-watch)

Triggers: `pull_request` to `main` with types `opened`, `synchronize`,
`reopened`. Concurrency cancels an in-progress run for the same PR when new
commits land.

## What humans still own (not optional)

- [ ] At least one **human** review/approval before merge
- [ ] AI-assisted review prompts are helpers only — **never auto-merge** on
      AI output alone
- [ ] Secret/config and product intent review outside a pure CI green
      (auth, RLS, embeddings env, UX)

## What not to require yet

- [ ] Do not require optional or flaky jobs that are **not** in `pr-ci.yml`
- [ ] Do not require deploy / production / Vercel jobs on pull requests
- [ ] Do not store secrets in the PR CI workflow just to satisfy a check
- [ ] Do not require `verify:search` or `seed:embeddings` (not PR gates)

## Readiness sign-off

- [ ] Workflow file path: `.github/workflows/pr-ci.yml`
- [ ] Triggers: `pull_request` to `main` (`opened` / `synchronize` / `reopened`)
- [ ] Concurrency: cancel in-progress runs for the same PR when new commits land
- [ ] Maintainer who can edit branch protection: __________________
- [ ] Date verified against a real PR check run: __________________

This checklist was **not** applied to GitHub settings as part of this step.
A learner without admin rights stops here.

## Notes for Sprint 6 handoff

A red required check should **block merge**. A green check means automated
quality gates passed — not that product review is done. Humans still decide
whether the change is good enough to merge.

## Enforcement record

This section was added after the existing checklist. The sections above stay in this file. They describe the rules we intended. This section records what GitHub actually saved. Branch protection is a GitHub website setting, not code. Writing this file does not turn a rule on. A rule that did not save is not enforced. Do not describe it as on.

- Date: 2026-11-18 (America/Denver)
- GitHub user who tried: Sjwarner516
- Repository visibility seen on the repo page: public
- Could open Settings and change rules: no, Settings was missing. The API listed `admin: true` for this user, but this session had no GitHub Settings page, so no rule was saved.
- Screen used: could not open either
- Branch name pattern: `main`
- Paid upgrade: No paid GitHub upgrade was purchased.

Look-only check after that attempt: `GET /repos/Sjwarner516/PREIShare-org-repo/branches/main/protection` returned **404 Branch not protected**. `GET .../rulesets` returned an empty list. Nothing was listed as Active. No rule is enforced.

### Intended rules versus what saved

Copied from `docs/ci/pr-approval-roles.md`. Do not invent roles. Approval count used: **1** (at least one human approval). The AI assistant is not an approver.

- Require a pull request before merging. Wanted: yes. Result: not attempted. What I saw after refresh: no Settings → Branches or Rulesets page in this session; `main` still returned Branch not protected. This rule is not enforced.
- Human approvals before merge. Count and approver roles from `docs/ci/pr-approval-roles.md`: count **1**; the human reviewer who may approve is GitHub collaborator `thortek`. Count is at least 1. The AI assistant is not an approver. Result: not attempted. What I saw after refresh: no required-reviewers rule listed. This rule is not enforced.
- Required status check from the existing workflow `.github/workflows/pr-ci.yml`. Exact check name selected, or exact name searched if it was not listed: searched **Quality checks** (workflow **PR CI**; GitHub may also show **PR CI / Quality checks**; finished sample run job URL used that job name). No new workflow was added. Result: not shown. What I saw after refresh: no required status checks on `main`. This rule is not enforced.
- Who may merge, from `docs/ci/pr-approval-roles.md`: Sydni Warner (`@Sjwarner516`), only after `thortek` has approved and pr-ci is green. Did GitHub limit merge to those people? no / could not set. This limit is not enforced by GitHub.

### Gaps

- Require a pull request before merging: not enforced (Settings screen not opened; protection GET 404).
- Human approvals (count 1, approver `thortek`): not enforced.
- Required status check **Quality checks** from `.github/workflows/pr-ci.yml`: not enforced (name searched, not listed on a protection screen).
- Restrict who may merge to Sydni Warner after that approval: not enforced (the page did not show that control in this session).
- No ruleset was created. Nothing was left Disabled because nothing was listed.

### What humans still do

People still follow `docs/ci/human-judgment-checklist.md` and `docs/ci/ai-review-orchestration.md` before merge, including when GitHub did not save the rule. The sample review in `docs/ci/sample-pr-review/critique-and-prompt-revision.md` is advice only and is not a required status check. The AI assistant does not approve or merge. The existing pr-ci workflow remains the only automated check this record tried to require. The sample pull request stays open and is not merged.
