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

## 1. Routing and information architecture (R1–R5)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| R1 | `/` lands on the starter page and reaches `/dashboard` | Pass | Opened `http://127.0.0.1:43123/` (HTTP 200). Saw `<h1>PREIshare</h1>`, copy “Investor dashboard shell — starter home route.”, and link **Open investor dashboard**. Clicked that link; URL became `http://127.0.0.1:43123/dashboard`. AppShell stayed: sidebar brand `PREIshare` (a `div`, not a link), nav Home/Portfolio/Deals/Profile, header title **Dashboard overview**, **Sample member** chip, main `#main-content`. Home showed three stats ($300,000 / 3 / 80%), Portfolio summary, and Recent activity. |
| R2 | `/dashboard` and `/dashboard/portfolio` are their own routes with titles | Pass | Reloaded `http://127.0.0.1:43123/dashboard` (HTTP 200): header **Dashboard overview**, Home `aria-current="page"`. Clicked sidebar **Portfolio**; URL `http://127.0.0.1:43123/dashboard/portfolio` (HTTP 200). Header became **Your portfolio**. Main showed **Your holdings** table (Riverfront Lofts Multifamily $50,000 → $56,200 Performing; Cedar Business Park Industrial $75,000 → $74,100 Under review) inside `dash-table-wrap`. Banner: “Sample holdings — placeholders only, not live balances.” |
| R3 | `/dashboard/deals` is its own route with a title | Pass | Clicked sidebar **Deals** from portfolio. URL `http://127.0.0.1:43123/dashboard/deals` (HTTP 200). Header **Open deals**. List: Harbor View Residences (Tampa, FL · Multifamily, Min. $25,000, Open); Summit Logistics Hub (Columbus, OH · Industrial, Min. $50,000, Closing soon); Oak & Main Retail Strip (Austin, TX · Retail, Min. $15,000, Waitlist). Banner: “Sample offerings — not live fundraising.” AppShell (sidebar + header + main) stayed. |
| R4 | `/dashboard/profile` is its own route with a title | Pass | Clicked sidebar **Profile**. URL `http://127.0.0.1:43123/dashboard/profile` (HTTP 200). Header **Your profile**. Card fields: Name Alex Morgan, Email alex.morgan@example.com, Membership Preferred investor, Preferred contact Email, Notes about Southeast multifamily/industrial. Banner: “Sample member card — not a live account.” Header chip still read **Sample member**. |
| R5 | Unknown path keeps the shell and shows a fallback | Pass | Opened `http://127.0.0.1:43123/dashboard/no-such-page` (HTTP 404). Sidebar + header + **Sample member** chip stayed. Header title fell back to **Dashboard overview**. Main showed framework **Not Found**. Chrome did not blank. No fifth investor page exists in the route tree (`/`, four dashboard URLs, and this 404 only). |

**IA notes:** Paths match `docs/dashboard-ia.md`. Header titles are `navConfig.title` values (Dashboard overview / Your portfolio / Open deals / Your profile), not the one-word nav labels. Sidebar brand **PREIshare** is a `div`, not a link — **Home** is the control that returns to `/dashboard`. That is accepted.

---

## 2. Navigation labels and active states (N1–N4)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| N1 | Sidebar labels are Home, Portfolio, Deals, Profile | Pass | On `http://127.0.0.1:43123/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile` the sidebar listed **Home**, **Portfolio**, **Deals**, **Profile** in that order. Same four labels appeared in the phone Menu drawer. No Settings, Admin, Login, or Payments items. |
| N2 | Active nav matches the current URL | Pass | At `/dashboard`, Home had `aria-current="page"` and `nav-link-active`. After clicking Portfolio, only Portfolio was current. Deals and Profile behaved the same. Home did not stay active on child URLs (exact match on `/dashboard`). On `/dashboard/no-such-page` no nav item was current. |
| N3 | Header title updates when the route changes | Pass | Clicked Home → header **Dashboard overview**. Portfolio → **Your portfolio**. Deals → **Open deals**. Profile → **Your profile**. Titles matched `getPageTitle` for each URL while AppShell stayed mounted. |
| N4 | Home / brand behavior and client routing | Pass | Clicked sidebar **Home** from Profile; URL returned to `http://127.0.0.1:43123/dashboard` without leaving the shell. Clicked the **PREIshare** brand: it is a `div` (tag=DIV, not a link), so it did not navigate. Home remains the home control. Sidebar items are TanStack `Link`s from one `navConfig` list; only the main slot swapped. |

---

## 3. Layout shell and responsiveness (L1–L5)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| L1 | Desktop (~1280px): sidebar + header + main | Pass | At 1280×800 on `http://127.0.0.1:43123/dashboard`: left `aside#investor-sidebar` (brand + four nav links), top header (title **Dashboard overview**, **Sample member** chip), main to the right. Menu button computed `display: none` (not visible). Same chrome on portfolio, deals, and profile. Horizontal overflow 0. |
| L2 | Narrow phone (~375px): Menu toggle; nav usable | Pass | At 375×812 on `http://127.0.0.1:43123/dashboard`: sidebar `display: none` / height 0 (no leftover brand bar). Menu button visible with `aria-label="Open navigation"`. Clicked Menu: `aria-expanded="true"`, `nav-open` on AppShell, drawer showed PREIshare + Home/Portfolio/Deals/Profile + Close. Clicked Portfolio in the drawer; header became **Your portfolio** and the drawer closed. Repeated for Deals and Profile. |
| L3 | No permanent page-level horizontal scroll on core pages | Pass | After the profile-wrap fix: at 375px, `documentElement.scrollWidth === clientWidth` (375) on Home, Portfolio, Deals, and Profile (overflowX 0). Portfolio table is allowed to scroll inside `dash-table-wrap` only; the page itself does not. First pass had Profile overflowX 43 (email clipped); re-check after stacking fields: email fully visible, overflowX 0. |
| L4 | Cards/tables stack or scroll intentionally | Pass | Home at 375px: stats stacked in one column (`dash-card-grid`); Portfolio summary rows wrap. Desktop home: three stats in a row, summary + activity side by side. Portfolio table uses `dash-table-wrap`. Deals stay a stacked list. Profile fields stack on the phone breakpoint. No overlapping header/nav after the Menu/sidebar CSS fix. |
| L5 | Keyboard: Menu and nav links have accessible names | Pass | At `http://127.0.0.1:43123/dashboard` (1280px) Tab order named: **Skip to main content**, **Home**, **Portfolio**, **Deals**, **Profile**, then **Open navigation** (`aria-label` on the Menu button, hidden visually on desktop). At 375px Tab order named: **Skip to main content**, **Close navigation**, **Home**, **Portfolio**, **Deals**, **Profile**, **Open navigation**. Chip has `aria-label="Sample member"`. Focus-visible outline is 2px on those controls. |

---

## 4. Mock content clarity (M1–M5)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| M1 | Home stats are labeled mock investor metrics | Pass | `http://127.0.0.1:43123/dashboard`: banner “Demo shell — all figures are placeholders, not live accounts.” Cards: **Total portfolio value** $300,000 (Sample total), **Open deals** 3 (Sample count), **Profile completeness** 80% (Sample profile). |
| M2 | Portfolio summary / table are labeled placeholders | Pass | Home Portfolio summary: “Sample data — placeholders only, not live balances”; Total (sample) $300,000; Riverside Court 40% $120,000; Harbor Logistics 35% $105,000; cash reserve 25% $75,000. `/dashboard/portfolio` table banner “Sample holdings — placeholders only, not live balances” with two mock rows. |
| M3 | Deals list is open-deal style mock content | Pass | `http://127.0.0.1:43123/dashboard/deals`: “Sample offerings — not live fundraising.” Three offerings with location, min. investment, and Open / Closing soon / Waitlist. No checkout or payment controls. |
| M4 | Profile card is a mock member; header has a sample-member chip | Pass | `http://127.0.0.1:43123/dashboard/profile`: “Sample member card — not a live account.” Name/email/membership/contact/notes placeholders only — no password or sign-in. Header **Sample member** chip (`aria-label="Sample member"`) on all four investor URLs. First HTML pass found empty `header-actions`; chip was added and re-checked. |
| M5 | No raw TODO or empty broken panels | Pass | Grep of `src/` and the four live URLs: no `TODO`. Each primary view had a heading, sample banner, and filled mock rows/fields. Unknown path is the only empty main, and it shows **Not Found**. |

---

## 5. Out-of-scope boundaries (O1–O4)

| ID | Check | Status | Evidence / reason |
|----|--------|--------|-------------------|
| O1 | Real authentication / login gate | Deferred | Brief marks sign-in, auth, and role-based authorization out of scope. All four investor URLs load without a login wall. No login route was added. Missing login is not a Fail. |
| O2 | Live Supabase / PostgreSQL data | Deferred | Brief requires mock data only. Widgets use inline `MOCK_*` constants. No fetch or Supabase client. Sample banners state the figures are not live. |
| O3 | Production deploy | Deferred | This verification used the local TanStack Start dev server at `http://127.0.0.1:43123`. Production hosting is not a Sprint 3 shell criterion. |
| O4 | Payments, document vault, admin tools | Deferred | Brief lists payments, e-sign, admin CRUD, notifications, settings, and vaults as non-goals. Nav and routes are only Home, Portfolio, Deals, Profile (plus starter `/` and framework 404). None of those extra products were required or built. |

---

## 6. Defects found and resolution

| Defect | Severity (blocker / polish) | Resolution | Re-check |
|--------|----------------------------|------------|----------|
| Header `header-actions` was empty — `docs/component-plan.md` requires a simple mock-member placeholder | polish | Default **Sample member** chip (`aria-label="Sample member"`) in `Header` (`src/components/layout/Header.tsx` and colocated `src/styles/dashboard.tsx`). Not a live account. | Pass — chip visible on all four investor URLs at 1280px and 375px |
| Desktop Menu stayed visible at 1280px because `.dash-header button { display: inline-flex }` beat `.dash-menu-toggle { display: none }` | polish | Raised Menu hide/show specificity in `src/styles/dashboard.css`. | Pass — at 1280×800 Menu `display: none`; sidebar remains the desktop nav |
| Phone sidebar leaked the PREIshare brand bar when closed (`max-height: 0` lost to flex `min-height: auto`) | polish | Collapsed drawer uses `display: none` until `.nav-open`. | Pass — at 375px closed sidebar height 0; Menu opens the four links |
| Profile page overflowed 43px at 375px (`alex.morgan@example.com` clipped) | polish | Profile fields wrap/stack in `dashboard-home.css`; `overflow-wrap: anywhere`. | Pass — `/dashboard/profile` at 375px overflowX 0; full email visible |
| Sidebar brand “PREIshare” is not a link | polish (accepted) | IA does not require a logo URL. Home nav lands on `/dashboard`. Left as a text brand. | Pass — documented; Home is the home control |

No remaining blocker defects.

---

## 7. Sign-off for handoff

- [x] All **blocker** fails fixed or explicitly accepted with reason
- [x] Deferred items only cover agreed out-of-scope work
- [x] Shell is demoable against the PREIshare client story for Sprint 3

**Overall result:** Ready

**Verifier signature:** Sydni Warner, 2026-09-22, browser walkthrough at http://127.0.0.1:43123 (desktop 1280×800 and phone 375×812)
