import type { PropertyListingRow } from '../../lib/supabase/types'
import './listings.css'

export type ListingCardProps = {
  listing: Pick<
    PropertyListingRow,
    'id' | 'title' | 'city' | 'region' | 'status' | 'property_type' | 'asking_price' | 'currency'
  >
}

export function ListingCard({ listing }: ListingCardProps) {
  const price =
    listing.asking_price != null
      ? `${listing.currency ?? ''} ${listing.asking_price.toLocaleString()}`.trim()
      : 'Price not set'

  return (
    <article className="listing-card" aria-label={listing.title}>
      <h2>{listing.title}</h2>
      <p>
        {listing.city}, {listing.region}
      </p>
      <p>{listing.property_type.replaceAll('_', ' ')}</p>
      <p>{price}</p>
      <p>Status: {listing.status.replaceAll('_', ' ')}</p>
    </article>
  )
}
