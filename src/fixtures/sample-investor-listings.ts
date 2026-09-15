import type { InvestorListing } from "../types";

/** Published East Village walk-up with full nested address, contact, and yield metrics. */
export const samplePublishedListing: InvestorListing = {
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
  ownership: {
    ownerName: "EV 12th Street Holdings LLC",
    notes: "Sponsor retains asset management through a five-year hold.",
    ownershipPercent: 100,
  },
};

/** Draft neighborhood retail listing with identity fields only and no financial summary yet. */
export const sampleDraftListing: InvestorListing = {
  id: "lst_queen_west_2204",
  createdAt: "2026-09-08T16:40:00.000Z",
  updatedAt: "2026-09-10T11:05:00.000Z",
  title: "Queen West Corner Retail — Draft OM",
  summary:
    "Street-level retail with a second-floor office loft; offering memorandum and rent roll are still being assembled.",
  status: "draft",
  propertyType: "retail",
  address: {
    line1: "842 Queen Street West",
    city: "Toronto",
    region: "ON",
    postalCode: "M6J 1G3",
    country: "CA",
  },
  contacts: [],
  primaryContactId: "ctc_pending_owner_rep",
  ownership: {
    ownerName: "Queen West Retail Partners",
  },
};

/** Industrial last-mile warehouse currently under offer in the Inland Empire. */
export const sampleUnderOfferListing: InvestorListing = {
  id: "lst_ie_3108",
  createdAt: "2026-01-20T18:00:00.000Z",
  updatedAt: "2026-08-22T13:30:00.000Z",
  title: "Ontario Last-Mile Industrial — Under Offer",
  summary:
    "Cross-dock warehouse with 32-foot clear height and trailer parking; a qualified buyer is in exclusivity pending environmental.",
  status: "under_offer",
  propertyType: "industrial",
  address: {
    line1: "1550 Jurupa Street",
    city: "Ontario",
    region: "CA",
    postalCode: "91761",
    country: "US",
  },
  financialSummary: {
    askingPrice: 27250000,
    currency: "USD",
    capRatePercent: 5.9,
  },
  contacts: [
    {
      id: "ctc_marcus_chen",
      fullName: "Marcus Chen",
      role: "owner_rep",
      email: "marcus.chen@ieindustrial.com",
      phone: "+1-909-555-0172",
    },
  ],
  primaryContactId: "ctc_marcus_chen",
  ownership: {
    ownerName: "Inland Empire Logistics Fund IV",
    notes: "Fund vehicle; GP is negotiating a 1031 replacement.",
    ownershipPercent: 87.5,
  },
};

/** Sold Midtown office recap with a required closedAt timestamp. */
export const sampleSoldListing: InvestorListing = {
  id: "lst_midtown_4410",
  createdAt: "2025-11-03T10:00:00.000Z",
  updatedAt: "2026-06-18T17:45:00.000Z",
  title: "Midtown South Creative Office Recap — Sold",
  summary:
    "Trophy creative office with long-term credit tenants; closed to a core-plus buyer after a competitive bid process.",
  status: "sold",
  closedAt: "2026-06-18T17:45:00.000Z",
  propertyType: "office",
  address: {
    line1: "11 West 19th Street",
    line2: "Floor 8",
    city: "New York",
    region: "NY",
    postalCode: "10011",
    country: "US",
  },
  financialSummary: {
    askingPrice: 41200000,
    currency: "USD",
    projectedIrrPercent: 11.8,
    capRatePercent: 4.7,
  },
  contacts: [
    {
      id: "ctc_elena_vasquez",
      fullName: "Elena Vasquez",
      role: "broker",
      email: "elena.vasquez@preishare.com",
      phone: "+1-212-555-0190",
    },
    {
      id: "ctc_owen_hart",
      fullName: "Owen Hart",
      role: "property_manager",
      email: "owen.hart@midtownops.com",
    },
  ],
  primaryContactId: "ctc_elena_vasquez",
  ownership: {
    ownerName: "19th Street Office JV",
    notes: "Closed to Atlas Core-Plus Office Fund.",
  },
};

/** Archived mixed-use land assemblage no longer being marketed. */
export const sampleArchivedListing: InvestorListing = {
  id: "lst_lyon_part_dieu_118",
  createdAt: "2025-04-09T08:30:00.000Z",
  updatedAt: "2026-02-14T12:00:00.000Z",
  title: "Lyon Part-Dieu Mixed-Use Assemblage — Archived",
  summary:
    "Entitled mixed-use parcel withdrawn from market after a zoning appeal; retained in archive for comparable research.",
  status: "archived",
  propertyType: "mixed_use",
  address: {
    line1: "42 Rue de la Villette",
    city: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    postalCode: "69003",
    country: "FR",
  },
  financialSummary: {
    askingPrice: 9800000,
    currency: "EUR",
  },
  contacts: [
    {
      id: "ctc_camille_durand",
      fullName: "Camille Durand",
      role: "sponsor",
      email: "camille.durand@partdieudev.eu",
    },
  ],
  primaryContactId: "ctc_camille_durand",
  ownership: {
    ownerName: "Part-Dieu Assemblage SAS",
    ownershipPercent: 64,
  },
};

export const sampleInvestorListings: InvestorListing[] = [
  samplePublishedListing,
  sampleDraftListing,
  sampleUnderOfferListing,
  sampleSoldListing,
  sampleArchivedListing,
];
