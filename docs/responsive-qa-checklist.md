# PREIshare dashboard — responsive QA checklist

**Tester:** Sydni
**Date:** 2026-10-06
**App URL tested:** http://127.0.0.1:43123/dashboard
**Build / branch:** main

## Breakpoints used

| Name    | Width  | How to set                          |
|---------|--------|-------------------------------------|
| Mobile  | 375px  | Devtools device toolbar             |
| Tablet  | 768px  | Devtools device toolbar             |
| Desktop | 1280px | Devtools device toolbar             |

## How to use this sheet

1. Load the dashboard route with the dev server running.
2. For each row, set the width, perform the check, mark **Pass** or **Fail**.
3. On Fail, write a short **Symptom** and which **file** you will ask the agent to touch.
4. After a targeted fix, re-test and update **Status** and **Fix notes**.
5. Critical rows must Pass (or be listed under Known limitations with stakeholder-safe wording).

---

## Mobile (~375px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| M1 | No horizontal page scroll | Pass | `scrollWidth === clientWidth` (375). Vertical scroll only. |  |
| M2 | Header remains visible and usable | Pass | Open menu, PREIshare mark, SM chip stay on one row. |  |
| M3 | Desktop sidebar is hidden or off-canvas (not permanently covering content) | Pass | `.dash-sidebar` computed `display: none` below 768px. |  |
| M4 | MobileNav or menu control is visible | Pass | “Open menu” button visible; `.dash-mobile-nav` is `block`. |  |
| M5 | Menu opens and closes navigation links | Pass | Click toggles “Close menu”, `aria-expanded=true`, links Home / Portfolio / Deals / Profile; click again hides panel. |  |
| M6 | Main content readable without pinched text | Pass | Intro and banner wrap; body copy remains full sentence width. |  |
| M7 | Metric cards stack in a single column (or intentional narrow grid) | Pass | Grid is one `343px` column. Value, open deals, completeness stack. |  |
| M8 | PortfolioSummary does not overflow or clip | Pass | Empty-state copy wraps inside the card; remaining lines are below the fold (scroll), not clipped. |  |
| M9 | RecentActivity list wraps; no cut-off timestamps/labels | Pass | Empty state shown (no timestamp row yet). Copy wraps in the card. |  |
| M10 | Empty-state messaging (if shown) is fully visible | Pass | Holdings and activity empty copy is readable after a short scroll. |  |

## Tablet (~768px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| T1 | No horizontal page scroll | Pass | `scrollWidth === 768`. |  |
| T2 | Navigation pattern matches plan (sidebar, rail, or menu—not both fighting) | Pass | Sidebar `display: flex`; MobileNav `display: none`. No hamburger on this width. |  |
| T3 | Header + content spacing not cramped | Pass | Brand + Overview + Sample member; main padding unchanged. |  |
| T4 | Metric cards use a sensible 2-column (or planned) layout | Pass | Two `248px` columns; third card wraps to the next row. |  |
| T5 | PortfolioSummary and RecentActivity share space without overlap | Pass | After cycle 1, two `246px` columns sit side by side with wrapping empty copy. | Cycle 1 also cleaned competing auto-fit rules that previously stacked these awkwardly. |
| T6 | Touch targets / click targets large enough to use | Pass | Sidebar links and header chip use 44px min height from `dashboard.css`. |  |

## Desktop (~1280px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| D1 | Sidebar visible and usable per architecture | Pass | Dark rail with Home / Portfolio / Deals / Profile; Home marked current. |  |
| D2 | MobileNav hidden or not duplicating full sidebar awkwardly | Pass | `.dash-mobile-nav` is `display: none` at 768px+. |  |
| D3 | Main region has comfortable padding/margins | Pass | Banner, intro, and cards sit inside `.dash-content` padding. |  |
| D4 | Metric cards align in a multi-column row as planned | Pass (after fix) | First pass: grid reported extra `0px` tracks (`330px 330px 330px 0 0`) from competing `auto-fit` in `dashboard-home.css` vs breakpoint rules in `dashboard.css`. | Cycle 1: remove `grid-template-columns` from `.dashboard-home__stats` / `__panels` so `dashboard.css` 1 / 2 / 3-col breakpoints own the grid. Re-test: `330px 330px 330px`. |
| D5 | PortfolioSummary + RecentActivity sit in intended regions | Pass | Two equal columns under the metric row. |  |
| D6 | Long labels/numbers do not break the header or sidebar width | Pass | PREIshare / Overview / Sample member stay on one header row; sidebar labels untruncated. |  |

## Cross-cutting issues

| ID | Check | Status | Notes |
|----|--------|--------|-------|
| X1 | Focus order / keyboard: menu and links reachable | Pass | Skip link, then Open menu (`aria-controls` / `aria-expanded`). Sidebar is `display: none` on mobile so those links are out of the tree. Overlay links appear when open. |
| X2 | No layout jump when opening/closing mobile menu | Pass | Panel is `position: absolute` under the header; main width does not change. Overlay covers the top of the first metric card by design. |
| X3 | Stacking order: important metrics appear before low-priority lists on small screens | Pass | Banner → intro → three MetricCards → PortfolioSummary → RecentActivity. |

## Targeted fix log (one row per prompt cycle)

| Cycle | Breakpoint | File(s) touched | Prompt summary (one sentence) | Result after re-test |
|-------|------------|-----------------|-------------------------------|----------------------|
| 1 | Desktop 1280px (also re-checked 375 / 768) | `src/components/dashboard/dashboard-home.css` | At 1280px the metric grid must be three equal columns with no extra `0px` tracks; change only competing `grid-template-columns` on home stats/panels—do not rewrite widgets or AppShell. | Pass. Desktop metrics `330×3`, panels `502×2`; tablet 2+2; mobile single column. No horizontal overflow at any of the three widths. |

## Known limitations (optional)

- Empty portfolio and activity regions have no timestamps or holding rows to clip; wrap behavior was checked on the empty-state sentences instead.
- Mobile navigation is an overlay panel, not a full-height drawer with animation (deferred; overlay meets open/close and link requirements).
- Live balances, charts, and Supabase loaders are out of this sprint; `—` and empty-state copy are intentional.

## Sign-off

- [x] Critical mobile checks M1–M7 pass
- [x] Critical tablet checks T1–T5 pass
- [x] Critical desktop checks D1–D5 pass
- [x] Fix log filled for every change made during QA
- [x] Touched components still match the architecture (no accidental full rewrite)

**Ready for stakeholder handoff draft:** Yes
