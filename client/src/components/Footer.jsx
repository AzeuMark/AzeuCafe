import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-bean/10 bg-foam dark:border-milk/10 dark:bg-roast">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Logo withWordmark />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-bean/70 dark:text-milk/70">
            A small café that takes care of its customers — and encrypts every
            name and phone number before it touches the database.
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-caramel-deep">
            Explore
          </span>
          <Link to="/menu" className="hover:text-caramel-deep">
            Menu
          </Link>
          <Link to="/orders" className="hover:text-caramel-deep">
            My Orders
          </Link>
          <Link to="/demo" className="hover:text-caramel-deep">
            Security Demo
          </Link>
        </nav>

        <div className="text-sm">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-caramel-deep">
            Project Team
          </span>
          <p className="mt-2 font-medium">Uelmark G. Valdehueza &amp; Vernelle Jhay Balatayo</p>
          <p className="font-mono text-xs text-bean/60 dark:text-milk/60">
            AzeuCafe · © 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
