# ADR-001: Investor listing TypeScript types (PREIshare)

- **Status:** Accepted (Sprint 2, Topic 1)
- **Date:** 2026-09-16
- **Owners:** PREIshare types working group (learner + coach)
- **Related code:** `src/types/index.ts` (barrel — import listing types from here)

## Context

PREIshare investor listings used to travel as loose objects and ad-hoc JSON. That let bad data into production: missing prices, status spelled three ways (`live` vs `published`), and address pieces that vanished on one screen. Sprint 2 Topic 1 models the listing in strict TypeScript so those shapes fail **at compile time**, before an investor sees them.

Business inputs:

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Safety evidence: `docs/type-safety/expected-type-errors.md`, `docs/type-safety/verification-checklist.md`

## Decision

We keep a small types package centered on `InvestorListing`, with supporting types for status, property type, address, financial summary, contacts, and ownership. New UI or API code should import from `src/types/index.ts` instead of opening individual files when possible.

`InvestorListing` is not one flat interface. Shared fields live on `InvestorListingBase`. `status` splits the rest: a **sold** listing must have `closedAt`; published and under-offer listings must have **at least one** contact; drafts and archived listings may have an empty contact list.

## Type choices mapped to business rules

| Business rule (plain language) | Type choice | Why this shape |
| --- | --- | --- |
| Every listing has a stable id, title, summary, timestamps, property class, address, primary-contact id, and ownership | Required fields on `InvestorListingBase` (`id`, `title`, `summary`, `createdAt`, `updatedAt`, `propertyType`, `address`, `primaryContactId`, `ownership`) | Optional identity recreates “this card has no title/id” bugs. Inventory `description` is named `summary` in types. |
| Asking price may arrive later on a draft | Optional `financialSummary?: FinancialSummary` on the listing; when present, `askingPrice` is a **number** and `currency` is `USD` \| `CAD` \| `EUR` | A string price cannot be sorted or compared. Optional whole object matches “metrics can wait”; it does **not** make `address` optional. |
| Workflow status is a closed list | `ListingStatus`: `draft` \| `published` \| `under_offer` \| `sold` \| `archived` | Free `string` allows `availble` / `active` / `closed`. PREIshare’s closed deal is **`sold`**, not `closed`. |
| Property class is a closed list | `PropertyType`: `multifamily` \| `office` \| `retail` \| `industrial` \| `mixed_use` \| `land` | Same reason as status. |
| Street, city, region, postal code, and country travel together | Nested `Address`: required `line1`, `city`, `region`, `postalCode`, `country`; optional `line2` | Stops a map pin with no city. Region is the inventory name (not `state`). Address is **required** on the TypeScript listing even for drafts (stricter than “optional on draft” in the inventory). |
| Optional yield metrics | `projectedIrrPercent?` and `capRatePercent?` as numbers on `FinancialSummary` | Inventory marks IRR and cap rate optional. |
| People on the listing are structured, not a name string | `contacts` is `InvestorContact[]` (or a min-one tuple). Each contact has `id`, `fullName` (inventory `name`), `role: ContactRole`, `email`, optional `phone` | `ContactRole` is `broker` \| `owner_rep` \| `sponsor` \| `property_manager`. A `primary` role fails typecheck. |
| Investor-visible listings need someone to reach | `published` / `under_offer` / `sold` use `contacts: [InvestorContact, ...InvestorContact[]]` (at least one). `draft` / `archived` allow `[]` | Matches the brief’s higher bar for investor-visible statuses. |
| Ownership is named on the listing | Nested `Ownership` **object**: required `ownerName`; optional `notes`, `ownershipPercent` | Not a flattened owner string and not an array (an array is an intentional type error today). |
| A sold listing must record when it closed | Discriminated union: `status: "sold"` requires `closedAt: string`. Other statuses must not carry a close date | `soldMissingClosedAt` is a documented compile error. |
| Identity stamps are not rewritten in ordinary app code | `readonly id`, `readonly createdAt`, `readonly updatedAt` on `InvestorListingBase` | Documents intent; title and address stay writable. |
| Call sites share one import path | Barrel re-exports in `src/types/index.ts`: `InvestorListing`, `InvestorListingBase`, `ClosedInvestorListing`, `OpenInvestorListing`, `InvestorContact`, `ContactRole`, `Ownership`, `Address`, `FinancialSummary`, `ListingStatus`, `PropertyType` | Fixtures import `InvestorListing` from `../types`. `Currency` exists in `financial-summary.ts` but is **not** on the barrel yet. |

## Alternatives considered

1. **Keep listings as `string` / `any` / untyped JSON**  
   Rejected: fastest short term; every bug shows up in production.

2. **One giant flat interface with everything optional**  
   Rejected: optional core fields recreate missing prices; flat shapes hide address and money.

3. **TypeScript `enum` for every closed list**  
   Not used. String unions (`ListingStatus`, `PropertyType`, `ContactRole`) stay easy to read in fixtures and error messages.

4. **Runtime schema library (for example Zod) as the source of truth in this topic**  
   Out of scope. Compile-time types and fixtures come first; a validator can mirror the same unions later.

## Consequences

**Positive**

- Invalid examples in `src/fixtures/invalid-listings.errors.ts` show the compiler rejecting bad data (see `docs/type-safety/expected-type-errors.md`): wrong status spelling, missing `address.city`, string `askingPrice`, invalid contact role, ownership as an array, sold without `closedAt`, published with zero contacts.
- Valid samples in `src/fixtures/sample-investor-listings.ts` construct one listing per status.
- `npm run typecheck` (`tsc --noEmit`) is the shared clean gate. The invalid file is **excluded** so that gate can stay green.

**Tradeoffs**

- Authors must use exact union members; “almost right” strings fail on purpose.
- Nested objects mean fixtures and future API mappers supply a whole `Address` or `FinancialSummary`, not scattered fields.
- Discriminated unions and `readonly` take a few minutes to learn.

**Known holes (still typecheck — called out, not hidden)**

- `primaryContactId` is a `string`; TypeScript does not prove it exists in `contacts`.
- `ownershipPercent` is a `number`; values over 100 are not rejected.
- Inventory ownership is a **list** of rows with `contactId` and `relationship`. Types today use **one** `Ownership` object with `ownerName`. That gap is a follow-up, not silent history.

## Out of scope for Sprint 2 Topic 1

- Database tables, migrations, or hosted row types
- HTTP API routes and runtime request validation
- React forms and client-side validation UX
- Authentication, authorization, and multi-tenant rules
- Photo galleries, offering documents, or search indexes beyond this listing model
- Changing production data or deploying a service
- Encoding “email or phone” as a single compile-time rule (this package requires `email`; phone is optional)

## Follow-ups (next topic / implementers)

1. Import domain types from `src/types/index.ts` when building UI or API layers.
2. Keep `src/fixtures/sample-investor-listings.ts` green under `npm run typecheck` before expanding the model.
3. If product adds a status or property type, extend the **union** and update fixtures + this ADR — do not widen the field to free `string`.
4. Consider runtime validators that mirror these types once API boundaries land.
5. Use `docs/type-safety/verification-checklist.md` as the acceptance gate when types change.
6. Align ownership with the inventory list (`contactId` + `relationship`) if product still needs that shape; consider exporting `Currency` from the barrel; consider proving `primaryContactId` at runtime.

## Evidence links

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Expected compile errors: `docs/type-safety/expected-type-errors.md`
- Verification checklist: `docs/type-safety/verification-checklist.md`
- Types entrypoint: `src/types/index.ts`
