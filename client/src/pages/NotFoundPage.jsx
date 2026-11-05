import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="font-mono text-7xl text-caramel-deep">Oops.</p>
      <h1 className="mt-4 font-display text-4xl">404 — this page left the café</h1>
      <p className="mt-3 text-sm text-bean/70 dark:text-milk/70">
        The address you followed doesn't exist — but the espresso machine is still warm.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-espresso px-6 py-2.5 text-sm font-semibold text-milk transition hover:opacity-85 dark:bg-milk dark:text-espresso"
      >
        Back to the café
      </Link>
    </div>
  )
}
