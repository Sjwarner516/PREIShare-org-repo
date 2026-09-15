import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { Ownership } from "./ownership";
import type { PropertyType } from "./property-type";

/** Fields every investor listing has, regardless of status. */
export interface InvestorListingBase {
  /** Stable unique id for this listing (assigned by the system). */
  readonly id: string;

  /** ISO-8601 datetime string when the listing was first created. */
  readonly createdAt: string;

  /** ISO-8601 datetime string when the listing was last updated. */
  readonly updatedAt: string;

  /** Short public headline shown in search results and cards. */
  title: string;

  /** Longer plain-text description of the investment opportunity. */
  summary: string;

  /** Asset class of the property from the field inventory. */
  propertyType: PropertyType;

  /** Pin-able street location for this listing. */
  address: Address;

  /** Optional nested money summary; draft metrics can arrive later. */
  financialSummary?: FinancialSummary;

  /**
   * Must match InvestorContact.id of one entry in contacts.
   * Runtime code will verify membership; TypeScript cannot prove the id exists in the array.
   */
  primaryContactId: string;

  /** Nested ownership for who the asset is tied to (not a flattened owner name). */
  ownership: Ownership;
}

/**
 * Discriminated union: TypeScript uses `status` to know which shape you have.
 * closedAt is required only when status is "sold" (PREIshare's closed deal).
 * Investor-visible statuses (published, under_offer, sold) need at least one contact.
 * Draft and archived may have an empty contacts list.
 */
export type InvestorListing =
  | (InvestorListingBase & {
      status: "draft" | "archived";
      /** Editors may save with nobody listed yet. */
      contacts: InvestorContact[];
      closedAt?: undefined;
    })
  | (InvestorListingBase & {
      status: "published" | "under_offer";
      /** Tuple form means "at least one contact" — investors need someone to reach. */
      contacts: [InvestorContact, ...InvestorContact[]];
      closedAt?: undefined;
    })
  | (InvestorListingBase & {
      status: "sold";
      /** Tuple form means "at least one contact" — investors need someone to reach. */
      contacts: [InvestorContact, ...InvestorContact[]];
      closedAt: string;
    });

export type ClosedInvestorListing = Extract<InvestorListing, { status: "sold" }>;
export type OpenInvestorListing = Exclude<InvestorListing, { status: "sold" }>;
