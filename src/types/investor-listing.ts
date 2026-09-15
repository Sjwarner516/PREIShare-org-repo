/**
 * Core PREIshare investor listing — scalars plus status, property type,
 * nested address, and financial summary. Contacts come later.
 */
import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { ListingStatus } from "./listing-status";
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
}
