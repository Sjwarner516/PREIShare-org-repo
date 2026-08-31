# Listing Field Inventory (PREIshare)

Use this table as the source of truth when defining TypeScript types. Field names are suggestions the types may adopt; meanings, shapes, closed lists, and required vs optional rules are mandatory.

**Investor-visible statuses:** `published`, `under_offer`, `sold`.  
**Internal-only statuses:** `draft`, `archived`.

## Identity and classification
| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| id | Stable unique id for the listing | text | yes | `lst_ev_1001` |
| title | Short name shown to investors | text | yes | `Riverfront Multifamily Offering` |
| description | Longer investor-facing summary | text | yes for investor-visible statuses; optional on `draft` and `archived` | `Value-add asset near transit with in-place cash flow.` |
| status | Lifecycle state | fixed choice | yes | `draft`, `published`, `under_offer`, `sold`, `archived` |
| propertyType | Asset class | fixed choice | yes | `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` |
| createdAt | When the listing record was created | datetime | yes | `2026-03-01T10:00:00Z` |
| updatedAt | Last meaningful edit | datetime | yes | `2026-03-15T16:30:00Z` |

## Address (nested object)
Address is a nested object named `address`, not a single free-text string.

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| address | Whole street address group | nested object | yes for investor-visible statuses; optional on `draft` and `archived` | see rows below |
| address.line1 | Street number and name | text | yes when `address` is present | `500 River Rd` |
| address.line2 | Unit, suite, or floor (if any) | text | no | `Suite 200` |
| address.city | City | text | yes when `address` is present | `Austin` |
| address.region | State, province, or region | text | yes when `address` is present | `TX` |
| address.postalCode | Postal code | text | yes when `address` is present | `78701` |
| address.country | Country as a short code | text | yes when `address` is present | `US` |

## Financial summary (nested object)
Financials is a nested object named `financials`, not loose top-level price strings.

| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| financials | Money summary for the listing | nested object | yes for investor-visible statuses; optional on `draft` and `archived` | see rows below |
| financials.askingPrice | Listed price amount (not a formatted string) | number | yes when `financials` is present | `12500000` |
| financials.currency | Currency of `askingPrice` | fixed choice | yes when `financials` is present | `USD`, `CAD`, `EUR` |
| financials.projectedIrrPercent | Optional projected IRR (percent) | number | no | `12.5` |
| financials.capRatePercent | Optional cap rate (percent) | number | no | `5.8` |

## Investor contacts (list of nested objects)
Contacts is a list named `contacts`. A valid investor-visible listing needs **at least one** entry.

| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| contacts | People or firms investors (or editors) can reach about this listing | list of nested objects | yes for investor-visible statuses (min 1); optional empty or absent on `draft` and `archived` | see rows below |
| contacts[].id | Stable unique id for this contact | text | yes (each contact) | `ctc_jordan_lee` |
| contacts[].name | Person or firm name | text | yes (each contact) | `Jordan Lee` |
| contacts[].role | Why they appear on the listing | fixed choice | yes (each contact) | `broker`, `owner_rep`, `sponsor`, `property_manager` |
| contacts[].email | Email if used | text | at least one of `email` or `phone` required on each contact | `jordan@example.com` |
| contacts[].phone | Phone if used | text | at least one of `email` or `phone` required on each contact | `+1-512-555-0142` |

## Ownership (list of nested objects tied to contacts)
Ownership is a list named `ownership`. Each row points at a contact by id.

| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| ownership | How contacts relate to the asset | list of nested objects | no (list may be empty); when a row exists, its required columns apply | see rows below |
| ownership[].contactId | Which contact this row refers to (`contacts[].id`) | text | yes (each ownership row) | `ctc_jordan_lee` |
| ownership[].relationship | Relationship to the asset | fixed choice | yes (each ownership row) | `primary_owner`, `co_owner`, `broker`, `property_manager` |
| ownership[].sharePercent | Optional ownership share (percent) | number | no | `60` |

## Closed lists (never free text)
| Field | Allowed values only |
| --- | --- |
| status | `draft`, `published`, `under_offer`, `sold`, `archived` |
| propertyType | `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` |
| financials.currency | `USD`, `CAD`, `EUR` |
| contacts[].role | `broker`, `owner_rep`, `sponsor`, `property_manager` |
| ownership[].relationship | `primary_owner`, `co_owner`, `broker`, `property_manager` |

## Inventory rules (must hold)
1. Do not invent extra top-level groups beyond identity, `address`, `financials`, `contacts`, and `ownership` without updating the domain brief.
2. `status` and `propertyType` must remain closed lists—never free text.
3. `address` and `financials` are nested objects, not flat optional strings only.
4. `contacts` is a list; a valid published, under-offer, or sold listing needs at least one contact with a name and email or phone.
5. `ownership` is a list of nested objects; `ownership[].contactId` must match a `contacts[].id` when both exist.
6. Every required field above must appear in later TypeScript interfaces unless a written decision record deliberately relaxes it.
7. These documents contain business rules only—no TypeScript `interface`, `type`, or `enum` syntax.
