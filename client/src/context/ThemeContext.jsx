import { createContext, useContext, useEffect, useState } from 'react'

/**
 * ThemeContext — light/dark for the WHOLE system (landing, app, owner, /demo).
 * Default: light ("Fresh Cream") on first visit; choice remembered in
 * localStorage; toggles <html class="dark"> for Tailwind's class strategy.
 * Keyboard: "T" toggles (ignored while typing in form fields).
 */
const ThemeContext = createContext(null)
const STORAGE_KEY = 'azeucafe-theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* private mode — fine */
    }
  }, [theme])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() !== 't' || event.ctrlKey || event.metaKey || event.altKey) return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = {
    theme,
    toggle: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
  }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
