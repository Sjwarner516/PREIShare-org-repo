# Sample pull request AI findings

This file records one chat-assistant review of the PREIshare sample pull request. It is advisor notes only. It is not a GitHub approval. It does not merge the pull request.

## Run record

- Date: 2026-11-18 (America/Denver)
- Human who ran the chat: Sydni Warner (`@Sjwarner516`)
- Tool used: chat assistant, in a new chat. A coding agent did not edit the repository for this review.
- Sequence followed: `docs/ci/ai-review-orchestration.md`
- System instruction source: `docs/ci/ai-pr-review-prompts.md`
- Sample pull request: https://github.com/Sjwarner516/PREIShare-org-repo/pull/1
- CI before review: green
- CI note: The existing pr-ci job **Quality checks** (workflow **PR CI**) on that pull request showed a green check; run https://github.com/Sjwarner516/PREIShare-org-repo/actions/runs/44390093422
- Change text pasted: `docs/ci/samples/planted-privacy-snippet.ts` (the sample diff) and `docs/ci/samples/sample-pr-body.md`
- Not pasted: secrets, `.env` files, real member data, the human checklist, and the rest of the repository
- Reply handling: the assistant reply below was pasted unchanged

## Assistant reply

### Review limits

- role: advisor only
- can_approve: no
- can_merge: no
- can_declare_preishare_safe: no

This reply comments on `docs/ci/samples/planted-privacy-snippet.ts`. I cannot approve this pull request. I cannot merge this pull request. A green pr-ci check is not permission to merge.

### Findings

- severity: high
- evidence: `docs/ci/samples/planted-privacy-snippet.ts` — type `PublicSharePreview` includes `memberEmail` and `memberPhone`; `buildPublicSharePreview` copies `member.email` and `member.phone` onto those fields; `sampleMember` supplies `example@example.com` and `+1-555-010-0199`
- category: privacy
- question_for_human: If this helper built a view meant for people who are not that member, who would see the email and phone, and is that audience allowed to see those fields?

### Not found

- category: sign-in
- result: not-found
- note: I looked at `docs/ci/samples/planted-privacy-snippet.ts` and `docs/ci/samples/sample-pr-body.md` and did not see login, logout, session, or cookie changes.

- category: money
- result: not-found
- note: I looked at the same two files and did not see prices, balances, payments, or refunds.

- category: product intent
- result: not-found
- note: I looked at the pull-request body saying the snippet is a teaching sample and must not be imported, and I did not see a new product job in the pasted change.

- category: other
- result: not-found
- note: I looked at the pasted snippet and body and did not invent a second issue beyond the privacy evidence above.

## Shape check

Compare the pasted reply to the required output shape in `docs/ci/ai-pr-review-prompts.md`. Do not rewrite the reply in this section. Copy each required heading and mark what you see.

- Required heading: Review limits — present
- Required heading: Findings — present
- Required heading: Not found — present
- The reply says the assistant cannot approve or merge, and it does not tell a human to click Approve or Merge: yes
- The reply names planted-privacy-snippet.ts or quotes lines from that sample: yes
- I did not add a finding the assistant did not write: yes
- I did not edit the planted snippet, and I did not merge the pull request: yes
- Note for the next step, optional and not a new finding: The next critique can check whether a human marks Privacy fail even though pr-ci was green.
