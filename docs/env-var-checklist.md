# Environment variable checklist (PREIshare)

**Contract:** `docs/sponsor-auth-requirements.md`  
**Template:** `.env.example` (placeholders only — this file has **no** real keys)

Copy `.env.example` → `.env` or `.env.local` on your machine. Fill values from Supabase → **Project Settings → API**. Real files stay gitignored. Later client setup (browser vs server Supabase modules) and security verification consume this table.

## Per-variable table

| Name | Client-safe or server-only? | Used for | Never do this |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | **Client-safe** (also readable on the server) | Public project URL. Browser auth (login/signup) and server code that talks to the same project. Safe when RLS is on. | Do not put a live project URL in git. The **name** is public; the **value** stays in the private env file. |
| `VITE_SUPABASE_ANON_KEY` | **Client-safe** (also readable on the server) | Anon / publishable key. Sponsor **auth session** in the browser: `signInWithPassword`, cookies. Listing queries should still send the **user JWT** so RLS applies. | Do not treat this as an admin key. It is not a bypass. Do not commit the live anon JWT. |
| `SUPABASE_URL` | **Server-only** (optional duplicate) | Same project URL when server code avoids `VITE_`. Auth session checks and listing loaders. | Do not add a `VITE_` prefix just to “make it work” in React. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** | **Admin bypass.** Skips Row-Level Security. Not for sponsor login, not for “list my properties,” not for create-owned-by-me. | **Never** prefix with `VITE_`. **Never** import into browser code, shared React dashboard components, or login/signup forms. **Never** commit the real value or paste it into docs/screenshots. If it leaks, rotate it in Supabase. |

## Prefix rule (Vite)

| Prefix | What Vite does | Allowed here |
| --- | --- | --- |
| `VITE_` | Can appear in the client bundle via `import.meta.env` | Project URL and anon key only |
| no `VITE_` | Stays on the server (`process.env`) if you never import it from client modules | `SUPABASE_SERVICE_ROLE_KEY`, optional `SUPABASE_URL` |

There is **no** variable named `VITE_SUPABASE_SERVICE_ROLE_KEY`. That name would ship the bypass key to every visitor.

## Who may see property data (from the requirements)

- Anonymous visitor: no listing rows.
- Signed-in sponsor: only rows they own (`owner_id` = their `auth.uid()`).
- Service-role: would see **all** rows — that is why it must not be in the browser.

Listing list/create in later steps must use the **anon key + sponsor session**, not the service-role key.

## Git hygiene (this step)

| Path | Tracked? |
| --- | --- |
| `.env.example` | Yes — placeholders |
| `docs/env-var-checklist.md` | Yes — names and purposes |
| `.env`, `.env.local`, `.env.*.local` | **No** — `.gitignore` |

Check before every commit:

```bash
git check-ignore -v .env
git check-ignore -v .env.local
git status
```

If a real `.env` shows as a new file, stop. Do not `git add .`.

## Later steps

- Supabase clients: `client.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only. `server.ts` may read `SUPABASE_URL` / `VITE_SUPABASE_URL` and, only for privileged server work, `SUPABASE_SERVICE_ROLE_KEY`.
- Security verification: search the repo for live JWT-shaped strings and for `VITE_SUPABASE_SERVICE_ROLE_KEY` as a **used** name. Mentions in “never do this” notes are warnings, not keys.
