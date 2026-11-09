# AI-assisted PR review prompt pack (PREIshare)

## Purpose

Use these prompts with a chat-assistant or IDE copilot when reviewing a
pull request on the PREIshare dashboard (TypeScript, TanStack Start, React,
Supabase). They speed up **human** review so teammates spend less time
re-discovering “what changed?” and more time on judgment
(`docs/ci/pr-pain-and-goals.md`).

They do **not** replace CI, and they do **not** replace a human merge
decision.

**CI already covers:** install (`npm ci`), typecheck, build, lint, and test
on each PR targeting `main` (see `docs/ci/pipeline-design.md`,
`docs/ci/ci-scripts-notes.md`, and `.github/workflows/pr-ci.yml`).
Do not ask the AI to re-run those gates or to guess whether they passed.

**Humans still cover:** product intent and UX, auth/session handling,
Supabase client vs server usage and row-level access, migrations/schema,
secrets and env names (`VITE_*` vs service-role), embeddings/search data
paths, and the final approve/merge click (`docs/ci/project-ci-inventory.md`
Buckets B and C).

## How to use this pack

1. Open the PR diff on GitHub (or locally with `git diff main...HEAD`).
2. Paste **one** prompt below into your assistant.
3. Attach or paste the relevant diff hunks (and file paths) the prompt asks for.
4. Read the answer as **advice only**. You still leave the GitHub review and
   decide merge.
5. Never paste production secrets, `.env` / `.env.local` values, service-role
   keys, embedding API keys, or live credentials into the assistant. File
   **names** and env **names** are enough.

## Boundaries (read before every review)

- The AI is a **review assistant**, not a reviewer of record.
- The AI must **not** say approve, LGTM, request changes as a gate, or merge
  (including “you may merge” / “safe to ship”).
- The AI must **not** claim CI is green unless the human pastes CI results
  from GitHub Actions.
- Only a **human** PREIshare teammate may approve and merge the pull request.

---

## Prompt 1 — Plain-language diff summary

**When to use:** First pass on a PR so you know what changed before deep review.

**Copy-paste prompt:**

```text
You are a review assistant for the PREIshare dashboard (TypeScript, TanStack Start,
React, Supabase). Summarize the pull request diff I paste below. You are not a
reviewer of record.

Output format:
1. One-sentence goal of the change (best guess from the diff). Label it inference.
2. Bullet list of files touched, grouped by area (UI/routes, API/server,
   Supabase/data, embeddings/search, config/CI). Label as observed in diff.
3. Bullet list of behavior changes a reviewer should verify manually.
4. Open questions for the author (max 5).

Hard rules:
- Do not approve, reject, LGTM, or recommend merge. Do not say "you may merge."
- Do not invent files or behavior that are not in the diff.
- If the diff is incomplete, say what else you need.
- Label every claim as observed in diff or inference.
- Do not claim CI passed unless I paste Actions results.
- Do not ask me to paste .env values or secrets.

Diff:
<PASTE DIFF OR FILE HUNKS HERE>
```

---

## Prompt 2 — Risk flags (auth, Supabase, migrations, secrets)

**When to use:** After the summary, when any auth, data, schema, env, or
search/embedding files changed. Ground buckets in
`docs/ci/project-ci-inventory.md` and `docs/ci/pipeline-design.md` — skip
style nits CI already runs.

**Copy-paste prompt:**

```text
You are a security-and-data risk assistant for PREIshare (TanStack Start +
Vite + React + Supabase). Review the diff below ONLY for risk signals.
CI already runs npm ci, typecheck, build, lint, and test on pull_request to
main — do not repeat formatting or type nits unless they hide a risk.

Flag risks in these PREIshare buckets (skip a bucket if nothing relevant
appears in the diff):

- Auth / session / route protection
  (login/signup, cookies, dashboard loaders, signed-out redirects)

- Supabase client usage and who can read or write which rows
  (browser client with VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY vs
  server client; never VITE_SUPABASE_SERVICE_ROLE_KEY; RLS / owner-only
  listings vs service-role bypass)

- Migrations / schema / SQL
  (files under supabase/migrations/, pgvector, match_properties,
  properties columns, RLS policies)

- Secrets, env vars, API keys, service-role usage
  (EMBEDDING_API_KEY, SUPABASE_SERVICE_ROLE_KEY, SEED_OWNER_ID, VITE_
  prefix leaking server secrets, new keys in workflow YAML)

- Destructive or irreversible data changes
  (seed:embeddings against a shared project, DROP/DELETE in SQL,
  production deploy from a PR)

For each flag output:
- Severity: high | medium | low
- File and rough location (observed in diff)
- Why it matters for PREIshare sponsors, buyers, or listing data
- A concrete question the human reviewer should ask
- needs human verification if you are not sure — never invent a pass

Hard rules:
- Do not approve, LGTM, or merge. Do not say the code is safe.
- If unsure, mark needs human verification.
- Prefer questions over verdicts.
- Do not request secrets or .env contents.
- Do not claim CI is green unless I paste the check run.

Diff:
<PASTE DIFF OR FILE HUNKS HERE>
```

---

## Prompt 3 — Human review question checklist

**When to use:** Before you submit your GitHub review, to build a short
checklist tailored to this PR (not a generic blog list).

**Copy-paste prompt:**

```text
You help PREIshare reviewers prepare questions. From the PR description and
diff below, generate 5–8 review questions a human should answer before they
decide to merge. You are a helper, not a required gate.

Rules for questions:
- Prefer PREIshare-specific topics: dashboard UX, TanStack Start routes and
  server handlers, /search vs sponsor listings, Supabase access, auth
  cookies/session, migrations, embedding/search env, and failure modes
  (empty/error states).
- Do not duplicate pure CI concerns (install, tsc, vite build, eslint,
  vitest) unless the diff shows a likely gap in tests.
- Each question must be answerable by reading code, running the app, or
  asking the author — not by guessing.

Output format:
- Checklist of questions (markdown "- [ ]" items)
- Group lightly: Product / UX, Data & auth, Ops & rollback
- End with exactly: Reminder: only a human may approve or merge this PR.

Hard rules:
- Do not approve, LGTM, or recommend merge.
- Do not speak as a required gate — speak as a helper.
- Do not invent files that are not in the diff.

PR description:
<PASTE PR BODY>

Diff:
<PASTE DIFF OR FILE HUNKS HERE>
```

---

## Optional follow-up — Map AI notes back to CI

If the assistant mentions something CI should have caught, open
`docs/ci/pipeline-design.md` and `.github/workflows/pr-ci.yml` and decide
whether to file a follow-up for the next sprint. Do **not** weaken human
review to paper over a missing automated check without a team decision.

Do **not** add live Supabase mutations or production deploy to PR CI to
“make the AI happy.” Bucket B stays out of the first pipeline
(`docs/ci/project-ci-inventory.md`).

## Human merge authority (non-negotiable)

- AI output in this pack is **advisory only**.
- Required status checks and branch protection (see
  `docs/ci/branch-protection-checklist.md`) remain the automated gates.
  The quality job name is **Quality checks** (workflow **PR CI**).
- A **named human reviewer** owns the GitHub review and the merge click.
- If AI and CI disagree with your judgment, trust evidence and teammates —
  not the model’s confidence.
- Green CI + a helpful AI summary still is **not** permission to merge.
