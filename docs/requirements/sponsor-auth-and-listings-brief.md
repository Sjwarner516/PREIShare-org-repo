# Sponsor Auth & Property Listings — Requirements Brief (Sprint 4)

## Client story (restated)

PREIshare sponsors (the people who list properties) need to sign in to the existing TanStack Start dashboard and manage **real** property listings stored in PostgreSQL. Anyone who is not signed in must not see listing data. Secret keys and privileged database access stay on the server and must never ship in the browser bundle.

This sprint does not rebuild the investor marketing site. It adds sponsor login and Postgres-backed create/read for listings the signed-in sponsor owns.

## Actors

| Actor | Goal |
| --- | --- |
| Sponsor | Register and log in with email/password, then create and view only their own property listings |
| Unauthenticated visitor | Can open the public home page and login/signup only; cannot see listing rows or protected dashboard listing pages |
| System (server) | Check the session before protected routes, talk to Supabase/Postgres with the correct keys, and never expose the service-role key to the client |

The existing UI still talks like an “investor dashboard.” For this sprint, the signed-in person who creates listings is the **sponsor**. Investor browse, roles beyond sponsor, and live portfolio balances stay deferred.

## Goals for this sprint

1. A sponsor can register and log in with Supabase Auth email/password (or the equivalent email flow Supabase provides).
2. Dashboard routes that show listings require a valid session; a logged-out visitor is sent to login instead of seeing listing data.
3. Property listings are stored in Postgres. They are not the hardcoded arrays in `src/fixtures/sample-investor-listings.ts` or the mock deal/holding defaults in dashboard components.
4. A signed-in sponsor can create a listing and read back the listings that belong to them (ownership via `auth.uid()`, enforced in the database).
5. Environment values are separated: the project URL and anon/publishable key may be used from client-safe config; the service-role key and any other privileged secrets stay server-only and are never committed.

## Out of scope (defer)

- Payment processing, subscriptions, or capital-account money movement
- Document uploads, offering memoranda, or image storage
- Full admin roles, compliance review queues, or multi-tenant organizations
- Social OAuth providers beyond email/password
- Production custom domain, Vercel project changes, or a second Hobby app
- Replacing every investor mock widget (portfolio totals, recent activity, sample profile chip) with live balances
- Editing, deleting, publishing-workflow, or investor-facing public listing browse
- Writing Supabase SQL, `.env` files, or login components in **this** step (later steps consume this brief)

## Current dashboard observations

Taken from this repo on `main` (TanStack Start + React + TypeScript). File-based routes live under `src/routes/`; the generated tree is `src/routeTree.gen.ts`. `package.json` has no `@supabase/supabase-js` (or other Supabase) dependency. There is no `.env` or `.env.example`.

### Routes that exist

| Path | File | What it does today |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` | Public starter home (“Investor dashboard shell”) with a `Link` to `/dashboard`. No auth. |
| `/dashboard` (layout) | `src/routes/dashboard/route.tsx` | Wraps children in `AppShell` + `<Outlet />`. No `beforeLoad`, no session check. |
| `/dashboard/` | `src/routes/dashboard/index.tsx` | Home widgets (`MetricCard`, `PortfolioSummary`, `RecentActivity`) fed **empty arrays** and hardcoded `demoMetrics` values of `—`. Banner says placeholders, not live balances. |
| `/dashboard/portfolio` | `src/routes/dashboard/portfolio.tsx` | Renders `PortfolioTable` with **default mock holdings** (`Riverfront Lofts`, `Cedar Business Park`) from `src/components/dashboard/PortfolioTable.tsx`. |
| `/dashboard/deals` | `src/routes/dashboard/deals.tsx` | Renders `DealsList` with **default mock deals** (`Harbor View Residences`, etc.) from `src/components/dashboard/DealsList.tsx`. These are investor “open deals,” not sponsor listing records. |
| `/dashboard/profile` | `src/routes/dashboard/profile.tsx` | Renders `ProfileCard` with **default mock profile** (`Alex Morgan`) from `src/components/dashboard/ProfileCard.tsx`. |

Nav labels and targets in `src/components/dashboard/navItems.ts`: Home `/dashboard`, Portfolio `/dashboard/portfolio`, Deals `/dashboard/deals`, Profile `/dashboard/profile`.

Routes that **do not** exist: `/login`, `/signup`, `/logout`, `/dashboard/listings`, or any other listings CRUD path.

### Listings today (mock vs real)

- Typed product shape already exists: `src/types/investor-listing.ts` (`InvestorListing` with title, status, property type, nested address, optional financial summary, contacts, ownership).
- Hardcoded samples live in `src/fixtures/sample-investor-listings.ts` (`sampleInvestorListings` and named fixtures such as `samplePublishedListing`). **No route imports these fixtures.** They are compile-time samples, not a database.
- Invalid-shape fixtures in `src/fixtures/invalid-listings.errors.ts` exist only to document type errors.
- `src/tasks/data/in-memory-task-repository.ts` is an in-memory task store from an earlier exercise. It is not the listings store and must not be treated as Postgres.
- Nothing persists after refresh. There is no loader, server function, or database client.

### Auth today

- None. No `beforeLoad` session gate, no `createServerFn` auth helper, no cookies/session utilities.
- `src/components/dashboard/Header.tsx` shows a demo chip: default `userLabel` is `Sample member` (comment: “not real auth state”).
- Prior docs (`docs/stakeholder-handoff-dashboard.md`, `docs/architecture-decisions.md`) already mark login and Supabase as future work.

### Gaps this sprint must close

- Login and signup routes plus a session-aware dashboard shell (protect `/dashboard` and any new listings pages).
- Postgres-backed list + create for listings owned by the signed-in sponsor.
- Env separation: `.env.example` with names only; real secrets never committed; service-role never in client code.

## Success criteria (how we know it worked)

- [ ] A sponsor can sign up and log in with email/password and is redirected to a protected dashboard (or listings page).
- [ ] A logged-out visitor who opens `/dashboard` (or a listings URL) does not see listing rows and is sent to login.
- [ ] Creating a listing persists it in Postgres; after a full page refresh, that listing is still there for the same sponsor.
- [ ] A sponsor only sees listings they own (`auth.uid()` / RLS). They do not see another sponsor’s rows.
- [ ] The existing mock investor widgets may still show placeholder copy, but **listing** data on protected pages comes from Postgres, not `sampleInvestorListings` or a client-only array.
- [ ] No service-role key or other privileged secret appears in client-bundled code or in a committed `.env`.
- [ ] `.env.example` documents required variable **names** (project URL, anon/publishable key, and any server-only names) without real secret values.

## Server-only boundary (must not ship to the browser)

Must never appear in client components, Vite `import.meta.env` public prefixes, or committed files:

- Supabase **service role** key (and any other privileged secrets)
- Direct privileged database URLs (for example a Postgres connection string used for admin or bypass)
- Any server-only env var used to skip RLS, impersonate users, or run admin operations

Client-safe (only when intentionally exposed by Supabase design, and still subject to RLS):

- Project URL
- Anon / publishable key (this is **not** a secret bypass; RLS still applies)

The browser may use the anon key with the user JWT. Server loaders/actions in TanStack Start may use the user session. Only trusted server code may use the service-role key, and only when a later step proves it is required.

## Implementation notes for later prompts

- Prefer TanStack Start server loaders/actions for reads and writes that need the user session or any privileged check. Do not put the service-role key in a React component.
- Reuse the field language already in `src/types/investor-listing.ts` and `docs/domain/investor-listing-domain-brief.md` for listing identity (title, status, property type, address). Do not invent a second listing model. Storage columns and RLS SQL are designed in later steps; this brief only locks the product contract.
- Add `/login` and `/signup` as new file routes. Gate `/dashboard` (layout) so child pages inherit the session check instead of copying a login wall into `index.tsx` only.
- Keep the current investor shell (`AppShell`, `Header`, `Sidebar`, `MobileNav`) unless a later prompt says to replace the “Sample member” chip with the signed-in sponsor email.
- Handoff later should map deliverables back to the goals and success criteria above.
- Do not create a second Vercel project or a static-only `outputDirectory: dist` workaround to “get auth working.”
