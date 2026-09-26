# PREIshare Dashboard Routing Plan

## Purpose

Map investor-facing dashboard URLs to TanStack Start route files before any
new UI generation. This document is a routing plan only: no component props,
no stylesheet work, and no new route files in this step.

Source requirements: `docs/preishare-dashboard-requirements.md`
(primary actor = investor; home = metrics + activity; placeholder children =
Portfolio, Deals, Profile; login and live data = later).

## Current app inventory (as found)

Read-only listing of `src/routes` in this repo. Do not delete these files
when later steps add or rename dashboard routes.

| File / folder | Likely URL | Notes |
| --- | --- | --- |
| `src/routes/__root.tsx` | (app root layout) | Document shell (`<html>`, head links). Existing shared root — do not replace casually. |
| `src/routes/index.tsx` | `/` | Starter landing with a link into `/dashboard`. Keep it. |
| `src/routes/dashboard.tsx` | `/dashboard` (layout) | Parent layout: wraps children and renders an `<Outlet />`. This is the same job as `src/routes/dashboard/route.tsx` in the folder-route convention. |
| `src/routes/dashboard/index.tsx` | `/dashboard` (index / home) | Investor home: metrics region + activity region. Already present. |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Placeholder child for holdings. Already present. |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Placeholder child for open offerings. Already present. |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Placeholder child for the member card. Already present. |

There is no `src/routes/dashboard/route.tsx` today. TanStack Start treats
`src/routes/dashboard.tsx` as the layout for the `dashboard/` folder. The
GitHub Hobby fork may also still have a starter `src/routes/about.tsx`
(`/about`); that is not an investor screen and is not part of this plan.

`src/router.tsx` and `src/routeTree.gen.ts` sit outside `src/routes` and
are generated/wired by the starter — do not hand-edit them for this plan.

## Planned dashboard route tree

```text
/                          → existing starter home (keep)
/dashboard                 → layout route (shell chrome + outlet)
/dashboard                 → index (investor home: metrics, summary, activity)
/dashboard/portfolio       → placeholder child (holdings)
/dashboard/deals           → placeholder child (open offerings)
/dashboard/profile         → placeholder child (member card)
```

Activity is a **region on the home index**, not its own URL
(`docs/preishare-dashboard-requirements.md` §2 goal 4 and §4 activity
region). Do not add `/dashboard/activity` unless the brief changes.

## File map (exact files)

Paths the next implementation step must honor. Several already exist — do
not recreate them as a second copy.

| URL | Role | File | Status | Wraps / renders |
| --- | --- | --- | --- | --- |
| `/dashboard` | Layout route | `src/routes/dashboard.tsx` (present) or, if starting from an empty tree, `src/routes/dashboard/route.tsx` | Already present as `dashboard.tsx` | Shared dashboard chrome; renders child via Outlet |
| `/dashboard` | Index page | `src/routes/dashboard/index.tsx` | Already present | Investor dashboard home content |
| `/dashboard/portfolio` | Placeholder | `src/routes/dashboard/portfolio.tsx` | Already present | Stub / mock holdings page |
| `/dashboard/deals` | Placeholder | `src/routes/dashboard/deals.tsx` | Already present | Stub / mock offerings page |
| `/dashboard/profile` | Placeholder | `src/routes/dashboard/profile.tsx` | Already present | Stub / mock profile page |

If a later tutorial insists on the folder form `src/routes/dashboard/route.tsx`,
**move** the current layout out of `src/routes/dashboard.tsx` into that file.
Do not keep both. Do not delete `__root.tsx` or `index.tsx`.

## Layout vs page responsibilities

- **Layout (`src/routes/dashboard.tsx` / `src/routes/dashboard/route.tsx`)**:
  persistent navigation regions only (header, sidebar / mobile nav slot,
  main outlet). No metric-card or activity-list business content.
- **Index (`src/routes/dashboard/index.tsx`)**: dashboard home composition
  (metrics region + activity region). Uses the parent layout.
- **Placeholders** (`portfolio`, `deals`, `profile`): minimal pages so nav
  links have real targets inside the same layout. Full live UI comes later.

## Navigation labels (for sidebar / mobile nav later)

| Label | Path | Requirement link |
| --- | --- | --- |
| Home (Overview) | `/dashboard` | Brief §2 goals 1–4 and §3 Dashboard home: branding, metrics, activity |
| Portfolio | `/dashboard/portfolio` | Brief §3 Portfolio: deeper holdings placeholder |
| Deals | `/dashboard/deals` | Brief §3 Deals: open-offering placeholder |
| Profile | `/dashboard/profile` | Brief §3 Profile: member-card placeholder |

Labels stay investor-facing one-word names from the brief (§2 goal 2).
Do not add Login, Settings, Admin, or Activity as top-level nav items.

## Out of scope for this plan

- Component prop designs and styling tokens (later architecture / UI steps)
- Auth guards and loader data shape
- API routes and Supabase queries
- Creating or deleting route files in this commit
- A separate `/dashboard/activity` URL (activity lives on the home index)
- Payments, tax exports, or live charts

## Success criteria for implementation steps

- Visiting `/dashboard` shows the layout shell and home index content region.
- Child placeholder paths (`/dashboard/portfolio`, `/dashboard/deals`,
  `/dashboard/profile`) render inside the same layout (not a blank
  full-page replace of the shell).
- No unrelated existing routes (`/`, `__root`) were deleted during
  dashboard work.

## Open questions

- Should a later step rename `src/routes/dashboard.tsx` to
  `src/routes/dashboard/route.tsx` for tutorial naming, or keep the
  working flat layout file?
- On the GitHub Hobby fork, should starter `/about` stay for the original
  landing chrome, or stay out of investor nav only (current preference)?
