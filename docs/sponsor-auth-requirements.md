# PREIshare Sponsor Auth & Property Listings — Security Requirements

**Project:** PREIshare dashboard  
**Audience:** Sponsors, the next implementer, and anyone writing env / RLS / login / verification docs  
**Rule:** This file names env vars and purposes only. Never paste real API keys, JWTs, database passwords, or connection strings here.

## 1. Context

PREIshare sponsors are the people who list real properties. They need a dashboard where they can **sign in**, **see only the listings they may manage**, and **add a new property** that belongs to their account.

Listing data lives in **PostgreSQL** (via Supabase). The browser may use the public project URL and the anon/publishable key. The **service-role** key (and any other secret that bypasses Row-Level Security) must never ship in the client bundle, never land in git, and never appear in this document as a value.

This topic does **not** rebuild the investor marketing site and does **not** add an admin console. The signed-in person who creates listings is the **sponsor**, even if some screens still say “investor dashboard.”

## 2. Actors

| Actor | Description | Signed in? | In scope? |
| --- | --- | --- | --- |
| Anonymous visitor | Anyone who has not logged in. May open the public home page and the login/signup pages only. | No | Yes |
| Sponsor | Partner who owns or manages their own property listings. After sign-in they can list and create **their** rows. | Yes (sponsor account) | Yes |
| Admin | Internal operator who might later see every listing or moderate other sponsors. | N/A this topic | **Out of scope** — do not build admin UI, admin roles, or cross-sponsor tools |

There is no “public editor” actor. A visitor who is not signed in must not create, update, or delete listings.

## 3. User stories (in scope)

1. As a **sponsor**, I can register and sign in with **email and password** (Supabase Auth) so the app knows which account is acting.
2. As a **sponsor**, after sign-in I can open a protected dashboard and see a list of **only my** properties — not another sponsor’s rows, and not leftover mock arrays used as the source of truth.
3. As a **sponsor**, I can create a new property that is owned by **my** account. The server sets ownership from the session (`auth.uid()` / signed-in user id). The form must not be allowed to pick a different owner.
4. As an **anonymous visitor**, I can reach `/auth/login` (and signup). I cannot stay on `/dashboard` or listing routes, and I cannot create or change listings.

Observable route rules for those stories:

- Logged-out request to `/dashboard` or `/dashboard/listings` → redirect to `/auth/login` (no listing rows in the response).
- Signed-in sponsor on `/dashboard/listings` → only rows where `owner_id` is that sponsor.
- Create listing → new Postgres row with `owner_id` = the signed-in sponsor.

## 4. Non-goals (out of scope this topic)

- Public (anonymous) create, update, or delete of properties
- Full admin console, cross-sponsor moderation, or “view everyone’s listings”
- Putting the Supabase **service-role** (secret) key in any client/browser bundle, in a `VITE_` env name, in git, or in screenshots
- Password-reset email branding, OAuth / social login, magic-link as the primary path, or multi-factor auth
- Payments, document uploads, photos, investor public browse, live portfolio balances
- Trusting the UI alone (“hide the button”) as the access control

## 5. Success criteria

Check these later in a browser or with HTTP — each line is pass/fail.

- [ ] A sponsor can complete email/password login and land on a **protected** dashboard route (for example `/dashboard` or `/dashboard/listings`).
- [ ] An unauthenticated visitor who opens `/dashboard` or `/dashboard/listings` is **blocked** (redirect to `/auth/login`) and does not see listing rows.
- [ ] After sign-in, the property list returns **only** rows that sponsor may manage (same `owner_id` as the session user).
- [ ] Creating a property stores a Postgres row owned by the signed-in sponsor. A body field named `owner_id` is ignored if present.
- [ ] Browser-exposed config uses only **public** names: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` is server-only and has no `VITE_` prefix.
- [ ] Listing read/write is enforced with **Postgres Row-Level Security** (`owner_id = auth.uid()`), not only by hiding React buttons.
- [ ] Sign-out clears the session so the next visit to `/dashboard` is blocked again.

## 6. Simple threat list

These threats are the tests the verification checklist must run.

| Threat | What goes wrong | Requirement to mitigate | Verification idea |
| --- | --- | --- | --- |
| Stolen or reused session cookie | Attacker acts as the sponsor without knowing the password | Protected routes check the session **on the server**. Sign-out clears cookies/tokens. | After sign-out, `/dashboard` redirects to login. |
| Guessing another sponsor’s property id | Attacker types or calls another row’s id and reads or edits it | RLS and server queries deny cross-sponsor access even when the id is known | Second account (User B) must not see User A’s listing in the UI or via a direct read. |
| Leaked service-role key | Attacker bypasses RLS with elevated API access | Never put the service-role key in client code, git, this file, or screenshots. Server env only; never `VITE_SUPABASE_SERVICE_ROLE_KEY`. | Repo search shows **names/warnings only**, no live key material. Network tab as a sponsor must not send a service-role header. |
| “Security by hiding buttons” | UI hides Edit/Create but an API or server function still writes | Enforce in Postgres RLS **and** server paths that use the user JWT (not service-role) for list/create | Logged-out or User B create/list must fail even if someone calls the same server function. |

## 7. Environment & secret hygiene notes (requirements only)

Document **names and purpose**. Do not write values.

| Name | Surface | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser + server | Public project URL. Safe when RLS is on. |
| `VITE_SUPABASE_ANON_KEY` | Browser + server | Anon / publishable key. Not a bypass. RLS still applies. |
| `SUPABASE_URL` | Server only (optional) | Same URL if server code avoids the `VITE_` prefix. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Bypasses RLS. **No** `VITE_` prefix. Never import into React or login forms. |

- Real values live in an untracked local file (`.env.local` / `.env`) or in host secret storage (for example Vercel). Not in git.
- Later steps create `.env.example` (placeholders only) and split `src/lib/supabase/client.ts` (public) vs `src/lib/supabase/server.ts` (server-only).

## 8. Open questions for the team

**Decided for this topic (so later steps are not blocked):**

- **Login method:** email and password via Supabase Auth. Magic link, Google/GitHub OAuth, and MFA stay in Non-goals.
- **Ownership model:** no separate `sponsors` profile table is required for the stories above. A listing’s `owner_id` is the signed-in `auth.users` id (`auth.uid()`). A profile table can be added later without changing these stories.

**Still open (do not block this topic):**

- Who, if anyone, may **only view** listings without creating them?
- When should email confirmation be required (local vs Production)?
- Is two-sponsor isolation (User B cannot see User A) a **sign-off** gate before calling the topic done? This brief says **yes** — RLS must be proven, not only designed.

## 9. How later steps use this brief

This file is the contract for:

- Env separation (`.env.example`, public vs server-only clients)
- Data-model and RLS (`property_listings.owner_id`, policies scoped to `auth.uid()`)
- Login / signup routes and a server-checked dashboard gate
- Property list and create flows that never trust a client-supplied owner
- The end-to-end security verification checklist (stolen session, guessed id, leaked service-role)

If a later step disagrees with a rule here, update **this** file first so the contract stays the source of truth.
