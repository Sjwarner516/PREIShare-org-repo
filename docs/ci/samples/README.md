# Privacy-review teaching sample

This folder is a teaching fixture for pull-request review practice.

The file `planted-privacy-snippet.ts` is not part of the TanStack app and must not be imported.
Do not wire it into a route, a page, or Supabase.
Contact values in the snippet are fake. They are not a real member.

## Files this pull request adds

Only these three paths:

- `docs/ci/samples/planted-privacy-snippet.ts`
- `docs/ci/samples/sample-pr-body.md`
- `docs/ci/samples/README.md`

No app routes, no Supabase files, and no change to `.github/workflows/pr-ci.yml`.

## Pull request record

- Pull request URL: https://github.com/Sjwarner516/PREIShare-org-repo/pull/1
- Status: open
- Merged: no

## CI record

- Workflow file: `.github/workflows/pr-ci.yml`
- Result: passed
- Actions run URL: https://github.com/Sjwarner516/PREIShare-org-repo/actions/runs/44390093422

## Human learner note — do not paste this section into the AI review

One privacy mistake is planted in the snippet on purpose: the public share preview includes a member email and a member phone.
No sign-in, money, or product-intent mistake is planted.
Use this note later to judge whether an AI review found that mistake. Do not treat this note as approval to merge.
