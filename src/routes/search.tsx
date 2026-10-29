import { Link, createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export const Route = createFileRoute('/search')({
  component: PropertySearchPage,
})

type SearchResult = {
  id: string
  title: string
  description: string
  city?: string | null
  similarity: number
}

function snippet(text: string, max = 160) {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max).trimEnd()}…`
}

function PropertySearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setStatus('error')
      setErrorMessage('Type a description of the property you want.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/properties/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })
      const data = (await res.json()) as {
        error?: string
        results?: SearchResult[]
      }
      if (!res.ok) {
        throw new Error(data.error || 'Search failed')
      }
      // Display only — do not sort or re-score on the client.
      setResults(Array.isArray(data.results) ? data.results : [])
      setStatus('done')
    } catch (err) {
      setResults([])
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Search failed')
    }
  }

  return (
    <main className="page-wrap px-4 py-10 sm:py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">
          <Link to="/" className="text-[var(--sea-ink-soft)] no-underline">
            Home
          </Link>
          {' / '}
          Search
        </p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          PREIshare property search
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Describe the kind of investment property you want. We match meaning,
          not only exact words — for example a peaceful lakeside stay with guest
          income, a family house near schools, or a loft you can walk to dinner.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <label htmlFor="q" className="text-sm font-semibold text-[var(--sea-ink)]">
            Search
          </label>
          <input
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="quiet cabin near water with good rental upside"
            autoComplete="off"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-2.5 text-base text-[var(--sea-ink)] outline-none ring-[var(--sea-ink)] focus:ring-2"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-fit rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] disabled:opacity-60"
          >
            {status === 'loading' ? 'Searching…' : 'Search'}
          </button>
        </form>

        {status === 'loading' ? (
          <p className="mt-4 text-[var(--sea-ink-soft)]">Searching sample listings…</p>
        ) : null}

        {errorMessage ? (
          <p role="alert" className="mt-4 text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {status === 'done' && results.length === 0 && !errorMessage ? (
          <p className="mt-4 text-[var(--sea-ink-soft)]">
            No matching properties yet. Try a different intent from the sample
            set, such as “family-friendly home close to good schools”.
          </p>
        ) : null}

        {results.length > 0 ? (
          <ol className="mt-6 list-decimal space-y-4 pl-5">
            {results.map((r) => (
              <li key={r.id} className="text-[var(--sea-ink)]">
                <strong>{r.title}</strong>
                {r.city ? (
                  <div className="text-sm text-[var(--sea-ink-soft)]">{r.city}</div>
                ) : null}
                <div className="text-[var(--sea-ink-soft)]">
                  {snippet(r.description ?? '')}
                </div>
                <div className="text-sm">
                  Similarity:{' '}
                  {typeof r.similarity === 'number' ? r.similarity.toFixed(3) : '—'}
                </div>
              </li>
            ))}
          </ol>
        ) : null}
      </section>
    </main>
  )
}
