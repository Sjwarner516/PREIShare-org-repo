/**
 * Core PREIshare investor listing — scalars plus status, property type,
 * nested address, financial summary, contacts, and ownership.
 * Contacts and ownership are this step.
 */
import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { ListingStatus } from "./listing-status";
import type { Ownership } from "./ownership";
import type { PropertyType } from "./property-type";

export interface InvestorListing {
  /** Stable unique id for this listing (assigned by the system). */
  id: string;

  /** Short public headline shown in search results and cards. */
  title: string;

  /** Longer plain-text description of the investment opportunity. */
  summary: string;

  /** ISO-8601 datetime string when the listing was first created. */
  createdAt: string;

  /** ISO-8601 datetime string when the listing was last updated. */
  updatedAt: string;

  /** Lifecycle state of this listing from the field inventory. */
  status: ListingStatus;

  /** Asset class of the property from the field inventory. */
  propertyType: PropertyType;

  /** Pin-able street location for this listing. */
  address: Address;

  /** Optional nested money summary; draft metrics can arrive later. */
  financialSummary?: FinancialSummary;

  /** People or firms investors can reach; structured objects, not name strings. */
  contacts: InvestorContact[];

  /**
   * Must match InvestorContact.id of one entry in contacts.
   * Runtime code will verify membership; TypeScript cannot prove the id exists in the array.
   */
  primaryContactId: string;

  /** Nested ownership for who the asset is tied to (not a flattened owner name). */
  ownership: Ownership;
}
