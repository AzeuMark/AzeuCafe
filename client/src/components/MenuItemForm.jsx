import { useState } from 'react'
import { post, patch } from '../api/client.js'
import PhotoField from './PhotoField.jsx'
import { peso } from '../utils/format.js'

/**
 * MenuItemForm — create or edit a menu item for the Owner.
 * When `item` is null it opens in create mode (POST /api/menu),
 * otherwise it edits in place (PATCH /api/menu/:id).
 * The server re-validates everything; this form only does the light checks.
 */

const CATEGORIES = [
  { id: 'espresso-drinks', label: 'Espresso Drinks' },
  { id: 'iced-drinks', label: 'Iced Drinks' },
  { id: 'pastries', label: 'Pastries' },
  { id: 'snacks', label: 'Snacks' },
]

const EMPTY = { name: '', description: '', category: 'espresso-drinks', price: '', image: { type: 'library', path: '' } }

export default function MenuItemForm({ item, onSaved, onCancel }) {
  const editing = Boolean(item?.id)
  const [draft, setDraft] = useState(() =>
    editing
      ? {
          name: item.name ?? '',
          description: item.description ?? '',
          category: item.category ?? 'espresso-drinks',
          price: String(item.price ?? ''),
          image: item.image ?? { type: 'library', path: '' },
        }
      : EMPTY,
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const set = (field, value) => setDraft((d) => ({ ...d, [field]: value }))

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const price = Number(draft.price)
    if (!draft.name.trim()) return setError('The item needs a name.')
    if (!Number.isFinite(price) || price < 0) return setError('Price must be a number ≥ 0.')

    setBusy(true)
    setError('')
    try {
      const payload = {
        name: draft.name.trim(),
        description: draft.description.trim(),
        category: draft.category,
        price,
        image: draft.image,
      }
      const data = editing
        ? await patch(`/menu/${item.id}`, payload)
        : await post('/menu', payload)
      onSaved(data.item, editing)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-espresso/15 bg-white/70 px-3 py-2.5 text-sm outline-none transition focus:border-caramel dark:border-milk/15 dark:bg-espresso/60'
  const labelClass =
    'mb-1 block text-[11px] font-semibold uppercase tracking-widest text-bean/55 dark:text-milk/55'

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr,140px]">
        <div>
          <label className={labelClass} htmlFor="mi-name">Item name</label>
          <input
            id="mi-name"
            type="text"
            required
            maxLength={80}
            className={inputClass}
            placeholder="e.g. Mocha Frappe"
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="mi-price">Price (₱)</label>
          <input
            id="mi-price"
            type="number"
            required
            min="0"
            step="0.01"
            className={inputClass}
            placeholder="120"
            value={draft.price}
            onChange={(e) => set('price', e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="mi-category">Category</label>
          <select
            id="mi-category"
            className={inputClass}
            value={draft.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="mi-description">Short description</label>
          <input
            id="mi-description"
            type="text"
            maxLength={200}
            className={inputClass}
            placeholder="Double shot / oat milk / freshly baked…"
            value={draft.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className={labelClass}>Photo</p>
        <PhotoField value={draft.image} onChange={(next) => set('image', next)} disabled={busy} />
      </div>

      {error && (
        <p className="rounded-lg bg-status-cancelled/10 px-3 py-2 text-sm text-status-cancelled">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-espresso px-7 py-2.5 text-sm font-semibold text-milk transition hover:bg-caramel-deep disabled:opacity-50 dark:bg-milk dark:text-espresso"
        >
          {busy ? 'Saving…' : editing ? 'Save changes' : `Add to menu`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-bean/60 hover:text-status-cancelled dark:text-milk/60"
        >
          Discard
        </button>
        {editing && (
          <span className="ml-auto font-mono text-xs opacity-50">
            editing “{item.name}” · currently {peso(item.price)}
          </span>
        )}
      </div>
    </form>
  )
}
