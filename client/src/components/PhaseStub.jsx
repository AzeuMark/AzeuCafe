/** Temporary placeholder for pages whose phase hasn't been built yet. */
export default function PhaseStub({ phase, title, note }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-caramel-deep">
        {phase}
      </p>
      <h1 className="mt-3 font-display text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-bean/70 dark:text-milk/70">{note}</p>
    </div>
  )
}
