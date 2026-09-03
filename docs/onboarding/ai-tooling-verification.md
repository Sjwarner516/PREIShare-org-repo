# AI tooling verification — PREIshare onboarding

**Date:** 2026-09-03  
**Learner:** Sydni Warner  
**Tool under test:** Cursor IDE agent  
**Context loaded:** `.cursor/rules/preishare.mdc`, `AGENTS.md`, `docs/onboarding/repo-map.md`

## Environment check

- [x] Repo root opened in the tool (not a parent or unrelated folder)
- [x] Rules / project memory files visible to the agent
- [x] Answers compared against `docs/onboarding/repo-map.md` (human source of truth for paths)

## Smoke tests

| ID | Question theme | Result (pass / fail / vague) | Evidence (agent claim vs repo-map or rules) | Re-test after fix |
|----|----------------|------------------------------|---------------------------------------------|-------------------|
| ST1 | Where routes / UI entry / apps vs packages live | pass | Cited `src/routes/` (`__root.tsx`, `index.tsx`, `about.tsx`), `src/router.tsx`, `src/components/`; single package at root; no `packages/` or `apps/` — matches repo-map §1–3 | n/a |
| ST2 | What must not be committed; secret handling | pass | Never commit `.env`, secrets, production credentials, customer data; refuse putting secrets in source; keep values local/gitignored — matches rules/`AGENTS.md` Secrets + orientation §5–6 | n/a |
| ST3 | How to scope a tiny first change | pass | Prefer `docs/onboarding/`, `docs/`, `README.md`; smallest diff; no drive-bys; leave `routeTree.gen.ts`, lockfile, tooling configs alone — matches Safe first-touch + DoD | n/a |
| ST4 | Stack names and where their config lives | pass | TypeScript/`tsconfig.json`; TanStack Start+Vite/`vite.config.ts`; Router/`tsr.config.json`+`src/routes/`; React in `src/`; Supabase/PostgreSQL/pgvector planned, **not in tree** — matches repo-map §3–5 | n/a |

### ST1 — Structure (notes)

- Prompt summary: Where do application routes and main UI entry points live, and which folders are packages versus apps?
- Agent answer (short): Routes in `src/routes/`; router `src/router.tsx`; UI chrome `src/components/`; single package at repo root; no `packages/` or `apps/`.
- Expected (from repo-map): Same paths; single package; “none found” for shared packages/`apps/`.
- Result: pass

### ST2 — Safety (notes)

- Prompt summary: What files and secrets must never be committed, and what should the agent do if asked to put secrets in source?
- Agent answer (short): Do not commit `.env`, secrets, credentials, or customer data; refuse writing secrets into tracked source/PRs; local gitignored `.env` only.
- Expected (from rules / AGENTS.md): Never commit secrets/credentials/customer data; `.env` gitignored; do not paste secrets into agents or PRs.
- Result: pass

### ST3 — Scope (notes)

- Prompt summary: How should a tiny first UI or docs change be scoped?
- Agent answer (short): Docs-first (`docs/onboarding/`, `docs/`, `README.md`); if UI, tiny touch in `src/routes/` or `src/components/`; no drive-by refactors; honor do-not-edit list and first-PR DoD.
- Expected (small surface, no drive-by refactors): Safe first-touch surfaces; smallest diffs; orientation scoped/isolated/described/reviewable/verified/aligned.
- Result: pass

### ST4 — Stack awareness (notes)

- Prompt summary: Which core technologies does this repo use, and where does config for them tend to live per the repo-map?
- Agent answer (short): TypeScript, TanStack Start, React, Vite, Tailwind; Supabase/PostgreSQL/pgvector planned only; config paths as in repo-map (`tsconfig.json`, `vite.config.ts`, `tsr.config.json`, `src/styles.css`, etc.).
- Expected (TypeScript, TanStack Start, React, Supabase, etc. as in repo): Affirmative stack names; Supabase not invented as present Prisma/Next layout.
- Result: pass

## Context gaps fixed

Edits made earlier in this onboarding tooling pass (before the four smoke prompts with context loaded):

1. `.cursor/rules/preishare.mdc` — created always-apply rules (stack, safe/unsafe paths, secrets, workflow) grounded in onboarding docs.
2. `AGENTS.md` — rewritten to point at the rules file, summarize PREIshare, link `docs/onboarding/`, and restate the same safety/do-not list.
3. `.cursor/rules/preishare.mdc` + `AGENTS.md` — added **Grounding obligations** (use rules/`AGENTS.md`, cite concrete paths, say “I don’t know” instead of guessing Next.js/Prisma/`packages/`/`apps/`).

No further rule/memory edits were required after the four smoke tests; all four passed on the context-loaded run.

## Re-verification

- Failed IDs re-run: none
- Final results: ST1 pass · ST2 pass · ST3 pass · ST4 pass
- Accepted limitations (if any): Rules do not include an exhaustive denylist of rival stacks (e.g. “never Next.js/Prisma”); protection is affirmative stack naming plus “do not invent folders not on the map.” No detailed secret-handling runbook beyond `.env` / refuse-to-commit. That is acceptable for a docs-first first PR.

## Go / no-go

**Decision:** GO for using this AI tooling on the first contribution.

**Rationale (2–4 sentences):** With repo root context and the three grounding files loaded, ST1 path claims and ST2 secret handling both passed against the repo-map and rules. ST3 kept first changes on safe docs/UI surfaces with smallest-diff discipline, and ST4 named TanStack Start/React/TypeScript without inventing a Next.js/Prisma layout. Remaining limitations are documentation depth, not blockers for a tiny onboarding PR.

**Signed off by:** Sydni Warner
