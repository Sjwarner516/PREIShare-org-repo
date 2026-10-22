# Embeddings learner notes (PREIshare)

These notes are for me (and the next teammate) before any embedding code exists. I wrote them after reading `docs/semantic-search-requirements.md` and quizzing myself on generation vs storage. No vendor, no formula, no app code.

**Sentence I started with:** An embedding turns property text into a **list of numbers** so that similar meanings are **near each other**.

---

## Plain-language definition

An embedding is a long list of numbers that stands for the **meaning** of a piece of text. For PREIshare that text is either a **property description** or a **buyer’s search phrase**.

It is **not**:

- a keyword index (it does not store “which words appeared”)
- a short English summary
- the original sentence packed inside the numbers

If two descriptions mean roughly the same thing, their number-lists look similar. If they mean different things, the lists look different—even when they share a word like “views.”

---

## Tiny intuition (not real model output)

I picture a toy 3-number list only so “near” vs “far” is visible. Real embeddings are hundreds or thousands of numbers. These values are **made up** for teaching.

- `"lakefront cabin, quiet, strong Airbnb history"` → `[0.9, 0.8, 0.1]`
- `"waterfront cottage, peaceful, good short-term rental"` → `[0.88, 0.82, 0.12]` (nearby — same quiet water + guest-income idea)
- `"downtown loft near nightlife and offices"` → `[0.1, 0.2, 0.95]` (far from the cabin — city energy, not a lake stay)

I am **not** reading a single slot as a score (“0.9 means quiet”). Closeness is about the **whole list** lining up with another whole list.

---

## PREIshare examples from our requirements

Pulled from query 1 in `docs/semantic-search-requirements.md`, plus two short listings I would seed later.

- **Buyer query I care about:** `quiet cabin near water with good rental upside`
- **Listing A (should feel close to the query and to each other):** `Peaceful lakefront cabin with strong short-term rental history.`
- **Listing A2 (same meaning, different words — this is the keyword-breaker):** `Quiet waterfront cottage, great Airbnb returns.`
- **Listing B (should feel far):** `Downtown loft near nightlife and offices; skyline views.`
- **Why A is closer in meaning than B (in my words):** The buyer wants a calm place by water that can earn guest income. Listing A (and A2) is lodging on a lake with short-term rental / Airbnb language. Listing B is a city loft for nights out. Both A2 and B might mention “views,” but that shared word does not make them close. Keyword search can miss A2 if the buyer said *cabin* and the listing said *cottage* and never used *cabin* or *water* as a pair. The embedding should still put A and A2 near the query.

Farmland (`flat irrigated farmland for row crops` in the requirements) is another “far” contrast: it is still real estate, but it is not a cabin stay.

---

## Generation vs storage (do not mix these up)

I kept mixing these up until I drew: **text → model → numbers → database**.

| Stage | What happens | Where |
| --- | --- | --- |
| **Generation** | Text (listing copy or the buyer’s query) goes into an embedding model or API. A number-list comes back. | **Outside** the database — later, TypeScript in our app |
| **Storage** | That number-list is saved next to the property so we can compare later. | **Inside** the database — later, Supabase PostgreSQL with pgvector |

Search is not solved in this step. Later it will: **generate** an embedding for the buyer’s query → **compare** it to **stored** property embeddings → rank. How “close” becomes an ordered list is **Step 3**.

Quiz I used on myself (and the answers I landed on):

1. **Does the database invent the numbers?** No. Generation happens first, in code/API.
2. **Does saving the list search for the buyer?** No. Storage only keeps the numbers. Comparison is later.
3. **Do we embed the query at search time?** Yes — that is generation again, for the query text, then compare to stored listing lists.
4. **If two listings share the word “views,” are they close?** Not because of that word. A cabin with lake views and a loft with skyline views can still be far apart.
5. **Did I mix up generation and storage?** Generation = create the list. Storage = INSERT/save the list. I must not treat `createEmbedding(text)` as the same step as writing a row.
6. **Did I treat embeddings like keywords?** Only if I thought “cottage” must appear for “cabin” to match. That is keyword thinking. Embeddings care about the idea (quiet water + rental), not the shared spelling.

---

## Misconceptions to watch for when reviewing agent code later

- Thinking the vector **contains the original sentence** as text. It is numbers that *stand for* meaning, not a compressed paragraph I can read back.
- Assuming two listings must **share the same words** to be “close.” Cabin vs cottage vs lakefront should still be near if the story is the same.
- Treating a **single number** in the list as a human score (“the third slot is rental quality”). It is not a labeled field.
- Forgetting every embedding from the **same model** must have the **same list length**. Mixing lengths (or two different models) in one table would make “near” meaningless.
- Mixing up **create embedding** with **INSERT into the database**. If agent code only generates and never stores, search has nothing to compare. If it stores random numbers or the raw description in the vector column, that is also wrong.
- Believing we already have ranked search because we can generate embeddings. Ranking / closeness is the next step.
- Putting API keys or a paid production pipeline in this tutorial slice (out of scope in the requirements brief).

---

## What I can explain to a teammate in 60 seconds

PREIshare buyers type intent, like “quiet cabin near water with good rental upside.” Keyword search only keeps listings that use those exact words, so a “waterfront cottage, great Airbnb returns” can disappear. An embedding is a long list of numbers that stands for the meaning of that text—not the words themselves. A model or API **creates** that list (generation). We **save** it next to the property in the database (storage). Similar homes, even with different wording, get similar lists; a downtown nightlife loft lands far from the cabin. When a buyer searches later, we embed their phrase the same way and look for stored lists that sit nearby. We have not yet defined how that “nearby” turns into a ranked page—that is the next step.

---

## Open questions before similarity ranking (Step 3)

- How do we turn “these two number-lists are close” into an **ordered** list of properties (best first)?
- What should the demo do if two listings are almost equally close?
- What happens if two **different embedding models** (or two different list lengths) are mixed in one table?
- Do we embed the buyer’s query with the **same** model we used on the listings, every time?
- Is “far” a hard cutoff (hide weak matches) or do we always show a ranked list and let the tester judge the top row?

I am not answering those here on purpose. This file only has to make generation vs storage and “meaning as numbers” solid enough that I can review later TypeScript and SQL without treating embeddings as fancy keywords.
