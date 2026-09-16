# Investor listing type verification checklist

Use this list to prove the TypeScript listing model still matches PREIshare’s
business rules. Check each box against the **real files** named in the bullet.
Do not use tutorial scaffold names (`active`, `financials`, `state`, `name`).

Run from the project root: `npm run typecheck`.

## A. Closed lists and nested shapes

Verify against `src/types/listing-status.ts`, `src/types/property-type.ts`,
`src/types/address.ts`, `src/types/financial-summary.ts`, and
`src/types/investor-listing.ts`.

- [ ] Identity fields from the inventory appear on `InvestorListingBase`: `id`, `title`, `summary` (inventory `description`), `createdAt`, `updatedAt` (`src/types/investor-listing.ts`)
- [ ] `ListingStatus` is exactly `draft` | `published` | `under_offer` | `sold` | `archived` (`src/types/listing-status.ts`)
- [ ] `PropertyType` is exactly `multifamily` | `office` | `retail` | `industrial` | `mixed_use` | `land` (`src/types/property-type.ts`)
- [ ] `Address` is a nested object with required `line1`, `city`, `region`, `postalCode`, `country` and optional `line2?` (`src/types/address.ts`)
- [ ] `InvestorListing.address` uses that nested `Address` type, not a free-text string (`src/types/investor-listing.ts`)
- [ ] Money lives on optional `financialSummary?: FinancialSummary` on the listing (`src/types/investor-listing.ts`)
- [ ] `FinancialSummary.askingPrice` is `number` (not a string) (`src/types/financial-summary.ts`)
- [ ] `FinancialSummary.currency` is `USD` | `CAD` | `EUR` (`src/types/financial-summary.ts`)
- [ ] `projectedIrrPercent` and `capRatePercent` are optional numbers on `FinancialSummary` (`src/types/financial-summary.ts`)

## B. Contacts, ownership, union, and readonly

Verify against `src/types/investor-contact.ts`, `src/types/ownership.ts`, and
`src/types/investor-listing.ts`.

- [ ] `InvestorContact` has `id`, `fullName`, `role: ContactRole`, `email`, and optional `phone?` (`src/types/investor-contact.ts`)
- [ ] `ContactRole` is `broker` | `owner_rep` | `sponsor` | `property_manager` (`src/types/investor-contact.ts`)
- [ ] Statuses `published`, `under_offer`, and `sold` require at least one contact (`contacts: [InvestorContact, ...InvestorContact[]]` in `src/types/investor-listing.ts`)
- [ ] `draft` and `archived` may have an empty contacts list (`contacts: InvestorContact[]` in `src/types/investor-listing.ts`)
- [ ] Ownership is a nested `Ownership` **object** (not a list) with required `ownerName` and optional `notes?` / `ownershipPercent?` (`src/types/ownership.ts`)
- [ ] This step’s model is one ownership object on the listing; the field inventory’s later list-of-rows shape is not what the types use today
- [ ] `InvestorListing` is a discriminated union on `status`: `sold` requires `closedAt: string`; `draft` / `archived` / `published` / `under_offer` do not (`src/types/investor-listing.ts`)
- [ ] `id`, `createdAt`, and `updatedAt` are `readonly` on `InvestorListingBase` (`src/types/investor-listing.ts`)

## C. Barrel exports

Verify against `src/types/index.ts`.

- [ ] Teammates import listing types from the barrel `src/types/index.ts` (not by reaching around it unless debugging a module)
- [ ] The barrel re-exports `InvestorListing`, `InvestorListingBase`, `ClosedInvestorListing`, and `OpenInvestorListing`
- [ ] The barrel re-exports `InvestorContact`, `ContactRole`, `Ownership`, `Address`, `FinancialSummary`, `ListingStatus`, and `PropertyType`

## D. Fixtures

Verify against `src/fixtures/sample-investor-listings.ts`,
`src/fixtures/invalid-listings.errors.ts`, and
`docs/type-safety/expected-type-errors.md`.

- [ ] `src/fixtures/sample-investor-listings.ts` assigns valid `InvestorListing` values (including `samplePublishedListing`, `sampleDraftListing`, `sampleUnderOfferListing`, `sampleSoldListing` with `closedAt`, and `sampleArchivedListing`)
- [ ] The sold sample has `closedAt`; the draft sample may use `contacts: []`
- [ ] `src/fixtures/invalid-listings.errors.ts` is annotated as `InvestorListing` on purpose and is **not** meant to typecheck
- [ ] The invalid file’s seven named exports match `docs/type-safety/expected-type-errors.md`:
  - [ ] `invalidStatusSpelling`
  - [ ] `missingAddressCity`
  - [ ] `priceAsString`
  - [ ] `invalidContactRole`
  - [ ] `ownershipAsArray`
  - [ ] `soldMissingClosedAt`
  - [ ] `publishedEmptyContacts`

## E. Typecheck gate

Verify against `package.json`, `tsconfig.json`, and `src/types/README.md`.

- [ ] `package.json` script name is `typecheck` and the command is `tsc --noEmit`
- [ ] `tsconfig.json` `exclude` includes `src/fixtures/invalid-listings.errors.ts` so the intentional bad examples do not break the clean gate
- [ ] Default typecheck covers `src/types/**` and `src/fixtures/sample-investor-listings.ts` (via `include`: `src/**/*.ts`)
- [ ] `src/types/README.md` **Typecheck** section explains: run `npm run typecheck` from the project root; success is no errors / exit code `0`; `tsc --noEmit` checks types only and does not write JS; invalid fixtures are excluded and documented in `docs/type-safety/expected-type-errors.md`

## Sign-off

- [ ] Re-ran `npm run typecheck` from the project root; it exited `0` with no type errors
- [ ] Would hand this listing model to a teammate who has not opened the tutorial: they can run the gate from the README and verify each box against the files named above
