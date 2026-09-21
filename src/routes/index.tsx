import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="display-title mb-5 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
        PREIshare
      </h1>
      <p className="mb-4 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
        Investor dashboard shell — starter home route.
      </p>
      <p>
        <Link to="/dashboard">Open investor dashboard</Link>
      </p>
    </main>
  )
}
