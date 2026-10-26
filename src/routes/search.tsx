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
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>PREIshare property search</h1>
      <p>
        Describe the kind of investment property you want. We match meaning, not
        only exact words — for example a peaceful lakeside stay with guest
        income, a family house near schools, or a loft you can walk to dinner.
      </p>

      <form onSubmit={onSubmit}>
        <label htmlFor="q">Search</label>
        <input
          id="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="quiet cabin near water with good rental upside"
          autoComplete="off"
          style={{ display: 'block', width: '100%', margin: '0.5rem 0' }}
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {status === 'loading' ? <p>Searching sample listings…</p> : null}

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}

      {status === 'done' && results.length === 0 && !errorMessage ? (
        <p>
          No matching properties yet. Try a different intent from the sample
          set, such as “family-friendly home close to good schools”.
        </p>
      ) : null}

      {results.length > 0 ? (
        <ol>
          {results.map((r) => (
            <li key={r.id} style={{ marginBottom: '1rem' }}>
              <strong>{r.title}</strong>
              {r.city ? <div>{r.city}</div> : null}
              <div>{snippet(r.description ?? '')}</div>
              <div>
                Similarity:{' '}
                {typeof r.similarity === 'number' ? r.similarity.toFixed(3) : '—'}
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  )
}
