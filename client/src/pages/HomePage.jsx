import Logo from '../components/Logo.jsx'

/** Phase 3 replaces this shell with the hand-crafted landing page. */
export default function HomePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-28 text-center">
      <Logo className="justify-center" />
      <p className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-caramel-deep">
        Phase 2 — app shell online
      </p>
      <h1 className="mt-4 font-display text-5xl sm:text-6xl">Your café, ready to brew.</h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-bean/70 dark:text-milk/70">
        Navigation, session handling, cart and theme are live. The hand-crafted
        landing page arrives in Phase 3.
      </p>
    </section>
  )
}
