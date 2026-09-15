/**
 * Nested street address group from the field inventory.
 */
export interface Address {
  /** Street number and name. */
  line1: string;

  /** Unit, suite, or floor. */
  line2?: string;

  /** City. */
  city: string;

  /** State, province, or region. */
  region: string;

  /** Postal code. */
  postalCode: string;

  /** Short country code. */
  country: string;
}
