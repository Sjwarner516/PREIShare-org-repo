import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import '../../components/listings/listings.css'
import { createProperty } from '../../server/properties'

export const Route = createFileRoute('/dashboard/properties/new')({
  component: NewPropertyPage,
})

function NewPropertyPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const title = String(formData.get('title') ?? '')
    const city = String(formData.get('city') ?? '')
    const description = String(formData.get('description') ?? '')

    try {
      const result = await createProperty({
        data: { title, city, description },
      })
      if (!result.ok) {
        setErrorMessage(result.error)
        return
      }
      await navigate({ to: '/dashboard/properties' })
    } catch {
      setErrorMessage('Could not create property. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="listings-page" aria-labelledby="new-property-heading">
      <header>
        <h1 id="new-property-heading">Add a property</h1>
        <Link to="/dashboard/properties">Back to properties</Link>
      </header>
      <form className="listing-form" onSubmit={handleSubmit}>
        {errorMessage ? (
          <p className="listing-alert" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div>
          <label htmlFor="property-title">Title</label>
          <input
            id="property-title"
            name="title"
            type="text"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="property-city">City / location</label>
          <input
            id="property-city"
            name="city"
            type="text"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="property-description">Description (optional)</label>
          <textarea
            id="property-description"
            name="description"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Create property'}
        </button>
      </form>
    </section>
  )
}
