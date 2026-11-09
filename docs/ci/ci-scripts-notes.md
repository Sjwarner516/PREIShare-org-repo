# CI scripts notes — PREIshare dashboard

These notes match `.github/workflows/pr-ci.yml` so a teammate can reproduce
a GitHub Actions failure on their laptop. Package manager and script names
come from `package.json` (inventory originally marked `lint` and `test` as
MISSING; this step added the smallest ESLint + Vitest scripts, not a browser
e2e suite).

## Package manager

- CI uses: **npm**
- Lockfile present: **package-lock.json**
- Node: **22** (`package.json` `"engines": { "node": "22.x" }`)

## Scripts CI calls (must match package.json and pr-ci.yml)

| CI step | package.json script | Exact local command | Purpose |
|------------|---------------------|----------------------------|----------------------------------|
| Install | *(none — `npm ci`)* | `npm ci` | Clean install from the lockfile |
| Typecheck | `typecheck` | `npm run typecheck` | `tsc --noEmit` |
| Build | `build` | `npm run build` | Vite / TanStack Start production build |
| Lint | `lint` | `npm run lint` | ESLint on the repo (`eslint .`) |
| Test | `test` | `npm run test` | Vitest **non-watch** (`vitest run`) |

Workflow order: checkout → Node 22 → install → typecheck → build → lint → test.
A non-zero exit on any of those quality steps fails the job (no
`continue-on-error`).

## package.json script entries (quality gates)

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

`lint` uses ESLint 9 (`eslint.config.js`) with `typescript-eslint`.
`test` uses Vitest in **run** mode so the GitHub job exits. Unit tests live
in `src/**/*.test.ts` (embedding helper smoke tests). There is no Playwright
or Cypress suite.

Not called by PR CI (still real scripts): `dev`, `start`, `generate-routes`,
`seed:embeddings`, `verify:search`.

## Intentional gaps

- **No full browser end-to-end suite** in PR CI (keep that human/manual or a
  later sprint).
- **No live Supabase** in this workflow: no `seed:embeddings`, no service-role
  key, no production deploy.
- `verify:search` prints ranking samples; it is **not** `npm run test`.

## How to reproduce a CI failure locally

1. `git checkout` the PR branch
2. `npm ci`
3. `npm run typecheck && npm run build && npm run lint && npm run test`
4. Fix until all four pass, then push again

If lint fails, the log names the file and rule. If tests fail, Vitest prints
the assertion. Run the same script GitHub ran—do not invent a different
command.
