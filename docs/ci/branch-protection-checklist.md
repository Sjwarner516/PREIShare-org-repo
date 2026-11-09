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
