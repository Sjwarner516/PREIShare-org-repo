/**
 * Shared Database shape for `public.property_listings`.
 * Columns match docs/data-model/property-listings-schema.md and
 * supabase/migrations/20250321000000_property_listings.sql.
 * owner_id is the sponsor (auth.users.id). There is no sponsor_id column.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PropertyListingStatus =
  | 'draft'
  | 'published'
  | 'under_offer'
  | 'sold'
  | 'archived'

export type PropertyType =
  | 'multifamily'
  | 'office'
  | 'retail'
  | 'industrial'
  | 'mixed_use'
  | 'land'

export type PropertyListingCurrency = 'USD' | 'CAD' | 'EUR'

export type PropertyListingRow = {
  id: string
  owner_id: string
  title: string
  summary: string | null
  property_type: PropertyType
  address_line1: string
  address_line2: string | null
  city: string
  region: string
  postal_code: string
  country: string
  asking_price: number | null
  currency: PropertyListingCurrency | null
  status: PropertyListingStatus
  created_at: string
  updated_at: string
}

export type PropertyListingInsert = {
  id?: string
  owner_id: string
  title: string
  summary?: string | null
  property_type: PropertyType
  address_line1: string
  address_line2?: string | null
  city: string
  region: string
  postal_code: string
  country?: string
  asking_price?: number | null
  currency?: PropertyListingCurrency | null
  status?: PropertyListingStatus
  created_at?: string
  updated_at?: string
}

export type PropertyListingUpdate = {
  id?: string
  owner_id?: string
  title?: string
  summary?: string | null
  property_type?: PropertyType
  address_line1?: string
  address_line2?: string | null
  city?: string
  region?: string
  postal_code?: string
  country?: string
  asking_price?: number | null
  currency?: PropertyListingCurrency | null
  status?: PropertyListingStatus
  created_at?: string
  updated_at?: string
}

export type Database = {
  public: {
    Tables: {
      property_listings: {
        Row: PropertyListingRow
        Insert: PropertyListingInsert
        Update: PropertyListingUpdate
        Relationships: [
          {
            foreignKeyName: 'property_listings_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      match_properties: {
        Args: {
          query_embedding: number[]
          match_count?: number
        }
        Returns: {
          id: string
          title: string
          description: string | null
          city: string | null
          similarity: number
        }[]
      }
    }
    Enums: Record<string, never>
  }
}
