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
- Domain type modules only (listing, address, status, contacts, etc.) — **not yet**.
  This step only tracks the folder via `.gitkeep`. `InvestorListing` and other
  type modules come in later steps.
- No UI components, no API route handlers, no database clients

## How to check types
From the project root after `npm install`:

```bash
npm run typecheck
```

That runs `tsc --noEmit`: TypeScript checks files under `src/` and reports
errors without writing JavaScript output files.

## Strict mode (plain language)
`strict: true` in `tsconfig.json` turns on the checker’s safest rules. It
refuses accidental `any`, forgotten null checks, and objects that are missing
required properties. That is what PREIshare needs: a missing price or a
misspelled status fails at compile time instead of on a live listing.

## Source of truth
Business vocabulary and field rules come from:
`docs/domain/investor-listing-domain-brief.md`
(and the field inventory at `docs/domain/listing-field-inventory.md`).
