import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import Logo from './Logo.jsx'

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? 'bg-espresso font-semibold text-milk dark:bg-milk dark:text-espresso'
      : 'hover:bg-caramel/20'
  }`

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M20 13.5A8.5 8.5 0 0 1 10.5 4 8.5 8.5 0 1 0 20 13.5z" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
      <path d="M3 3h2.2l2.5 12.2a1.6 1.6 0 0 0 1.6 1.3h7.9a1.6 1.6 0 0 0 1.6-1.3L20.6 8H6.1" />
    </svg>
  )
}

export default function Navbar() {
  const { user, ready, isOwner, openAuth, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-bean/10 bg-latte/90 backdrop-blur dark:border-milk/10 dark:bg-espresso/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="mr-1 shrink-0" aria-label="AzeuCafe home">
          <Logo withWordmark />
        </Link>

        <nav className="flex flex-wrap items-center gap-1" aria-label="Main">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/menu" className={navLinkClass}>
            Menu
          </NavLink>
          {user && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}
          {isOwner && (
            <>
              <NavLink to="/owner/orders" className={navLinkClass}>
                Orders
              </NavLink>
              <NavLink to="/owner/menu" className={navLinkClass}>
                Manage
              </NavLink>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            title="Toggle theme (T)"
            aria-label="Toggle light/dark theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-bean/15 transition-colors hover:bg-caramel/20 dark:border-milk/15"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link
            to="/cart"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-bean/15 transition-colors hover:bg-caramel/20 dark:border-milk/15"
            aria-label={`Cart (${count} item${count === 1 ? '' : 's'})`}
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-caramel-deep px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {!ready ? (
            <span className="hidden px-2 text-xs opacity-60 sm:block" aria-hidden="true">
              …
            </span>
          ) : !user ? (
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-milk transition-opacity hover:opacity-85 dark:bg-milk dark:text-espresso"
            >
              Log in
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className="hidden max-w-32 truncate text-sm sm:block"
                title={user.email}
              >
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-bean/15 px-3 py-1.5 text-sm transition-colors hover:bg-caramel/20 dark:border-milk/15"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
