# Supabase environment setup checklist (PREIshare Sprint 4)

## Purpose

Configure the Supabase project URL and keys for this TanStack Start + Vite dashboard so later steps can add sponsor auth and Postgres listings **without** shipping the service-role key to the browser.

This step is configuration only. It does not add login UI, tables, or a Supabase client.

## Source requirements

See `docs/requirements/sponsor-auth-and-listings-brief.md`:

- Sponsors sign in; listings persist in Postgres, not mock arrays.
- Project URL and anon/publishable key may be client-safe (RLS still applies).
- Service-role key and other privileged secrets stay server-only and are never committed.

## Public prefix for this repo

This project is Vite + TanStack Start. Browser-safe variables **must** use the `VITE_` prefix so `import.meta.env` can read them.

| Name | Surface | Why |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser + server | Project URL (public when RLS is on) |
| `VITE_SUPABASE_ANON_KEY` | Browser + server | Anon / publishable key (not a bypass) |
| `SUPABASE_URL` | Server only (optional duplicate) | Same URL if server code avoids `VITE_` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Bypasses RLS — **no** `VITE_` prefix |

Never name the service-role key `VITE_SUPABASE_SERVICE_ROLE_KEY`. Vite would put it in the client bundle.

## Supabase project

- [ ] Signed in at [https://supabase.com/dashboard](https://supabase.com/dashboard)
- [ ] New or existing empty project selected for PREIshare (wait until the project is **ready**)
- [ ] Database password stored in a password manager (not in this repo; it is not an API key)
- [ ] Open **Project Settings → API** (or **Project Settings → API Keys**)
- [ ] Project URL copied (looks like `https://xxxxx.supabase.co`)
- [ ] **anon** / **publishable** key copied (browser-safe with RLS)
- [ ] **service_role** / secret key copied and treated like a password — private note only, never chat, screenshots, or client code

If the dashboard says “Publishable” instead of “anon,” use that as `VITE_SUPABASE_ANON_KEY`. The key that **bypasses RLS** is the service-role key.

## Repo files

- [ ] `.env.example` at the repo root is committed with **placeholders only** (`your-project-ref`, `your-anon-or-publishable-key`, `your-service-role-key`)
- [ ] Local `.env.local` (preferred) or `.env` created by **you**: `cp .env.example .env.local`, then paste real values from the dashboard
- [ ] `.gitignore` includes `.env`, `.env.local`, and `*.local` so real files stay untracked
- [ ] `git status` does **not** list `.env` or `.env.local` as files to add
- [ ] Confirm with: `git check-ignore -v .env .env.local`

Do not ask an agent or chat to store the real service-role key. Paste it yourself.

## Public vs server-only rules

- [ ] Browser-safe vars use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` has **no** public/client prefix
- [ ] No file under `src/` that runs in the browser reads `SUPABASE_SERVICE_ROLE_KEY` or `import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY`
- [ ] Later TanStack Start **server** loaders/actions may read the service-role key only if a later step proves it is required; prefer the user JWT + anon key + RLS first
- [ ] This checklist and `.env.example` contain **zero** real key material

## Smoke checks before feature work

- [ ] Restart the Vite / TanStack Start dev server after creating or editing `.env.local`
- [ ] App still starts (empty URL/key typos usually show up when a later step first reads env)
- [ ] Search the repo for your real service-role key string — **zero** hits in tracked files
- [ ] Search tracked files for `VITE_SUPABASE_SERVICE_ROLE_KEY` — must not exist

## Handoff notes

- Hosting (existing Hobby/Vercel project only — do not create a second app): public/`VITE_` vars on the client build; `SUPABASE_SERVICE_ROLE_KEY` only in **server/runtime** secret storage, never a public env.
- Next steps in this sprint: data model and RLS, then Supabase clients that read **these same variable names**.
- Still out of scope here: login pages, SQL, extra third-party services.
