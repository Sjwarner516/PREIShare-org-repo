# PREIshare PR CI — Pipeline Design

## Purpose

Plain-language design for automated checks on **every pull request** for the
PREIshare investor dashboard (TypeScript, TanStack Start, React, Vite).
This document is the source of truth for the GitHub Actions workflow we will
write next. It is a recipe card, not the cooked YAML.

It does **not** deploy anything, does **not** talk to live Supabase, and does
**not** replace human review. Green/red only answers: did the **Bucket A**
commands from `docs/ci/project-ci-inventory.md` pass on a clean machine?

Consumed inputs:

- `docs/ci/pr-pain-and-goals.md` — why PRs hurt today
- `docs/ci/ci-concepts-notes.md` — CI, pipeline, green vs red, CI washing
- `docs/ci/project-ci-inventory.md` — real npm scripts (no invented names)

## Trigger

- Event: **`pull_request`** (opened, synchronized / updated, reopened — the
  usual “someone proposed or changed a PR” set). This is the starter; nobody
  clicks “run checks” as the only path.
- Branches: PRs **targeting `main`** (the default integration branch).
- Goal: every proposed change gets the same install → typecheck → build
  loop before merge discussion continues. That attacks the pain that GitHub
  currently runs **nothing** on a PR.
- Not the primary trigger: `workflow_dispatch` only (that would be
  click-to-run, which the concepts notes call CI washing if it is the
  *only* starter). `push` to `main` may be added later; it is **not**
  required for this design’s “every PR” goal.

## Ordered stages (happy path)

Typical tutorial order is checkout → Node → install → lint → typecheck →
test → build. PREIshare **skips lint and test in the required job** because
the inventory marks those scripts **MISSING**. We do not invent `npm run lint`
or `npm test`.

1. **Checkout** — fetch the PR commit so the runner has the proposed code.
2. **Setup Node** — Node.js **22** to match `package.json` `"engines": { "node": "22.x" }`.
   There is **no `.nvmrc`** in the repo; `engines` is the source of truth.
3. **Install dependencies** — `npm ci` from `package-lock.json` (only lockfile;
   package manager is npm). Must happen before typecheck/build because those
   need `node_modules`.
4. **Lint** — **gap.** No lint script or ESLint config in the inventory.
   Do not add a lint stage until `package.json` has a real `lint` script.
5. **Typecheck** — `npm run typecheck` (`tsc --noEmit`). Cheaper than a full
   production build; run after install and before build.
6. **Test** — **gap.** No `test` script, vitest, or jest. Do not call
   `npm test`. `verify:search` exists but is **not** a test runner; keep it
   out of the required job (optional later; see open questions).
7. **Build** — `npm run build` (`vite build`). Broken imports, TanStack Start /
   Nitro/Vite config, and TypeScript that slipped past tsc in the bundle
   fail on the PR instead of after merge.

> Order reason: install before anything that needs `node_modules`; typecheck
> before the slower production build. Lint/test omitted from the required
> list until the inventory is no longer MISSING those scripts.

## Commands / scripts (from inventory)

| Stage | Script or command (from project-ci-inventory) | Required on PR? |
|-------------|-----------------------------------------------|-----------------|
| Checkout | GitHub `actions/checkout` (implementation detail later) | Yes |
| Setup Node | Node **22** (`package.json` engines; no `.nvmrc`) | Yes |
| Install | `npm ci` (no `install` npm script — call `npm ci` directly) | **Yes** |
| Lint | **gap — MISSING** (do not invent `npm run lint`) | No — not present |
| Typecheck | `npm run typecheck` → `tsc --noEmit` | **Yes** |
| Test | **gap — MISSING** (do not invent `npm test`; `verify:search` is not a test runner) | No — not present |
| Build | `npm run build` → `vite build` | **Yes** |

Scripts the inventory listed that **must not** be required PR stages:

- `dev` / `start` — long-running servers; would hang the job
- `generate-routes` — rewrites `routeTree.gen.ts`; not a pass/fail gate
- `seed:embeddings` — Bucket B (Supabase / `SEED_OWNER_ID`)

## Failure policy

- Any **required** stage failing (checkout, Node, `npm ci`, `npm run typecheck`,
  `npm run build`) → the CI **job fails** (red X on the PR).
- Do **not** use `continue-on-error: true` on those quality gates.
- Do not hide a failed typecheck behind a later green build, or the reverse.
- Optional/experimental checks (if anyone later adds `verify:search`) must be
  labeled optional and must not confuse the required red/green signal.
- Humans still decide merge; CI only reports whether automated gates passed
  (`docs/ci/ci-concepts-notes.md`: green is a signal, not permission).

## Caching intent

- **Do** cache npm dependency downloads, keyed on `package-lock.json`, so
  repeated PR updates install faster without changing the `npm ci` contract.
- **Do not** cache Vite/`dist`/`.output` build artifacts across unrelated PRs
  in a way that could hide a broken build.
- Exact `actions/cache` / `setup-node` cache flags land in YAML later; this
  file only records intent.

## Environment and secrets

- Required stages use **committed** files only: lockfile, `tsconfig.json`,
  source, public npm packages.
- **No production secrets** in PR CI and none printed in logs.
- Do **not** set `SUPABASE_SERVICE_ROLE_KEY`, `SEED_OWNER_ID`, or
  `EMBEDDING_API_KEY` on this job. Inventory Bucket B stays out.
- `VITE_SUPABASE_*` are not required for typecheck/build as the first
  pipeline; live login/search against Supabase is not a PR gate here.
- Do not connect PR CI to production (or shared) Supabase projects.

## Explicitly out of scope for this PR pipeline

- Production or staging **deploy** (including Vercel Production on every PR)
- Live **Supabase** schema migrations or data mutations (`seed:embeddings`,
  dashboard SQL, writing `properties` rows)
- Calling **MISSING** scripts (`lint`, `test`)
- Manual QA, product acceptance, UX walkthroughs, and **final merge approval**
- AI auto-merge or treating an AI “LGTM” comment as a substitute for this job
  (CI washing, from the concepts notes)

## Mapping back to PREIshare goals

- Pain addressed (`docs/ci/pr-pain-and-goals.md`):
  - No cloud check on PR → `pull_request` trigger runs one job
  - Forgotten install → `npm ci` on a clean runner
  - Easy-to-skip typecheck/build → required stages, red X if they fail
  - Broken code reaching `main` → checks **before** merge
  - Reviewers re-running “does it build?” → shared green/red first
- Inventory sources (`docs/ci/project-ci-inventory.md`):
  - Bucket A rows: `npm ci`, `npm run typecheck`, `npm run build`
  - Bucket B (secrets/Supabase) excluded
  - Bucket C (merge, UX, security intent) remains human
- Human boundary: CI is a consistent signal; reviewers still own judgment.
  Later AI review prompts support—not replace—that judgment.

## Open questions / gaps

- [x] Lint script missing from `package.json`? **Yes — MISSING.** Required
      pipeline omits lint until a real script exists.
- [x] Test script missing? **Yes — MISSING.** Do not use `verify:search` as
      fake `npm test`. Optional follow-up: add a real test runner, then a
      Test stage.
- [x] Node version source of truth? **`package.json` engines `22.x`** (no
      `.nvmrc`). YAML should pin Node 22.
- [ ] Should `verify:search` become an **optional** non-blocking job later?
      Headless and no secrets, but it is a ranking printout, not assertions.
      **Default for this design: omit from the required job.**
- [ ] Tests that need a database: **blocked** until a safe non-prod setup
      exists. Not in this PR pipeline.

## Sign-off for next step

When this design is stable, the next step may scaffold
`.github/workflows/pr-ci.yml` from **these stages only**:

`pull_request` → checkout → Node 22 → `npm ci` → `npm run typecheck` →
`npm run build`

No extra scope: no deploy, no live Supabase, no invented lint/test commands,
no auto-merge.
