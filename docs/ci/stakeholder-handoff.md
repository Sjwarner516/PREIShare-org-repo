# PREIshare Sprint 6 — Stakeholder Handoff

**Audience:** PREIshare product owners, tech leads, and reviewers  
**Sprint goal:** Continuous integration on every pull request + AI-assisted review that does not replace human judgment  
**Date:** 2026-11-09 (America/Denver)  
**Author:** Sydni Warner (`@Sjwarner516`)  
**Repo:** `https://github.com/Sjwarner516/PREIShare-org-repo` (branch `main`)

---

## 1. Client story recap (why we did this)

PREIshare is an investor dashboard (TypeScript, TanStack Start, React, with a planned Supabase data layer). Before this sprint, opening a pull request did **not** start any shared GitHub check. Teammates had to remember to install dependencies, typecheck, and build on their own laptops. Under time pressure those steps were easy to skip, so broken TypeScript or a failed Vite build could reach `main` before anyone noticed. Reviewers spent time asking “does it even build?” instead of judging whether the change was right for sponsors and buyers.

**What changed:** Every pull request targeting `main` is now set up to run one named GitHub Actions job. That job installs from the lockfile, typechecks, builds, lints, and runs the unit tests. A red check means a required machine step failed. A green check means those steps passed — **not** that the feature is ready to ship.

**What did not change:** A human still reads the diff, still owns secrets and product judgment, and still clicks merge. AI review prompts are optional helpers.

**Source notes:** `docs/ci/pr-pain-and-goals.md`, `docs/ci/pipeline-design.md`

---

## 2. What is automated on every pull request

One workflow file does this work: `.github/workflows/pr-ci.yml`.  
Workflow name: **PR CI**. Job name (the status check): **Quality checks**. GitHub often shows this as **`PR CI / Quality checks`**.

| Stage | What runs | Where defined |
| --- | --- | --- |
| Trigger | Pull requests **to `main`**, when opened, updated (`synchronize`), or reopened | `.github/workflows/pr-ci.yml` (`on.pull_request`) |
| Duplicate runs | Newer commits on the same PR cancel the in-progress run (`cancel-in-progress: true`) | same (`concurrency`) |
| Setup | Check out repository → Set up Node.js **22** (npm cache) → Install dependencies (`npm ci`) | same |
| Quality gates | Typecheck (`npm run typecheck`) → Build (`npm run build`) → Lint (`npm run lint`) → Test (`npm run test`) | same + `docs/ci/ci-scripts-notes.md` |
| Failure behavior | Any of those steps failing turns the job **red**. Merge is **not** blocked until an admin turns on branch protection | `docs/ci/branch-protection-checklist.md` |

**Plain-language summary for stakeholders:**  
If install, types, build, lint, or tests break, the PR is supposed to show a failed **Quality checks** run. Teammates should fix the PR before merge — not skip the check. That gate is only enforced after branch protection is enabled (section 4).

**What CI does *not* do (by design):**  
- Does not deploy to production or Vercel  
- Does not talk to live Supabase, run `seed:embeddings`, or run `verify:search`  
- Does not approve product or UX decisions  
- Does not replace reading the diff  
- Does not store or print secret values in logs (no GitHub Secrets are wired into this job)

---

## 3. What humans still decide

| Decision | Owner | Why it stays human |
| --- | --- | --- |
| Merge approval | Reviewer / maintainer | CI proves install/typecheck/build/lint/test passed, not that the feature is right for PREIshare users |
| Using AI review prompts | Reviewer | AI can miss product intent, auth/session risk, or Supabase row-level access. It must not approve, LGTM, or merge |
| Secret and env configuration | Maintainer | Credentials (`SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, `.env`) must not live in the workflow file or a PR body |
| Enabling required status checks | Repo admin | Branch protection is a GitHub **setting**. Committing YAML is not enough |
| Auth, listings data, migrations, UX | Reviewer | Those are PREIshare judgment calls CI cannot see |
| Accepting a thin or noisy test suite | Tech lead | Today’s tests are five embedding unit tests. A green job can still miss a broken dashboard route |

**AI-assisted review boundary:**  
Use the prompt pack in `docs/ci/ai-pr-review-prompts.md` to speed reading (plain-language diff summary, risk flags for auth/Supabase/migrations/secrets, human review questions). A human must still approve or request changes on GitHub. AI output is **advice, not a merge vote.** Do not paste the assistant’s last paragraph into **Approve**.

---

## 4. How to enable branch protection (operator checklist)

YAML on `main` does **not** stop a merge by itself. An admin with repo settings access should follow `docs/ci/branch-protection-checklist.md` and do at least this:

1. Protect the **`main`** branch (the only merge target this sprint named).
2. Require status checks to pass before merging.
3. Require the check named **`Quality checks`** (confirm the exact string on a real PR Checks tab; it may appear as **`PR CI / Quality checks`**). Copy that string from GitHub after the first live run — do not guess.
4. Prefer “Require branches to be up to date before merging.”
5. Require at least **one human review**.
6. Do not allow routine contributors to bypass checks. Do not require deploy, Vercel, `verify:search`, or `seed:embeddings` on pull requests.

**Status after verification:** [x] Not enabled yet  /  [ ] Enabled on main  

**Evidence:** `docs/ci/e2e-verification-log.md` (2026-11-09) — GitHub API returned `404 Branch not protected`. The checklist boxes for protect `main`, required checks, and human review are still unchecked. Maintainer name and “date verified against a real PR check run” are still blank in that checklist.

---

## 5. Known limits and risks (honest scope)

These are limits we designed around or recorded in the verification log — not a generic CI blog list.

| Limit | Impact | Recommended next action |
| --- | --- | --- |
| Secrets / private env | PR CI uses only committed files. It does **not** load `.env`, service-role keys, or embedding API keys. Live login/search cannot be proven on the PR. | Keep secrets out of YAML and PR bodies. Document GitHub Secrets later **only** if the team adds an optional, non-required job. Never commit `.env`. |
| Supabase / external services | `seed:embeddings` and live `match_properties` stay out of this workflow on purpose. | Next sprint: decide whether a preview env or mocked data is worth it. Do **not** add live DB writes to PR CI to “make the gate look complete.” |
| Thin tests (not flakes) | Verification did **not** find flaky tests. `npm run test` is 5 passing tests in one embeddings file. A broken route or auth cookie change can still go green. | Grow tests for dashboard routes, auth, and access patterns. Do not disable the whole workflow because coverage is small. |
| Local vs CI script drift | Local `npm ci` → typecheck → build → lint → test matched the YAML. Older design docs (`docs/ci/pipeline-design.md`, `docs/ci/project-ci-inventory.md`) still say lint/test are missing. | Treat `pr-ci.yml` + `docs/ci/ci-scripts-notes.md` as the live source of truth. Refresh the stale design docs next sprint. |
| No live Actions run yet | The workflow is **registered** (PR CI, id `412309071`) but has **zero runs** because Sprint 6 commits were pushed to `main` with no pull request. | Open a real PR so the Checks tab appears, then copy the exact required-check name into branch protection. |
| Build warnings | Vite printed CSS `@import` order and TanStack `"use client"` warnings. The build still exited 0. | Do not treat warnings as a red gate unless the team later chooses warning-as-error. |
| `npm audit` | Install reported 14 vulnerabilities (12 moderate, 2 high). That is **not** a PR CI step. | Triage separately; do not add `npm audit` as a required check without a team decision. |

---

## 6. Verification snapshot

Summarized from `docs/ci/e2e-verification-log.md` (2026-11-09, verifier Sydni Warner). Overall gate status there: **Credible with known gaps.**

- **PR opened / workflow triggered:** **no** — `gh pr list` was empty; `gh run list --workflow=pr-ci.yml` was empty. No Actions run URL or run id. Do not treat this as a live GitHub green check.
- **Expected steps ran in order:** **yes, locally** — `npm ci` → `npm run typecheck` → `npm run build` → `npm run lint` → `npm run test`, all exit 0 on Node 22.23.4 / Ubuntu, matching the YAML step order. **Not** observed on the GitHub Actions tab.
- **Intentional failure experiment (optional):** **no** — we did not push a broken PR to watch a red X. Local failures were not forced.
- **AI review prompt trial:** **yes** — Prompt 2 (risk flags) on a described (not committed) leak of `VITE_SUPABASE_SERVICE_ROLE_KEY` in the browser client. First reply said “Do not merge this PR until…”; the prompt pack was tightened so the model must end with `Decision: advisory only — no merge recommendation`. Second reply stayed advisory. **Human still made the call:** request changes. AI did not approve the merge.
- **Blockers found:**
  1. No live GitHub Actions run; branch protection off, so a red or missing check cannot block merge today.
  2. Design docs still say lint/test are missing; the workflow already runs both.
  3. Test surface is thin (embeddings only).
  4. `npm audit` and Vite warnings are residual, not PR gates.

---

## 7. Artifact index (where everything lives)

| Artifact | Purpose |
| --- | --- |
| `docs/ci/pr-pain-and-goals.md` | Original PR pain and success goals |
| `docs/ci/pipeline-design.md` | Planned stages before YAML (lint/test rows are **stale**; see script notes) |
| `docs/ci/project-ci-inventory.md` | Early inventory of scripts vs secrets vs human work (same staleness on lint/test) |
| `.github/workflows/pr-ci.yml` | Live PR CI workflow (install → typecheck → build → lint → test) |
| `docs/ci/ci-scripts-notes.md` | Exact npm commands CI relies on |
| `docs/ci/branch-protection-checklist.md` | Admin steps to require checks (not applied yet) |
| `docs/ci/ai-pr-review-prompts.md` | Human-in-the-loop review prompts (advisory only) |
| `docs/ci/e2e-verification-log.md` | Proof the loop was exercised locally + AI dry-run |
| `docs/ci/stakeholder-handoff.md` | This handoff |

---

## 8. What should roll into the next Sprint 6 topic

Prioritize follow-ups that improve trust without inventing deploy or live-database jobs:

1. **Open a real pull request** so **PR CI / Quality checks** actually runs. Copy the exact check name from the Checks tab, then turn on branch protection so contributors cannot merge on red (or on a missing check).
2. **Fill the maintainer blanks** in `docs/ci/branch-protection-checklist.md` (who can edit settings; date verified against a real run). Require one human review. Do not require Vercel or Supabase jobs.
3. **Refresh stale design docs** so `pipeline-design.md` and `project-ci-inventory.md` match the live lint and test scripts.
4. **Grow the test suite** beyond five embedding helper tests (dashboard routes, auth/session, empty/error states). Quarantine flakes if they appear; we have not seen flakes yet.
5. **Decide policy** for secrets and optional Supabase-backed checks. Default from this sprint: keep live DB and `seed:embeddings` **out** of required PR CI.
6. **Use the AI prompt pack on one or two real PRs**, keep the advisory last line, and do not treat the model as a merge vote.

---

## 9. One-paragraph executive summary

PREIshare pull requests are now wired to run an automated install → typecheck → build → lint → test job named **Quality checks** (workflow **PR CI**), so broken changes should fail in public instead of only on a teammate’s laptop. That job does not deploy, does not talk to live Supabase, and does not approve the product. AI-assisted prompts can speed review, but merge decisions, secret handling, and product judgment stay with humans. Admins still need to enable branch protection using the checklist — it is **not** on today — and the next work should be a real PR run, required checks on `main`, and the coverage and doc-drift gaps listed above.
