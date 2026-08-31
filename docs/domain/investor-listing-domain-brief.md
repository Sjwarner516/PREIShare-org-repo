# Investor Listing Domain Brief (PREIshare)

## Purpose
Define what an investor listing is in PREIshare business language so TypeScript types in later steps match real workflows—not invented fields. A listing is a property opportunity investors can review. It is not a loose JSON blob: identity, lifecycle status, property class, street address, money summary, investor contacts, and ownership must be named and constrained here before any code is written.

## Actors
- **Listing editor (internal ops)** — creates and updates listings before investors see them. Needs to save incomplete `draft` records, then complete every required field before publish.
- **Investor (end user)** — browses listings that are safe to show (`published`, `under_offer`, and historical `sold`). Relies on complete, consistent data: a real status, a locatable address, a numeric asking price, and someone to contact.
- **Reviewer / compliance** — checks that status, price, address, and contact info are trustworthy before a listing becomes investor-visible.
- **Future systems** — website UI, API, and database will all read the same listing shape. They are consumers of this definition, not authors of extra fields.

## Business goals
- One shared definition of a listing across screens and teammates so a missing price or a status spelled three ways cannot slip into production.
- Catch missing or invalid data before users see it (at compile time once types exist).
- Support nested real-world data: address, financial summary, investor contacts, and ownership—never a single vague “details” field.
- Make investor-visible statuses (`published`, `under_offer`, `sold`) hold a higher completeness bar than internal `draft` or `archived`.

## Listing lifecycle statuses (allowed values only)
These are the only allowed status values. Free-text status is forbidden (no “live”, “active”, “Under Offer”, or similar variants).

- `draft` — internal only; not visible to investors. May be incomplete while an editor is still working.
- `published` — visible to investors; must meet the full validity rules below.
- `under_offer` — active interest; still structured like a published listing (same completeness rules).
- `sold` — closed deal; retained for history; still must have been a complete, trustworthy record.
- `archived` — removed from active browse; not deleted. Completeness is not re-checked for investor display because investors do not see it.

## Nested data groups
- **Address** — nested object: street line(s), city, region/state, postal code, country. Required for investor-visible statuses so the property can be located.
- **Financial summary** — nested object: asking price (a number) and currency (from a small closed list). Optional projected return metrics (IRR, cap rate) if the team chooses to show them.
- **Investor contacts** — a list of nested objects: one or more people tied to the listing (stable contact id, name, role, email and/or phone). At least one contact is required for investor-visible statuses.
- **Ownership** — a list of nested objects describing how contacts relate to the asset (primary owner, co-owner, broker, property manager) and an optional ownership share. Each ownership row points at a contact by id—not by a loosely typed name string alone.

## Core identity fields (high level)
- Stable listing id
- Human-readable title
- Property type (fixed set only: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`)
- Status (from the lifecycle list above)
- Short description for investors (required when the listing is investor-visible)
- Created and updated timestamps (as business concepts; storage format decided later)

## Success criteria — “a valid investor listing”
Use this checklist. “Investor-visible” means status is `published`, `under_offer`, or `sold`.

1. Has a non-empty listing `id` and a non-empty `title`.
2. `status` is exactly one of: `draft`, `published`, `under_offer`, `sold`, `archived` (no free-text variants, no other spellings).
3. `propertyType` is exactly one of: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`.
4. Address is a nested object and, for investor-visible statuses, includes street (`line1`), city, region/state, postal code, and country.
5. Financial summary is a nested object and, for investor-visible statuses, includes a numeric asking price and a currency code from the allowed currency list.
6. Contacts is a list; for investor-visible statuses it contains at least one contact, each with a non-empty name and at least one reachable channel (email or phone).
7. Each contact’s `role` and each ownership `relationship` is from an agreed fixed set (not free text).
8. Each ownership row refers to an existing contact by `contactId`. Optional `sharePercent` is a number when present.
9. Optional fields (address line 2, projected IRR, cap rate, ownership share, a second contact channel) may be absent. Required fields for investor-visible statuses must never be missing.
10. A `draft` or `archived` listing may omit investor-facing completeness (description, full address, financials, contacts) but must still have `id`, `title`, `status`, `propertyType`, `createdAt`, and `updatedAt`.

## Out of scope for this topic
- Building UI forms, API routes, or database tables.
- Authentication, payments, or document uploads.
- Exact TypeScript syntax (comes in later steps).
- Additional currencies, property classes, or statuses beyond the closed lists in this brief and the field inventory.
- Photo galleries, offering documents, or legal disclaimers.

## Handoff note
Later steps must implement types that honor this brief and the companion field inventory at `docs/domain/listing-field-inventory.md`. If a type allows a status, property type, contact role, ownership relationship, or extra top-level group not listed here, the type is wrong. Do not flatten nested address, financials, contacts, or ownership into a vague “details” field.
