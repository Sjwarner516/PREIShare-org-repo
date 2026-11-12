# PREIshare review overlay brief

This note is the human layer on top of the green check that already exists. Topic 1 already built the automatic check. This topic adds how people review, approve, and merge. It does not rebuild the check.

## Words we will use

- **Pull request:** A pull request is a proposal to change the shared GitHub project. It is not part of the main copy until a person accepts it.
- **CI check:** A CI check is GitHub Actions running the saved recipe of install, typecheck, build, lint, and test on that proposal. A green check means those commands passed. It is evidence. It is not permission to merge.
- **Merge:** Merge is when a person accepts the proposal so the change becomes part of the default branch, the main shared copy, often named `main`.
- **Review comment:** A review comment is a note left on the proposal. A comment is not an approval, and it is not a merge.

## What topic 1 already finished

These files are done and working. Do not treat them as missing or as work still to set up.

- Existing workflow (do not create another): `.github/workflows/pr-ci.yml`
- What that check already runs: install, typecheck, build, lint, and test
- Branch-protection notes already written: `docs/ci/branch-protection-checklist.md`
- Prompt pack already drafted (refine this file later; do not invent a new name): `docs/ci/ai-pr-review-prompts.md`
- Verification log already written: `docs/ci/e2e-verification-log.md`
- Stakeholder handoff already written: `docs/ci/stakeholder-handoff.md`
- Hosting: keep the existing Production URL. Do not create a new hosting project.

A later step will record which branch-protection rules the plan actually saved. Do not fill that record in this brief.

## What this topic adds

Name only these. Later steps will write them. This brief only names them.

1. Who may approve a pull request, and who may merge it
2. A constrained system instruction with a required output shape, edited later inside `docs/ci/ai-pr-review-prompts.md`
3. A human-judgment checklist
4. A practice review on a sample pull request
5. An honest record of which branch-protection rules the GitHub plan actually saved

## What this topic will not rebuild

- No second workflow file
- No second CI design and no second dashboard inventory
- No second prompt-pack filename
- No new hosting project
- No claim that a green CI check is permission to merge

## Risks a green check cannot decide

- **Sign-in:** Sign-in means who is allowed to be logged in, and whether a change breaks that. A passing test can still leave the wrong person inside the dashboard.
- **Money:** Money means charges, payments, or money records. A passing test can still change a number a sponsor should not trust.
- **Privacy:** Privacy means member information, such as an email, staying with only the people who should see it. A change can pass every test and still leak an email.
- **Product intent:** Product intent means whether the change still matches what PREIshare is for: helping people make better real-estate decisions. A green check cannot tell if the product still does that job.

That is why the overlay exists. The CI check stays in front. People still judge these four risks after the commands pass.

## Who is allowed to decide

- The AI may suggest findings in a review comment.
- The AI may not approve a pull request.
- The AI may not merge a pull request.
- A person approves. A person merges.

## How we will direct the agent

We work in one plan-draft-critique cycle. This step creates only `docs/ci/ai-review-overlay-brief.md`. Later steps may refine `docs/ci/ai-pr-review-prompts.md` in place. They will not add a second prompt pack, a second workflow, or a new hosting project.
