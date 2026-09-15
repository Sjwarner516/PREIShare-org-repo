# Expected type errors (intentional)

This page is a checklist for humans, including teammates who do not live in TypeScript.

PREIshare listings must fail at compile time when a status is misspelled, a city is missing, a price is a string, or a sold deal has no close date. The file `src/fixtures/invalid-listings.errors.ts` holds **bad examples on purpose**. Each named export is annotated as `InvestorListing`, so TypeScript has to check it and should show a red error.

## How to use this file

- `src/fixtures/invalid-listings.errors.ts` is **supposed to fail typechecking**. The red errors are the proof that the types work.
- Do **not** “fix” those errors. If you add or remove a bad example, update the table below so the list stays true.
- Happy-path samples live in `src/fixtures/sample-investor-listings.ts` and **must stay valid**.
- `npm run typecheck` excludes the invalid file so the happy path stays green.

## Cases that must fail

| id | business problem | rule that should catch it | expected TS kind |
| --- | --- | --- | --- |
| invalidStatusSpelling | status typo would break filters | ListingStatus string union | invalid string literal |
| missingAddressCity | city required for maps/display | Address.city required | missing property |
| priceAsString | money must be numeric for math | FinancialSummary.askingPrice: number | type not assignable (string vs number) |
| invalidContactRole | free-text role would break contact filters | ContactRole union on InvestorContact.role | invalid string literal |
| ownershipAsArray | ownership is one nested object, not a list of percents | Ownership object on InvestorListing | type not assignable (array vs object) |
| soldMissingClosedAt | a sold listing must record when it closed | InvestorListing discriminant: status "sold" requires closedAt | missing property |
| publishedEmptyContacts | a published listing with nobody to contact is not investor-ready | InvestorListing discriminant: published / under_offer / sold require min 1 contact | type not assignable (empty array vs min 1) |

## Known holes (still typecheck)

These domain rules are **not** enforced by the types yet. Leave the types as they are for now; this list is only so we do not pretend the checker covers everything.

- `primaryContactId` is a string; it is not proven to exist in `contacts`.
- `ownershipPercent: number` does not reject values over 100.
