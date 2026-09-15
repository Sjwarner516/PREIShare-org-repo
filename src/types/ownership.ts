/**
 * Nested ownership group for who the asset is tied to.
 * One object on the listing (not a flattened ownerName string).
 */
export interface Ownership {
  /** Person or entity name shown on the listing. */
  ownerName: string;

  /** Free text about splits or co-owners. */
  notes?: string;

  /** Ownership share as a percent 0–100 when known. */
  ownershipPercent?: number;
}
