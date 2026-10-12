import { Link, createFileRoute } from '@tanstack/react-router'
import { ListingCard } from '../../../components/listings/ListingCard'
import '../../../components/listings/listings.css'
import { listMyListings } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/')({
  loader: async () => listMyListings(),
  pendingComponent: ListingsLoading,
  component: ListingsIndexPage,
})

function ListingsLoading() {
  return (
    <section className="listings-page" aria-labelledby="listings-heading">
      <h1 id="listings-heading">Your property listings</h1>
      <p className="listings-loading">Loading listings…</p>
    </section>
  )
}

function ListingsIndexPage() {
  const result = Route.useLoaderData()

  if (!result.ok) {
    return (
      <section className="listings-page" aria-labelledby="listings-heading">
        <h1 id="listings-heading">Your property listings</h1>
        <p className="listing-alert" role="alert">
          {result.error}
        </p>
        <Link to="/dashboard/listings/new">Add listing</Link>
      </section>
    )
  }

  const listings = result.listings

  if (listings.length === 0) {
    return (
      <section className="listings-page listings-empty" aria-labelledby="listings-heading">
        <div>
          <h1 id="listings-heading">Your property listings</h1>
          <p>No properties yet. Add your first listing to get started.</p>
        </div>
        <Link to="/dashboard/listings/new">Add listing</Link>
      </section>
    )
  }

  return (
    <section className="listings-page" aria-labelledby="listings-heading">
      <header>
        <h1 id="listings-heading">Your property listings</h1>
        <Link to="/dashboard/listings/new">Add listing</Link>
      </header>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id}>
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </section>
  )
}
