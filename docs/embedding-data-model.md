# PREIshare embedding data model

## Purpose

Software-ready design for **property listings** and their **embedding vectors**.

This doc is the contract for later pgvector migrations, TypeScript types, seed/backfill, and similarity search. It is **not SQL** and **not application code**. If a later prompt would add tables or fields listed under Out of scope, cut it.

**My scratch list before drafting:** (a) each searchable property needs `id`, `title`, `description`, optional `city`, and timestamps already used on PREIshare listings; (b) the vector is built from **title + description** only; (c) the embedding is a **fixed-length list of numbers** stored in its **own** column; (d) that length is **`DIMENSION_TODO`** until a later step picks a model.

---

## Sources

Consumed as-is (do not invent a different product):

- `docs/semantic-search-requirements.md` — buyer queries, in/out scope, sample listings
- `docs/embeddings-learner-notes.md` — embedding = meaning as numbers; generation vs storage
- `docs/vector-search-learner-notes.md` — query embedding vs stored vectors; rank best-first; top-K; distance vs similarity
- `docs/data-model-and-rls-matrix.md` — existing `properties` listing identity (extend, do not fork)

---

## Overview

Each **property** is one PREIshare listing we can show in search. Humans read normal text fields (`title`, `description`, optional `city`). Search uses one **embedding** column: a fixed-length list of numbers that captures the meaning of selected listing text.

This tutorial **extends** the existing `properties` idea (one catalog). It does **not** add a second listings table. Sample rows for semantic search may be seeded fiction; they still use this same shape.

Search will: generate a **query embedding** from the buyer’s phrase → compare it to **stored** property embeddings → rank best-first → top-K. Keyword-only match is not the ranking rule.

---

## Identifiers

| Field | Type (logical) | Required | Notes |
| --- | --- | --- | --- |
| id | UUID | yes | Primary key. Unique per listing. Guessing an id does not change how embeddings work. |

Do not use `id` as embedding input. It is identity, not meaning.

---

## Core listing fields (this tutorial slice)

Fields humans read in the demo. Logical types only.

| Field | Type (logical) | Required | Notes |
| --- | --- | --- | --- |
| title | text | **yes** | Short headline. Part of the embedding input. Must be non-empty for searchable rows. |
| description | text | **yes** for searchable rows | Longer write-up. **Main meaning source** for queries like “quiet cabin near water.” Earlier sponsor-create allowed an empty description; **semantic search rows must have description text** or they cannot be honest meaning matches. |
| city | text | no | Optional display (already on PREIshare list cards). **Not** part of the embedding recipe. |
| status | text | yes if the row lives on the existing `properties` table | Existing listing lifecycle (`draft` / `published`). Display only for this slice. **Not** embedded. Seed may use `published` or `draft`; ranking does not sort by status. |
| created_at | timestamp | yes | When the row was inserted. **Not** embedded. **Not** the ranking order. |

### Fields that already exist and stay out of this search contract

| Field | Why it is mentioned | What this slice does **not** do |
| --- | --- | --- |
| owner_id | Required on live sponsor `properties` for RLS | Do **not** add user/auth tables. Do **not** embed owner ids. Seed strategy for sample rows (satisfy existing NOT NULL vs a later note in the pgvector plan) is an open question—not a new product table. |
| price / beds / photos | Investor marketplace extras | **Not modeled** here. Requirements exclude filters, photos, and payments. Do not add them as required columns. |

---

## What text is embedded

**Canonical listing embedding input** — concatenate `title` and `description` with a blank line between them:

```text
{title}

{description}
```

Rules:

- **Always** build listing embeddings from this same recipe (generation and re-embed). If code embeds **title only**, that is a bug against this contract.
- Trim each part. If description is empty, the row is **not searchable** until description is filled and the vector is generated.
- Do **not** embed `id`, `city`, `status`, `owner_id`, timestamps, or prices as if they were narrative meaning.
- Store **raw** `title` and `description` unchanged. The vector is a **derived** column. Re-embed overwrites the vector only; it must not wipe the listing text.

**Query embedding input:** the buyer’s search string as typed (for example `quiet cabin near water with good rental upside`). Same **model** and **`DIMENSION_TODO`** as listing vectors. The query is **not** forced through the `{title}\n\n{description}` recipe because it is not a listing.

---

## Embedding column

| Field | Type (logical) | Required | Notes |
| --- | --- | --- | --- |
| embedding | vector(**DIMENSION_TODO**) | **yes after backfill** for any row that may appear in semantic search | One vector per property in this tutorial. Same length for every stored row **and** every query embedding. |

### Dimension placeholder

- The only size name in this contract is **`DIMENSION_TODO`**.
- A later step chooses the embedding model and replaces **`DIMENSION_TODO`** with **one** integer everywhere (this doc, migration, TypeScript types) in a **single pass**.
- Until then, do not write a second size in another section. Query vectors and stored vectors must use the **same model and same dimension**. Mixed lengths break insert or search (see embeddings + vector-search notes).

### Nullability and backfill lifecycle

1. **Create listing text** — `title` + `description` (and other scalars) exist on the row.
2. **Generate embedding** — outside the database (TypeScript / model API). Input = canonical string above.
3. **Store vector** — write `embedding` on that same property row.
4. **Eligible for semantic search** — only when `embedding` is **non-null** and has length **`DIMENSION_TODO`**.

Temporary null: `embedding` may be null **only** between insert-text and embed (or if embed failed and we have not retried). After seed/backfill, **every searchable sample property has a non-null embedding**. A null embedding is omitted from ranking, not treated as “close to everything.”

---

## Separation of concerns

| Concern | Where it lives |
| --- | --- |
| Human-readable listing | `title`, `description`, optional `city`, `status` |
| Meaning for search | `embedding` vector column **only** |
| Identity | `id` |
| Similarity metric | Decided at **query** time in a later SQL step. Reminder from `docs/vector-search-learner-notes.md`: know whether the operator is **distance** (lower better) or **similarity** (higher better). Planned style to try: **cosine similarity** (name only until migration). |
| Top-K | Query/API concern (try **K = 5**). Not a column on the property. |

Do **not** replace `description` with the vector. The UI needs text; ranking needs numbers.

---

## In scope vs out of scope (data model)

**In scope**

- One `properties` table (or equivalent existing listing table) with `id`, listing fields above, and `embedding`
- **One** embedding per property for this tutorial
- Explicit embedding input recipe (`title` + `description`)
- One dimension placeholder: **`DIMENSION_TODO`**
- Sample seed set large enough for the requirements queries (cabin/water rental, family/schools, downtown walkable, farmland **control**)

**Out of scope (do not model yet)**

- A second listings catalog or `property_listings` fork
- Multiple embedding versions per property (history, per-language, photo embeddings)
- User accounts, saved searches, permissions, or RLS redesign (auth sprint stays as-is)
- Payments, messaging, maps, price/beds filters
- Full-text keyword indexes as a **replacement** for vectors
- Production model keys, rate limits, or batch-job infrastructure
- Mixing two models or two dimensions in one column

---

## Consistency checklist (must pass before migration)

- [x] Every field has a clear purpose tied to requirements (search demo + existing listing identity)
- [x] Primary key defined (`id`)
- [x] Embedding input text recipe is explicit (`{title}\n\n{description}`)
- [x] Single dimension placeholder used consistently (**`DIMENSION_TODO`** only)
- [x] Raw text and vector are separate
- [x] Null rules for embedding are stated (temporary during insert-then-embed; required after backfill for search)
- [x] Query embeddings must match stored embeddings in model and **`DIMENSION_TODO`**
- [x] Out-of-scope items are listed so a later agent does not invent them

If someone embeds **only the title** while this doc says title + description, that is a **fail** at review.

---

## Open questions

- Exact embedding **model name** and the integer that will replace **`DIMENSION_TODO`**
- Final SQL similarity / distance **operator** (align with `docs/vector-search-learner-notes.md`; cosine is the reminder, not locked)
- Whether demo seed `city` values are filled (optional field; not in the embedding recipe)
- How sample seed rows relate to existing `owner_id` NOT NULL on live `properties` (pgvector plan / seed step; **not** a new users table)
- Whether failed embed leaves the row visible in keyword UI but hidden from semantic search (recommended: hide from ranking while `embedding` is null)

---

## Handoff

Next: plan Supabase pgvector enablement and migration **order** using this doc as the schema contract (`docs/pgvector-setup-plan.md`). That later file may name types and extensions. It must not change the embedding recipe or invent a second dimension.

**Contract in one breath:** one property row, human text in `title`/`description`, meaning in `embedding vector(DIMENSION_TODO)` built from `{title}\n\n{description}`, same size for every query.
