<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# PREIshare — agent & contributor notes

**Authoritative agent rules:** [`.cursor/rules/preishare.mdc`](.cursor/rules/preishare.mdc)  
Humans and agents should follow that file for stack, safe edit surfaces, coding conventions, secrets/safety, and workflow. Keep this document consistent with it.

### Grounding obligations

1. Use the project rules file and this `AGENTS.md` (plus linked onboarding docs) before changing code or asserting layout.
2. When claiming where something lives, cite concrete paths or file names from this repo (e.g. `src/routes/`, `src/router.tsx`) — not a generic framework layout.
3. If unsure, say **I don’t know** instead of guessing (e.g. inventing Next.js/`app/`, Prisma, `packages/`, or `apps/`).

## What PREIshare is

PREIshare helps people make better real-estate decisions by turning property and market data into clear intelligence. The engineering team ships that as a modern web app: a single package at the repo root with app code in `src/`. Stack: **TypeScript + TanStack Start + React**; Vite toolchain; TanStack Router file routes under `src/routes/`. Planned data layer: **Supabase / PostgreSQL / pgvector** (not in the tree yet). Existing scripts only: `dev`, `build`, `preview`, `generate-routes`.

## Onboarding docs

Start here before changing code:

- [`docs/onboarding/`](docs/onboarding/) — onboarding folder
- [`docs/onboarding/repo-map.md`](docs/onboarding/repo-map.md) — repository map and safe vs do-not-edit paths
- [`docs/onboarding/team-orientation-notes.md`](docs/onboarding/team-orientation-notes.md) — mission, PR workflow, first-PR definition of done
- [`docs/onboarding/setup-log.md`](docs/onboarding/setup-log.md) — local setup notes

## Safe edit surfaces

**Prefer (first contributions):** `docs/onboarding/`, other `docs/`, `README.md`.

**Do not edit yet** (need a real task, tests/review as applicable) — same list as the rules file:

- `src/routeTree.gen.ts` (generated — never hand-edit)
- `package-lock.json` / root dependency churn
- `.cursorrules`, `AGENTS.md`, `tsconfig.json`, `vite.config.ts`
- `.github/` when added; Supabase / migrations / production env when added
- Auth, payments, or vector/search core if/when present

## Safety boundaries

- Prefer **smallest diffs**. No drive-by refactors or unrelated “while I was here” edits.
- Never commit secrets, production credentials, or real customer data. `.env` is gitignored; do not paste secrets into agents or PRs.
- When data/env appear later: no destructive SQL, no “fixing” live data without a mentor and a real task.
- Do not invent scripts or folders not listed in the repo map.
- Treat failing automation checks as blockers when CI exists.
- Work on a feature branch (personal fork); PR to the team repo — do not push directly to the shared default branch.
- Do not ship agent output you cannot explain. Cycle: understand → plan → prompt → review → refine.
