# PREIshare investor listing types

This folder holds **shared TypeScript types** for PREIshare investor listings.

## Why this exists
PREIshare listings must be trustworthy before investors see them. The domain brief
says we need one shared definition so a missing price or a status spelled three
ways cannot slip into production, and so we catch missing or invalid data before
users see it.

Loose objects and ad-hoc JSON let that bad data through (missing asking price,
status written as “live” instead of `published`, address fields that vanish on
one screen). These types catch those mistakes at **compile time**—before a
listing is investor-visible.

## What belongs here
- Domain type modules: `InvestorListing` (`investor-listing.ts`) plus nested
  modules for `ListingStatus`, `PropertyType`, `Address`, `FinancialSummary`,
  `InvestorContact` / `ContactRole`, and `Ownership`
- Public re-exports in `index.ts` (the barrel teammates should import from)
- No UI components, no API route handlers, no database clients

## Typecheck
From the project root after `npm install`:

```bash
npm run typecheck
```

- **Success:** no type errors, exit code `0`
- The script is `tsc --noEmit`: TypeScript checks types only and does not write JavaScript
- **Valid sources** that must pass: `src/types/**` and `src/fixtures/sample-investor-listings.ts`
- **Intentional bad examples:** `src/fixtures/invalid-listings.errors.ts` (documented in
  `docs/type-safety/expected-type-errors.md`). That file is listed in `tsconfig.json`
  `exclude` so it does not break the clean gate.

## Strict mode (plain language)
`strict: true` in `tsconfig.json` turns on the checker’s safest rules. It
refuses accidental `any`, forgotten null checks, and objects that are missing
required properties. Extra flags such as `noUncheckedIndexedAccess` treat
`list[0]` as possibly missing, so you cannot pretend a contact or price exists
when the array or object might be empty.

That is what PREIshare needs: a missing price or a misspelled status fails at
compile time instead of on a live listing.

## Source of truth
Business vocabulary and field rules come from:
`docs/domain/investor-listing-domain-brief.md`
(and the field inventory at `docs/domain/listing-field-inventory.md`).
A beginner verification pass lives at `docs/type-safety/verification-checklist.md`.
