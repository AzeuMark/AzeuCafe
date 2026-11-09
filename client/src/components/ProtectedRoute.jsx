import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/** Sends the visitor to "/" and opens the login modal once. */
function NeedLogin({ openAuth }) {
  useEffect(() => {
    openAuth('login')
  }, [openAuth])
  return <Navigate to="/" replace />
}

export default function ProtectedRoute({ children, requireOwner = false }) {
  const { user, ready, isOwner, openAuth } = useAuth()

  if (!ready) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm opacity-60">
        Checking your session…
      </div>
    )
  }
  if (!user) return <NeedLogin openAuth={openAuth} />
  if (requireOwner && !isOwner) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Owner access only</h1>
        <p className="mt-2 text-sm text-bean/70 dark:text-milk/70">
          This page belongs to the café owner. Please sign in with the owner credentials to access this dashboard.
        </p>
      </div>
    )
  }
  return children
}
