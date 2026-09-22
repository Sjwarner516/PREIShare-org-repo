# PREIshare Investor Dashboard Shell

TanStack Start + TypeScript **UI shell** for PREIshare investors. Four
dashboard areas (Home, Portfolio, Deals, Profile) share one `AppShell`.
Numbers and names are **mock placeholders**, not live accounts.

## Prerequisites

- Node.js LTS
- npm (this repo uses `package-lock.json`)

## Cold start

From the repo root:

```bash
npm install
npm run dev
```

`npm run dev` runs `vite dev --host 0.0.0.0 --port 43123`. Open
**http://127.0.0.1:43123/dashboard** (or http://127.0.0.1:43123/ and click
**Open investor dashboard**).

Other scripts that exist in `package.json`:

| Script | Command |
|--------|---------|
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | `vite build` |
| `npm run start` | `vite preview --host 0.0.0.0 --port 43123` |
| `npm run generate-routes` | `tsr generate` |

There is no `test` or `lint` script.

## Investor URLs

| Path | What you should see |
|------|---------------------|
| `/dashboard` | Stats, portfolio summary, recent activity (mock) |
| `/dashboard/portfolio` | Holdings table (mock) |
| `/dashboard/deals` | Open offerings list (mock) |
| `/dashboard/profile` | Member card (mock) |

## Docs

- Sprint 3 handoff (how to demo, what is mock, what is next): [`docs/sprint3-handoff.md`](docs/sprint3-handoff.md)
- Architecture decisions (why routing, AppShell, mocks): [`docs/architecture-decisions.md`](docs/architecture-decisions.md)
- Client brief: [`docs/investor-dashboard-brief.md`](docs/investor-dashboard-brief.md)
- Information architecture: [`docs/dashboard-ia.md`](docs/dashboard-ia.md)
- Component plan: [`docs/component-plan.md`](docs/component-plan.md)
- Verification checklist: [`docs/verification-checklist.md`](docs/verification-checklist.md)

## Project notes

- File-based routes live under `src/routes/`. `__root.tsx` is the document
  shell; `dashboard.tsx` wraps investor pages in `AppShell`.
- `app.config.ts` re-exports the Vite/TanStack Start config (`vite.config.ts`).
- Listing types from earlier work still live in `src/types/`.
