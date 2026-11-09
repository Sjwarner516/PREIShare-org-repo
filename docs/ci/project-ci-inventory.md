# PREIshare dashboard — CI project inventory

## Purpose

List what this repo can run automatically on a GitHub-hosted runner for pull
requests, what needs secrets or external services, and what stays human.
Downstream pipeline design must use only the real package manager and script
names found here. Context: `docs/ci/pr-pain-and-goals.md` (forgotten local
checks, no cloud run on PRs) and `docs/ci/ci-concepts-notes.md` (shared
green/red proof before merge—not a laptop habit).

This file does **not** invent npm scripts. `lint` and `test` are **MISSING**.

## Repo facts (fill from the real project)

- Package manager: **`npm`** (README: “this repo uses `package-lock.json`”;
  `package.json` `"engines": { "node": "22.x" }`)
- Lockfile present: **`package-lock.json`** only (no `pnpm-lock.yaml`, no
  `yarn.lock`)
- Node/TypeScript app signals: `package.json`, `package-lock.json`,
  `tsconfig.json`, `src/` (routes, lib, components), `vite.config.ts`,
  `app.config.ts`
- Framework signals: **React 19** + **TanStack Start** + **Vite 8** +
  **Nitro** (`vite.config.ts` plugins `tanstackStart()`, `nitro()`,
  `viteReact()`, `tailwindcss()`; file routes under `src/routes/`; README
  titles the project as a TanStack Start dashboard)
- Test runner (if any): **none found** (no vitest, jest, or `test` script)
- Lint tool (if any): **none found** (no eslint script, no `lint` script)

Exact `package.json` `"scripts"` block as inspected:

```json
"scripts": {
  "dev": "vite dev --host 0.0.0.0 --port 43123",
  "build": "vite build",
  "start": "vite preview --host 0.0.0.0 --port 43123",
  "generate-routes": "tsr generate",
  "typecheck": "tsc --noEmit",
  "seed:embeddings": "npx tsx scripts/seed-property-embeddings.ts",
  "verify:search": "npx tsx scripts/verify-semantic-search.ts"
}
```

## Scripts discovered in package.json

| Script name | Exact command (from package.json) | Role |
|-------------|-------------------------------------|------|
| `dev` | `vite dev --host 0.0.0.0 --port 43123` | local long-running dev server — **not** a PR CI step |
| `build` | `vite build` | production build (Vite / TanStack Start / Nitro) |
| `start` | `vite preview --host 0.0.0.0 --port 43123` | local preview server — **not** a PR CI step |
| `generate-routes` | `tsr generate` | regenerates `src/routeTree.gen.ts` — not a pass/fail quality check |
| `typecheck` | `tsc --noEmit` | TypeScript typecheck |
| `seed:embeddings` | `npx tsx scripts/seed-property-embeddings.ts` | writes sample listings + embeddings to Supabase |
| `verify:search` | `npx tsx scripts/verify-semantic-search.ts` | prints ranking for sample queries (script exists; **not** a `test` runner) |

Missing common checks (write MISSING if not present):

- typecheck: **present** as `typecheck` (`tsc --noEmit`)
- build: **present** as `build` (`vite build`)
- lint: **MISSING**
- test: **MISSING**

Do not later write `npm run lint` or `npm run test` until those keys exist
in `package.json`. README already states: “There is no `test` or `lint` script.”

## Bucket A — Headless-safe on GitHub-hosted runners

Need only a clean checkout, Node **22**, `npm ci` from `package-lock.json`,
and public npm packages. No Supabase project, no embedding vendor key, no
browser click-through.

Suggested order (matches pain/goals: install → typecheck → build):

1. **Install** — `npm ci`  
   Why: the pain brief’s forgotten local install / “works on my machine.”
   A lockfile install on a clean runner is the shared proof. There is no
   `install` npm script; CI must call `npm ci` directly.

2. **Typecheck** — `npm run typecheck`  
   Why: `typecheck` exists but nothing requires it on a PR today, so broken
   TypeScript can reach `main`. This is the first real quality script.

3. **Build** — `npm run build`  
   Why: same pain for a failed Vite / TanStack Start build. Confirms the
   dashboard still compiles.

Optional later (still headless, but **not** a substitute for MISSING `test`):

4. **`npm run verify:search`** — ranking smoke over bundled sample listings.
   It does not need `EMBEDDING_API_KEY` when the local 1536-d path is used.
   Keep it out of the **first** required PR job unless pipeline design
   explicitly wants a longer run. It is **not** `npm run test`.

**Not Bucket A:** `dev` / `start` (servers that stay up), `generate-routes`
(rewrites files rather than failing a check), `seed:embeddings` (Bucket B).

## Bucket B — Needs secrets, env, or external services

Do **not** put these in the first PR CI job unless the team later adds
protected GitHub secrets and a safe plan. **No secret values** are recorded
here—names only, from `.env.example` and server modules.

| Check or step | Why it is not headless-safe | What would be required later |
|---------------|-----------------------------|------------------------------|
| Sponsor login / live `properties` RLS reads | Needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and a real project | Hosted secrets + a non-prod Supabase project; still not a substitute for typecheck/build |
| `match_properties` RPC against Postgres | Needs `SUPABASE_URL` / `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, plus migrations applied | Protected `SUPABASE_SERVICE_ROLE_KEY` (never `VITE_`); not Sprint 6 first pipeline |
| `npm run seed:embeddings` | Needs service role, `SEED_OWNER_ID` (existing `auth.users` uuid), and optionally `EMBEDDING_API_KEY` | Local or staging only; must not seed production from a PR |
| Live OpenAI (or compatible) embeddings | `EMBEDDING_API_KEY` / `EMBEDDING_API_URL` | Optional vendor secret; app already has a no-key local embedding path for demos |
| Applying `supabase/migrations/*.sql` | Talks to a live Postgres; easy to aim at the wrong project | Human-run SQL or a dedicated staging pipeline, not PR CI |

## Bucket C — Human judgment (not a green checkmark)

CI must not pretend a green check decides these (from the pain brief’s
“human review stays in charge”):

- Approve or request changes on the pull request
- Decide **whether to merge** (even if Bucket A is green)
- Product / UX quality (dashboard layout, search copy, empty/error states)
- Security-sensitive design (auth cookies, RLS, service-role vs anon key,
  embedding env never in the client bundle)
- “Is this listing copy or ranking good enough for a stakeholder demo?”
- AI review comments — assistance only; they are not a pipeline signal

## Supabase / env caveats for CI

- Env var **names** referenced by `.env.example` and/or `src/lib/supabase*`
  / embeddings (values never committed):
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, `EMBEDDING_MODEL`,
  `EMBEDDING_API_URL`, `EMBEDDING_MOCK`, `SEED_OWNER_ID`
- Local-only or dashboard-only steps: run SQL in the Supabase dashboard,
  seed embeddings, create a sponsor user, point Vercel at Production
- Recommendation for Sprint 6 PR CI: **keep the first pipeline on Bucket A
  only** (`npm ci` → `npm run typecheck` → `npm run build`). Do not inject
  Supabase or embedding secrets into the first workflow.

## Risks and open questions

- One lockfile only (`package-lock.json`) — no manager conflict.
- `dev` / `start` bind a long-running server; using them as CI “checks”
  would hang the job.
- No lint/test scripts: a later YAML must **not** call missing names.
- `verify:search` is a real script and can run without secrets, but it is
  a ranking printout, not a test runner with assertions that fail the
  process on wrong titles.
- Vite **build** may still succeed without `VITE_*` if those values are
  only read at runtime; login/search against live Supabase would still
  fail without env. That belongs in Bucket B, not a reason to skip
  `npm run build`.
- Node version: runners should use **22** to match `"engines": { "node": "22.x" }`.

## Link back to earlier docs

- Pain/goals addressed by Bucket A (`docs/ci/pr-pain-and-goals.md`):
  - No shared GitHub check on PR open/update → workflow will run these
    scripts on every PR
  - Forgotten `npm ci` / install → lockfile install on a clean runner
  - Easy-to-skip `typecheck` and `build` → required pipeline steps
  - Broken TypeScript/Vite can merge to `main` → red X before merge
  - Reviewers re-running “does it build?” → green/red signal first;
    UX and merge stay Bucket C
- CI idea used (`docs/ci/ci-concepts-notes.md`): automated checks on
  **every pull request** before merge; green is a signal, not permission;
  laptop-only builds and “AI LGTM with no run” are CI washing.

## Source files inspected

- `package.json` (scripts, engines, dependencies)
- `package-lock.json` (npm lockfile; only lockfile present)
- `tsconfig.json`
- `vite.config.ts`, `app.config.ts`
- `README.md` (npm, typecheck/build, no lint/test)
- `src/routes/` (TanStack Start file routes, including `/search`)
- `.env.example`
- `docs/setup/supabase-env-checklist.md`
- `supabase/migrations/` (pgvector + listings SQL; not a CI script)
- `docs/ci/pr-pain-and-goals.md`
- `docs/ci/ci-concepts-notes.md`
