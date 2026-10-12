import type { FormEvent } from 'react'
import type { CreateListingInput } from '../../lib/listings/schema'
import {
  listingCurrencySchema,
  listingStatusSchema,
  propertyTypeSchema,
} from '../../lib/listings/schema'
import './listings.css'

export type ListingFormValues = CreateListingInput

export type ListingFormProps = {
  onSubmit: (values: ListingFormValues) => void | Promise<void>
  submitLabel?: string
  errorMessage?: string | null
  fieldErrors?: Record<string, string[]>
  isSubmitting?: boolean
}

const propertyTypes = propertyTypeSchema.options
const statuses = listingStatusSchema.options
const currencies = listingCurrencySchema.options

function firstError(fieldErrors: Record<string, string[]> | undefined, name: string) {
  const messages = fieldErrors?.[name]
  return messages && messages.length > 0 ? messages[0] : null
}

export function ListingForm({
  onSubmit,
  submitLabel = 'Save listing',
  errorMessage = null,
  fieldErrors,
  isSubmitting = false,
}: ListingFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const askingRaw = String(data.get('asking_price') ?? '').trim()
    const currencyRaw = String(data.get('currency') ?? '').trim()
    const summaryRaw = String(data.get('summary') ?? '').trim()
    const line2Raw = String(data.get('address_line2') ?? '').trim()

    void onSubmit({
      title: String(data.get('title') ?? ''),
      summary: summaryRaw || null,
      property_type: propertyTypeSchema.catch('multifamily').parse(
        String(data.get('property_type') ?? 'multifamily'),
      ),
      address_line1: String(data.get('address_line1') ?? ''),
      address_line2: line2Raw || null,
      city: String(data.get('city') ?? ''),
      region: String(data.get('region') ?? ''),
      postal_code: String(data.get('postal_code') ?? ''),
      country: String(data.get('country') ?? 'US') || 'US',
      asking_price: askingRaw === '' ? null : Number(askingRaw),
      currency: currencyRaw
        ? listingCurrencySchema.catch('USD').parse(currencyRaw)
        : null,
      status: listingStatusSchema.catch('draft').parse(
        String(data.get('status') ?? 'draft'),
      ),
    })
  }

  return (
    <form className="listing-form" onSubmit={handleSubmit}>
      {errorMessage ? (
        <p className="listing-alert" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div>
        <label htmlFor="listing-title">Title</label>
        <input id="listing-title" name="title" type="text" required disabled={isSubmitting} />
        {firstError(fieldErrors, 'title') ? (
          <p className="listing-field-error">{firstError(fieldErrors, 'title')}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="listing-summary">Summary</label>
        <textarea id="listing-summary" name="summary" rows={3} disabled={isSubmitting} />
      </div>

      <div>
        <label htmlFor="listing-property-type">Property type</label>
        <select id="listing-property-type" name="property_type" required disabled={isSubmitting}>
          {propertyTypes.map((value) => (
            <option key={value} value={value}>
              {value.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="listing-address-line1">Street address</label>
        <input
          id="listing-address-line1"
          name="address_line1"
          type="text"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="listing-address-line2">Unit / suite (optional)</label>
        <input
          id="listing-address-line2"
          name="address_line2"
          type="text"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="listing-city">City</label>
        <input id="listing-city" name="city" type="text" required disabled={isSubmitting} />
        {firstError(fieldErrors, 'city') ? (
          <p className="listing-field-error">{firstError(fieldErrors, 'city')}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="listing-region">Region / state</label>
        <input id="listing-region" name="region" type="text" required disabled={isSubmitting} />
      </div>

      <div>
        <label htmlFor="listing-postal-code">Postal code</label>
        <input
          id="listing-postal-code"
          name="postal_code"
          type="text"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="listing-country">Country</label>
        <input
          id="listing-country"
          name="country"
          type="text"
          defaultValue="US"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="listing-asking-price">Asking price (optional)</label>
        <input
          id="listing-asking-price"
          name="asking_price"
          type="number"
          min="0"
          step="0.01"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="listing-currency">Currency</label>
        <select id="listing-currency" name="currency" disabled={isSubmitting}>
          <option value="">None</option>
          {currencies.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="listing-status">Status</label>
        <select id="listing-status" name="status" disabled={isSubmitting} defaultValue="draft">
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
