<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Project context

## Scaffold commands

Exact CLI used (initially created a nested folder, then merged into this repo root):

```bash
npx @tanstack/cli@latest create my-tanstack-app --agent --package-manager npm --tailwind
```

Notes from CLI:
- `--tailwind` is deprecated/ignored; Tailwind is already enabled in the standard TanStack Start scaffold.
- No partner add-ons were selected (`chosenAddOns: []`). Blank React Start starter only.

Follow-up Intent commands (run from this repo root):

```bash
npx @tanstack/intent@latest install
npx @tanstack/intent@latest list
```

Result: 9 intent-enabled packages, 31 skills (Start, Router, Devtools, Virtual File Routes).

## Chosen stack

| Choice | Value |
|--------|--------|
| Framework | React 19 + TanStack Start |
| Starter | Blank / default file-router preset |
| Package manager | npm |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Toolchain | Vite 8 + TypeScript (default CLI toolchain) |
| Router | TanStack Router file-based routes (`src/routes`) |
| Integrations / add-ons | None |

## Layout (preserve unless there is a clear reason to change)

- `src/routes/` — file routes (`__root.tsx`, `index.tsx`, `about.tsx`)
- `src/router.tsx` — router factory
- `src/components/` — Header, Footer, ThemeToggle
- `src/styles.css` — Tailwind entry
- `vite.config.ts` — `devtools()`, `tailwindcss()`, `tanstackStart()`, `viteReact()`
- `tsr.config.json` — route generation config
- `.cta.json` — scaffold metadata

Package name in `package.json` is `preishare-org-repo` (repo root). App lives at the repository root, not under `my-tanstack-app/`.

## Environment variables

None required for the blank scaffold.

When adding secrets or config later (from `@tanstack/start-client-core#start-core/execution-model`):
- **Server-only:** read `process.env.MY_SECRET` inside handlers / `createServerFn` / per-request code — never at module scope, never with a `VITE_` prefix.
- **Client-exposed:** only `VITE_*` via `import.meta.env.VITE_*`.
- Do not put secrets in `VITE_*` variables (they ship in the client bundle).
- `.env` is gitignored.

## Scripts

```bash
npm install
npm run dev      # Vite on port 3000
npm run build
npm run preview
npm run generate-routes
```

## Deployment notes

Blank scaffold has no host-specific adapter yet. TanStack Start deploys via Vite + Nitro (see `npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/deployment`). Typical next step for Vercel/Node/Railway is adding the Nitro Vite plugin when you are ready to deploy.

## Architectural decisions

- Keep the generated structure; prefer Intent skills over guessing Start/Router APIs.
- Isomorphic-by-default: use `createServerFn` / `createServerOnlyFn` / `createClientOnlyFn` for environment boundaries.
- No auth, DB, or partner integrations in this blank app.

## Known gotchas

- CLI `--tailwind` flag is ignored (Tailwind is on by default).
- Nested `my-tanstack-app/` from the create command was flattened into this repo root on purpose.
- `intent install` keeps a short skill-loading block at the top of this file; durable project notes live below it.
- Future Intent versions may require an explicit `intent.skills` allowlist.

## Next steps

1. `npm run dev` and open http://localhost:3000
2. Add routes under `src/routes/` as needed
3. Load matching Intent skills before Start/Router/Devtools changes
4. When deploying, load the deployment skill and add the appropriate Nitro/host preset
5. Add `.env` / typed env declarations only when real config is introduced
