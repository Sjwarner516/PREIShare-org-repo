# Pull request title

Add a teaching sample for a public share preview (do not merge)

# Pull request description

This pull request adds three teaching files under `docs/ci/samples` and nothing else.

- `docs/ci/samples/planted-privacy-snippet.ts`
- `docs/ci/samples/sample-pr-body.md`
- `docs/ci/samples/README.md`

The snippet is not part of the TanStack app and must not be imported.
It does not change app routes, Supabase, or `.github/workflows/pr-ci.yml`.
The contact values are fake (`example@example.com` and a 555 phone number).

Please review the sample helper the way the runbook in `docs/ci/ai-review-orchestration.md` describes, using `docs/ci/human-judgment-checklist.md`.
Roles in `docs/ci/pr-approval-roles.md` still apply: a human may approve, a human may merge, and an AI assistant may only advise.

This description does not approve the change. Do not merge this pull request as part of the exercise.
