import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { get, post } from '../api/client.js'

/**
 * AuthContext — session state + the login/register modal controller.
 * The JWT lives in an httpOnly cookie (set by the server), so the client
 * only needs to ask /auth/me on boot to know who's in.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready'
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'

  useEffect(() => {
    let alive = true
    get('/auth/me')
      .then((data) => {
        if (alive) {
          setUser(data.user)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (alive) setStatus('ready')
      })
    return () => {
      alive = false
    }
  }, [])

  const openAuth = useCallback((mode = 'login') => {
    setAuthMode(mode)
    setAuthOpen(true)
  }, [])

  const closeAuth = useCallback(() => setAuthOpen(false), [])

  const login = useCallback(async (email, password) => {
    const data = await post('/auth/login', { email, password })
    setUser(data.user)
    setAuthOpen(false)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const data = await post('/auth/register', payload)
    setUser(data.user)
    setAuthOpen(false)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await post('/auth/logout', {})
    } catch {
      /* cookie may already be gone — clearing local state is what matters */
    }
    setUser(null)
  }, [])

  const value = {
    user,
    ready: status === 'ready',
    isOwner: user?.role === 'owner',
    authOpen,
    authMode,
    openAuth,
    closeAuth,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
