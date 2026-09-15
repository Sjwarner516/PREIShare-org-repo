/**
 * Closed set of listing lifecycle statuses from the field inventory.
 * `sold` is PREIshare's closed-deal status (not spelled "closed").
 */
export type ListingStatus =
  | "draft"
  | "published"
  | "under_offer"
  | "sold"
  | "archived";
