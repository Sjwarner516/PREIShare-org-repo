# PREIshare Investor Dashboard — Stakeholder Handoff

**Sprint focus:** Responsive investor dashboard shell (TanStack Start routes + React UI)
**Audience:** PREIshare product stakeholders and the next implementation topic owners
**Date:** 2026-10-07
**Prepared by:** Sydni

## 1. Demo today (what investors can click)

- Open `/dashboard`. Layout chrome comes from `src/routes/dashboard/route.tsx` (`AppShell` + `<Outlet />`). Home content comes from `src/routes/dashboard/index.tsx`.
- Desktop and tablet (~768px and up): persistent sidebar (Home, Portfolio, Deals, Profile) plus header branding and a **Sample member** chip — not a signed-in session.
- Narrow widths (~375px): sidebar is hidden; **Open menu** / **Close menu** in `MobileNav` lists the same four destinations.
- Child URLs in the same shell: `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`.
- Home composition (placeholder / empty, not live balances):
  - Three `MetricCard` tiles: Total portfolio value, Open deals, Profile completeness (values are `—`)
  - `PortfolioSummary` with an empty holdings list and empty-state copy
  - `RecentActivity` with an empty items list and empty-state copy
  - Banner: “Demo shell — figures are placeholders, not live PREIshare balances”

**Out of scope for this demo:** live Supabase data, login/auth gates, editing holdings, or production deployment hardening.

## 2. Requirements traceability

Success criteria copied verbatim from `docs/preishare-dashboard-requirements.md` §6.

| Success criterion (from requirements brief) | Status | Evidence |
| --- | --- | --- |
| An investor can open `/dashboard` in the browser | Met | `src/routes/dashboard/route.tsx`, `src/routes/dashboard/index.tsx` |
| Header, navigation, metrics, and activity regions are all visible on desktop home | Met | `AppShell`, `Header`, `Sidebar`; home composes `MetricCard`, `PortfolioSummary`, `RecentActivity` in `src/routes/dashboard/index.tsx`. QA **D1**, **D4**, **D5** Pass in `docs/responsive-qa-checklist.md`. |
| On a narrow (mobile) width, navigation remains usable (Menu toggle / stacked nav) | Met | `MobileNav` Open/Close menu. QA **M3–M5** Pass (sidebar hidden; menu visible; links Home / Portfolio / Deals / Profile). |
| Placeholder content is clearly labeled so stakeholders know data is not live | Met | Sample-data banner and `—` metric hints on the home index; emptyMessage on `PortfolioSummary` and `RecentActivity`. |
| Requirements in this brief match what was built (no surprise mega-features) | Met | No login, no Supabase client, no `/dashboard/activity` URL, no admin/settings. Nav labels match the routing plan only. |
| A teammate can read this brief and understand scope in under 5 minutes | Met | `docs/preishare-dashboard-requirements.md` (shell only; later = auth, live data, payments). This handoff is the companion for demo vs future work. |

## 3. Decisions made (so the next topic does not re-litigate them)

- **Routing:** File-based TanStack Start tree. Layout is `src/routes/dashboard/route.tsx` (`createFileRoute('/dashboard')` + `AppShell` + `<Outlet />`). Home is `src/routes/dashboard/index.tsx` (`createFileRoute('/dashboard/')`). Activity is a **region on home**, not `/dashboard/activity`.
- **Nav labels:** Home, Portfolio, Deals, Profile only (`src/components/dashboard/navItems.ts`). Same list in `Sidebar` and `MobileNav`. No Login, Settings, Admin, or Activity as top-level items.
- **Shell regions:** `AppShell` composes `Header`, `Sidebar`, `MobileNav`, and `{children}` in `<main id="main-content">` per `docs/dashboard-component-architecture.md`. Widgets do not live in the layout route.
- **Widgets:** `MetricCard`, `PortfolioSummary`, and `RecentActivity` are presentational (typed props, no fetch). Parents pass empty arrays or `—` so later loaders can replace props without rewriting the page.
- **Responsive approach:** Below 768px, sidebar hidden and MobileNav overlay; at 768px+ sidebar visible and MobileNav hidden. QA sign-off: critical M1–M7, T1–T5, D1–D5 Pass. **Ready for stakeholder handoff draft:** Yes.

## 4. Known limitations (honest baseline)

- **Mock data only:** Metric values are `—`. Portfolio holdings and activity items are empty arrays with empty-state sentences. Nothing is read from PostgreSQL/Supabase.
- **Auth not wired:** Anyone who can load the app can open `/dashboard`. The header chip is a presentational “Sample member” placeholder, not a session.
- **No mutations:** Read-only shell. No forms that persist holdings, profile, or subscriptions.
- **QA residual risks** (from `docs/responsive-qa-checklist.md`):
  - Empty lists were QA’d on wrap of empty-state copy, not long live names or timestamp rows.
  - Mobile nav is an overlay panel, not an animated full-height drawer.
  - Cycle 1 fixed home CSS grid tracks only; AppShell / Sidebar / MobileNav were not rewritten because M3–M5 and D1–D2 already Pass.

## 5. Recommended next sprint work

1. Connect loaders or server functions to Supabase for real portfolio, deals, and activity reads; keep widget props stable.
2. Add authentication and protect `/dashboard` (and children) for signed-in investors only.
3. Replace empty arrays and `—` with typed API/DTO shapes; keep `MetricCard`, `PortfolioSummary`, and `RecentActivity` presentational.
4. Re-run `docs/responsive-qa-checklist.md` against real content lengths (long offering names, full vs empty lists).
5. Stakeholder demo script: happy path on ~375px and ~1280px with one real (or fixture) portfolio, plus an explicit “this is still mock” line until loaders ship.

## 6. Artifact index (for handoff package)

- Requirements: `docs/preishare-dashboard-requirements.md`
- Routing plan: `docs/dashboard-routing-plan.md`
- Component architecture: `docs/dashboard-component-architecture.md`
- Responsive QA: `docs/responsive-qa-checklist.md`
- Routes: `src/routes/dashboard/route.tsx`, `src/routes/dashboard/index.tsx`
- Shell: `src/components/dashboard/AppShell.tsx`, `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`
- Home widgets: `src/components/dashboard/MetricCard.tsx`, `PortfolioSummary.tsx`, `RecentActivity.tsx`
