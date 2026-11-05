import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get, patch } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import StatusChip from '../components/StatusChip.jsx'
import { peso } from '../utils/format.js'

/**
 * My Orders — every order this account ever placed, with the actions the
 * user may take per the confirmed rules:
 *   waiting → may cancel · ready → may mark completed
 *   processing → no cancellation (only the owner can, on request)
 * Polls every 10s so status changes by the Owner show up live-ish.
 */
export default function MyOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState(null) // null = loading
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const data = await get('/orders/mine')
      setOrders(data.orders)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    refresh()
    const timer = window.setInterval(refresh, 10000)
    return () => window.clearInterval(timer)
  }, [refresh])

  async function changeStatus(order, status, confirmMessage) {
    if (confirmMessage && !window.confirm(confirmMessage)) return
    setBusyId(order.id)
    setActionError('')
    try {
      await patch(`/orders/${order.id}/status`, { status })
      await refresh()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const dateLabel = (iso) =>
    new Date(iso).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
        Your claim tickets
      </p>
      <h1 className="mt-2 font-display text-4xl">My Orders</h1>
      <p className="mt-2 text-sm text-bean/60 dark:text-milk/60">
        Signed in as <strong>{user?.name}</strong> — claim at the counter with your order code.
      </p>

      {error && (
        <p className="mt-6 rounded-xl bg-status-cancelled/10 px-4 py-3 text-sm text-status-cancelled">
          {error}
        </p>
      )}
      {actionError && (
        <p className="mt-6 rounded-xl bg-status-cancelled/10 px-4 py-3 text-sm text-status-cancelled">
          {actionError}
        </p>
      )}

      {orders && orders.length === 0 && (
        <div className="mt-10 rounded-2xl border border-espresso/10 bg-foam p-10 text-center dark:border-milk/10 dark:bg-roast">
          <h2 className="font-display text-2xl">No orders yet</h2>
          <p className="mt-2 text-sm text-bean/60 dark:text-milk/60">
            The menu awaits your first claim code.
          </p>
          <Link
            to="/menu"
            className="mt-6 inline-block rounded-full bg-espresso px-6 py-2.5 text-sm font-semibold text-milk transition hover:bg-caramel-deep dark:bg-milk dark:text-espresso"
          >
            Browse the menu
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-5">
        {orders?.map((order) => {
          const canCancel = order.status === 'waiting'
          const canComplete = order.status === 'ready'
          return (
            <article
              key={order.id}
              className="rounded-2xl border border-espresso/10 bg-foam p-5 dark:border-milk/10 dark:bg-roast"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold">{order.orderCode}</span>
                  <StatusChip status={order.status} />
                </div>
                <span className="text-xs opacity-60">{dateLabel(order.createdAt)}</span>
              </div>

              {order.status === 'waiting' && (
                <p className="mt-3 rounded-xl border border-caramel/40 bg-caramel/10 px-3 py-2 text-sm">
                  <strong>PAY CASH AT THE COUNTER.</strong> Show this code:
                  <span className="font-mono font-bold"> {order.orderCode}</span>
                </p>
              )}
              {order.status === 'ready' && (
                <p className="mt-3 rounded-xl border border-status-ready/40 bg-status-ready/10 px-3 py-2 text-sm text-status-ready">
                  <strong>Ready for pickup!</strong> Claim at the cashier / claim shelf.
                </p>
              )}
              {order.status === 'processing' && (
                <p className="mt-3 rounded-xl border border-status-processing/30 bg-status-processing/10 px-3 py-2 text-sm text-status-processing/90">
                  Our café is making it right now — orders can no longer be
                  cancelled in this stage (only the owner can, if you ask).
                </p>
              )}

              <ul className="mt-4 space-y-1 border-y border-espresso/10 py-3 text-sm dark:border-milk/10">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-baseline justify-between gap-4">
                    <span className="min-w-0 truncate">
                      <span className="font-mono text-xs opacity-70">{item.qty} ×</span> {item.name}
                    </span>
                    <span className="font-mono text-xs">{peso(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="text-bean/60 dark:text-milk/60">
                  Claim as: <strong>{order.contact?.name || '—'}</strong>
                  {order.contact?.phone ? ` · ${order.contact.phone}` : ''}
                  {order.note ? ` · note: “${order.note}”` : ''}
                </span>
                <span className="font-display text-xl">{peso(order.total)}</span>
              </div>

              <p className="mt-2 font-mono text-[11px] opacity-50">
                {order.history?.map((h) => h.status).join(' → ') ?? order.status}
              </p>

              {(canCancel || canComplete) && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {canCancel && (
                    <button
                      type="button"
                      disabled={busyId === order.id}
                      onClick={() =>
                        changeStatus(order, 'cancelled', `Cancel ${order.orderCode}? It has not been accepted yet.`)
                      }
                      className="rounded-full border border-status-cancelled/50 px-5 py-2 text-sm font-semibold text-status-cancelled transition hover:bg-status-cancelled/10 disabled:opacity-50"
                    >
                      {busyId === order.id ? 'Cancelling…' : 'Cancel order'}
                    </button>
                  )}
                  {canComplete && (
                    <button
                      type="button"
                      disabled={busyId === order.id}
                      onClick={() => changeStatus(order, 'completed')}
                      className="rounded-full bg-status-ready px-5 py-2 text-sm font-semibold text-milk transition hover:opacity-85 disabled:opacity-50"
                    >
                      {busyId === order.id ? 'Updating…' : "I've got it — mark completed"}
                    </button>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
