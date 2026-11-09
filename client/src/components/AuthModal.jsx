import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const EMPTY_LOGIN = { email: '', password: '' }
const EMPTY_REGISTER = { name: '', email: '', phone: '', password: '' }

/**
 * Modal controller. The body mounts FRESH each time the modal opens, so its
 * state (mode, forms, errors) always starts clean without sync effects.
 */
export default function AuthModal() {
  const { authOpen, authMode } = useAuth()
  if (!authOpen) return null
  return <AuthModalBody key={authMode} initialMode={authMode} />
}

function AuthModalBody({ initialMode }) {
  const { closeAuth, login, register } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN)
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeAuth()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeAuth])

  const submit = async (event) => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      if (mode === 'login') {
        await login(loginForm.email.trim(), loginForm.password)
      } else {
        await register({
          name: registerForm.name.trim(),
          email: registerForm.email.trim(),
          phone: registerForm.phone.trim(),
          password: registerForm.password,
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-bean/15 bg-white/70 px-3 py-2 text-sm outline-none transition focus:border-caramel dark:border-milk/15 dark:bg-espresso/60'
  const labelClass =
    'mb-1 block text-[11px] font-semibold uppercase tracking-widest text-bean/55 dark:text-milk/55'
  const tabClass = (active) =>
    `flex-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
      active
        ? 'bg-espresso text-milk dark:bg-milk dark:text-espresso'
        : 'opacity-60 hover:opacity-90'
    }`

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-espresso/60 p-4 backdrop-blur-sm"
      onClick={closeAuth}
      role="dialog"
      aria-modal="true"
      aria-label="Authentication"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-foam p-6 shadow-2xl dark:bg-roast"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">
            {mode === 'login' ? 'Welcome back' : 'Join AzeuCafe'}
          </h2>
          <button
            type="button"
            onClick={closeAuth}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-bean/60 transition-colors hover:bg-espresso/10 dark:text-milk/60 dark:hover:bg-milk/10"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-1 rounded-full bg-espresso/5 p-1 dark:bg-milk/10">
          <button type="button" className={tabClass(mode === 'login')} onClick={() => { setMode('login'); setError('') }}>
            Log in
          </button>
          <button type="button" className={tabClass(mode === 'register')} onClick={() => { setMode('register'); setError('') }}>
            Register
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'login' ? (
            <>
              <div>
                <label className={labelClass} htmlFor="auth-email">
                  Email
                </label>
                <input
                  id="auth-email"
                  type="text"
                  required
                  autoFocus
                  autoComplete="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="auth-password">
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={5}
                  autoComplete="current-password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={labelClass} htmlFor="reg-name">
                  Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  autoFocus
                  maxLength={80}
                  className={inputClass}
                  placeholder="Juan Dela Cruz"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="reg-email">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="reg-phone">
                  Phone (optional)
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  className={inputClass}
                  placeholder="0917 123 4567"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                />
                <p className="mt-1 text-[11px] text-bean/50 dark:text-milk/50">
                  Encrypted with AES-256-GCM before it reaches the database.
                </p>
              </div>
              <div>
                <label className={labelClass} htmlFor="reg-password">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="At least 6 characters"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>
            </>
          )}

          {error && (
            <p className="rounded-lg bg-status-cancelled/10 px-3 py-2 text-sm text-status-cancelled">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-espresso py-2.5 font-semibold text-milk transition hover:opacity-85 disabled:opacity-50 dark:bg-milk dark:text-espresso"
          >
            {busy ? 'One moment…' : mode === 'login' ? 'Log in' : 'Create my account'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-bean/60 dark:text-milk/60">
          {mode === 'login' ? 'New here?' : 'Already a member?'}{' '}
          <button
            type="button"
            className="font-semibold text-caramel-deep hover:underline"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
            }}
          >
            {mode === 'login' ? 'Create an account' : 'Log in instead'}
          </button>
        </p>
      </div>
    </div>
  )
}
