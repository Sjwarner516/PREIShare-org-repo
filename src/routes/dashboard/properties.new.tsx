import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'
import { getSession } from '../../lib/auth/session.server'
import { createSupabaseServerClient } from '../../lib/supabase.server'
import '../../components/listings/listings.css'

type CreatePropertyInput = {
  title: string
  city?: string
  description?: string
}

/** Keep title / city / description only. Ignore any owner_id the client sends. */
function parseCreatePropertyInput(input: unknown): CreatePropertyInput {
  const body =
    typeof input === 'object' && input !== null
      ? (input as Record<string, unknown>)
      : {}

  return {
    title: typeof body.title === 'string' ? body.title : '',
    city: typeof body.city === 'string' ? body.city : undefined,
    description:
      typeof body.description === 'string' ? body.description : undefined,
  }
}

/**
 * Server mutation: load the signed-in session, then insert.
 * owner_id comes from that user id — never from the form.
 * RLS WITH CHECK is owner_id = auth.uid().
 */
export const createProperty = createServerFn({ method: 'POST' })
  .validator((input: unknown) => parseCreatePropertyInput(input))
  .handler(async ({ data }) => {
    const title = data.title.trim()
    if (!title) {
      return { ok: false as const, error: 'Title is required.' }
    }

    const session = await getSession()
    if (!session?.user || !session.access_token) {
      return {
        ok: false as const,
        error: 'You must be signed in to add a property.',
      }
    }

    const supabase = createSupabaseServerClient({
      get: () => undefined,
      set: () => {},
      remove: () => {},
    })

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token ?? '',
    })
    if (sessionError) {
      return {
        ok: false as const,
        error: 'You must be signed in to add a property.',
      }
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        ok: false as const,
        error: 'You must be signed in to add a property.',
      }
    }

    const { data: row, error } = await supabase
      .from('properties')
      .insert({
        title,
        city: data.city?.trim() ? data.city.trim() : null,
        description: data.description?.trim()
          ? data.description.trim()
          : null,
        status: 'draft',
        owner_id: user.id,
      })
      .select('id')
      .single()

    if (error) {
      return { ok: false as const, error: error.message }
    }

    if (!row) {
      return {
        ok: false as const,
        error: 'Could not create property. Try again.',
      }
    }

    return { ok: true as const, id: row.id }
  })

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
