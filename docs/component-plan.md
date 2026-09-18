# PREIshare Investor Dashboard — Component Inventory

## Scope

Reusable UI pieces for a responsive shell with **mock data only**.
Components present structure and placeholder content. They do not call APIs,
open auth screens, or take payments. Inline mock constants are allowed this sprint;
real Supabase comes later.

Locked names below must match later agent prompts. Do not rename without updating
this file and `docs/dashboard-ia.md`.

## Layout components (shared chrome)

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `AppShell` | Page frame: Sidebar + Header + main content slot; stacks or collapses nav on a narrow viewport | All `/dashboard/*` pages | Own page widgets (stats, tables, deals, profile); fetch data; define nav labels |
| `Sidebar` | Branding plus the primary nav region on larger screens; renders `NavItems` | `AppShell` | Duplicate the page title (Header owns title); hardcode a second nav list; hardcode deal or holding rows |
| `Header` | Top bar: current page title and a simple mock-member placeholder | `AppShell` | Define the full nav list; render stats, tables, or deals |
| `NavItems` / `navConfig` | Single source of nav labels + paths (Home, Portfolio, Deals, Profile) | `Sidebar` (and mobile menu, if `AppShell` adds one) | Render stats, tables, or page titles; add Settings / Admin / Login links |

`navConfig` is the only place nav labels live. Sidebar and any mobile menu **consume** that list; they do not each invent their own.

## Dashboard home widgets

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `StatsCard` | Show **one** metric: label + value (+ optional mock hint) | Dashboard home (three instances: portfolio value, open deals, profile completeness). Reusable elsewhere if a later page needs a single metric. | Fetch data; own the page layout; list holdings or deals |
| `PortfolioSummary` | Short snapshot of mock portfolio value / allocation on Home | Dashboard home | Replace `PortfolioTable` or become the Portfolio page |
| `RecentActivity` | Simple list of recent mock events | Dashboard home | Own global navigation; fetch live activity |

## Page-level shells

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `PortfolioTable` | Tabular mock holdings | Portfolio page (`/dashboard/portfolio`) | Live market data; live on Home as the full table (`PortfolioSummary` stays the Home snapshot) |
| `DealsList` | List or cards of mock open / available offerings | Deals page (`/dashboard/deals`) | Checkout, subscribe, or payment flows |
| `ProfileCard` | Mock member name, contact, and simple preference placeholders | Profile page (`/dashboard/profile`) | Password change, sign-in, or role switching |

## Composition rules

1. One job per component — if two rows describe the same job, merge or delete one.
2. Layout components wrap pages; page widgets never re-implement `AppShell`.
3. Mock data may be inline constants for this sprint; no backend hooks.
4. Names above are locked — do not rename without updating both planning docs.
5. Every mock number and sample name shown in these widgets is labeled **mock**.

## Mapping check (IA ↔ components)

| URL | Page-level content (inside `AppShell`) |
|-----|----------------------------------------|
| `/dashboard` | `StatsCard` ×3, `PortfolioSummary`, `RecentActivity` |
| `/dashboard/portfolio` | `PortfolioTable` |
| `/dashboard/deals` | `DealsList` |
| `/dashboard/profile` | `ProfileCard` |

Shared on every listed URL: `AppShell` → `Sidebar` + `Header` + main slot; nav from `NavItems` / `navConfig`.

## Brief goals ↔ components

| Brief goal | URL | Components |
|------------|-----|------------|
| Scan portfolio snapshot and recent activity in one glance | `/dashboard` | `StatsCard`, `PortfolioSummary`, `RecentActivity` |
| Move between Home, Portfolio, Deals, Profile in the same frame | all four | `AppShell`, `Sidebar`, `Header`, `NavItems` |
| Readable on phone and desktop; nav stays findable; no overlap | all four | `AppShell` responsive frame; `Sidebar` / mobile menu both read `navConfig` |
