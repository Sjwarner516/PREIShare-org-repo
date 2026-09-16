# Sprint 2 Topic 1 — Types Handoff: PREIshare Investor Listings

**Audience:** next sprint topic owners, PREIshare eng, product partners who did not watch types get built  
**Status:** Topic 1 (TypeScript foundations) complete — forms, database, and API not started  
**Date:** 2026-09-16

## 1. Client story recap

PREIshare was shipping investor listing data as loose objects and ad-hoc JSON. That let bad data reach production: missing prices, status strings spelled several ways (`live` vs `published`), and nested address fields that disappeared on some screens. Sprint 2 Topic 1 modeled listings with **strict TypeScript types** so those mistakes fail at **compile time** while someone is still building, not in front of investors.

The typed model, proof fixtures, typecheck gate, and stakeholder decisions live in ADR-001 — this handoff does not copy that record. Read `docs/decisions/ADR-001-investor-listing-types.md` for the mapping table.

## 2. What we shipped this topic

| Deliverable | Path | Why it matters |
| --- | --- | --- |
| Domain brief + field inventory | `docs/domain/investor-listing-domain-brief.md`, `docs/domain/listing-field-inventory.md` | Business rules before code |
| Types barrel | `src/types/index.ts` | Single import for `InvestorListing`, `ListingStatus`, `PropertyType`, `Address`, `FinancialSummary`, `InvestorContact`, `Ownership`, and helpers |
| Core + nested types | `src/types/*.ts` | Status/property unions, nested address and money, contacts, ownership, sold vs open branches |
| Valid fixtures | `src/fixtures/sample-investor-listings.ts` | One realistic listing per status; must stay green |
| Invalid cases + expected errors | `src/fixtures/invalid-listings.errors.ts`, `docs/type-safety/expected-type-errors.md` | Prove bad data is rejected (typo status, missing city, string price, and so on) |
| Typecheck script + checklist | `package.json` (`typecheck` → `tsc --noEmit`), `docs/type-safety/verification-checklist.md`, `src/types/README.md` | Repeatable clean gate |
| Decision record | `docs/decisions/ADR-001-investor-listing-types.md` | Product-facing type decisions |

**How to verify:** walk `docs/type-safety/verification-checklist.md` and run `npm run typecheck` from the project root. Valid types and sample fixtures must pass. Intentional invalid fixtures are **excluded** from that gate; they remain type errors as documented.

## 3. What we must NOT claim is done yet

- No TanStack Start UI or listing forms are built or wired to these types.
- No Supabase / PostgreSQL tables, migrations, or pgvector work from this model.
- No HTTP API routes, network-boundary validation, or auth rules.
- No runtime schema library (for example Zod) is required by this topic.
- No production create/edit listing flow.

If a demo only shows a green typecheck on fixtures, say: **the data model is typed and verified; product surfaces are next.**

## 4. Next sprint pickups (use the types — do not reinvent them)

### A. TanStack Start forms (UI)

- Build create/edit listing forms whose field names and option lists match `InvestorListing`, `ListingStatus`, and `PropertyType` from `src/types`.
- Import from `src/types/index.ts` rather than copying status or property-type strings into components.
- Use `src/fixtures/sample-investor-listings.ts` as realistic defaults / examples.
- Acceptance sketch: during development, a form cannot treat `"active"` or `"closed"` as a valid status.

### B. Supabase / PostgreSQL schema alignment (data)

- Draft columns (or related tables) that mirror required listing fields, nested address/financial concepts, and constrained status / property-type values.
- Document any difference between TypeScript optional fields (`financialSummary?`) and database NULL rules in a follow-up ADR — do not silently diverge.
- Plan contacts and ownership from the same domain brief; types today use one `Ownership` object, while the inventory still describes a list of `contactId` rows (see ADR-001 follow-ups).
- Acceptance sketch: a row that would fail `InvestorListing` assignment is also rejected by constraints or insert validation.

### C. API boundaries (server)

- Define list/get/create/update payloads that **compose or re-export** `src/types` instead of anonymous JSON.
- Keep write endpoints from accepting free-form status strings; use the same unions as Topic 1.
- Add tests with fixture-shaped (valid) and known-bad payloads at the boundary.
- Acceptance sketch: handlers never widen listing status back to plain `string` without a documented escape hatch.

```text
Client pain (loose JSON)
        |
        v
 Domain brief + field inventory
        |
        v
 Strict TS types + fixtures + typecheck + ADR-001   <-- you are here
        |
        +--> TanStack Start forms (UI)
        +--> Supabase/PostgreSQL schema (data)
        +--> API routes & validation (boundary)
```

## 5. Prompting and review self-assessment

- **Prompting habit that helped:** Pasting the **exact** inventory labels into coding-agent prompts (`draft` / `published` / `under_offer` / `sold` / `archived`) so the agent did not copy tutorial scaffold values like `active` or `closed`.
- **Second prompting habit that helped:** Small follow-ups (“make `summary` required,” “exclude the invalid fixtures file”) instead of asking for a full rewrite; one file or one property per correction.
- **Review habit that caught an agent mistake:** Reading every property against `docs/domain/listing-field-inventory.md` — catching `state` vs `region`, `financials` vs `financialSummary`, `name` vs `fullName`, and flattened contact strings.
- **What I would do differently next topic:** Put GitHub credentials in Cursor Cloud secrets (or start the agent on the GitHub repo) before PAUL checks `main`, and exclude `*.errors.ts` from `tsconfig` **before** the first `npm run typecheck` so the clean gate never surprises us.
- **Confidence (1–5) explaining `InvestorListing` to a teammate:** 4 — I can walk status unions, nested address/money, contacts, and `sold` + `closedAt`; I would still open ADR-001 for the ownership-list vs single-object gap.

## 6. Handoff checklist for the next owner

- [ ] Read ADR-001 and this handoff before opening a UI or SQL PR
- [ ] Import listing types from `src/types/index.ts` only
- [ ] Keep `npm run typecheck` green on valid fixtures
- [ ] Do not delete intentional invalid fixture files; they document safety
- [ ] File a new ADR if product changes allowed statuses or required fields
