/**
 * INTENTIONAL TYPE ERRORS, see docs/type-safety/expected-type-errors.md
 *
 * Each named export is annotated as InvestorListing so TypeScript must check it.
 * This file is not meant to typecheck.
 */
import type { InvestorListing } from "../types";

/** Status spelling is not in the ListingStatus union. */
export const invalidStatusSpelling: InvestorListing = {
  id: "lst_ev_1001",
  createdAt: "2026-03-12T14:22:00.000Z",
  updatedAt: "2026-09-01T09:15:00.000Z",
  title: "East Village 48-Unit Value-Add Multifamily",
  summary:
    "Stabilized walk-up with in-place upside through unit renovations, laundry conversion, and a light amenity refresh near the L train.",
  status: "availble",
  propertyType: "multifamily",
  address: {
    line1: "214 East 12th Street",
    line2: "Suite 4B",
    city: "New York",
    region: "NY",
    postalCode: "10003",
    country: "US",
  },
  financialSummary: {
    askingPrice: 18500000,
    currency: "USD",
    projectedIrrPercent: 14.2,
    capRatePercent: 5.4,
  },
  contacts: [
    {
      id: "ctc_jordan_lee",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@preishare.com",
      phone: "+1-212-555-0148",
    },
    {
      id: "ctc_priya_nair",
      fullName: "Priya Nair",
      role: "sponsor",
      email: "priya.nair@eastvillageholdings.com",
    },
  ],
  primaryContactId: "ctc_jordan_lee",
  ownership: {
    ownerName: "EV 12th Street Holdings LLC",
    notes: "Sponsor retains asset management through a five-year hold.",
    ownershipPercent: 100,
  },
};

/** Address is missing the required city field. */
export const missingAddressCity: InvestorListing = {
  id: "lst_ev_1001",
  createdAt: "2026-03-12T14:22:00.000Z",
  updatedAt: "2026-09-01T09:15:00.000Z",
  title: "East Village 48-Unit Value-Add Multifamily",
  summary:
    "Stabilized walk-up with in-place upside through unit renovations, laundry conversion, and a light amenity refresh near the L train.",
  status: "published",
  propertyType: "multifamily",
  address: {
    line1: "214 East 12th Street",
    line2: "Suite 4B",
    region: "NY",
    postalCode: "10003",
    country: "US",
  },
  financialSummary: {
    askingPrice: 18500000,
    currency: "USD",
    projectedIrrPercent: 14.2,
    capRatePercent: 5.4,
  },
  contacts: [
    {
      id: "ctc_jordan_lee",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@preishare.com",
      phone: "+1-212-555-0148",
    },
    {
      id: "ctc_priya_nair",
      fullName: "Priya Nair",
      role: "sponsor",
      email: "priya.nair@eastvillageholdings.com",
    },
  ],
  primaryContactId: "ctc_jordan_lee",
  ownership: {
    ownerName: "EV 12th Street Holdings LLC",
    notes: "Sponsor retains asset management through a five-year hold.",
    ownershipPercent: 100,
  },
};

/** askingPrice must be a number, not a numeric string. */
export const priceAsString: InvestorListing = {
  id: "lst_ev_1001",
  createdAt: "2026-03-12T14:22:00.000Z",
  updatedAt: "2026-09-01T09:15:00.000Z",
  title: "East Village 48-Unit Value-Add Multifamily",
  summary:
    "Stabilized walk-up with in-place upside through unit renovations, laundry conversion, and a light amenity refresh near the L train.",
  status: "published",
  propertyType: "multifamily",
  address: {
    line1: "214 East 12th Street",
    line2: "Suite 4B",
    city: "New York",
    region: "NY",
    postalCode: "10003",
    country: "US",
  },
  financialSummary: {
    askingPrice: "610000",
    currency: "USD",
    projectedIrrPercent: 14.2,
    capRatePercent: 5.4,
  },
  contacts: [
    {
      id: "ctc_jordan_lee",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@preishare.com",
      phone: "+1-212-555-0148",
    },
    {
      id: "ctc_priya_nair",
      fullName: "Priya Nair",
      role: "sponsor",
      email: "priya.nair@eastvillageholdings.com",
    },
  ],
  primaryContactId: "ctc_jordan_lee",
  ownership: {
    ownerName: "EV 12th Street Holdings LLC",
    notes: "Sponsor retains asset management through a five-year hold.",
    ownershipPercent: 100,
  },
};

/** Contact role is not in the ContactRole union. */
export const invalidContactRole: InvestorListing = {
  id: "lst_ev_1001",
  createdAt: "2026-03-12T14:22:00.000Z",
  updatedAt: "2026-09-01T09:15:00.000Z",
  title: "East Village 48-Unit Value-Add Multifamily",
  summary:
    "Stabilized walk-up with in-place upside through unit renovations, laundry conversion, and a light amenity refresh near the L train.",
  status: "published",
  propertyType: "multifamily",
  address: {
    line1: "214 East 12th Street",
    line2: "Suite 4B",
    city: "New York",
    region: "NY",
    postalCode: "10003",
    country: "US",
  },
  financialSummary: {
    askingPrice: 18500000,
    currency: "USD",
    projectedIrrPercent: 14.2,
    capRatePercent: 5.4,
  },
  contacts: [
    {
      id: "ctc_jordan_lee",
      fullName: "Jordan Lee",
      role: "primary",
      email: "jordan.lee@preishare.com",
      phone: "+1-212-555-0148",
    },
    {
      id: "ctc_priya_nair",
      fullName: "Priya Nair",
      role: "sponsor",
      email: "priya.nair@eastvillageholdings.com",
    },
  ],
  primaryContactId: "ctc_jordan_lee",
  ownership: {
    ownerName: "EV 12th Street Holdings LLC",
    notes: "Sponsor retains asset management through a five-year hold.",
    ownershipPercent: 100,
  },
};

/** Ownership must be a single object, not an array of owners. */
export const ownershipAsArray: InvestorListing = {
  id: "lst_ev_1001",
  createdAt: "2026-03-12T14:22:00.000Z",
  updatedAt: "2026-09-01T09:15:00.000Z",
  title: "East Village 48-Unit Value-Add Multifamily",
  summary:
    "Stabilized walk-up with in-place upside through unit renovations, laundry conversion, and a light amenity refresh near the L train.",
  status: "published",
  propertyType: "multifamily",
  address: {
    line1: "214 East 12th Street",
    line2: "Suite 4B",
    city: "New York",
    region: "NY",
    postalCode: "10003",
    country: "US",
  },
  financialSummary: {
    askingPrice: 18500000,
    currency: "USD",
    projectedIrrPercent: 14.2,
    capRatePercent: 5.4,
  },
  contacts: [
    {
      id: "ctc_jordan_lee",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@preishare.com",
      phone: "+1-212-555-0148",
    },
    {
      id: "ctc_priya_nair",
      fullName: "Priya Nair",
      role: "sponsor",
      email: "priya.nair@eastvillageholdings.com",
    },
  ],
  primaryContactId: "ctc_jordan_lee",
  ownership: [{ ownerName: "EV 12th Street Holdings LLC", ownershipPercent: 100 }],
};

/** Sold listings require closedAt via the status discriminant. */
export const soldMissingClosedAt: InvestorListing = {
  id: "lst_ev_1001",
  createdAt: "2026-03-12T14:22:00.000Z",
  updatedAt: "2026-09-01T09:15:00.000Z",
  title: "East Village 48-Unit Value-Add Multifamily",
  summary:
    "Stabilized walk-up with in-place upside through unit renovations, laundry conversion, and a light amenity refresh near the L train.",
  status: "sold",
  propertyType: "multifamily",
  address: {
    line1: "214 East 12th Street",
    line2: "Suite 4B",
    city: "New York",
    region: "NY",
    postalCode: "10003",
    country: "US",
  },
  financialSummary: {
    askingPrice: 18500000,
    currency: "USD",
    projectedIrrPercent: 14.2,
    capRatePercent: 5.4,
  },
  contacts: [
    {
      id: "ctc_jordan_lee",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@preishare.com",
      phone: "+1-212-555-0148",
    },
    {
      id: "ctc_priya_nair",
      fullName: "Priya Nair",
      role: "sponsor",
      email: "priya.nair@eastvillageholdings.com",
    },
  ],
  primaryContactId: "ctc_jordan_lee",
  ownership: {
    ownerName: "EV 12th Street Holdings LLC",
    notes: "Sponsor retains asset management through a five-year hold.",
    ownershipPercent: 100,
  },
};

/** Published listings require at least one contact. */
export const publishedEmptyContacts: InvestorListing = {
  id: "lst_ev_1001",
  createdAt: "2026-03-12T14:22:00.000Z",
  updatedAt: "2026-09-01T09:15:00.000Z",
  title: "East Village 48-Unit Value-Add Multifamily",
  summary:
    "Stabilized walk-up with in-place upside through unit renovations, laundry conversion, and a light amenity refresh near the L train.",
  status: "published",
  propertyType: "multifamily",
  address: {
    line1: "214 East 12th Street",
    line2: "Suite 4B",
    city: "New York",
    region: "NY",
    postalCode: "10003",
    country: "US",
  },
  financialSummary: {
    askingPrice: 18500000,
    currency: "USD",
    projectedIrrPercent: 14.2,
    capRatePercent: 5.4,
  },
  contacts: [],
  primaryContactId: "ctc_jordan_lee",
  ownership: {
    ownerName: "EV 12th Street Holdings LLC",
    notes: "Sponsor retains asset management through a five-year hold.",
    ownershipPercent: 100,
  },
};
