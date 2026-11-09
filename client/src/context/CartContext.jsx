import { createContext, useCallback, useContext, useEffect, useState } from 'react'

/**
 * CartContext — the cart survives refreshes via localStorage.
 * Stored item shape: { id, name, price, image, qty } — checkout sends only
 * { id, qty } to the server, which re-prices everything from its own DB.
 */
const CartContext = createContext(null)
const STORAGE_KEY = 'azeucafe-cart'

function loadInitial() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((it) => it && typeof it.id === 'string' && Number.isFinite(it.qty) && it.qty > 0)
      .slice(0, 50)
      .map((it) => {
        let image = ''
        if (it.image && typeof it.image === 'object') {
          image = { type: it.image.type ?? 'library', path: String(it.image.path ?? '') }
        } else if (typeof it.image === 'string' && it.image !== '[object Object]') {
          image = it.image
        }
        return {
          id: it.id,
          name: String(it.name ?? ''),
          price: Number(it.price) || 0,
          image,
          qty: Math.min(50, Math.max(1, Math.floor(it.qty))),
        }
      })
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* private mode — fine */
    }
  }, [items])

  const add = useCallback((item, qty = 1) => {
    setItems((current) => {
      const existing = current.find((it) => it.id === item.id)
      if (existing) {
        return current.map((it) =>
          it.id === item.id ? { ...it, qty: Math.min(50, it.qty + qty) } : it,
        )
      }
      return [
        ...current,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image ?? '',
          qty: Math.min(50, qty),
        },
      ]
    })
  }, [])

  const setQty = useCallback((id, qty) => {
    setItems((current) =>
      current.map((it) => (it.id === id ? { ...it, qty: Math.max(1, Math.min(50, qty)) } : it)),
    )
  }, [])

  const remove = useCallback((id) => {
    setItems((current) => current.filter((it) => it.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = items.reduce((sum, it) => sum + it.qty, 0)
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0)

  const value = { items, count, total, add, setQty, remove, clear }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
