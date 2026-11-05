import { useState } from 'react'

/**
 * Photo with a designed fallback: renders the item's photo when available,
 * and degrades to a serif monogram card if the image is missing, dead
 * (owner-pasted URL), or fails to load — never a broken-image icon.
 *
 * @param name  item name (source of the monogram letter)
 * @param image string path, or { type, path } object from the API
 */
export default function MenuItemPhoto({ name, image, className = '', eager = false }) {
  const [broken, setBroken] = useState(false)
  const src = typeof image === 'string' ? image : image?.path

  if (!src || broken) {
    return (
      <span
        className={`grid place-items-center bg-caramel/15 font-display text-4xl text-caramel-deep dark:bg-caramel/10 dark:text-caramel ${className}`}
        aria-hidden="true"
      >
        {(name || '?').charAt(0).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setBroken(true)}
      className={`object-cover ${className}`}
    />
  )
}
