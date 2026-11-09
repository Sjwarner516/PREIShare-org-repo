# CI concepts notes — PREIshare dashboard

These notes translate `docs/ci/pr-pain-and-goals.md` into shared vocabulary.
They do **not** add dashboard features, secrets, or a workflow file. Later
inventory and design steps should consume this file and the pain brief together.

## In my own words

**Continuous integration (CI)**  
CI is the team’s habit of proving a change still fits the shared project
**before** it lands on `main`. For PREIshare that means: when someone opens
or updates a pull request, a machine automatically does the checks we already
know how to run (`npm ci`, `npm run typecheck`, `npm run build`, and later
lint/test if we add those scripts). We find out fast if TypeScript or the
TanStack Start build is broken, instead of hoping a teammate remembered to
run those commands on their laptop.

**Pipeline / workflow**  
A pipeline (GitHub often calls it a **workflow**) is the **ordered recipe**
of those checks: check out the branch → install from the lockfile →
typecheck → build → lint if we have it → test if we have it. People write
the recipe once. A cloud computer follows it the same way every time. It is
not a person walking a sticky-note checklist, and it is not “whatever I
happened to run locally.”

**Green check vs red X**  
- **Green:** every required automated step passed. That is a shared
  *signal* that install/typecheck/build (and later lint/test) succeeded.
  It is **not** permission to merge without thinking, and it is **not** a
  product or security review.
- **Red:** at least one required step failed. Do not merge. Open the log
  on the PR, understand the failure, fix it, and let the same pipeline
  run again. Reviewers should not spend deep UX time on a PR that cannot
  even build.

**Why every pull request (for PREIshare)**  
The pain brief says GitHub currently runs **nothing** when a PR opens, so
forgotten installs, skipped typecheck/build, and “works on my machine”
can all reach `main`. Running **one** shared pipeline on **every** PR
(not only some laptops, not only after merge) gives every teammate the
same green/red note and catches breakage while the change is still a
proposal. That is the heart of “why CI on every PR” for this dashboard.

## Pain → CI idea map

Pains are copied from `docs/ci/pr-pain-and-goals.md`. If a row cannot be
fully automated, the right-hand column says so.

| Pain (from pr-pain-and-goals) | Would an automatic run on every PR reduce that risk? | CI idea (or human-review gap) |
| --- | --- | --- |
| Opening or updating a PR starts **no** shared GitHub check | Yes | A workflow that **triggers on the PR** is the missing starter. Without that event, we do not have CI—we have a wish. |
| Teammates forget `npm ci` / `npm install` | Yes | The first pipeline step is a **clean install from the lockfile** on a shared machine, not “whatever is on my laptop.” |
| `typecheck` and `build` exist but are easy to skip | Yes | Required pipeline steps run those **same npm scripts** so skipping them under time pressure is no longer possible. |
| Broken TypeScript or a failed Vite build can still merge to `main` | Yes | Checks run **before** merge. A red X is visible on the PR; merging without that proof is the old pain. |
| Reviewers re-run “does it install and build?” instead of judging UX and risk | Yes, for the boring part | A red X should stop deep review until basics pass. **UX, auth, listings, embeddings, and data handling stay human.** |
| No written line between machine checks and human (or AI-assisted) judgment | Only partly | CI gives a green/red **proof** of install/typecheck/build. Approve, request changes, and **merge stay human**. AI comments are assistance, not a check. |

## Non-examples (“CI washing”) — not real CI

These look busy but would **not** solve the pains in `pr-pain-and-goals.md`.
Use them later to reject a fake workflow.

1. **Only running `npm run build` (or typecheck) on my laptop** — The result
   stays personal. Other machines and `main` never get the same proof, so
   “forgotten local checks” and “works on my machine” remain.
2. **Merging because an AI comment said the PR “looks fine” while no
   automated run happened** — That is extra reading, not a pipeline.
   AI does not install, typecheck, or build; it cannot replace a green/red
   check or a human merge decision.
3. **A workflow file sitting in the repo that never starts on
   `pull_request`** — The recipe exists but GitHub never cooks it when
   someone proposes a change. Same pain as today: the cloud still does
   nothing reliable.
4. **Running checks only on `main` after merge** — Feedback is too late.
   Broken TypeScript can already be on the default branch, which is the
   failure the tech lead asked us to stop.

## What I will demand from later agent-written YAML (preview)

No YAML in this step. When a later step drafts a file, I will ask:

- Does it **start by itself** on pull request open/update (not only a
  manual “click run” button)?
- Are the steps **ordered** the way we already work: install → typecheck
  → build → lint/test only if those scripts exist?
- Does a failed command make the job **red**, with a log on the PR?
- Do **secrets, production deploy, and merge** stay human-controlled?

If the draft matches a non-example above, it is CI washing. Send it back.

## Open questions for inventory/design steps

- Which exact npm scripts does this repo already expose? (Today:
  `typecheck` and `build` are real; README already says there is **no**
  `lint` or `test` script.)
- Which checks are automatable vs must stay human (product UX, security
  judgment, sponsor data handling)?
- What should the single workflow be **named** so a teammate can find it
  on a real PR?
