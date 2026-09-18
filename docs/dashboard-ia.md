# PREIshare Investor Dashboard — Information Architecture

## Purpose

Map of investor-facing pages for the dashboard shell (mock data only).
This sprint covers **four unique URLs** under `/dashboard`. No auth flows,
admin tools, settings, payments, or live API contracts.

Source brief: `docs/investor-dashboard-brief.md`.

## URL map and page purposes

| URL path | Route name | Nav label | Page purpose | Primary content |
|----------|------------|-----------|--------------|-----------------|
| `/dashboard` | Dashboard home | Home | Let an investor scan mock portfolio value, open-deal count, and recent activity in one glance | Page title; three `StatsCard`s (portfolio value, open deals, profile completeness); `PortfolioSummary`; `RecentActivity` |
| `/dashboard/portfolio` | Portfolio | Portfolio | Review mock holdings at a glance without leaving the dashboard frame | Page title; `PortfolioTable` (mock holding rows, labeled mock) |
| `/dashboard/deals` | Deals | Deals | See mock open / available real-estate offerings | Page title; `DealsList` (mock offering rows or cards, labeled mock) |
| `/dashboard/profile` | Profile | Profile | View this member’s mock name and contact details | Page title; `ProfileCard` (mock name and contact, labeled mock) |

Each path is unique. Nav labels are one word. There is no fifth investor page.

## Investor goals → URL

| Brief goal | URL that covers it | What the investor uses |
|------------|--------------------|------------------------|
| Land on a home overview with a portfolio snapshot and recent-activity placeholder | `/dashboard` | Stats row, `PortfolioSummary`, `RecentActivity` |
| Move to Portfolio, Deals, and Profile without leaving the dashboard frame | All four URLs | Persistent nav from `navConfig` (Home, Portfolio, Deals, Profile) |
| Use the layout on a phone and on a desktop; labels stay clear; content does not overlap | All four URLs | Shared `AppShell` (sidebar / header / main); nav collapses or stacks on a narrow viewport |

## Navigation rules

- Shared chrome on every investor URL: left sidebar (desktop) + top header; main content on the right (desktop) or below (narrow viewport).
- Nested under `/dashboard` so one parent layout wraps all four pages.
- Active nav item matches the current URL path.
- Labels stay short and investor-friendly: **Home**, **Portfolio**, **Deals**, **Profile**.
- Nav labels and paths live in **one** `navConfig` / `NavItems` list — not separately in Header and Sidebar.
- On a narrow viewport, navigation collapses or stacks; controls do not overlap content.
- English copy. One investor viewing their own mock portfolio. No account switcher.

## Out of scope for this shell

Do not add routes or nav items for:

- Sign-in / sign-up / password pages
- Live Supabase or other database queries
- Admin or sponsor tools
- Payments, subscriptions, or document vaults
- Settings, notifications, or multi-portfolio switchers

## Demo checks (from the brief)

- [ ] From any of the four areas, persistent nav reaches Home, Portfolio, Deals, and Profile.
- [ ] Each area is its own route and shows a clear page title.
- [ ] Layout has a sidebar (or equivalent), a header, and a main content region.
- [ ] Narrow viewport: nav collapses or stacks; content stays readable.
- [ ] Every mock figure or sample name is labeled mock.
- [ ] No extra in-scope pages beyond these four.

## Notes for later route files

Names below are locked for scaffold prompts. Do not rename without updating this file and `docs/component-plan.md`.

| URL | File-based route (TanStack Start) |
|-----|-----------------------------------|
| parent layout | `dashboard` (wraps children with `AppShell`) |
| `/dashboard` | child `index` (home) |
| `/dashboard/portfolio` | child `portfolio` |
| `/dashboard/deals` | child `deals` |
| `/dashboard/profile` | child `profile` |
