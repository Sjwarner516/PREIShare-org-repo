# PREIshare review orchestration runbook

This runbook is the repeatable sequence for reviewing a PREIshare pull request. A human starts any AI review in a chat assistant. The AI is an advisor only. It may suggest findings. It may not approve or merge. A GitHub Action does not start that review.

## What this file is not

- This topic does not add a new GitHub Action.
- This topic does not edit `.github/workflows/pr-ci.yml`.
- This file does not replace `docs/ci/human-judgment-checklist.md`.
- A green check or a red check never replaces the checklist or a human approval.
- Do not change branch-protection settings from this file. A later step records what the repository plan can enforce.

## Pieces this sequence uses

These pieces already exist. Point to them. Do not rewrite them here.

- CI workflow: `.github/workflows/pr-ci.yml` already runs install, typecheck, build, lint, and test on pull requests. Workflow name **PR CI**. Job name **Quality checks**. Do not edit it. Do not add another workflow file.
- Overlay brief: `docs/ci/ai-review-overlay-brief.md` says why this review overlay exists.
- Role map: `docs/ci/pr-approval-roles.md` says who may approve and who may merge.
- System instruction: `docs/ci/ai-pr-review-prompts.md` holds the standing rules and the required output shape for the chat assistant.
- Human checklist: `docs/ci/human-judgment-checklist.md` covers sign-in, money, privacy, and product intent. A human walks this list.

## Who may act

Copied from `docs/ci/pr-approval-roles.md`. No new role was invented.

- People who may approve: GitHub collaborator `thortek` (human reviewer with write access).
- People who may merge: Sydni Warner (`@Sjwarner516`), admin of this GitHub repository, and only after `thortek` has approved and the existing pr-ci check is green.
- Same person for approve and merge: no. `thortek` approves. Sydni Warner merges. Those are two different people. Sydni Warner is the author when she opens the pull request and is also the maintainer who merges. Those are two jobs, not one button, and they are not the approve job.
- AI assistant: advisor only. It may suggest findings. It may not approve. It may not merge. It may not start the review by itself.

## Where to click

1. Sign in to GitHub in your browser.
2. Open this repository.
3. Click **Pull requests** in the top bar of the repository.
4. Click the title of the pull request you are reviewing. That opens the proposal.
5. To see whether the automatic check ran, click the **Actions** tab in that same top bar. Open the run for this pull request. That run is the existing check from `.github/workflows/pr-ci.yml`. The name in the list is **PR CI** (job **Quality checks**). A run that is still spinning is not finished. A green check means the commands passed. A red X means a command failed. Do not rename the workflow and do not add a workflow if you are unsure. You can also see the check list near the bottom of the pull request **Conversation** tab. The Actions tab is the full history of those runs.

## Never paste these into a chat assistant

- Secrets: passwords, API keys, tokens, Supabase keys, and the contents of a `.env` file.
- Real member data: real names, email addresses, phone numbers, addresses, or payment details.
- Share only the proposed change, called the diff (the lines added or removed), and made-up examples.
- If a diff already contains a real secret or a real member's data, do not paste that part. Stop and ask a human who may approve. Do not clean it up by sending it to the AI.

## Sequence and stop points

A stop point is a moment where a person must decide before anyone continues.

### A. Confirm the continuous integration check

Open the Actions tab and record one state: still running, green check, or red check.

- Stop 1, not finished. If the pr-ci check is still running, wait. Do not review as if the check were done.
- Stop 2, the check is not a decision. A green check is not permission to merge. A red check does not replace the human checklist and is not a human approval. Green means the commands in pr-ci passed. Red means a command failed. Neither means the change is safe for PREIshare members. If the check is red, stop. Do not use the checklist to override a failed automatic check. If the check is green, continue. Green still does not waive sign-in, money, privacy, or product intent.

### B. A human starts the AI review

A person opens a chat assistant. They give it the system instruction from `docs/ci/ai-pr-review-prompts.md` and the diff. They do not paste secrets or real member data.

- Stop 3, no invented prompt. If that system-instruction file is not open, stop and open it. Do not ask the AI to invent a new standing rule. The AI does not start this step. A GitHub Action does not start this step.

The AI notes are suggestions in the required output shape. They are not an approval.

### C. A human applies the judgment checklist

Open `docs/ci/human-judgment-checklist.md`. The human, not the AI, walks sign-in, money, privacy, and product intent. For each AI finding, the human accepts it or rejects it.

- Stop 4, unanswered checklist. Do not approve while any checklist item is unanswered. An AI note you have not judged is not a decision. If the change could show a member email, mishandle money, break who is signed in, or drift from what PREIshare is for, mark that item yourself even if the AI said nothing. Any fail or needs-info blocks merge even when pr-ci is green.

### D. Human approval

Only a person listed under People who may approve may approve the pull request on GitHub.

- Stop 5, wrong person or AI. If you are not `thortek`, stop and ask `thortek`. Do not ask the AI to approve. Do not treat the AI notes as the approval.

### E. Merge

Merge means accepting the proposal so it becomes part of the shared project. Only a person listed under People who may merge may merge, and only after Stop 5 has a real human approval.

- Stop 6, approval missing. A green check plus AI notes is not enough. If the human approval is missing, do not merge. If the checklist failed, do not merge. Only Sydni Warner may merge, and only after `thortek` has approved.

## When the AI is wrong

Do not merge to keep moving. Write down what the AI missed or invented. Changing the system instruction in `docs/ci/ai-pr-review-prompts.md` is a later human decision. This runbook does not edit that file and does not edit the workflow file.

## Roles critique (complete before you commit)

Write YES only after the side-by-side check. If any line would be NO, fix the file first. Do not commit a NO.

- I opened `docs/ci/pr-approval-roles.md` and compared it to the Who may act section: YES
- Approver lines match that role map and no new role was invented: YES (`thortek` is the human reviewer who may approve)
- Merger lines match that role map: YES (Sydni Warner merges only after that approval and green pr-ci)
- The AI is an advisor only and cannot approve or merge: YES
- This file does not add a GitHub Action and does not edit `.github/workflows/pr-ci.yml`: YES
