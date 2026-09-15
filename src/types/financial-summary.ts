/**
 * Nested money summary from the field inventory.
 */
export type Currency = "USD" | "CAD" | "EUR";

export interface FinancialSummary {
  /** Listed price amount (not a formatted string). */
  askingPrice: number;

  /** Currency of askingPrice from the inventory closed list. */
  currency: Currency;

  /** Optional projected IRR percent. */
  projectedIrrPercent?: number;

  /** Optional cap rate percent. */
  capRatePercent?: number;
}
