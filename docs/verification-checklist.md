# PREIshare Investor Dashboard Shell — Verification Checklist

**Sprint:** 3 (TanStack Start UI shell)  
**Verifier:** Sydni Warner  
**Date:** 2026-09-22  
**App URL tested:** http://127.0.0.1:43123  
**Sources of truth:** `docs/investor-dashboard-brief.md`, `docs/dashboard-ia.md`, `docs/component-plan.md`

## How to use this checklist

- **Pass** — requirement met; evidence describes what you saw.
- **Fail** — in-scope shell issue; fix before handoff or note the fix commit.
- **Deferred** — intentionally out of scope for this sprint; reason required.

---

## 1. Routing and information architecture

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| R1 | `/dashboard` (or agreed home) loads dashboard home inside AppShell | Pass | Opened `http://127.0.0.1:43123/dashboard` (HTTP 200). AppShell stayed up: sidebar `PREIshare` + Home/Portfolio/Deals/Profile, header title **Dashboard overview**, Menu button, main `#main-content`. Saw three stats (Total portfolio value $300,000, Open deals 3, Profile completeness 80%), Portfolio summary, and Recent activity. |
| R2 | `/dashboard/portfolio` loads portfolio page shell | Pass | Opened `/dashboard/portfolio` (HTTP 200). Header title **Your portfolio**. Main showed **Your holdings** table: Riverfront Lofts / Cedar Business Park with invested and current values. Sample banner: “Sample holdings — placeholders only, not live balances.” Table wrapped in `dash-table-wrap`. |
| R3 | `/dashboard/deals` loads deals page shell | Pass | Opened `/dashboard/deals` (HTTP 200). Header title **Open deals**. List showed Harbor View Residences (Tampa, Open), Summit Logistics Hub (Columbus, Closing soon), Oak & Main Retail Strip (Austin, Waitlist), each with a min. investment. Banner: “Sample offerings — not live fundraising.” |
| R4 | `/dashboard/profile` loads profile page shell | Pass | Opened `/dashboard/profile` (HTTP 200). Header title **Your profile**. Profile card: Name Alex Morgan, Email alex.morgan@example.com, Membership Preferred investor, Preferred contact Email, Notes about Southeast multifamily/industrial. Banner: “Sample member card — not a live account.” |
| R5 | Unknown paths do not break the whole app (sensible fallback or framework 404) | Pass | Opened `/dashboard/no-such-page` (HTTP 404). AppShell (sidebar + header + Menu) stayed visible. Main showed framework **Not Found**. Did not blank the chrome. |

**IA notes:** URLs match `docs/dashboard-ia.md` (`/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`). Header titles are the `navConfig` titles (Dashboard overview / Your portfolio / Open deals / Your profile), not the one-word nav labels — that is consistent with `navConfig.title`. Sidebar brand is text, not a link; Home is the control that returns to `/dashboard`. No fifth investor page.

---

## 2. Navigation labels and active states

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| N1 | Sidebar/nav labels match brief/IA (Home/Dashboard, Portfolio, Deals, Profile) | Pass | On every investor URL the sidebar listed **Home**, **Portfolio**, **Deals**, **Profile** in that order. Matches IA one-word labels. No Settings, Admin, or Login items. |
| N2 | Active nav item highlights the current route | Pass | `/dashboard` marked Home `aria-current="page"`. `/dashboard/portfolio` marked Portfolio. `/dashboard/deals` marked Deals. `/dashboard/profile` marked Profile. Home did not stay active on child URLs (exact match on `/dashboard`). |
| N3 | Header page title updates when changing routes | Pass | Clicked Home → header **Dashboard overview**. Portfolio → **Your portfolio**. Deals → **Open deals**. Profile → **Your profile**. Title always matched `getPageTitle` for that path. |
| N4 | Nav links use client routing (no full page reload flash if applicable) | Pass | Sidebar items are TanStack `Link`s from `NavItems` / `navConfig` (single list). Changing areas kept AppShell mounted; only the main slot swapped. `/` starter page has “Open investor dashboard” `Link` to `/dashboard`. |

---

## 3. Layout shell and responsiveness

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| L1 | AppShell shows sidebar + header + main content on desktop | Pass | At a wide viewport (~1280px CSS: no 767px collapse), `/dashboard` showed left `aside#investor-sidebar` (brand + nav), top header (Menu hidden via `.dash-menu-toggle { display: none }`, title, sample-member chip), and main content to the right. Same chrome on portfolio, deals, and profile. |
| L2 | Narrow viewport: nav remains usable (collapse, drawer, or stacked pattern) | Pass | `src/styles/dashboard.css` `@media (max-width: 767px)` stacks `.dash-shell` to column, shows the Menu button (`aria-label="Open navigation"`, `aria-expanded`, `aria-controls="investor-sidebar"`), and collapses `.dash-sidebar` to `max-height: 0` until `.nav-open`. Clicking Menu toggles `nav-open` on AppShell and reveals the same Home/Portfolio/Deals/Profile list. Close control and backdrop labeled “Close navigation.” |
| L3 | No permanent horizontal scroll on home/portfolio/deals/profile at ~375px width | Pass | Core pages use `min-width: 0` on the main column. Home stats use `dash-card-grid` (1 column below 640px). Holdings table sits in `dash-table-wrap` with `overflow-x: auto` so only the table scrolls, not the whole page. Deals and profile are stacked cards/fields. |
| L4 | Main content remains readable; cards/tables stack or scroll intentionally | Pass | Home: stats 1 → 2 → 3 columns at 640 / 1024. Portfolio: wide table scrolls inside the wrap (min-width 36rem on the table). Deals: card list. Profile: definition list. No overlapping header/nav on the documented breakpoints. |
| L5 | Basic accessibility: buttons/links are keyboard-focusable; interactive controls have accessible names | Pass | Menu is a real `<button>` with `aria-label="Open navigation"`. Sidebar is `aside` `aria-label="Investor navigation"`. Skip link “Skip to main content.” Close/backdrop buttons use `aria-label="Close navigation"`. Decorative icons use `aria-hidden="true"`. `:focus-visible` outline is 2px on nav and header controls. Sample member chip has `aria-label="Sample member"`. |

---

## 4. Mock content clarity (demo readiness)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| M1 | Dashboard home: stats cards show labeled mock investor metrics | Pass | `/dashboard` stats: **Total portfolio value** $300,000 (hint Sample total), **Open deals** 3 (Sample count), **Profile completeness** 80% (Sample profile). Page banner: “Demo shell — all figures are placeholders, not live accounts.” |
| M2 | Portfolio summary / table shows clear placeholder holdings | Pass | Home Portfolio summary: Total (sample) $300,000; Riverside Court 40% $120,000; Harbor Logistics 35% $105,000; cash reserve 25% $75,000; banner “Sample data — placeholders only, not live balances.” Portfolio page table: Riverfront Lofts $50,000 → $56,200 Performing; Cedar Business Park $75,000 → $74,100 Under review; banner “Sample holdings — placeholders only, not live balances.” |
| M3 | Deals list shows open-deal style placeholders | Pass | `/dashboard/deals`: Harbor View Residences Min. $25,000 Open; Summit Logistics Hub Min. $50,000 Closing soon; Oak & Main Retail Strip Min. $15,000 Waitlist. Banner “Sample offerings — not live fundraising.” No checkout or payment controls. |
| M4 | Profile card shows member-style placeholder fields | Pass | `/dashboard/profile`: Alex Morgan / alex.morgan@example.com / Preferred investor / Email / Southeast interest note. Banner “Sample member card — not a live account.” No password or sign-in fields. Header also shows a **Sample member** chip (component-plan header placeholder). |
| M5 | No raw "TODO" / empty broken panels on primary views | Pass | Grepped the four investor URLs: no `TODO`, no empty main. Each primary view had a heading, sample banner, and filled mock rows/fields. |

---

## 5. Out-of-scope boundaries (must stay deferred)

| ID | Check | Status | Evidence / reason |
|----|--------|--------|-------------------|
| O1 | No real authentication / login gate required for shell demo | Deferred | Brief marks sign-in / auth out of scope. All four areas load without a login wall. No login route was added. |
| O2 | No live Supabase/PostgreSQL data — mock data only | Deferred | Widgets use inline `MOCK_*` constants (`StatsCard` values, `MOCK_HOLDINGS`, `MOCK_DEALS`, `MOCK_PROFILE`). No fetch/Supabase client. Sample banners say data is not live. |
| O3 | No production deploy required for this verification | Deferred | Walkthrough used the local dev server at `http://127.0.0.1:43123`. Production Hobby URL is a separate Canvas/PAUL concern, not this checklist. |
| O4 | No payment, document vault, or admin tools added beyond brief | Pass | Nav and routes are only Home, Portfolio, Deals, Profile (plus starter `/` and framework 404). No payments, vault, admin, settings, or notifications screens shipped. |

---

## 6. Defects found and resolution

| Defect | Severity (blocker / polish) | Resolution | Re-check |
|--------|----------------------------|------------|----------|
| Header `header-actions` was empty — `docs/component-plan.md` asks for a simple mock-member placeholder next to the page title | polish | Added a default **Sample member** chip (`aria-label="Sample member"`) in `src/components/layout/Header.tsx` and the colocated `src/styles/dashboard.tsx` Header. Not a live account. | Pass — chip visible on all four investor URLs |
| Sidebar brand “PREIshare” is not a link | polish (accepted) | IA does not require a logo URL. Home nav lands on `/dashboard`. Left as text brand to avoid a fifth destination. | Pass — documented; Home is the home control |

No blocker defects. In-scope polish above is fixed or accepted.

---

## 7. Sign-off for handoff

- [x] All **blocker** fails fixed or explicitly accepted with reason
- [x] Deferred items only cover agreed out-of-scope work
- [x] Shell is demoable against the PREIshare client story for Sprint 3

**Overall result:** Ready for stakeholder handoff

**Verifier signature:** Sydni Warner, 2026-09-22, local walkthrough at http://127.0.0.1:43123
