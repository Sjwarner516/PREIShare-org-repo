# PREIshare repository map

> Onboarding map for first contribution planning. Built with AI-assisted
> inventory + human path verification. Do not treat this as architecture law
> if the real tree disagrees—update this file when you learn more.

## Meta

- Clone path (from setup-log): `/home/ubuntu/projects/PREIShare-org-repo`
- Date mapped: `2026-09-02`
- Agent tool used: `coding-agent`
- Mapper: `Sydni (@Sjwarner516)`

## 1. Overview (5–8 sentences)

PREIshare appears to be organized as: **single package** (not a monorepo/workspace).
In plain language, the product code seems to live mainly in `src/` at the repository root (TanStack Start + React + TypeScript + Vite), with build wiring in root files such as `vite.config.ts` and `package.json`.
Shared libraries or packages appear in **none found** (no `packages/`, `apps/`, or nested `package.json` manifests).
Docs and onboarding notes live in `docs/` (including this file), with domain briefs under `docs/domain/` and onboarding under `docs/onboarding/`.
There is no implemented Supabase/PostgreSQL/migrations tree yet; data-layer mentions are planning and agent-rule conventions only.
Tooling today is light: TypeScript strictness via `tsconfig.json`, editor settings under `.vscode/`, agent notes in `.cursorrules` and `AGENTS.md`, and **no** GitHub Actions / ESLint / Prettier configs found.
I am intentionally not editing application code while building this map.

## 2. Top-level inventory

| Path | Kind (app / package / config / docs / other) | One-sentence purpose | Verified by me? (yes/no) |
|------|-----------------------------------------------|----------------------|---------------------------|
| `.git/` | other | Git history and repository metadata | yes |
| `.vscode/` | config | Editor settings (e.g. treat generated `routeTree.gen.ts` as readonly) | yes |
| `docs/` | docs | Onboarding, domain briefs, and project documentation | yes |
| `src/` | app | Main TanStack Start / React application source | yes |
| `.cta.json` | config | Create TanStack App scaffold metadata | yes |
| `.cursorrules` | config | Cursor agent coding rules for this repo | yes |
| `.gitignore` | config | Paths Git should ignore (including `.env`) | yes |
| `AGENTS.md` | docs | Agent/onboarding notes for stack, layout, and Intent skills | yes |
| `package-lock.json` | config | Locked npm dependency versions | yes |
| `package.json` | config | Root package manifest and scripts (`preishare-org-repo`) | yes |
| `README.md` | docs | Human-facing project overview | yes |
| `tsconfig.json` | config | TypeScript compiler options and path aliases | yes |
| `tsr.config.json` | config | TanStack Router route-generation config | yes |
| `vite.config.ts` | config | Vite + TanStack Start / React / Tailwind / Devtools setup | yes |

## 3. Frontend concerns (TypeScript, React, TanStack Start)

- Likely app root(s): repository root + `src/` (single app; no nested `apps/web`)
- Clues I used (file names, frameworks mentioned in package.json): `@tanstack/react-start`, `@tanstack/react-router`, `react` / `react-dom`, `vite`, `tailwindcss`; `vite.config.ts` registers `tanstackStart()`; routes use `createFileRoute` / `createRootRoute`
- Entry / routes / UI areas worth knowing:
  - `vite.config.ts` — Start/Vite toolchain entry
  - `src/router.tsx` — router factory (`getRouter()`)
  - `src/routeTree.gen.ts` — **generated** route tree (do not edit by hand)
  - `src/routes/__root.tsx` — root layout / HTML shell
  - `src/routes/index.tsx` — home `/`
  - `src/routes/about.tsx` — `/about`
  - `src/components/` — `Header.tsx`, `Footer.tsx`, `ThemeToggle.tsx`
  - `src/styles.css` — Tailwind entry and design tokens
  - `src/lib/user.ts` — placeholder user helper (returns `null`)
- How this area relates to user-facing screens: file routes under `src/routes/` are the pages people see; shared chrome lives in `src/components/`; Start’s Vite plugin owns the framework bootstrap (no classic `src/main.tsx` / checked-in `index.html` found)

## 4. Backend / data concerns (Supabase, PostgreSQL, pgvector, APIs)

- Supabase or data config paths: **not found yet** (no `supabase/` folder; no `@supabase/*` in `package.json`; `.cursorrules` mentions a future `lib/supabase.ts` that does not exist yet)
- Migrations / SQL / schema-related paths: **not found yet** (no `*.sql`, `migrations/`, Prisma, or Drizzle)
- Env examples (NOT secret values): **not found yet** (no `.env.example`; `.env` is gitignored for when secrets appear later)
- Notes on what a beginner should not touch in production data: there is no in-repo production database config to edit today; when Supabase/migrations/env appear later, do not run destructive SQL, rotate or paste secrets into Git, or “fix” live data without a mentor and a real task. Domain docs under `docs/domain/` describe listing shape for future DB consumers—they are not a live schema.

## 5. Tooling and CI

- TypeScript / lint / format config: `tsconfig.json` (strict TS checks); **no** ESLint / Prettier / Biome configs or `lint`/`format` scripts found; also `vite.config.ts`, `tsr.config.json`, `.cta.json`, `package-lock.json`
- CI workflows (e.g. GitHub Actions): **not found** (no `.github/` in this snapshot)
- Editor or agent config already present: `.vscode/settings.json`, `.cursorrules`, `AGENTS.md`
- Scripts from package manifests that look like dev/build/test: `dev`, `build`, `preview`, `generate-routes` (no `test` script yet)

## 6. Safe first-touch vs do-not-edit-yet

### Safe first-touch (good candidates for a tiny onboarding PR)

| Path or area | Why it is relatively safe | Risk if handled carelessly |
|--------------|---------------------------|----------------------------|
| `docs/onboarding/` | Docs-only; helps teammates onboard | Misleading setup or map docs |
| `docs/` (briefs / domain notes) | Documentation; no runtime impact | Wrong product wording if edited without review |
| `README.md` | Low runtime impact; discoverability | Broken links or outdated install steps |

### Do not edit yet (wait until you have tests, review, and a real task)

| Path or area | Why wait | What could break |
|--------------|----------|------------------|
| CI under `.github/` (when added) | Shared pipeline | Everyone’s builds |
| `package-lock.json` / root dependency churn | Dependency graph for the whole app | Install failures for all |
| Supabase / migrations / production env (when added) | Data and secrets | Data loss or leaked secrets |
| `src/routeTree.gen.ts` | Generated by the router toolchain | Route mismatches; edits get overwritten |
| Shared packages used by multiple apps | N/A today (single package); revisit if monorepo appears | Multiple features regress |
| Auth, payments, or vector/search core (if/when present) | High complexity | Security or relevance bugs |
| `.cursorrules` / `AGENTS.md` / `tsconfig.json` / `vite.config.ts` | Tooling / conventions | Confusing agents or breaking local builds |

## 7. Open questions for the team

- Will Supabase land as a local `supabase/` + SQL migrations tree, or only as a hosted project with a future `src/lib/supabase.ts` client?
- When should `.env.example`, ESLint/Prettier (or Biome), a `test` script, and GitHub Actions be added?
- Is `src/lib/` intended to stay small shared helpers, or become the home for server-only data access?
- Where does the exact TanStack Start runtime bootstrap live if not as a first-party `src/main.tsx` (framework-injected vs checked-in later)?
- Official clone path on each contributor machine may differ from setup-log’s `/home/ubuntu/projects/PREIShare-org-repo`—confirm remotes still match fork (`origin`) + team (`upstream`) from `docs/onboarding/setup-log.md`.

## 8. How I will use this map next

- Configure AI project rules/memory using the paths above (next tooling steps).
- Pick a first contribution only from **Safe first-touch** unless a mentor expands scope.
- Revisit and edit this file when a path claim is proven wrong.
