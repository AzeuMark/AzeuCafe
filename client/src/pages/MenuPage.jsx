import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { get } from '../api/client.js'
import { useCart } from '../context/CartContext.jsx'
import MenuItemCard from '../components/MenuItemCard.jsx'

const CATEGORY_LABELS = {
  'espresso-drinks': 'Espresso Drinks',
  'iced-drinks': 'Iced Drinks',
  pastries: 'Pastries',
  snacks: 'Snacks',
}
const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS)

export default function MenuPage() {
  const [items, setItems] = useState(null) // null = loading
  const [error, setError] = useState('')
  const [category, setCategory] = useState('all')
  const [justAdded, setJustAdded] = useState(null)
  const { add, count } = useCart()

  useEffect(() => {
    let alive = true
    get('/menu')
      .then(({ items: data }) => {
        if (alive) setItems(data)
      })
      .catch((err) => {
        if (alive) setError(err.message)
      })
    return () => {
      alive = false
    }
  }, [])

  /** Group by category, in menu-board order, skipping empty groups. */
  const groups = useMemo(() => {
    if (!items) return []
    return CATEGORY_ORDER.map((c) => ({
      category: c,
      label: CATEGORY_LABELS[c],
      items: items.filter((it) => it.category === c),
    })).filter((g) => g.items.length > 0)
  }, [items])

  const visible = category === 'all' ? groups : groups.filter((g) => g.category === category)

  function handleAdd(item) {
    add(item, 1)
    setJustAdded(item.id)
    window.setTimeout(() => setJustAdded((current) => (current === item.id ? null : current)), 1200)
  }

  const tabClass = (active) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      active
        ? 'bg-espresso text-milk dark:bg-milk dark:text-espresso'
        : 'border border-espresso/15 hover:border-caramel dark:border-milk/15'
    }`

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
            The counter
          </p>
          <h1 className="mt-2 font-display text-5xl">The Menu</h1>
          <p className="mt-2 text-sm text-bean/60 dark:text-milk/60">
            Prices are set at the counter — {items ? `${items.length} items` : 'loading'} on today's board.
          </p>
        </div>

        {count > 0 && (
          <Link
            to="/cart"
            className="rounded-full bg-caramel px-5 py-2.5 text-sm font-semibold text-espresso transition hover:bg-caramel-deep hover:text-milk"
          >
            Go to cart ({count})
          </Link>
        )}
      </div>

      {/* category tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button type="button" onClick={() => setCategory('all')} className={tabClass(category === 'all')}>
          All
        </button>
        {groups.map((g) => (
          <button
            key={g.category}
            type="button"
            onClick={() => setCategory(g.category)}
            className={tabClass(category === g.category)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-8 rounded-xl bg-status-cancelled/10 px-4 py-3 text-sm text-status-cancelled">
          {error}
        </p>
      )}

      {!error && !items && (
        <p className="mt-12 text-sm opacity-60">Warming up the machine…</p>
      )}

      {items && !error && (
        <div className="mt-10 space-y-14">
          {visible.map((group) => (
            <section key={group.category} aria-label={group.label}>
              <div className="mb-5 flex items-baseline gap-4">
                <h2 className="font-display text-2xl">{group.label}</h2>
                <span className="h-px flex-1 bg-espresso/10 dark:bg-milk/10" />
                <span className="font-mono text-xs opacity-60">{group.items.length}</span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: (index % 3) * 0.06 }}
                  >
                    <MenuItemCard
                      item={item}
                      onAdd={handleAdd}
                      justAdded={justAdded === item.id}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          ))}

          {visible.length === 0 && (
            <p className="text-sm opacity-60">Nothing on this shelf yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
