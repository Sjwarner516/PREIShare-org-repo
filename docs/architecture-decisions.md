# Architecture Decisions — PREIshare Dashboard Shell (Sprint 3)

These notes explain **why** the shell is shaped this way so a teammate does
not rip out the wrong piece. They are not a claim that auth, live data,
pgvector, or CI already exist.

Related older work: listing TypeScript types live in `src/types/` and are
recorded in `docs/decisions/ADR-001-investor-listing-types.md`. That ADR is
about compile-time contracts, not this UI shell.

## ADR-001: TanStack Start with file-based routes

- **Context:** The brief and IA lock four investor URLs. We needed a
  TypeScript app where each URL is obvious in the repo, with room later for
  per-route data loading — without standing up a second framework.
- **Decision:** Use TanStack Start + TypeScript. Routes live as files under
  `src/routes/`: `__root.tsx` (document/head), `index.tsx` (`/`),
  `dashboard.tsx` (parent layout), and children
  `dashboard/index.tsx`, `dashboard/portfolio.tsx`, `dashboard/deals.tsx`,
  `dashboard/profile.tsx`.
- **Consequences:** Nav paths match the IA. A missing file is a 404 (the
  walkthrough hit `/dashboard/no-such-page` and kept AppShell). Later
  loaders/server functions can attach per route. Do not replace this tree
  with a hand-rolled switch or a second app just to add data.

## ADR-002: Shared AppShell layout

- **Context:** Every investor page needs the same chrome: sidebar, header,
  main. Duplicating that in each page file would drift (two titles, two nav
  lists, broken mobile menu).
- **Decision:** `AppShell` (`src/components/layout/AppShell.tsx`) owns
  `Sidebar` + `Header` + `<main id="main-content">`. `src/routes/dashboard.tsx`
  wraps child routes with `AppShell`. `AppShell` toggles a `nav-open` class
  for the Menu button; it does not own stats, tables, or deals.
- **Consequences:** Page files stay focused on one widget. Layout and Menu
  fixes happen in one place (`AppShell` / `Header` / `src/styles/dashboard.css`).
  Do not re-implement a second shell inside Portfolio or Profile.

## ADR-003: Central nav config

- **Context:** Labels, paths, active states, and header titles must stay
  aligned. Hardcoding “Home / Portfolio / Deals / Profile” in both Sidebar
  and Header is how those lists go stale.
- **Decision:** `src/components/layout/navConfig.ts` is the only destination
  list (`label`, `path`, `title`). `NavItems` renders TanStack `Link`s from
  that list. `getPageTitle(pathname)` feeds `Header`. Home uses exact-match
  active state so it does not stay highlighted on `/dashboard/deals`.
- **Consequences:** Adding an investor page is a config row **plus** a route
  file — and an IA/component-plan update. Do not add Settings, Admin, or
  Login links here unless the brief changes. The PREIshare brand is a `div`,
  not a fifth destination; **Home** returns to `/dashboard`.

## ADR-004: Mock data boundary for the shell

- **Context:** Sprint 3 is a trustworthy demo shell. Inventing a “fake API”
  that looks like production would hide where live data should plug in and
  would let stakeholders mistake $300,000 for a real balance.
- **Decision:** Widgets take optional props and fall back to inline `MOCK_*`
  constants (`StatsCard` usage on home, `PortfolioTable`, `DealsList`,
  `ProfileCard`, `PortfolioSummary`, `RecentActivity`). Sample banners on
  every primary view say the content is not live. No `fetch`, no Supabase
  client, no hidden service layer.
- **Consequences:** Next sprint can pass real data into the same components
  (or swap the constants at the route) without untangling a pretend backend.
  Do not add a mock REST server “to look more real.” Do not remove the
  sample banners until live data is actually wired.

## ADR-005: Responsive CSS + accessibility baseline

- **Context:** Investors will use a laptop and a phone. Overlapping controls
  and unlabeled icon buttons break trust in a finance UI. A full a11y audit
  was out of scope; a demo-safe baseline was not.
- **Decision:** Shared rules live in `src/styles/dashboard.css` (imported
  from `src/routes/__root.tsx` via `import dashboardCss from
  '../styles/dashboard.css?url'` and from the global stylesheet). Narrow
  viewports (max-width 767px) hide the sidebar until Menu (`aria-label="Open
  navigation"`, `aria-expanded`, `aria-controls="investor-sidebar"`) sets
  `nav-open`. Cards use `dash-card-grid`; the holdings table uses
  `dash-table-wrap` (page does not permanently scroll sideways). Decorative
  icons are `aria-hidden`; icon-only close controls have `aria-label`.
  `:focus-visible` outlines sit on nav and header controls. Touch targets
  aim at 44px.
- **Consequences:** The 2026-09-22 walkthrough passed desktop 1280px and
  phone 375px after small CSS fixes (Menu specificity, collapsed drawer
  `display: none`, profile field wrap). Deeper audits, contrast tokens, and
  a real skip-flow test still belong before production.

## Next-sprint foundations (do not reverse casually)

| Foundation | Why it builds on this shell |
| --- | --- |
| Supabase auth | Protect `/dashboard/*` and replace the **Sample member** chip / `ProfileCard` mocks with a signed-in user. Add login routes; do not stuff auth into `navConfig` as a fake “Log in” that goes nowhere. |
| Live portfolio data | Replace `MOCK_*` in `StatsCard` / `PortfolioSummary` / `PortfolioTable` / `DealsList` via route loaders or server functions on the existing files. Keep AppShell out of data fetching. |
| pgvector search | Add a search UI on deals or documents only after offerings live in Postgres. There is no search box or vector index in this sprint. |
| GitHub Actions CI | Gate PRs with `npm install` and `npm run typecheck` on this package. Add test/lint scripts before you claim a full CI matrix — they are not in `package.json` today. |

## Explicit non-goals for Sprint 3

- Real authentication, authorization, or a login gate
- Live balances or any Supabase / PostgreSQL / pgvector integration
- GitHub Actions (or other) CI beyond what a teammate runs locally
- Real money movement, trading, or compliance workflows
- Payments, document vaults, admin CRUD, settings, notifications
- Final visual brand system
- Production deployment hardening

## References

- `docs/investor-dashboard-brief.md`
- `docs/dashboard-ia.md`
- `docs/component-plan.md`
- `docs/verification-checklist.md`
- `docs/sprint3-handoff.md`
