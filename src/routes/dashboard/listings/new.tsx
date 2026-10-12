import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ListingForm, type ListingFormValues } from '../../../components/listings/ListingForm'
import '../../../components/listings/listings.css'
import { createListing } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/new')({
  component: NewListingPage,
})

function NewListingPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values: ListingFormValues) {
    setErrorMessage(null)
    setFieldErrors(undefined)
    setIsSubmitting(true)

    try {
      const result = await createListing({ data: values })
      if (!result.ok) {
        setErrorMessage(result.error)
        setFieldErrors(result.fieldErrors)
        return
      }
      await navigate({ to: '/dashboard/listings' })
    } catch (cause) {
      setErrorMessage(
        cause instanceof Error ? cause.message : 'Could not create listing.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="listings-page" aria-labelledby="new-listing-heading">
      <header>
        <h1 id="new-listing-heading">Add a property listing</h1>
        <Link to="/dashboard/listings">Back to listings</Link>
      </header>
      <ListingForm
        onSubmit={handleSubmit}
        submitLabel="Create listing"
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
      />
    </section>
  )
}
