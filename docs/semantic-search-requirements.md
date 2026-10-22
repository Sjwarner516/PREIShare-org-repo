# PREIshare semantic search — requirements brief

**Project:** PREIshare investor dashboard  
**Audience:** The next implementer, a stakeholder who has two minutes, and anyone writing later embedding / search / verification steps  
**Rule:** This file is a **problem and scope contract**. It does not invent table columns, vector sizes, SQL, API paths, or React components. Later design steps choose those details. If a later prompt would add work listed under Out of scope, cut it.

This is a **beginner tutorial slice** on a small sample of property descriptions. It is not a production search engine and it is not a rebuild of sponsor login or listing create.

---

## Problem (one paragraph)

PREIshare buyers look at investment properties the way people talk, not the way listing copy is written. They type intent: lifestyle (“quiet,” “near water”), use (“weekend stays”), and money (“rental upside”). Ordinary search only keeps a listing when the **same words** appear in the text. A lakeside cottage described as “peaceful short-term income, dock on the lake” will not show up for “quiet cabin near water with good rental upside” if those exact words never appear together. That miss is the product problem. This tutorial will later add a **small meaning-aware search slice**: turn sample property descriptions into embeddings (lists of numbers that stand for meaning), store them in Supabase PostgreSQL with pgvector, and rank those samples by similarity to the buyer’s query. Until those later steps exist, this brief only says **who** searches, **what** a good list looks like, and **what we will not build**.

Keyword search fails here because the buyer and the listing author used different words for the same idea. Semantic search should still surface the lakeside rental cottage even when “cabin” is missing from the listing.

---

## Actors

| Actor | Goal in this slice | In scope to design for? |
| --- | --- | --- |
| Property buyer / investor | Type everyday intent and see a ranked list of sample homes that match **meaning**, not only exact phrases | **Yes** — the person who searches |
| PREIshare operator (us) | Demo a trustworthy, beginner-explainable match on a small sample set and hand off a brief later steps can fail against | **Yes** — we run the demo and write verification |
| Listing sponsor | Already creates owned listings in earlier sprint work | **Named only** — this slice does not add sponsor tools or require live sponsor rows |
| Coding agent (assistant) | Produce later migrations, embedding helpers, seed data, search helper, and a minimal search page **only** inside the stated scope | **Yes as implementer** — not a product user |
| Admin / compliance | Might later moderate listings | **Out of scope** — do not build admin search |

There is no “search as a signed-in sponsor” story in this brief. The searcher is a **buyer** looking at **sample** listings. Auth, RLS, and create-listing remain earlier-sprint work and must not be redesigned here.

---

## Example queries (must drive later tests)

Use these as the demo script. Each “good result” note is **plain language**. A tester who has the sample listings in front of them should be able to mark pass or fail **without asking what “relevant” means**. Later seed data must include at least one listing that can satisfy each **should match** query **without** copying the query’s distinctive words into the listing text.

### 1. Quiet waterfront lodging with rental income *(keyword-breaker)*

**Query:** `quiet cabin near water with good rental upside`

**Why keyword search fails:** A strong sample can describe a peaceful lakeside cottage with short-term guest income and never use the words *cabin*, *water*, *quiet*, *rental*, or *upside*. Exact-word search returns nothing or the wrong rows.

**Good top result:** A lodging-style home next to a lake, river, or dock, described as calm / peaceful, with income or guest-stay language (vacation rental, short-term stays, strong occupancy)—even if the title never says “cabin.”

**Fail this query if:** The first result is an urban condo, a noisy nightlife unit, or irrigated farmland, **or** the only hit is a listing that matched because it literally contains `cabin` and nothing else in the meaning fits.

### 2. Family house near schools

**Query:** `family-friendly home close to good schools`

**Why keyword search fails:** The listing may say “three-bedroom on a cul-de-sac, walk to elementary” and never say *family-friendly* or *good schools*.

**Good top result:** A residential house (not a downtown studio or a farm) whose description implies households with children and nearby schooling (elementary, district, playground, quiet street).

**Fail this query if:** The first result is a one-bed nightlife loft or a cabin marketed only for weekend adults, with no school or family cue.

### 3. Walkable downtown living

**Query:** `downtown condo walkable to restaurants`

**Why keyword search fails:** The listing may say “urban loft, dining on the block, no car needed” and never say *downtown*, *condo*, *walkable*, or *restaurants*.

**Good top result:** A city condo / loft / flat whose description is about walking to food, nightlife, or a core business district—not a rural cabin that happens to mention a grill.

**Fail this query if:** The first result is a secluded cabin or a farm parcel whose only “food” language is a kitchen or land for crops.

### 4. Near-miss control *(must not dominate)*

**Query:** `flat irrigated farmland for row crops`

**Why this query exists:** Semantic search can over-associate any “property” with any other property. If the sample set is cabins, houses, and condos, this query is the **control**. It should not crown a lakeside cabin or downtown loft as a strong match just because both are real estate.

**Good top result:** If the sample set includes a farm / ag / acreage listing, that listing is first. If the sample set has **no** farm listing, the ranked list may be empty or clearly weak—cabins and condos must not look like they “won.”

**Fail this query if:** A lakeside cabin or downtown condo sits in **first place** as if it were a strong meaning match for farmland.

### 5. Synonym / paraphrase of query 1 *(second keyword-breaker)*

**Query:** `peaceful place I can rent out on weekends`

**Why keyword search fails:** Shares intent with query 1 (calm + lodging income) but uses *peaceful*, *rent out*, and *weekends* instead of *quiet*, *cabin*, and *rental upside*. A listing written with “serene lake cottage, Saturday-to-Sunday guests” should still rank well.

**Good top result:** The same kind of property as query 1 (calm lodging with guest/income use). It is acceptable if queries 1 and 5 surface the **same** sample listing first.

**Fail this query if:** The first result is a full-time family house with no guest-income cue, or a downtown condo whose only “rent” language is monthly tenant yield with no weekend/stay meaning.

Do **not** add map pins, price sliders, or “did you mean…?” behavior to satisfy these queries. Ranking by meaning similarity on sample descriptions is enough.

---

## Success criteria (observable)

A stranger watching a demo (or reading verification notes) must be able to check **yes or no**. None of these mean “search feels smart.”

- [ ] A small **sample** set of properties exists, each with readable description text **and** a stored embedding vector for that text (how the vector is stored is a later design step).
- [ ] Typing a natural-language query returns a **ranked list**: more than one hit when samples support it, **best meaning match first**, weaker matches below.
- [ ] Query 1 (`quiet cabin near water with good rental upside`) returns a waterfront / lakeside lodging sample in the **top result** even when that listing’s text does **not** contain the words `cabin` and `water` together (ideally contains neither).
- [ ] Query 5 (`peaceful place I can rent out on weekends`) also returns a calm lodging-with-income sample near the top, showing paraphrase still works.
- [ ] Query 4 (`flat irrigated farmland for row crops`) does **not** put a cabin or downtown condo in first place as a strong match when those are the only samples.
- [ ] A beginner can point at query 1 (or 5) and say, in one sentence, why **keyword** search would miss that listing (“the listing never uses the buyer’s words”).
- [ ] The demo search page is reachable and shows the query plus the ranked titles/descriptions (or an honest empty state). It does not require maps, login, or payment to complete the checks above.
- [ ] Later code and docs stay inside **In scope**. If maps, auth, payments, production embedding ops, or advanced ranking appear, this criterion **fails** even if similarity works.

If any checkbox needs a hidden definition of “relevant,” the criterion is still too vague—rewrite it against the example queries before implementing.

---

## In scope for this tutorial

Later steps may implement **only** this slice:

- A plain-language explanation of embeddings and vector similarity (meaning-aware match vs exact words)
- A data-model write-up for sample properties **plus** embedding vectors that can live in Supabase PostgreSQL with pgvector (design first; no extra product tables)
- A migration that enables pgvector and stores vectors for the sample set
- A TypeScript helper that turns property **text** into an embedding
- A seed / backfill path for a **small** sample set (enough to run the example queries, including at least one near-miss control listing **or** a documented empty/weak result for query 4)
- Similarity search (SQL + TypeScript helper) that ranks samples for a query string
- One minimal API-style server function **and** one simple React search page in the existing TanStack Start app
- End-to-end verification notes and a short handoff doc that reuse **these** queries and checkboxes

Sample listings may be seeded fiction written for the demo. They do not have to be live sponsor rows from the auth sprint.

---

## Out of scope (explicit non-goals)

Do **not** treat these as implied follow-ups in the same slice:

- Production embedding provider billing, API keys in git, rate-limit operations, or batch jobs at marketplace scale
- Map search, draw-a-region, or “near me”
- Filters (price, beds, baths, property type chips) and hybrid keyword + vector tuning beyond a basic similarity demo
- Auth, RLS changes, payments, messaging, saved searches, or email alerts
- Personalization, click-through ranking, business rules (“boost featured listings”), or autocompletes
- Photo / PDF embedding, multilingual models, or real-time re-embed on every sponsor edit
- A new Vercel project, a native mobile app, or visual polish as a goal
- Inventing a second listings table that diverges from the product idea of a property listing (later data-model work may **extend** storage for vectors; it must not invent a parallel catalog)

If a prompt asks for any of the above “while we’re here,” the answer is no. Record it as future work outside this brief.

---

## Assumptions and open questions

**Assumptions (this tutorial)**

- Free-tier Supabase is enough for a handful of sample rows and vectors.
- English queries and English sample descriptions are enough.
- One embedding model and one vector size will be chosen in the **data-model step** and must stay **the same** from seed through search (mixing sizes would make ranking meaningless).
- Distance / similarity metric (for example cosine) is also chosen in that later step and used consistently.
- The searcher in the demo does not need to be signed in. This does not cancel earlier sprint auth; it keeps **this** slice small.
- “Good” is judged against the example queries and sample descriptions, not against a live MLS or a large production index.

**Open questions (resolve in later design steps, not here)**

- Which embedding provider and model (hosted vs local) the tutorial will use
- Vector dimension and distance metric
- How many sample listings, and the exact wording of each seed description
- Whether vectors live beside existing property rows or in a dedicated store (problem level: they must be queryable with the listing text for the demo)
- How the minimal search page is routed in the existing TanStack Start tree (path names are **not** locked here)
- Whether a failed or empty provider call shows a plain error versus a mocked fallback (must never leak secrets either way)

Do not answer those questions by inventing schema or code in this file.

---

## Handoff note for later steps

Every implementation step should be checkable against the **example queries** and **success criteria** above. Quote this file in later prompts. If a prompt would add maps, auth, payments, production embedding ops, or ranking beyond basic similarity, cut it. If a prompt starts with SQL columns or React widgets before a data-model brief exists, stop and design storage first.

**Stakeholder one-minute version:** Buyers type intent, not listing jargon. Keyword search misses homes that use different words for the same idea. We will demo meaning-aware ranking on a small sample in Postgres—not a map, not a marketplace, not a production pipeline.
