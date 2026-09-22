# Sprint 3 Handoff — PREIshare Investor Dashboard Shell

## Stakeholder summary

We built a responsive investor dashboard **shell** for PREIshare members.
An investor can open one frame and move between Dashboard Home, Portfolio,
Deals, and Profile without extra pages. The layout works on a wide desktop
and on a phone-width window.

**Nothing on screen is a live account.** Portfolio totals, holdings, deals,
and the member card are labeled mock placeholders so you can demo the product
before any backend is connected. There is no login wall, no live balances,
and no search or payments in this sprint.

Sydni Warner walked the four areas on 2026-09-22
(`docs/verification-checklist.md`). Overall result: **Ready** for a shell demo.

## What shipped

- TanStack Start + TypeScript app (`package.json` name `preishare-investor-dashboard`)
- File-based routes under `src/routes/`:
  - `/` — starter landing with a link into the dashboard
  - `/dashboard` — home overview
  - `/dashboard/portfolio` — holdings table
  - `/dashboard/deals` — open-offering list
  - `/dashboard/profile` — member card
- Shared chrome: `AppShell`, `Sidebar`, `Header`, `NavItems` + `navConfig`
  (`src/components/layout/`). Desktop shows a left sidebar; a Menu button
  opens the same four links on a narrow viewport.
- Home widgets: three `StatsCard`s (portfolio value / open deals / profile
  completeness), `PortfolioSummary`, `RecentActivity`
- Area shells: `PortfolioTable`, `DealsList`, `ProfileCard`
- Responsive + basic a11y polish in `src/styles/dashboard.css` (and a small
  Menu toggle in `Header`)
- Verification checklist: `docs/verification-checklist.md`

What the walkthrough actually showed (mock, labeled as such):

| URL | Header title | What you see |
|-----|--------------|--------------|
| `/dashboard` | Dashboard overview | $300,000 / 3 open deals / 80% profile; summary + activity |
| `/dashboard/portfolio` | Your portfolio | Riverfront Lofts and Cedar Business Park sample rows |
| `/dashboard/deals` | Open deals | Harbor View, Summit Logistics, Oak & Main sample offerings |
| `/dashboard/profile` | Your profile | “Alex Morgan” sample member card + **Sample member** chip |

## How to run locally (cold start)

Scripts below are copied from `package.json`. Do not invent others.

**Prerequisites:** Node.js LTS and npm.

1. From the repo root: `npm install`
2. Start the dev server: `npm run dev`  
   That script is `vite dev --host 0.0.0.0 --port 43123`.
3. Open **http://127.0.0.1:43123/dashboard** (or the starter page at
   http://127.0.0.1:43123/ and click **Open investor dashboard**).

Useful extras that already exist:

- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — `vite build`
- `npm run start` — `vite preview` on the same host/port as `dev`

There is no test script and no lint script in `package.json`.

## Short demo script

1. Open `/dashboard`. Point at the three stats and say they are **sample
   totals**, not live portfolio value. Note the banners on the page.
2. Click **Portfolio**, **Deals**, and **Profile** in the sidebar. The header
   title changes; the sidebar and header stay. Home is the control that
   returns to `/dashboard` (the PREIshare brand is text, not a link).
3. Narrow the window to about 375px. Click **Menu** to open the same four
   links. Resize wide again — the left sidebar comes back; Menu hides.
4. Say clearly: Sprint 3 is a UI shell. No login, no Supabase, no live money.

## Known limitations

These are **not done**. Do not demo them as if they work.

- **No login.** Anyone who can open the URL sees the shell. No auth, no roles.
- **No live data.** Every dollar amount and name is a hardcoded mock. They
  will not change if a real investor’s portfolio changes.
- **No Supabase, PostgreSQL, or pgvector.** Nothing queries a database.
- **No GitHub Actions CI** in this package (no test/lint scripts to hook up).
- **Not production-hardened.** No error boundaries for failed APIs, no
  loading/empty states for real fetches (there are no fetches).
- **No payments, document vault, admin tools, settings, or notifications.**
- Starter `/` is a thin landing page, not a fifth investor product area.

## Recommended next-sprint work

1. Supabase auth and protect `/dashboard/*` (add a login route; do not
   pretend this shell already has one).
2. Replace `MOCK_*` constants in the widgets with live portfolio / deals /
   profile queries (route loaders or server functions).
3. pgvector-powered search for deals or documents — only after data lives
   in Postgres. There is no search UI today.
4. GitHub Actions CI: `npm install`, `npm run typecheck`, plus tests/lint
   once those scripts exist.
5. Empty, loading, and error states on each widget once it talks to a backend.

## References

- Client brief: `docs/investor-dashboard-brief.md`
- IA: `docs/dashboard-ia.md`
- Components: `docs/component-plan.md`
- Verification: `docs/verification-checklist.md`
- Architecture decisions: `docs/architecture-decisions.md`
- Earlier listing-types ADR (Sprint 2): `docs/decisions/ADR-001-investor-listing-types.md`
