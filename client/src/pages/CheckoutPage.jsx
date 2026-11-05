import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { post } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import MenuItemPhoto from '../components/MenuItemPhoto.jsx'
import StatusChip from '../components/StatusChip.jsx'
import { peso } from '../utils/format.js'

/**
 * Checkout — one screen, one act: confirm claim details, place the order,
 * then receive the order code + "pay cash at the counter" instruction.
 * The server re-prices everything; the browser sends only ids + qty.
 */
export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, total, clear } = useCart()
  const [contact, setContact] = useState(() => ({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
  }))
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [placedOrder, setPlacedOrder] = useState(null)

  async function placeOrder(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const data = await post('/orders', {
        items: items.map((it) => ({ id: it.id, qty: it.qty })),
        contact: { name: contact.name.trim(), phone: contact.phone.trim() },
        note: note.trim(),
      })
      setPlacedOrder(data.order)
      clear() // cart served — it's the counter's turn
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  /* ── Success state: the code + cash instructión ── */
  if (placedOrder) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-xl px-4 py-20 text-center"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
          Order placed
        </p>
        <h1 className="mt-3 font-display text-4xl">Claim code</h1>
        <p className="mt-4 font-mono text-6xl font-bold tracking-widest text-espresso dark:text-milk">
          {placedOrder.orderCode}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <StatusChip status={placedOrder.status} />
          <span className="text-sm text-bean/60 dark:text-milk/60">
            waiting for the café to accept it
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-caramel/40 bg-caramel/10 p-6">
          <p className="font-display text-2xl text-espresso dark:text-milk">
            PAY CASH AT THE COUNTER
          </p>
          <p className="mt-2 text-sm leading-relaxed text-bean/75 dark:text-milk/75">
            Read your order code (<span className="font-mono font-bold">{placedOrder.orderCode}</span>)
            to the cashier when you arrive. Total: <strong>{peso(placedOrder.total)}</strong>.
            The order starts machine time once the café accepts it.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/orders"
            className="rounded-full bg-espresso px-7 py-3 text-sm font-semibold text-milk transition hover:bg-caramel-deep dark:bg-milk dark:text-espresso"
          >
            Track my orders →
          </Link>
          <Link
            to="/menu"
            className="rounded-full border border-espresso/20 px-7 py-3 text-sm font-semibold transition hover:border-caramel-deep dark:border-milk/20"
          >
            Back to the menu
          </Link>
        </div>
      </motion.div>
    )
  }

  /* ── Empty cart guard ── */
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-28 text-center">
        <h1 className="font-display text-4xl">Nothing to check out yet</h1>
        <p className="mt-3 text-sm text-bean/70 dark:text-milk/70">
          Pick something from the counter first.
        </p>
        <Link
          to="/menu"
          className="mt-8 inline-block rounded-full bg-espresso px-7 py-3 text-sm font-semibold text-milk transition hover:bg-caramel-deep dark:bg-milk dark:text-espresso"
        >
          Browse the menu
        </Link>
      </div>
    )
  }

  /* ── Form ── */
  const inputClass =
    'w-full rounded-lg border border-espresso/15 bg-white/70 px-3 py-2.5 text-sm outline-none transition focus:border-caramel dark:border-milk/15 dark:bg-espresso/60'
  const labelClass =
    'mb-1 block text-[11px] font-semibold uppercase tracking-widest text-bean/55 dark:text-milk/55'

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
        Final step
      </p>
      <h1 className="mt-2 font-display text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,380px]">
        {/* claim details */}
        <form onSubmit={placeOrder} className="space-y-4">
          <div className="rounded-2xl border border-espresso/10 bg-foam p-5 dark:border-milk/10 dark:bg-roast">
            <h2 className="font-display text-xl">Claim details</h2>
            <p className="mt-1 text-xs text-bean/55 dark:text-milk/55">
              Used to find you at the counter. Encrypted before storage.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="co-name">Name</label>
                <input
                  id="co-name"
                  type="text"
                  required
                  maxLength={80}
                  className={inputClass}
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="co-phone">Phone</label>
                <input
                  id="co-phone"
                  type="tel"
                  className={inputClass}
                  placeholder="0917 123 4567"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass} htmlFor="co-note">Note for the barista (optional)</label>
              <textarea
                id="co-note"
                rows={3}
                maxLength={500}
                className={inputClass}
                placeholder="less sugar please · oat milk · heat it extra…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-status-cancelled/10 px-3 py-2 text-sm text-status-cancelled">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-espresso py-3.5 font-semibold text-milk transition hover:bg-caramel-deep disabled:opacity-50 dark:bg-milk dark:text-espresso sm:w-auto sm:px-10"
          >
            {busy ? 'Placing your order…' : `Place order · ${peso(total)}`}
          </button>
        </form>

        {/* summary */}
        <aside className="h-fit rounded-2xl border border-espresso/10 bg-foam p-5 lg:sticky lg:top-24 dark:border-milk/10 dark:bg-roast">
          <h2 className="font-display text-xl">Order summary</h2>
          <ul className="mt-4 space-y-3 border-y border-espresso/10 py-4 dark:border-milk/10">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <MenuItemPhoto
                  name={item.name}
                  image={item.image}
                  className="h-11 w-11 shrink-0 rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="font-mono text-[11px] opacity-70">
                    {item.qty} × {peso(item.price)}
                  </p>
                </div>
                <span className="font-mono text-sm">{peso(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between pt-4">
            <span className="text-sm text-bean/70 dark:text-milk/70">Total</span>
            <span className="font-display text-2xl">{peso(total)}</span>
          </div>
          <p className="mt-4 rounded-xl bg-caramel/10 px-3 py-2 text-[11px] leading-relaxed text-caramel-deep">
            Payment: CASH AT THE COUNTER. Prices are re-checked by the server at
            the moment of ordering.
          </p>
        </aside>
      </div>
    </div>
  )
}
