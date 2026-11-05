import { useRef, useState } from 'react'
import { postForm } from '../api/client.js'
import MenuItemPhoto from './MenuItemPhoto.jsx'

/**
 * PhotoField — the Owner's 3-way photo source picker.
 *
 *   Library → pick from photos bundled with the app (offline-safe)
 *   Upload  → send a file to POST /api/menu/upload (multer, 5 MB, jpg/png/webp)
 *   URL     → paste any external image link
 *
 * `value` is always an image object { type, path } (blank path = no photo,
 * which renders the serif monogram fallback everywhere on the site).
 */

const LIBRARY = [
  { label: 'Cappuccino', path: '/menu/cappuccino.jpg' },
  { label: 'Espresso Doppio', path: '/menu/espresso-doppio.jpg' },
  { label: 'Cafe Latte', path: '/menu/cafe-latte.jpg' },
  { label: 'Iced Americano', path: '/menu/iced-americano.jpg' },
  { label: 'Iced Caramel Latte', path: '/menu/iced-caramel-latte.jpg' },
  { label: 'Iced Matcha Latte', path: '/menu/iced-matcha-latte.jpg' },
  { label: 'Butter Croissant', path: '/menu/butter-croissant.jpg' },
  { label: 'Blueberry Cheesecake', path: '/menu/blueberry-cheesecake.jpg' },
  { label: 'Chocolate Chip Cookie', path: '/menu/chocolate-chip-cookie.jpg' },
  { label: 'Clubhouse Sandwich', path: '/menu/clubhouse-sandwich.jpg' },
  { label: 'Loaded Fries', path: '/menu/loaded-fries.jpg' },
  { label: 'Tuna Wrap', path: '/menu/tuna-wrap.jpg' },
]

const TABS = [
  { id: 'library', label: 'Library' },
  { id: 'upload', label: 'Upload' },
  { id: 'url', label: 'From URL' },
]

const BLANK = { type: 'library', path: '' }

export default function PhotoField({ value, onChange, disabled = false }) {
  const current = value && (value.type || value.path) ? value : BLANK
  const [tab, setTab] = useState(current.path ? (LIBRARY.some((p) => p.path === current.path) ? 'library' : current.type) : 'library')
  const [urlDraft, setUrlDraft] = useState(current.type === 'url' ? current.path : '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  function emit(next) {
    setError('')
    onChange(next)
  }

  async function handleFile(file) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('photo', file)
      const { path } = await postForm('/menu/upload', fd)
      emit({ type: 'upload', path })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function applyUrl() {
    const candidate = urlDraft.trim()
    if (!/^https?:\/\/\S+/i.test(candidate)) {
      setError('Paste a full image link starting with http(s)://.')
      return
    }
    emit({ type: 'url', path: candidate })
  }

  const tabBtn = (active) =>
    `rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
      active
        ? 'bg-espresso text-milk dark:bg-milk dark:text-espresso'
        : 'border border-espresso/15 hover:border-caramel dark:border-milk/15'
    }`

  return (
    <div className="rounded-xl border border-espresso/10 bg-white/60 p-4 dark:border-milk/10 dark:bg-espresso/40">
      {/* preview + current source caption */}
      <div className="flex items-center gap-3">
        <MenuItemPhoto
          name="Current"
          image={current.path ? current : undefined}
          className="h-16 w-16 shrink-0 rounded-lg text-2xl"
        />
        <div className="min-w-0 text-sm">
          {current.path ? (
            <>
              <p className="font-medium">Photo set</p>
              <p className="truncate font-mono text-[11px] opacity-60" title={current.path}>
                {current.type}: {current.path}
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">No photo yet</p>
              <p className="text-[12px] opacity-60">Items without photos show their monogram.</p>
            </>
          )}
          {current.path && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => emit(BLANK)}
              className="mt-1 text-[11px] font-semibold text-status-cancelled hover:underline"
            >
              Remove photo
            </button>
          )}
        </div>
      </div>

      {/* mode tabs */}
      <div className="mt-4 flex gap-2" role="tablist" aria-label="Photo source">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            disabled={disabled}
            onClick={() => {
              setTab(t.id)
              setError('')
            }}
            className={tabBtn(tab === t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'library' && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {LIBRARY.map((photo) => {
            const selected = current.path === photo.path
            return (
              <button
                key={photo.path}
                type="button"
                disabled={disabled}
                onClick={() => emit({ type: 'library', path: photo.path })}
                title={photo.label}
                className={`overflow-hidden rounded-lg border-2 transition ${
                  selected
                    ? 'border-caramel'
                    : 'border-transparent hover:border-caramel/40'
                }`}
              >
                <MenuItemPhoto
                  name={photo.label}
                  image={{ type: 'library', path: photo.path }}
                  className="aspect-square w-full text-lg"
                />
                <span className="block truncate bg-espresso px-1 py-1 text-[10px] font-semibold text-milk dark:bg-espresso/70">
                  {photo.label}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {tab === 'upload' && (
        <div className="mt-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0])
              e.target.value = '' // allow re-picking the same file later
            }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => fileRef.current?.click()}
              className="rounded-full border border-espresso/20 px-4 py-2 text-sm font-semibold transition hover:border-caramel disabled:opacity-50 dark:border-milk/20"
            >
              {busy ? 'Uploading…' : 'Choose image…'}
            </button>
            <p className="text-[11px] opacity-60">JPG / PNG / WebP · up to 5 MB</p>
          </div>
        </div>
      )}

      {tab === 'url' && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="url"
            placeholder="https://images.example.com/photo.jpg"
            value={urlDraft}
            disabled={disabled}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyUrl()
              }
            }}
            className="min-w-0 flex-1 rounded-lg border border-espresso/15 bg-white/70 px-3 py-2 text-sm outline-none transition focus:border-caramel dark:border-milk/15 dark:bg-espresso/60"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={applyUrl}
            className="rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-milk transition hover:bg-caramel-deep disabled:opacity-50 dark:bg-milk dark:text-espresso"
          >
            Use this URL
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-status-cancelled">{error}</p>}
    </div>
  )
}
