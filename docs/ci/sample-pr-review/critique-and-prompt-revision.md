# Critique and prompt revision — sample PREIshare pull request

## What I compared
- Saved AI findings: `docs/ci/sample-pr-review/ai-findings.md`
- Planted leak: `docs/ci/samples/planted-privacy-snippet.ts`
- Human checklist: `docs/ci/human-judgment-checklist.md`
- Prompt pack edited in place (not a new file): `docs/ci/ai-pr-review-prompts.md`

## The planted privacy leak, in my words
- Email I saw in the snippet: example@example.com
- Phone I saw in the snippet: +1-555-010-0199
- Why this is a privacy problem for a PREIshare member: a public share preview is for people who are not that member, so putting the member's email and phone on that preview would show private contact details to the wrong audience.

## Four judgments of the first AI review

### 1. Did it catch the privacy issue?
- Caught the email: yes
- Caught the phone: yes
- Quote or close restatement from the findings file: `sampleMember` supplies `example@example.com` and `+1-555-010-0199`
- If this is a miss, what the AI said instead: not a miss

### 2. Did it invent a finding?
- Invented finding: none
- How I know it is not in the sample: not applicable

### 3. Did it skip evidence?
- Claim with no quote from the change: none — every claim had a quote

### 4. Did it try to approve or merge?
- Tried to approve or merge: no
- Words it used, if yes: not applicable
- Sample pull request left unmerged: yes
- Planted leak must not land on main: yes
- I am not telling anyone to merge this sample: yes

## Checklist areas
- Area this leak belongs to: privacy
- Sign-in, money, or product intent reviewed without evidence: no

The planted leak is a public preview that includes a member email and phone, which is the privacy section of `docs/ci/human-judgment-checklist.md`. The first review used not-found blocks for sign-in, money, and product intent and said what it looked at; it did not invent a finding in those areas.

## Gaps the prompt change will fix
- Gap 1: no gaps — all four checks passed
- Gap 2: no second gap
- Gaps I am not fixing, and why: I did not see an invented finding, a skipped quote, a missed email or phone, or an approve/merge attempt, so I will not add a rule for problems I did not see.

## One re-run on the same unmerged sample
- Advisor tool: chat assistant, new chat, not a coding agent
- Same sample as the first review: yes
- Answer key pasted into the chat: no
- Output shape improved: no — the first reply already used Review limits, Findings, and Not found in that order; the re-run used the same headings
- Privacy finding improved: no — the first review already named example@example.com and +1-555-010-0199 and quoted `buildPublicSharePreview` copying those fields; the re-run named them again with a quote
- What is still wrong: nothing from the four checks remained wrong
- Number of re-runs: 1

## Human stays in charge
- I did not let the AI approve.
- I did not click Merge.
- Course files committed on main: this critique and `docs/ci/ai-pr-review-prompts.md` only.
