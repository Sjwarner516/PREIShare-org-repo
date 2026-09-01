# PREIshare Investor Dashboard — Client Brief (Sprint 3 Shell)

## Product summary
PREIshare is for people who put money into real-estate offerings and need one
calm place to see how they are doing. In this sprint an investor should open
the dashboard and immediately scan a portfolio-value snapshot, jump to open
deals, and open their own profile—without hunting through extra pages.

This delivery is a **shell-only sprint**: a responsive layout, four file-based
routes, and reusable placeholder components. Numbers and names on screen are
**mock data** (fake sample content), clearly labeled so a stakeholder can demo
the product without mistaking it for live accounts.

## Primary actors
| Actor | Role in this sprint | In scope to build? |
|-------|---------------------|--------------------|
| Investor (member) | The person using PREIshare to scan portfolio value, open deals, and profile details | Yes — the only user we design for |
| Future admin | Might later manage offerings or members | No — name them only so we do not accidentally build their tools |

## Investor goals
1. Land on a home overview that shows a portfolio snapshot and a recent-activity placeholder in one glance.
2. Move to Portfolio, Deals, and Profile from the same persistent navigation without leaving the dashboard frame.
3. Use the layout on a phone and on a desktop: labels stay clear, navigation stays findable, content does not overlap.

## Must-have dashboard areas (this sprint)
Exactly four investor areas. Do not add other product areas as in-scope work.

| Area | Route idea (for later steps) | What the investor should see |
|------|------------------------------|------------------------------|
| Home overview | `/dashboard` | Page title, stats cards (mock portfolio value / open deals / profile completeness), a portfolio summary placeholder, and a recent-activity list placeholder |
| Portfolio | `/dashboard/portfolio` | Page title plus a table or list shell of holdings (mock rows OK) |
| Deals | `/dashboard/deals` | Page title plus a list shell of open or available offerings (mock rows OK) |
| Profile | `/dashboard/profile` | Page title plus a profile card shell (name and contact placeholders) |

## Success criteria (demo-ready shell)
Each line is a yes/no check in a walkthrough that uses mock UI only.

- [ ] From any of the four areas, persistent navigation reaches Home, Portfolio, Deals, and Profile.
- [ ] Each of those four areas is its own route/page and shows a clear page title.
- [ ] The layout has a sidebar (or equivalent nav), a header, and a main content region.
- [ ] On a narrow viewport, navigation collapses or stacks and content stays readable (no overlapping controls).
- [ ] Every mock figure or sample name is labeled as mock so stakeholders know data is not live.
- [ ] The running shell has no extra in-scope pages beyond Home, Portfolio, Deals, and Profile.

## Out of scope (explicit non-goals for this sprint)
- Real sign-in, authentication, or role-based authorization
- Live portfolio, deals, or profile data from a database (including Supabase/PostgreSQL)
- Payments, subscriptions, or document e-sign
- Admin screens to create, edit, or delete investors or deals
- Notification centers, settings hubs, multi-portfolio switchers, or other areas not listed above
- Production hardening and CI beyond basic project setup needed to run the shell

## Prompting notes for later AI steps
Attach or quote this brief in every coding-agent or ide-copilot prompt. Require
TypeScript, TanStack Start file-based routes, reusable React components, mock
data only, and no auth. Reject any output that adds pages or capabilities listed
under Out of scope. Keep copy tied to PREIshare investors and real-estate
offerings—not a generic SaaS dashboard.

## Open questions / assumptions
- English UI copy for the shell.
- One investor viewing their own mock portfolio (no account switcher).
- Visual treatment can be simple and professional; a full brand system is not required this sprint.
- File-based route paths in the table above are the intended URLs unless a later step records a deliberate change in this brief.
