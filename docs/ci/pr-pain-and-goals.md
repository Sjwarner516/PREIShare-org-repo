# PREIshare PR pain points and Sprint 6 CI goals

## Client need (in my own words)

PREIshare is a TypeScript + TanStack Start + React investor dashboard with a Supabase backend. When a teammate opens a pull request today, GitHub does not run our install, typecheck, or build for them. A change can look fine in the PR text and still be broken TypeScript or a failed Vite build, and nobody finds out until someone remembers to run those commands locally—or until the code is already on `main`.

This sprint should give every PR the **same automatic check run in the cloud**. A machine should prove the project still installs, typechecks, and builds (and later lints and tests, once those scripts exist). A human still decides whether the change is good enough to merge. Green checks are evidence, not permission.

## Current PR pain points

These are true of this repo as of Sprint 6 planning (no `.github/workflows` folder; `package.json` has `typecheck` and `build`, and the README already notes there is **no** `lint` or `test` script):

- Opening or updating a pull request does **not** start any shared GitHub check. There is no workflow file, so the cloud does nothing reliable.
- A teammate can forget `npm ci` / `npm install`. Reviewers then hit missing packages or “works on my machine” instead of a clean install.
- `npm run typecheck` and `npm run build` exist, but nothing requires them on the PR. Under time pressure they are easy to skip.
- Broken TypeScript or a failed TanStack Start / Vite build can still be merged into `main` because GitHub is not blocking on those commands.
- Reviewers spend time re-running “does it install and build?” locally instead of judging UX, data handling, and risk.
- There is no shared written line between **machine checks** (repeatable commands) and **human judgment** (approve, request changes, merge). If we later add AI-assisted review comments, it is still unclear who is accountable unless we say it here.

## Automated CI goals (machines should do these on every PR)

A later step will turn this list into GitHub Actions. This file only names **what** should run, not the YAML.

- Install dependencies from the lockfile in a clean environment (`npm ci`), not whatever happens to be on a laptop.
- Run TypeScript typecheck (`npm run typecheck` / `tsc --noEmit`).
- Build the TanStack Start / React dashboard (`npm run build`).
- Run lint **once a lint script is confirmed** in `package.json`. Do not pretend we already have one.
- Run tests **once a test script is confirmed** in `package.json`. Do not pretend we already have one.
- Mark the PR check **failed** when any required step fails, with a log a teammate can open on the PR without asking “can you try it locally?”

Order that matches how we work locally: **install → typecheck → build → lint (when present) → test (when present)**.

## Human review stays in charge

Automation does not merge, and a green check is not a product decision.

- A human still **approves** or **requests changes** on the pull request.
- A human still judges product and UX risk, security-sensitive logic (auth, listings, embeddings, env vars), and how we handle sponsor data.
- A human still **decides to merge**—even when CI is green. Green only means the required machine steps passed.
- Any AI review prompt pack is **assistance**. It may catch nits or missing tests; it does not approve the PR and it does not merge.
- Secrets, Vercel production access, and Supabase keys stay **outside** this sprint’s PR automation. This brief does not invent those values or a deploy pipeline.

## Out of scope for this sprint (do not solve in the goals brief)

- Full production deploy from the PR workflow (no Vercel production ship on every PR).
- Replacing human reviewers with fully automated merge (“AI auto-merge,” merge-when-green with no person).
- Deep performance or load-testing suites (we do not have those scripts today).
- Inventing new dashboard features unrelated to CI quality (search, maps, payments, new pages).
- Writing `.github/workflows/*.yml` in this step, storing production secrets in git, or documenting live API keys.

## Success signals

A teammate should be able to verify these on a **real pull request** later in the sprint—not as vague hopes:

- Opening or updating a PR triggers **one** clearly named CI workflow (visible in the GitHub Checks / Actions panel on that PR).
- Required steps run in a sensible order: install, then typecheck, then build, then lint and test if those scripts exist.
- A failing typecheck or build shows as a **red check on the PR**, with a log, without asking another person to reproduce it only on their laptop.
- An AI-assisted review prompt pack exists for humans to paste or attach; using it is optional and never skips the human merge decision.
- A short handoff (later in the sprint) restates the same split: machines run install/typecheck/build/(lint)/(test); humans still approve and merge.

If those signals are not visible on a real PR, this brief is not done—even if the wording looks complete.
