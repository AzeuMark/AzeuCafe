import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { get, del, patch } from '../api/client.js'
import MenuItemPhoto from '../components/MenuItemPhoto.jsx'
import MenuItemForm from '../components/MenuItemForm.jsx'
import { peso } from '../utils/format.js'

/**
 * Owner Menu Manager.
 *  - Full list (GET /api/menu/all) INCLUDING retired items, grouped per category
 *  - Add new items · edit existing ones · SOFT retire (the DELETE endpoint only
 *    flags `retired`, so past orders keep their history) · un-retire via PATCH
 *  - Photos come in through the 3-way PhotoField (library / upload / URL)
 */

const CATEGORY_LABELS = {
  'espresso-drinks': 'Espresso Drinks',
  'iced-drinks': 'Iced Drinks',
  pastries: 'Pastries',
  snacks: 'Snacks',
}
const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS)

export default function OwnerMenuPage() {
  const [items, setItems] = useState(null) // null = loading
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [showRetired, setShowRetired] = useState(true)
  const [formFor, setFormFor] = useState(null) // null | 'new' | item
  const [busyId, setBusyId] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const data = await get('/menu/all')
      setItems(data.items)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const groups = useMemo(() => {
    if (!items) return []
    return CATEGORY_ORDER.map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      items: items.filter((it) => it.category === category && (showRetired || !it.retired)),
    })).filter((g) => g.items.length > 0)
  }, [items, showRetired])

  const retiredCount = items?.filter((it) => it.retired).length ?? 0

  async function retire(item) {
    if (!window.confirm(`Retire “${item.name}”? It disappears from the public menu but stays in order history.`)) return
    setBusyId(item.id)
    setActionError('')
    try {
      await del(`/menu/${item.id}`)
      await refresh()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function unretire(item) {
    setBusyId(item.id)
    setActionError('')
    try {
      await patch(`/menu/${item.id}`, { retired: false })
      await refresh()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  function handleSaved() {
    setFormFor(null)
    refresh()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
            Owner · the counter's back office
          </p>
          <h1 className="mt-2 font-display text-4xl">Menu Manager</h1>
          <p className="mt-2 text-sm text-bean/60 dark:text-milk/60">
            {items ? `${items.length} items on record · ${retiredCount} retired` : 'loading the counter…'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showRetired}
              onChange={(e) => setShowRetired(e.target.checked)}
              className="h-4 w-4 accent-caramel-deep"
            />
            Show retired
          </label>
          <button
            type="button"
            onClick={() => setFormFor('new')}
            className="rounded-full bg-espresso px-6 py-2.5 text-sm font-semibold text-milk transition hover:bg-caramel-deep dark:bg-milk dark:text-espresso"
          >
            + New item
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-xl bg-status-cancelled/10 px-4 py-3 text-sm text-status-cancelled">{error}</p>
      )}
      {actionError && (
        <p className="mt-6 rounded-xl bg-status-cancelled/10 px-4 py-3 text-sm text-status-cancelled">{actionError}</p>
      )}

      {/* New / edit form */}
      {formFor && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mt-8 rounded-2xl border border-caramel/40 bg-foam p-6 dark:border-caramel/25 dark:bg-roast"
        >
          <h2 className="font-display text-2xl">
            {formFor === 'new' ? 'New menu item' : `Editing “${formFor.name}”`}
          </h2>
          <p className="mt-1 text-sm text-bean/60 dark:text-milk/60">
            {formFor === 'new'
              ? 'Server stores it immediately; retired items can be brought back anytime.'
              : 'Prices apply to NEW orders — placed orders keep the price they were sold at.'}
          </p>
          <div className="mt-5">
            <MenuItemForm
              item={formFor === 'new' ? null : formFor}
              onSaved={handleSaved}
              onCancel={() => setFormFor(null)}
            />
          </div>
        </motion.section>
      )}

      {/* List */}
      <div className="mt-10 space-y-12">
        {items && groups.length === 0 && (
          <p className="text-sm opacity-60">Nothing on this shelf — add your first item.</p>
        )}
        {groups.map((group) => (
          <section key={group.category} aria-label={group.label}>
            <div className="mb-4 flex items-baseline gap-4">
              <h2 className="font-display text-2xl">{group.label}</h2>
              <span className="h-px flex-1 bg-espresso/10 dark:bg-milk/10" />
              <span className="font-mono text-xs opacity-60">{group.items.length}</span>
            </div>

            <ul className="divide-y divide-espresso/10 border-y border-espresso/10 dark:divide-milk/10 dark:border-milk/10">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className={`flex flex-wrap items-center gap-4 py-3 ${item.retired ? 'opacity-55' : ''}`}
                >
                  <MenuItemPhoto
                    name={item.name}
                    image={item.image}
                    className="h-14 w-14 shrink-0 rounded-xl"
                  />

                  <div className="min-w-0 flex-1 basis-48">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-medium">{item.name}</h3>
                      {item.retired && (
                        <span className="rounded-full bg-espresso/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-espresso/60 dark:bg-milk/10 dark:text-milk/60">
                          Retired
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-bean/60 dark:text-milk/60">
                      {item.description || '—'}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[10px] opacity-45" title={item.image?.path}>
                      {item.image?.path ? `${item.image?.type}: ${item.image?.path}` : 'no photo'}
                    </p>
                  </div>

                  <span className="font-mono text-sm font-semibold">{peso(item.price)}</span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormFor(item)}
                      className="rounded-full border border-espresso/20 px-4 py-1.5 text-xs font-semibold transition hover:border-caramel dark:border-milk/20"
                    >
                      Edit
                    </button>
                    {item.retired ? (
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => unretire(item)}
                        className="rounded-full border border-status-ready/50 px-4 py-1.5 text-xs font-semibold text-status-ready transition hover:bg-status-ready/10 disabled:opacity-50"
                      >
                        {busyId === item.id ? '…' : 'Restore'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => retire(item)}
                        className="rounded-full border border-status-cancelled/40 px-4 py-1.5 text-xs font-semibold text-status-cancelled transition hover:bg-status-cancelled/10 disabled:opacity-50"
                      >
                        {busyId === item.id ? '…' : 'Retire'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
