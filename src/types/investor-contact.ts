/**
 * Nested person or firm investors can reach about a listing.
 * Role is a closed list from the field inventory.
 */
export type ContactRole =
  | "broker"
  | "owner_rep"
  | "sponsor"
  | "property_manager";

export interface InvestorContact {
  /** Stable unique id for this contact. */
  id: string;

  /** Person or firm name (inventory field `name`). */
  fullName: string;

  /** Why they appear on the listing (inventory closed list). */
  role: ContactRole;

  /** Required reachable identity channel for this step. */
  email: string;

  /** Optional phone number. */
  phone?: string;
}
