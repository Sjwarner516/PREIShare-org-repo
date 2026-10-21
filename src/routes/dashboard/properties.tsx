import { Link, createFileRoute, isRedirect } from '@tanstack/react-router'
import '../../components/listings/listings.css'
import {
  listMyProperties,
  type PropertiesLoaderData,
} from '../../server/properties'

const LOAD_ERROR = 'Could not load properties. Try again.'

export const Route = createFileRoute('/dashboard/properties')({
  loader: async (): Promise<PropertiesLoaderData> => {
    try {
      return await listMyProperties()
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }
      return { properties: [], error: LOAD_ERROR }
    }
  },
  pendingComponent: PropertiesLoading,
  component: PropertiesPage,
})

function PropertiesLoading() {
  return (
    <section className="listings-page" aria-labelledby="properties-heading">
      <h1 id="properties-heading">Your properties</h1>
      <p className="listings-loading">Loading properties…</p>
    </section>
  )
}

function PropertiesPage() {
  const { properties, error } = Route.useLoaderData()

  if (error) {
    return (
      <section className="listings-page" aria-labelledby="properties-heading">
        <h1 id="properties-heading">Your properties</h1>
        <p className="listing-alert" role="alert">
          {error}
        </p>
        <Link to="/dashboard/properties/new">Add property</Link>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section
        className="listings-page listings-empty"
        aria-labelledby="properties-heading"
      >
        <div>
          <h1 id="properties-heading">Your properties</h1>
          <p>No properties yet</p>
          <p>
            New listings will show only for this sponsor account. Visibility is
            enforced by the database (row-level security), not only this page.
          </p>
        </div>
        <Link to="/dashboard/properties/new">Add property</Link>
      </section>
    )
  }

  return (
    <section className="listings-page" aria-labelledby="properties-heading">
      <header>
        <div>
          <h1 id="properties-heading">Your properties</h1>
          <p>
            Visibility is enforced by the database (row-level security), not only
            this page.
          </p>
        </div>
        <Link to="/dashboard/properties/new">Add property</Link>
      </header>
      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <article className="listing-card">
              <h2>{property.title}</h2>
              <p>{property.city ?? 'Location TBD'}</p>
              <p>Status: {property.status}</p>
              <p>
                <time dateTime={property.created_at}>
                  {new Date(property.created_at).toLocaleDateString()}
                </time>
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
