import { useCallback, useEffect, useState } from 'react'
import { get, patch } from '../api/client.js'
import StatusChip from '../components/StatusChip.jsx'
import { peso } from '../utils/format.js'

/**
 * Owner Orders dashboard — the café's side of the counter.
 * Polls every 5s so orders that arrive while the tab is open show up without
 * a manual refresh, and always shows whose order it is + the DECRYPTED claim
 * info (the server decrypts; the dashboard just displays it).
 *
 * Action rules (mirror of server/src/controllers/orders.controller.js TRANSITIONS):
 *   waiting    → Accept (processing) · Cancel
 *   processing → Ready              · Cancel (owner may, users may not)
 *   ready      → Completed
 *   completed / cancelled → terminal, no buttons
 */

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'waiting', label: 'Waiting' },
  { id: 'processing', label: 'Processing' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState(null) // null = loading
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [filter, setFilter] = useState('all')
  const [busyId, setBusyId] = useState(null)
  const [lastSync, setLastSync] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const data = await get('/orders')
      setOrders(data.orders)
      setLastSync(new Date())
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    refresh()
    const timer = window.setInterval(refresh, 5000)
    return () => window.clearInterval(timer)
  }, [refresh])

  async function move(order, status, confirmMessage) {
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

  const counts = STATUS_FILTERS.reduce((acc, f) => {
    acc[f.id] = f.id === 'all' ? (orders?.length ?? 0) : (orders ? orders.filter((o) => o.status === f.id).length : 0)
    return acc
  }, {})

  const visible = (filter === 'all' ? orders : orders?.filter((o) => o.status === filter)) ?? []

  const dateLabel = (iso) =>
    new Date(iso).toLocaleString('en-PH', { timeStyle: 'short', dateStyle: 'medium' })

  const isActive = (status) => status === 'waiting' || status === 'processing'

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
            Owner · the kitchen's queue
          </p>
          <h1 className="mt-2 font-display text-4xl">Orders</h1>
          <p className="mt-2 text-sm text-bean/60 dark:text-milk/60">
            {orders
              ? `${counts.waiting} waiting · ${counts.processing} in the making · ${counts.ready} ready to hand out`
              : 'loading the queue…'}
          </p>
        </div>
        <p className="text-xs opacity-60">
          Auto-refreshing every 5s{lastSync ? ` · last sync ${dateLabel(lastSync)}` : ''}
        </p>
      </div>

      {/* status filter tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === f.id
                ? 'bg-espresso text-milk dark:bg-milk dark:text-espresso'
                : 'border border-espresso/15 hover:border-caramel dark:border-milk/15'
            }`}
          >
            {f.label}
            <span className="ml-1.5 font-mono text-xs opacity-70">{counts[f.id] ?? 0}</span>
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-xl bg-status-cancelled/10 px-4 py-3 text-sm text-status-cancelled">{error}</p>
      )}
      {actionError && (
        <p className="mt-6 rounded-xl bg-status-cancelled/10 px-4 py-3 text-sm text-status-cancelled">{actionError}</p>
      )}

      {orders && visible.length === 0 && (
        <div className="mt-10 rounded-2xl border border-espresso/10 bg-foam p-10 text-center dark:border-milk/10 dark:bg-roast">
          <h2 className="font-display text-2xl">The queue is clear</h2>
          <p className="mt-2 text-sm text-bean/60 dark:text-milk/60">
            {filter === 'all' ? 'No orders yet — they will appear here the moment a customer checks out.' : `No ${filter} orders right now.`}
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {visible.map((order) => (
          <article
            key={order.id}
            className={`flex flex-col rounded-2xl border p-5 ${
              isActive(order.status)
                ? 'border-caramel/50 bg-foam shadow-sm dark:border-caramel/30 dark:bg-roast'
                : 'border-espresso/10 bg-foam/70 dark:border-milk/10 dark:bg-roast/70'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold">{order.orderCode}</span>
                <StatusChip status={order.status} />
              </div>
              <span className="text-xs opacity-60">{dateLabel(order.createdAt)}</span>
            </div>

            {/* who ordered + claim info (server-side decrypted) */}
            <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-widest opacity-55">Claim as</dt>
                <dd className="truncate">
                  {order.contact?.name || '—'}
                  {order.contact?.phone ? <span className="opacity-70"> · {order.contact.phone}</span> : ''}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-widest opacity-55">Account</dt>
                <dd className="truncate">
                  {order.user?.name || '—'}
                  <span className="block truncate text-xs opacity-60">{order.user?.email}</span>
                </dd>
              </div>
              {order.note ? (
                <div className="sm:col-span-2">
                  <dt className="text-[10px] font-semibold uppercase tracking-widest opacity-55">Note</dt>
                  <dd className="rounded-lg bg-caramel/10 px-2.5 py-1.5 text-sm">“{order.note}”</dd>
                </div>
              ) : null}
            </dl>

            {/* items */}
            <ul className="mt-3 space-y-1 border-y border-espresso/10 py-3 text-sm dark:border-milk/10">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-baseline justify-between gap-4">
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-xs opacity-70">{item.qty} ×</span> {item.name}
                  </span>
                  <span className="font-mono text-xs">{peso(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-mono text-[11px] opacity-50">
                {order.history?.map((h) => h.status).join(' → ')}
              </span>
              <span className="font-display text-xl">{peso(order.total)} <span className="text-xs opacity-60">cash</span></span>
            </div>

            {/* actions straight from the TRANSITIONS matrix */}
            {(isActive(order.status) || order.status === 'ready') && (
              <div className="mt-4 flex flex-wrap gap-3 border-t border-espresso/10 pt-4 dark:border-milk/10">
                {order.status === 'waiting' && (
                  <button
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() => move(order, 'processing')}
                    className="rounded-full bg-espresso px-5 py-2 text-sm font-semibold text-milk transition hover:bg-caramel-deep disabled:opacity-50 dark:bg-milk dark:text-espresso"
                  >
                    {busyId === order.id ? 'Accepting…' : 'Accept → Processing'}
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() => move(order, 'ready')}
                    className="rounded-full bg-status-ready px-5 py-2 text-sm font-semibold text-milk transition hover:opacity-85 disabled:opacity-50"
                  >
                    {busyId === order.id ? 'Updating…' : 'Mark Ready'}
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() => move(order, 'completed')}
                    className="rounded-full bg-status-completed px-5 py-2 text-sm font-semibold text-milk transition hover:opacity-85 disabled:opacity-50"
                  >
                    {busyId === order.id ? 'Closing…' : 'Hand out → Completed'}
                  </button>
                )}
                {isActive(order.status) && (
                  <button
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() =>
                      move(
                        order,
                        'cancelled',
                        `Cancel ${order.orderCode}? Make sure the customer was informed.`,
                      )
                    }
                    className="rounded-full border border-status-cancelled/50 px-5 py-2 text-sm font-semibold text-status-cancelled transition hover:bg-status-cancelled/10 disabled:opacity-50"
                  >
                    {busyId === order.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
