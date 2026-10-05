# PREIshare Dashboard — Component Architecture & Responsive Layout Map

## Purpose

Blueprint for the investor dashboard **shell** only. Implementation agents must
follow these names, regions, and responsive rules. No real portfolio API yet—
placeholder content is OK in later UI steps.

This file does not implement React. It names rooms (layout regions) before
furniture (widgets) so later prompts can build one component at a time.

## Sources

- `docs/preishare-dashboard-requirements.md` — investor actor, home metrics +
  activity, must-have vs later
- `docs/dashboard-routing-plan.md` — URLs and nav labels (Home, Portfolio,
  Deals, Profile). Activity is a **home region**, not a extra route.

Nav destinations in Sidebar and MobileNav **must** match the routing plan.
Do not add `/dashboard/activity`, Login, Settings, or Admin.

## Layout regions

| Region | Role | Typical components |
|--------|------|--------------------|
| Header | Top bar: PREIshare context, page title, simple user/placeholder label | Header |
| Sidebar | Vertical nav on tablet and desktop | Sidebar |
| Mobile nav | Menu button + panel/drawer on small screens | MobileNav |
| Main | Scrollable page content for the active route | Route outlet + home widgets |

AppShell is the frame that places Header, Sidebar/MobileNav, and Main together.
The dashboard **layout route** (`src/routes/dashboard.tsx` or
`src/routes/dashboard/route.tsx`) renders AppShell and an outlet. Home widgets
live only in the **index page**, not in the layout.

## Component inventory

### AppShell

- **Responsibility:** Outer dashboard frame; arranges header, nav, and main.
  Owns whether mobile nav is open (`open` / close on route change).
- **Parent:** Dashboard layout route.
- **Children:** Header, Sidebar, MobileNav, main content slot (`children`).
- **Props (beginner):** `children` (the page content to show in main).

### Header

- **Responsibility:** Top bar with PREIshare branding, current page title, and
  a simple status/user placeholder (for example “Sample member”). On mobile it
  can host the menu **button** that asks AppShell to open MobileNav.
- **Parent:** AppShell.
- **Children:** none required (menu control may live here or on AppShell).
- **Props:** `title` (text, optional—default from the current route label);
  `userLabel` (text, optional placeholder such as “Sample member”).

### Sidebar

- **Responsibility:** Desktop/tablet navigation links matching the routing plan.
  Hidden on mobile (MobileNav takes over).
- **Parent:** AppShell.
- **Children:** nav links (plain elements or a shared list). Same destinations
  as MobileNav.
- **Props:** `items` (list of `{ label, to }` from the routing plan).

### MobileNav

- **Responsibility:** Small-screen navigation (menu panel/drawer). Same four
  destinations as Sidebar. Does not invent a second label list.
- **Parent:** AppShell.
- **Children:** same destinations as Sidebar.
- **Props:** `items` (same shape as Sidebar); `open` (yes/no); `onClose`
  (action). Open state lives in **AppShell**, not in each page.

### MetricCard

- **Responsibility:** One reusable metric tile (label + value + optional hint).
  Prefer this over one-off “TotalEquityCard” components. Three instances on
  home: portfolio value, open deals, profile completeness (placeholders).
- **Parent:** Dashboard home (main).
- **Children:** none required.
- **Props:** `label` (text), `value` (text or number shown as text), `hint`
  (text, optional). Do **not** hard-code dollar amounts inside the component.

*(If the repo already has `StatsCard`, it is the same one-job tile as
MetricCard. Do not ship both.)*

### PortfolioSummary

- **Responsibility:** Short summary block for a portfolio snapshot placeholder
  on home. Not the full Portfolio page table.
- **Parent:** Dashboard home.
- **Props:** `headline` (text), `summaryLines` (list of text), `emptyMessage`
  (text when no data).

### RecentActivity

- **Responsibility:** List of recent activity placeholders for the investor
  (home activity region). Not a separate `/dashboard/activity` route.
- **Parent:** Dashboard home.
- **Props:** `items` (list of `{ id, title, detail, timestamp }`),
  `emptyMessage` (text).

Placeholder child **pages** (Portfolio, Deals, Profile) stay in route files
from the routing plan. They are not extra shell components in this list.

## Composition (dashboard home)

Main content on `/dashboard` (index) should compose roughly:

1. Row/grid of MetricCard (three placeholders: value, open deals, completeness)
2. PortfolioSummary
3. RecentActivity

Empty states: each widget must support a clear empty or “sample data” message
from the requirements brief. Architecture does not require fake production
numbers—parents pass placeholder text in later UI steps.

## Responsive behavior

| Viewport | Approx width | Nav behavior | Main content |
|----------|--------------|--------------|--------------|
| Mobile | < 768px | Sidebar hidden; MobileNav via a large menu control; `open` on AppShell | Single column; MetricCards stack |
| Tablet | 768px–1024px | Sidebar visible (may be narrower). MobileNav stays closed. | 2-column card grid when space allows |
| Desktop | > 1024px | Sidebar visible and fixed/sticky in the shell | Cards in a multi-column grid (up to 3); summary + activity side-by-side when space allows |

Notes for implementers:

- Touch targets on the menu button should be easy to tap (about 44px).
- Main content must remain scrollable; header should not crowd out content.
- Do not rely on hover-only actions for anything required on mobile.
- Header, Sidebar, and MobileNav stay mounted across `/dashboard`,
  `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile`. Only
  the main outlet changes.

## File targets (for later steps—do not create all here)

- `src/components/dashboard/AppShell.tsx`
- `src/components/dashboard/Header.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/components/dashboard/MobileNav.tsx`
- `src/components/dashboard/MetricCard.tsx`
- `src/components/dashboard/PortfolioSummary.tsx`
- `src/components/dashboard/RecentActivity.tsx`

If chrome already lives under `src/components/layout/`, later steps should
reuse or re-export those files to these names—do not create a second AppShell.

## Out of scope (prevent scope creep)

- Real Supabase/PostgreSQL data fetching and auth
- Charts libraries, map views, PDF export, wire transfers
- Additional routes beyond `docs/dashboard-routing-plan.md` (no Activity URL,
  no Login)
- Design-system package extraction or animation-heavy UI
- Editing portfolio holdings
- Payments, tax exports, admin tools, settings hubs

## Success criteria for this blueprint

- Every named component has one clear responsibility.
- Props are listed in plain language (no unexplained advanced patterns).
- Mobile / tablet / desktop nav behavior is explicit.
- Widget list matches investor dashboard home needs from requirements
  (metrics + summary + activity).
- Out-of-scope section blocks accidental mega-features.
- Nav items stay Home, Portfolio, Deals, Profile only.
