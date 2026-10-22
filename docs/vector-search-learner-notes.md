# Vector search learner notes (PREIshare)

These notes sit **after** embeddings and **before** any SQL. I already know from `docs/embeddings-learner-notes.md` that an embedding is a list of numbers for meaning, generated outside the database and stored next to the property. This file answers: once many of those lists are stored, and a buyer types a new phrase, **how do we pick the best listings?**

**Scratch answer I wrote first:** After we have a query embedding and many property embeddings, the system compares **those number-lists to each other**, not the English words. “Best match” means the stored listing whose numbers sit **nearest** the query’s numbers on a map of meaning, then we keep only the closest few.

No production schema, no `CREATE TABLE`, no finished API. Ranking judgment only.

---

## 1. My plain-language definition

Vector similarity ranking means: turn the buyer’s query into an embedding **the same way** we embedded listing text, compare that list of numbers to each **stored** property embedding, score how close the meanings are, and return the closest properties **first**.

Keyword search asks “does this exact word appear?” Vector search asks “is the meaning nearby?” A listing that says “lakeside cottage, peaceful, strong short-term income” can rank highly for `quiet cabin near water with good rental upside` even if none of the buyer’s exact words appear.

---

## 2. How a search runs (steps I can explain)

1. Buyer types a natural-language query (from `docs/semantic-search-requirements.md`).
2. System creates a **query embedding** with the **same** embedding approach used for listings (same model, same list length). Generation happens here, outside the database.
3. System compares the query embedding to **stored property embeddings** (the lists we already saved in the database).
4. Each property gets a **distance or similarity score**. I do not compute it by hand; I must know which kind the database reports.
5. Results are **ranked** best-first and cut to **top-K** (I want to try **K = 5** so the UI does not dump the whole sample table).

```text
[Buyer query text]
        |
        v
[Query embedding] ----compare----> [Property embeddings in database]
        |
        v
[Scores] -> [Sort best-first] -> [Top-K listings shown]
```

If step 2 uses a different model than the listings, the map is wrong. If step 3 compares to raw description text with `ILIKE`, that is keyword search wearing a semantic name.

---

## 3. Keyword search vs vector search (same query)

**Example query (requirements query 1):** `quiet cabin near water with good rental upside`

| Approach | What it looks for | Likely miss |
| --- | --- | --- |
| Keyword | Exact words like *cabin*, *water*, *rental* | Listing that says “lakeside cottage, peaceful, strong short-term income” (or my seed line “Quiet waterfront cottage, great Airbnb returns”) |
| Vector / semantic | Nearby meaning even when words differ | Still can miss if the listing text is empty, misleading, or was **never embedded** |

**My takeaway:** PREIshare buyers describe *intent*. Sponsors (or our sample copy) phrase the same home many ways. Ranking has to compare embeddings, not require overlapping tokens.

---

## 4. Worked ranking examples (no real math required)

I am practicing **judgment**, not computing real vectors. Relative order is what I will defend in a demo.

### Example A — clear winner

**Query:** `family-friendly home near good schools` (requirements query 2, shortened)

| Listing blurb (short) | Expected rank | Why |
| --- | --- | --- |
| "4BR near top-rated elementary, quiet cul-de-sac, yard for kids" | **1 (best)** | Same intent: family house + schools. Keyword might still work here because *elementary* is close to *schools*, but vector should win even if the listing said “walk to the district campus” instead. |
| "2BR downtown loft, nightlife, walk to offices" | **lower** | Different lifestyle. Might share *walk* or *home*-ish housing language; meaning is not family-plus-schools. |
| "Industrial warehouse, high ceilings, loading dock" | **lowest** | Unrelated meaning. Still a property, so a sloppy “everything is real estate” ranking would wrongly keep it near the top. |

If a future `match_properties` function puts the warehouse first, ranking **fails**—even if it returned three rows.

### Example B — different words, same intent

**Query:** `cabin by the lake` (same intent as requirements query 1, fewer words)

| Listing blurb (short) | Expected rank | Why |
| --- | --- | --- |
| "rustic woodland retreat on the water with dock" | **1 (best)** | Small getaway + water. No *cabin*, no *lake*. This is the PREIshare case. |
| "Peaceful lakefront cabin with strong short-term rental history." | **also near the top** | Same meaning; happens to share *cabin*. Fine if it ties or sits next to the woodland retreat. |
| "Downtown loft near nightlife and offices; skyline views." | **low** | Shared word *views* must not beat the water getaway. |

**Why vector should win:** shared meaning (quiet lodging on water) without the buyer’s tokens.

**Why keyword may fail:** `cabin` and `lake` never appear in the woodland-retreat blurb.

### Extra control (from requirements query 4)

**Query:** `flat irrigated farmland for row crops`

Cabins and downtown lofts must **not** sit in first place as if they were strong matches. If the sample set has no farm listing, a weak or empty top is more honest than crowning a cabin.

---

## 5. Top-K and scores (what I will check later)

- **Top-K:** only return the K nearest neighbors. Default I want to try: **K = 5**. A demo page should not print every sample row “just in case.”
- **Distance score:** **smaller** usually means closer / more similar. Sorting `ASC` is the usual direction **if** we are using distance.
- **Similarity score:** **larger** usually means closer / more similar. Sorting `DESC` is the usual direction **if** we are using similarity.
- **I will check which kind of score our later SQL returns before I trust ORDER BY.** Mixing this up is the easiest way to show the worst listing first.
- A score alone is not enough in the UI. I still want **property id**, a **title or description snippet**, and the **score** for debugging (“why did this hit appear?”).
- Score is **not** a human-labeled field like “quietness = 0.9.” It is only “how near is this list to the query list?”

---

## 6. What good ranking is *not*

- Not alphabetical order of titles
- Not “newest listing first” unless we add that as a separate product rule later (out of scope now)
- Not filtering only with SQL `ILIKE` / keyword match and calling it semantic
- Not comparing embeddings built with **different models or different list lengths** (apples to oranges)
- Not boosting “featured” listings, map distance, or price filters (requirements out of scope)
- Not claiming search is done because we **generated** embeddings. Generation without compare → rank → top-K is not ranking.

---

## 7. Assessment questions for a future match_properties-style function

I will reject agent output later unless I can answer **YES** to these. “It returned rows” is not enough.

1. Does the function take a **query embedding**, or clearly take query text and embed it with the **same method and list length** as the listings?
2. Does it compare that vector to the **stored property embedding**, not to raw description text alone (`ILIKE`, `LIKE`, full-text keywords only)?
3. Does it **order** results so the best semantic matches come first—and is that direction correct for **distance** (lower better) vs **similarity** (higher better)?
4. Does it support **top-K** (a limit; my first try is 5) instead of returning the whole table?
5. Does each row include enough fields to explain the hit: at least **property id**, a **human-readable label/snippet**, and the **score**?
6. Does it avoid silently mixing different embedding sizes or models?
7. If sample data includes an intentional semantic match with **different wording** (woodland retreat vs “cabin by the lake”), does that row rank **above** an unrelated keyword-only distractor (warehouse, farmland, nightlife loft)?
8. For requirements query 4 (farmland), does a cabin or loft **fail** to take first place when it is not a farm?

If question 3 or 7 is NO, the function is not vector ranking for PREIshare—even if TypeScript compiles.

---

## 8. Link back to requirements

**From `docs/semantic-search-requirements.md` (queries I will reuse):**

- `quiet cabin near water with good rental upside` (keyword-breaker)
- `family-friendly home close to good schools`
- `peaceful place I can rent out on weekends` (paraphrase of the cabin query)
- Control: `flat irrigated farmland for row crops`

**From `docs/embeddings-learner-notes.md`:** an embedding is a list of numbers for meaning; generation creates it; storage saves it. This ranking step **uses both**: generate the query list, compare to stored listing lists.

**Success criteria this ranking model supports** (quoted as checks, not as “search feels smart”):

- Typing a natural-language query returns a **ranked list**: best meaning match first, weaker matches below.
- Query 1 returns a waterfront / lakeside lodging sample in the **top result** even when that listing does not contain `cabin` and `water` together.
- Query 5 also returns a calm lodging-with-income sample near the top (paraphrase still works).
- Query 4 does **not** put a cabin or downtown condo in first place as a strong match when those are the only samples.
- A beginner can say why **keyword** search would miss query 1 (“the listing never uses the buyer’s words”).

---

## 9. Open questions for later steps

- Which distance or similarity **metric name** will Supabase / pgvector use in our migration? (Name only later—I am not picking it here.)
- Confirm the first API default **K = 5**, or another small K, and that the UI can show “no strong matches” instead of padding with junk.
- What minimum fields should the first UI show next to each ranked hit? (I want id, title/snippet, score.)
- Do we hide results past a weakness cutoff, or always show K rows and let the tester judge the top one?

I am leaving those for design/implementation. This file only has to make **compare → score → best-first → top-K** solid enough that I can fail a `match_properties` helper that sorts the wrong way or only runs keyword `ILIKE`.
