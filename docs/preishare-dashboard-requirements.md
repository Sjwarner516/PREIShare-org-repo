# PREIshare Investor Dashboard — Requirements Brief

## 1. Product context

PREIshare is for people who put money into real-estate offerings and need
one calm place to see how they are doing. This sprint delivers an
investor-facing **dashboard shell**: layout, file-based routes, and
placeholder content so a member can scan portfolio metrics, recent
activity, and navigation into Portfolio, Deals, and Profile.

This sprint is the **shell only**. Numbers and names on screen are labeled
mock placeholders. There is no live market data, no login wall, and no
account management.

## 2. Primary actor and goals

- **Actor:** Investor (a PREIshare member viewing their own dashboard)
- **Goals on first visit:**
  1. Recognize they are in the PREIshare investor area (branding / header)
  2. Move among Home, Portfolio, Deals, and Profile without leaving the shell
  3. See high-level portfolio metrics at a glance (value, open deals, profile completeness — placeholders OK)
  4. Scan recent activity related to their investments (placeholder list OK)

Admins and sponsors are named only so we do **not** build their tools now.

## 3. Primary screens (this sprint)

| Screen | Purpose | In this sprint? |
|--------|---------|-----------------|
| Dashboard home (`/dashboard`) | Shell + metric cards + portfolio summary + activity placeholders | Yes |
| Portfolio (`/dashboard/portfolio`) | Holdings table placeholder; proves routing and nav | Yes (minimal) |
| Deals (`/dashboard/deals`) | Open-offering list placeholder; proves routing and nav | Yes (minimal) |
| Profile (`/dashboard/profile`) | Member card placeholder; proves routing and nav | Yes (minimal) |
| Login / signup | Authentication | No (later) |
| Live portfolio detail / trades | Deep investment tools | No (later) |

## 4. Dashboard layout regions (must describe in UI work)

1. **Header** — PREIshare context, current page title, simple user/account placeholder (for example a “Sample member” chip)
2. **Navigation** — sidebar on desktop (Home, Portfolio, Deals, Profile); collapsible Menu on small screens
3. **Metrics region** — cards for summary numbers on home (placeholders OK)
4. **Activity region** — list of recent items on home (placeholders OK)
5. **Main content area** — where page-specific content renders inside the shell (`<main>`)

## 5. Must-have vs later

### Must-have (demoable shell)

- File-based dashboard routes under a `/dashboard` area
- App shell composing header + nav + main content
- Responsive behavior: usable on mobile, tablet, and desktop widths
- Placeholder metric cards and recent-activity list on the home page
- Empty-state or sample-data messaging when real data is not connected yet
- Clear navigation labels an investor would understand (Home, Portfolio, Deals, Profile)

### Later (explicitly out of scope now)

- Real Supabase queries, live balances, or pgvector search
- Authentication, roles, and permissions UI
- Payments, documents vault, tax exports, wire transfers
- Polished design system beyond a clean functional layout
- Charts that require live time-series data
- Admin tools, settings hubs, or multi-portfolio switchers

## 6. Success criteria (how we know the shell is done)

- [ ] An investor can open `/dashboard` in the browser
- [ ] Header, navigation, metrics, and activity regions are all visible on desktop home
- [ ] On a narrow (mobile) width, navigation remains usable (Menu toggle / stacked nav)
- [ ] Placeholder content is clearly labeled so stakeholders know data is not live
- [ ] Requirements in this brief match what was built (no surprise mega-features)
- [ ] A teammate can read this brief and understand scope in under 5 minutes

## 7. Notes for AI-assisted build

- Every implementation prompt should reference this file as scope control.
- Prefer small milestones: routes → shell → nav → widgets → compose → responsive QA.
- Reject agent output that adds out-of-scope fintech features (auth, live data, payments) without asking.
- Keep TypeScript, TanStack Start file-based routes, mock data only, and one GitHub repo / one Vercel Hobby Production URL.
