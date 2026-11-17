# PREIshare human-judgment checklist

This checklist is the human gate for a pull request. A pull request is a proposal to change the shared project. A person marks this list. The AI advisor may suggest notes. It may not mark these outcomes, approve the pull request, or merge it.

Merge means accepting the proposal so its changes become part of the main shared copy.

This file does not replace `.github/workflows/pr-ci.yml`. That workflow already installs dependencies, typechecks, builds, lints, and tests. Do not re-run those commands as items on this checklist. A green pr-ci check is required evidence that those commands passed. It is not permission to merge.

Role names below match `docs/ci/pr-approval-roles.md`. The **human reviewer** is GitHub collaborator `thortek`. The **maintainer** who may merge is Sydni Warner (`@Sjwarner516`). The **AI assistant** stays an advisor only. AI notes, if you read them, must follow the output shape in `docs/ci/ai-pr-review-prompts.md`. This checklist is how a human accepts or rejects those notes. It is not a second copy of that prompt pack.

## How a human uses this file

1. Wait until the existing pr-ci check has a result. If it is red, stop. Do not use this checklist to override a failed automatic check.
2. Read AI advisor notes only as suggestions. A note that says "looks fine" is not evidence.
3. For each of the four sections, look at the evidence, then mark exactly one outcome: pass, fail, or needs-info. `thortek` marks the outcomes. The AI must not mark them.
4. If any section is fail or needs-info, a human must not merge, even when pr-ci is green.
5. Only `thortek` may approve. Only Sydni Warner may merge, and only after that approval and a green pr-ci check. This checklist does not click Approve or Merge.

## Sign-in

### Risk in PREIshare terms

Sign-in is how a member proves who they are so the dashboard shows that member's own information. The overlay brief says a passing test can still leave the wrong person inside the dashboard. The risk is that a change lets the wrong person in, keeps someone signed in who should be signed out, or shows one member another member's dashboard after login.

### Evidence a human needs

- The diff (the lines added or removed) for login, logout, session, cookies, or who is signed in.
- A short note of whose data a signed-in member should see, taken from `docs/ci/ai-review-overlay-brief.md` or `docs/ci/pr-approval-roles.md`.
- If no sign-in file changed, the human still looks once for new screens that read member data and writes what they opened.

The AI's confidence is not evidence.

### What the AI is not allowed to decide

The AI must not decide that sign-in is safe, must not mark pass, fail, or needs-info, and must not approve or merge.

### Outcomes

- **pass**: A human saw the diff and the member-data rule, and this change does not let the wrong person in or show another member's dashboard.
- **fail**: A human saw a sign-in or session problem, or another member's data shown after login. Fail blocks merge even if pr-ci is green.
- **needs-info**: A human cannot tell who the change signs in or whose data it shows. This is not a pass. Do not merge until the missing fact is written down and the section is marked again.

## Money

### Risk in PREIshare terms

Money means any amount a member pays, owes, or sees, including a balance, a price, or a refund. The overlay brief says a passing test can still change a number a sponsor should not trust. The risk is a wrong amount, the wrong person changing an amount, or money moving without a human knowing who is affected.

### Evidence a human needs

- The diff, searched for amounts, prices, balances, payments, or refunds.
- The screen or file where a member would see that amount.
- If the change has no money words, the human writes which files they opened and that they found none.

### What the AI is not allowed to decide

The AI must not decide that an amount is correct, must not mark the money outcome, and must not approve or merge.

### Outcomes

- **pass**: A human checked the diff and either found no money change, or found a money change and confirmed the amount and who can see or edit it.
- **fail**: A human found a wrong amount, a hidden money change, or the wrong person able to change money. Fail blocks merge even if pr-ci is green.
- **needs-info**: A human sees money words but cannot tell who is charged or who can see the amount. This is not a pass. Do not merge until that fact is known and the section is marked again.

## Privacy

### Risk in PREIshare terms

Privacy means keeping a member's private details from people who should not see them. In PREIshare that includes a member's email and other private fields. The overlay brief says a change can pass every test and still leak an email. The risk is a leak: private details on a public page, in an error message, in a log, in a shared screen, or in a file the wrong person can open.

### Evidence a human needs

- The diff, read for email, phone, address, or other private member fields.
- Where that text would appear: a public page, an error, a log, a download, or a screen only one member should see.
- A human statement of who is allowed to see that field.

An AI sentence that says "looks fine" is not evidence. A suggested finding is only a hint to check.

### What the AI is not allowed to decide

The AI must not decide that a privacy leak is acceptable, must not mark the privacy outcome, and must not approve or merge.

### Outcomes

- **pass**: A human read the diff and confirmed private member fields are not shown to the wrong audience.
- **fail**: A human found a private field, such as a member email, exposed to the wrong audience. Fail blocks merge even if every automatic command passed.
- **needs-info**: A human cannot tell who can see a private field. This is not a pass. Do not merge until the audience is known and the section is marked again.

## Product intent

### Risk in PREIshare terms

Product intent is what PREIshare is for and who it serves. Cite this sentence from `docs/ci/ai-review-overlay-brief.md`: product intent means whether the change still matches what PREIshare is for: helping people make better real-estate decisions. Do not invent a new purpose. The risk is drift: the change still builds and tests, but it serves a different goal, a different audience, or a job the brief does not ask for.

### Evidence a human needs

- One sentence copied from the overlay brief that states what PREIshare is for. Do not invent a new purpose.
- The pull request description, compared with that sentence.
- The diff, checked for a new audience or a new job the product was not meant to do.

### What the AI is not allowed to decide

The AI must not decide that a change matches product intent, must not rewrite the product purpose, must not mark pass, fail, or needs-info, and must not approve or merge.

### Outcomes

- **pass**: A human compared the change to the brief and it still serves that purpose.
- **fail**: A human found drift from the brief. Fail blocks merge even if pr-ci is green.
- **needs-info**: The brief does not clearly cover this change, or the description does not say what member problem it solves. Ask a human stakeholder. This is not a pass. Do not let the AI invent the purpose. Do not merge until a human records the missing fact and marks the section again.

## Merge rule

- Any **fail** blocks merge, even when the pr-ci check is green.
- Any **needs-info** blocks merge until a human records the missing evidence and marks that section again.
- All four sections must be **pass**, and pr-ci must be green, before `thortek` may approve.
- After that approval, only Sydni Warner may merge.
- This checklist never authorizes the AI to approve or merge.

## What this checklist does not do

Do not add checklist tasks that repeat the commands already in `.github/workflows/pr-ci.yml`:

- install dependencies
- typecheck
- build
- lint
- test

If those fail, the automatic check is red and this checklist does not waive them. If those pass, this checklist still runs.

## Practice box (not the sample pull request)

This box is practice only. It is not the sample pull request review. No real member email is used.

- Imaginary change: a public PREIshare page prints member@example.com. The pr-ci check is green.
- Section marked: Privacy
- Outcome: fail
- Why a green check does not allow merge: the automatic commands can pass while a private email is still visible to the wrong people. A privacy fail blocks merge.
