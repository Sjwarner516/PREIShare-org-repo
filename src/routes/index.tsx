import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main>
      <h1>PREIshare</h1>
      <p>Investor dashboard shell — starter home route.</p>
      <p>
        <Link to="/dashboard">Open investor dashboard</Link>
        {' · '}
        <Link to="/search">Search sample properties</Link>
      </p>
    </main>
  )
}
