/**
 * Shared create/update validation for property_listings.
 * Columns match docs/data-model/property-listings-schema.md and
 * supabase/migrations/20250321000000_property_listings.sql.
 * There is no sponsor_id / description / state / price column.
 */
import { z } from 'zod'

export const listingStatusSchema = z.enum([
  'draft',
  'published',
  'under_offer',
  'sold',
  'archived',
])

export const propertyTypeSchema = z.enum([
  'multifamily',
  'office',
  'retail',
  'industrial',
  'mixed_use',
  'land',
])

export const listingCurrencySchema = z.enum(['USD', 'CAD', 'EUR'])

export const createListingSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    summary: z.string().trim().max(5000).optional().nullable(),
    property_type: propertyTypeSchema,
    address_line1: z.string().trim().min(1, 'Address is required').max(300),
    address_line2: z.string().trim().max(120).optional().nullable(),
    city: z.string().trim().min(1, 'City is required').max(120),
    region: z.string().trim().min(1, 'Region is required').max(120),
    postal_code: z.string().trim().min(3, 'Postal code is required').max(20),
    country: z.string().trim().min(1).max(8).default('US'),
    asking_price: z.coerce
      .number()
      .nonnegative('Asking price must be zero or greater')
      .optional()
      .nullable(),
    currency: listingCurrencySchema.optional().nullable(),
    status: listingStatusSchema.default('draft'),
  })
  .superRefine((value, ctx) => {
    if (value.asking_price != null && !value.currency) {
      ctx.addIssue({
        code: 'custom',
        path: ['currency'],
        message: 'Currency is required when asking price is set',
      })
    }
  })

export const updateListingSchema = createListingSchema.partial().extend({
  id: z.string().uuid('Listing id must be a valid UUID'),
})

export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>

export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : 'form'
    const existing = fieldErrors[key] ?? []
    existing.push(issue.message)
    fieldErrors[key] = existing
  }
  return fieldErrors
}
