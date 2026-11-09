# PREIshare PR CI — End-to-End Verification Log

**Date:** 2026-11-09 (America/Denver)
**Verifier:** Sydni Warner (GitHub `@Sjwarner516`)
**Repo / branch used:** `https://github.com/Sjwarner516/PREIShare-org-repo` on `main` (HEAD `3867ebb` at the start of this pass). Local dry-run used the same working tree after restoring an uncommitted `src/routeTree.gen.ts` so it matched git.
**Inputs checked:**
- `.github/workflows/pr-ci.yml`
- `docs/ci/ci-scripts-notes.md`
- `docs/ci/branch-protection-checklist.md`
- `docs/ci/ai-pr-review-prompts.md`

---

## 1. Static workflow review

Source: `.github/workflows/pr-ci.yml` compared to `docs/ci/ci-scripts-notes.md`.

| Check | Result (pass/fail) | Evidence / notes |
| --- | --- | --- |
| Triggers on `pull_request` (branches as designed) | pass | `on.pull_request.branches: [main]`; types `opened`, `synchronize`, `reopened`. Matches `docs/ci/pipeline-design.md` and the branch-protection checklist. No `push` / `workflow_dispatch` (intentional — those would be extra, not a miss). |
| Job name(s) clear for GitHub status checks | pass | Workflow `name: PR CI`; job id `ci`; job `name: Quality checks`. Checklist says GitHub often displays **`PR CI / Quality checks`**. Not confirmed live (no Actions run yet). |
| Step order: checkout → runtime setup → install → typecheck → build → lint → test | pass | Steps in YAML: `actions/checkout@v4` → `actions/setup-node@v4` (Node `"22"`) → `npm ci` → `npm run typecheck` → `npm run build` → `npm run lint` → `npm run test`. Same order as `docs/ci/ci-scripts-notes.md`. |
| Each `run:` matches scripts in `docs/ci/ci-scripts-notes.md` | pass | `npm ci`, `npm run typecheck`, `npm run build`, `npm run lint`, `npm run test`. `package.json` scripts: `typecheck` = `tsc --noEmit`, `build` = `vite build`, `lint` = `eslint .`, `test` = `vitest run`. |
| Caching / dependency install strategy present and sensible | pass | `actions/setup-node@v4` with `cache: npm` (lockfile-keyed). Install is still `npm ci`, not a cached `node_modules` skip. No Vite/`dist` artifact cache. |
| Fail-fast behavior acceptable (failed step fails the job) | pass | No `continue-on-error` on any step. Default GitHub Actions: a non-zero `run:` fails the job. |
| No plaintext secrets or unsafe `${{ }}` expansions in logs | pass | Expressions used: `github.workflow`, `github.event.pull_request.number`, `github.ref`. No `secrets.*`, no `env:` block, no service-role / embedding keys. |

**Static review summary:** The YAML matches the script notes: one job, PR-to-`main` trigger, Node 22 + `npm ci`, then the four quality scripts in order. It does **not** match the older “lint/test are MISSING” paragraphs still sitting in `docs/ci/pipeline-design.md` / `docs/ci/project-ci-inventory.md` — those design docs were written before lint and test were added. The workflow file itself is consistent with `package.json` and `ci-scripts-notes.md`. No live GitHub check name was observed because this repo has not had a `pull_request` event yet.

---

## 2. Local CI command dry-run

Run the same sequence CI will run. Copy commands from `docs/ci/ci-scripts-notes.md`.

| Step | Exact command | Exit (pass/fail) | Notes |
| --- | --- | --- | --- |
| Install | `npm ci` | pass (exit 0) | “added 329 packages, and audited 330 packages in 30s”. `npm audit` also printed **14 vulnerabilities (12 moderate, 2 high)** — not a CI step, logged as a residual risk. |
| Typecheck | `npm run typecheck` | pass (exit 0) | `tsc --noEmit`; no compiler output. |
| Build | `npm run build` | pass (exit 0) | `vite build` completed client + SSR + Nitro. Warnings (not failures): CSS `@import` must precede other rules; many `[MODULE_LEVEL_DIRECTIVE] "use client"` notes from `@tanstack/react-router`. Job would still be green. |
| Lint | `npm run lint` | pass (exit 0) | `eslint .` — silent success. |
| Test | `npm run test` | pass (exit 0) | `vitest run` — Test Files **1 passed**, Tests **5 passed**, duration **144ms**. Coverage is only `src/lib/embeddings/generate.test.ts`. |

**Environment notes:** Node `v22.23.4` (matches workflow `node-version: "22"` and `package.json` `"engines": { "node": "22.x" }`), npm `10.9.9`, OS Ubuntu 24.04.5 LTS (`linux-x64`). Same package manager as CI.

**Local dry-run summary:** The full install → typecheck → build → lint → test sequence succeeded on the first run of this verification pass. Nothing broke. Warnings on `vite build` did not fail the command. Tests exist but only cover embedding helpers — CI would still go green for a broken dashboard route with no new test.

---

## 3. PR → CI loop checklist

Use `docs/ci/branch-protection-checklist.md` as the source of checklist items.

Live GitHub evidence collected with `gh` against `Sjwarner516/PREIShare-org-repo` on 2026-11-09:

- Workflow **PR CI** is **active** (id `412309071`).
- `gh run list --workflow=pr-ci.yml` returned **no runs**.
- `gh pr list --state all` returned **no pull requests**.
- `GET /repos/.../branches/main/protection` returned **404 Branch not protected**.
- Default branch is `main`, visibility public, Actions enabled.

Sprint 6 work was pushed **directly to `main`**, so GitHub never received a `pull_request` event. No Actions URL is recorded below — that is a dry-run, not a fake green check.

| Checklist item | Status (Ready / Needs work / Blocked) | Evidence |
| --- | --- | --- |
| Workflow runs on pull requests | Ready (YAML) / Needs work (live) | YAML `on.pull_request` targeting `main` with types `opened`, `synchronize`, `reopened`. Live: **zero** workflow runs and **zero** PRs. A teammate opening a PR tomorrow *should* start the job; that has not been watched on the Actions tab. |
| Check names suitable as required status checks | Ready | Designed name **`Quality checks`** (display likely **`PR CI / Quality checks`**). Checklist still has the box unchecked until a maintainer copies the string from a real Checks tab. |
| Concurrency / duplicate-run behavior acceptable | Ready | `concurrency.group: pr-ci-${{ github.workflow }}-${{ github.event.pull_request.number \|\| github.ref }}` with `cancel-in-progress: true`. Not observed live (no second synchronize). |
| Human still required for merge (CI ≠ auto-merge) | Ready | Workflow has no auto-merge job. Checklist: “At least one **human** review/approval before merge”; AI prompts “never auto-merge”. Branch protection (which would *enforce* human review) is **not** on. |
| Branch protection readiness gaps listed | Needs work | Checklist items for protect `main`, require **`Quality checks`**, require human approval, and “Date verified against a real PR check run” are all still `[ ]`. API: branch not protected. Learner without admin rights is expected to stop here. |

**PR loop summary:** A teammate *could* open a PR tomorrow and, based on the YAML, get install → typecheck → build → lint → test on `ubuntu-latest`. They would **not** yet be blocked from merging a red (or un-run) check, because `main` is not protected and this fork has never shown a Checks tab. Trust the local dry-run and the YAML; do not claim a live GitHub gate exists.

---

## 4. AI-assisted review dry-run (human remains accountable)

**Sample change used:** Described (not committed) risky diff against `src/lib/supabase/client.ts`: browser client would read `import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY` and pass it to `createClient` instead of the anon key. No real `.env` values were pasted.

```diff
 export function createBrowserSupabaseClient() {
   const url = import.meta.env.VITE_SUPABASE_URL
   const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
+  const serviceRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
   ...
-  return createClient<Database>(url, anonKey)
+  return createClient<Database>(url, serviceRole || anonKey)
 }
```

**Prompt chosen:** Prompt 2 — Risk flags (auth, Supabase, migrations, secrets) from `docs/ci/ai-pr-review-prompts.md`
**Tool category used:** chat-assistant

### Attempt 1 (before prompt fix)

**AI output — what helped:**
- Flagged the `VITE_` prefix on a service-role name as a browser-bundle leak (secrets / env bucket).
- Flagged that a service-role client in `src/lib/supabase/client.ts` would bypass RLS so any visitor could read or write listing rows (Supabase access bucket).
- Skipped migrations/SQL (nothing in the sample diff) instead of inventing schema files.
- Did not claim CI was green (no Actions output was pasted).

**AI output — problems:**
- Closed with **“Do not merge this PR until the service-role key is removed from the client bundle.”** That is still the model acting as merge authority (a gate), even though the wording is negative.
- Severity `high` was easy to read as “the AI already decided ship/no-ship.”
- Did **not** say LGTM or approve.

**Human judgment call (attempt 1):** I would **request changes** on a real PR: a Vite-prefixed service-role key ships in the dashboard bundle and can bypass listing RLS. That call is mine. The assistant’s “do not merge” sentence is not a GitHub review.

**Prompt fix applied?** Yes — see cycle 1 in section 5. Prompt 2 now bans “you may merge” / “safe to ship” / “do not merge”, says severity is not a ship score, and requires the last line `Decision: advisory only — no merge recommendation`. How-to-use step 4 now says not to paste the assistant’s last paragraph into GitHub **Approve**.

### Attempt 2 (after prompt fix)

Re-ran Prompt 2 on the same sample diff.

**AI output — what helped:**
- Same two buckets (secrets/env + Supabase row access), same file (`src/lib/supabase/client.ts`), questions for the human (“Does any browser route import this client after the change?” / “Was a `VITE_SUPABASE_SERVICE_ROLE_KEY` name added to `.env.example`?”).
- Ended with exactly: `Decision: advisory only — no merge recommendation`
- No approve / LGTM / merge / “do not merge” in the body.

**AI output — problems:**
- Still no live GitHub review UI in this dry-run (chat only).
- A hurried reviewer could still treat `Severity: high` as a substitute for reading the diff. The locked last line makes that harder to confuse with a merge click.

**Human judgment call (attempt 2):** Unchanged: **request changes** if this were a real PR. I would not approve, and I would not treat the assistant as the reviewer of record.

---

## 5. Assess → fix → re-verify cycles

| Cycle | What failed | Fix applied (file + change) | Re-verify result |
| --- | --- | --- | --- |
| 1 | Local install → typecheck → build → lint → test all **passed** (exit 0). No script/workflow fix required. | n/a | Full sequence green on first dry-run. Residual risk: Vitest only covers embedding helpers; `npm audit` reported 14 vulns; Vite printed CSS/`use client` warnings that do not fail the job. |
| 2 | AI Prompt 2 dry-run (attempt 1) told the human **“Do not merge this PR until…”** — model acting as a merge gate. | `docs/ci/ai-pr-review-prompts.md`: Prompt 2 hard rules now ban merge/ship wording, forbid using severity as a ship score, and require last line `Decision: advisory only — no merge recommendation`. How-to-use: do not paste the assistant’s last paragraph into Approve. | Attempt 2 on the same sample: flags stayed PREIshare-specific (auth/session skipped; Supabase access + secrets/env raised; no invented migrations). Closing line was advisory-only. Human still owns request-changes vs approve. |

---

## 6. Gate credibility decision

**Overall gate status:** Credible with known gaps

**Known gaps still open:**
1. **No live GitHub Actions run** on this repo: zero PRs, zero `pr-ci.yml` runs. YAML + local commands passed; the Checks tab has never been seen. Branch protection on `main` is **off** (`404 Branch not protected`), so a red (or missing) check cannot yet block merge.
2. **Design docs are stale:** `docs/ci/pipeline-design.md` and `docs/ci/project-ci-inventory.md` still say lint/test are MISSING; the workflow and `ci-scripts-notes.md` already require `npm run lint` and `npm run test`.
3. **Test surface is thin:** `npm run test` is 5 unit tests in one embeddings file. Dashboard routes, auth cookies, and Supabase access are not in CI.
4. **`npm audit`** reported 14 vulnerabilities during `npm ci`; not a required PR step, not triaged here.
5. **Build warnings** (Google Fonts `@import` order; TanStack `"use client"` directives) do not fail CI and could hide a real future warning-as-error policy.

**Safe for Sprint 6 stakeholder handoff?** Yes with caveats

**Notes for Step 12 handoff:**
- Local proof: Node 22 / `npm ci` → `typecheck` → `build` → `lint` → `test` all exit 0, matching `.github/workflows/pr-ci.yml` and `docs/ci/ci-scripts-notes.md`.
- GitHub workflow **PR CI** is registered and active, but has never run because Sprint 6 commits went to `main` with no pull request.
- Required check name to copy after the first real PR: **`Quality checks`** (expect **`PR CI / Quality checks`** on the Checks tab). A maintainer still needs to tick `docs/ci/branch-protection-checklist.md`.
- AI review pack is advisory only; Prompt 2 was tightened after a dry-run that said “do not merge.” Humans still own auth, Supabase RLS, migrations, secrets, and the merge click.
- Do not add live Supabase, `seed:embeddings`, or production deploy to PR CI to paper over the missing live Actions run.
