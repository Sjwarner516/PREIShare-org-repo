# PREIshare pull request approval roles

This file says who may do each job on a PREIshare pull request. It follows `docs/ci/ai-review-overlay-brief.md`. It does not start a new project. It does not edit `.github/workflows/pr-ci.yml`. It does not rewrite the review prompt pack.

## Two words, defined before the rules

**Approve** means a human has read the proposal and accepts it. Approve is a review decision. It does not put the change into the shared project by itself.

**Merge** means a human combines the accepted proposal into the shared branch, usually `main`, so the change becomes part of PREIshare for everyone.

Approve is not merge. A green pr-ci check is not approve, and it is not merge.

## The four roles

| Role | Who (name or job you can point to) | May do | Must not do |
| --- | --- | --- | --- |
| Author | Sydni Warner (`@Sjwarner516`), the classmate who opens the pull request | Open the pull request and update it after feedback | Be the only human who approves, or merge alone, when the change touches privacy, sign-in, or money |
| Human reviewer | GitHub collaborator `thortek` (instructor with write access) | Read the change, comment, approve, or request changes | Hand the approve button to the AI assistant |
| Maintainer | Sydni Warner (`@Sjwarner516`), admin of this GitHub repository | Merge only after the human approval and the existing pr-ci check | Merge because an AI comment said the change looks fine |
| AI assistant | Chat assistant used as an advisor | Comment with suggested notes for the human reviewer | Approve, request changes as if it were a GitHub reviewer, or merge |

Sydni Warner is the author when she opens the pull request, and she is also the maintainer who merges. Those are two jobs, not one button. `thortek` is the human reviewer. The reviewer and the maintainer are not the same person.

## What the AI assistant may and must not do

The AI assistant may comment. A comment is a note. A note is not a decision.

The AI assistant must not approve.

The AI assistant must not request changes as if it were a GitHub reviewer.

The AI assistant must not merge.

Request changes is an official GitHub review outcome that sends the proposal back to the author. Only the human reviewer may do that.

## Merge paths

Every allowed path ends with a named human. The AI assistant is never the last actor.

1. Sydni Warner opens the pull request. The existing pr-ci check runs. `thortek` approves. Sydni Warner merges.
2. The pr-ci check fails. Sydni Warner fixes the proposal. The check passes. `thortek` approves. Sydni Warner merges.
3. `thortek` requests changes. Sydni Warner updates the proposal. `thortek` approves. Sydni Warner merges.

Forbidden path, not allowed: the AI assistant comments that the change looks fine, and the proposal is merged with no named human approval.

## Aligned with branch protection, not applied yet

This map agrees with `docs/ci/branch-protection-checklist.md`.

Intended gates, already described in that checklist, and restated here in plain language:

- The pr-ci check should be required before merge.
- A human approval should be required before merge.

This document does not change GitHub settings. It does not turn branch protection on or off. A later step records what the repository plan actually enforced.

## Accountability

If a bad change is merged, the person who answers is Sydni Warner, after `thortek` approved. The AI assistant does not answer for the merge.
