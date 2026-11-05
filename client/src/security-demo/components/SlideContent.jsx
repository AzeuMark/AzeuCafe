import { motion } from 'framer-motion'
import LockSketch from './LockSketch.jsx'
import CodeWindow from './CodeWindow.jsx'
import EncryptPlayground from './EncryptPlayground.jsx'

/**
 * SlideContent — the visual of each of the 16 slides, keyed by `slide.content`
 * (data lives in data/slides.js). Staggered reveals everywhere; special slides
 * use LockSketch (12), CodeWindow (13), EncryptPlayground (14).
 */

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

const riseX = (delay = 0) => ({
  initial: { opacity: 0, x: -26 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

/* ── 1 · Title ─────────────────────────────────────────────────────────── */
function TitleSlide({ slide }) {
  return (
    <div className="flex min-h-[52vh] flex-col items-center justify-center text-center">
      <motion.p {...rise(0)} className="font-mono text-xs font-bold uppercase tracking-[0.4em] text-caramel-deep dark:text-caramel">
        {slide.kicker}
      </motion.p>

      <motion.h1
        {...rise(0.15)}
        className="mt-5 font-display text-7xl leading-none tracking-tight sm:text-8xl"
      >
        AzeuCafe
      </motion.h1>

      {/* steam lines */}
      <motion.div {...rise(0.3)} className="mt-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px w-16 bg-caramel/50" />
        <svg viewBox="0 0 40 26" className="h-6 w-10 text-caramel-deep dark:text-caramel" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 20q2-3 0-6M15 22q2-3 0-6M24 20q2-3 0-6M33 22q2-3 0-6" />
        </svg>
        <span className="h-px w-16 bg-caramel/50" />
      </motion.div>

      <motion.p {...rise(0.45)} className="mt-5 max-w-2xl text-balance text-lg leading-relaxed opacity-85">
        {slide.subtitle}
      </motion.p>

      <motion.div {...rise(0.6)} className="mt-8 flex flex-col items-center gap-1.5">
        <span className="font-display text-2xl">Uelmark G. Valdehueza</span>
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-caramel-deep dark:text-caramel">
          aka AzeuMark · developer & security lead
        </span>
      </motion.div>

      <motion.p {...rise(0.75)} className="mt-10 font-mono text-[11px] opacity-50">
        16 slides · 3 acts ≈ 12 minutes · full speaker script hidden (press S)
      </motion.p>
    </div>
  )
}

/* ── 2 · What is AzeuCafe ─────────────────────────────────────────────── */
function RolesSlide({ slide }) {
  const roles = [
    {
      title: 'User',
      tag: 'customer',
      lines: ['Registers & logs in (role: user, always)', 'Browses the menu · fills a cart', 'Checks out → gets a claim code (AZ-000X)', 'Tracks the order · cancels only while Waiting'],
    },
    {
      title: 'Owner',
      tag: 'the café',
      lines: ['Runs the menu (add / edit / soft-retire)', 'Works the order queue on a live dashboard', 'Sees claim contacts — server decrypts for owner', 'Manages the full status state machine'],
    },
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {roles.map((role, i) => (
          <motion.div
            key={role.title}
            {...rise(0.2 + i * 0.12)}
            className="rounded-2xl border border-espresso/12 bg-white/60 p-6 dark:border-milk/10 dark:bg-espresso/60"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-3xl">{role.title}</h3>
              <span className="font-mono text-[11px] uppercase tracking-widest opacity-55">{role.tag}</span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {role.lines.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caramel-deep dark:bg-caramel" />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div {...rise(0.5)} className="mt-6 rounded-2xl border border-caramel/40 bg-caramel/10 px-6 py-5 text-center">
        <span className="font-display text-2xl sm:text-3xl">PAY CASH AT THE COUNTER</span>
        <p className="mt-1 text-sm opacity-70">
          No payment gateway exists anywhere in this codebase — by design, it ships zero card data.
        </p>
      </motion.div>
    </div>
  )
}

/* ── 3 · Register & login ─────────────────────────────────────────────── */
function AuthSlide({ slide }) {
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <motion.div {...riseX(0.2)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">Modal · Register</p>
          <div className="mt-3 space-y-2 font-mono text-xs opacity-80">
            <p className="rounded-lg bg-espresso/5 px-3 py-2 dark:bg-milk/10">name · <em>“Juan Dela Cruz”</em></p>
            <p className="rounded-lg bg-espresso/5 px-3 py-2 dark:bg-milk/10">email · <em>juan@cafe.ph</em></p>
            <p className="rounded-lg bg-espresso/5 px-3 py-2 dark:bg-milk/10">password · <em>••••••••</em></p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><strong>Server assigns role “user”</strong> — whatever the client claims</li>
            <li>Password → <strong>bcrypt hash + per-user salt</strong>, original destroyed</li>
            <li>Name & phone → <strong>AES-256-GCM ciphertext in the DB</strong></li>
          </ul>
        </motion.div>

        <motion.div {...riseX(0.32)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">Modal · Login</p>
          <div className="mt-3 space-y-2 font-mono text-xs opacity-80">
            <p className="rounded-lg bg-espresso/5 px-3 py-2 dark:bg-milk/10">email · <em>owner@azeucafe.local</em></p>
            <p className="rounded-lg bg-espresso/5 px-3 py-2 dark:bg-milk/10">password · <em>••••••••</em></p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>JWT returned as an <strong>httpOnly cookie</strong> — unreadable to page JS</li>
            <li>Owner login unlocks the owner APIs — role checked on every route</li>
            <li><em>No tokens in localStorage. Nothing for XSS to steal.</em></li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

/* ── 4 · Menu & cart ──────────────────────────────────────────────────── */
function MenuSlide({ slide }) {
  const items = [
    { name: 'Cappuccino', price: 140, img: '/menu/cappuccino.jpg' },
    { name: 'Butter Croissant', price: 90, img: '/menu/butter-croissant.jpg' },
    { name: 'Loaded Fries', price: 140, img: '/menu/loaded-fries.jpg' },
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-8 grid items-start gap-5 md:grid-cols-[2fr,1fr]">
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, i) => (
            <motion.figure
              key={item.name}
              {...rise(0.2 + i * 0.1)}
              className="overflow-hidden rounded-xl border border-espresso/12 bg-white/60 dark:border-milk/10 dark:bg-espresso/60"
            >
              <img src={item.img} alt={item.name} loading="lazy" className="aspect-square w-full object-cover" />
              <figcaption className="p-2.5">
                <span className="block truncate text-xs font-semibold">{item.name}</span>
                <span className="font-mono text-[11px] text-caramel-deep dark:text-caramel">₱{item.price}</span>
              </figcaption>
            </motion.figure>
          ))}
          <motion.p {...rise(0.5)} className="col-span-3 text-sm opacity-70">
            …9 more items across 4 categories — all served real from <code className="font-mono">GET /api/menu</code>.
          </motion.p>
        </div>

        <motion.div {...riseX(0.35)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">Cart (local only)</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span>Cappuccino <span className="font-mono opacity-60">× 1</span></span><span className="font-mono">− 1 +</span></li>
            <li className="flex justify-between"><span>Butter Croissant <span className="font-mono opacity-60">× 2</span></span><span className="font-mono">− 2 +</span></li>
          </ul>
          <div className="mt-4 rounded-xl bg-espresso/80 px-4 py-3 text-milk dark:bg-milk/10">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Trust boundary #2</p>
            <p className="mt-1 text-xs leading-relaxed">
              The browser sends <strong>only ids + quantities</strong>. Prices and totals are taken from the server’s own database.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ── 5 · Checkout ─────────────────────────────────────────────────────── */
function CheckoutSlide({ slide }) {
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-8 grid items-start gap-5 md:grid-cols-2">
        <motion.div {...riseX(0.2)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">Checkout screen</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Claim details: name + phone (editable, prefilled)</li>
            <li>Note for the barista: <em>“less sugar please”</em></li>
            <li>Summary panel — priced by the server at submit</li>
          </ul>
          <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm">
            <li><strong>Re-price every line</strong> from the server’s own menu</li>
            <li><strong>Snapshot items</strong> onto the order — menu edits never rewrite receipts</li>
            <li><strong>Encrypt name & phone</strong> with AES-256-GCM <em>before</em> the row is saved</li>
          </ol>
        </motion.div>

        <motion.div {...rise(0.35)} className="flex flex-col gap-4">
          <div className="rounded-2xl border border-espresso/12 bg-white/60 p-6 text-center dark:border-milk/10 dark:bg-espresso/60">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-55">Claim code</p>
            <p className="mt-2 font-mono text-6xl font-bold tracking-widest">AZ-0001</p>
          <p className="mt-2 font-mono text-xs opacity-55">iv: fresh random · tag: GCM integrity</p>
          </div>
          <div className="rounded-2xl border border-caramel/40 bg-caramel/10 p-5 text-center">
            <p className="font-display text-2xl">PAY CASH AT THE COUNTER</p>
            <p className="mt-1 text-sm opacity-70">₱320 owed · order starts machine time on Accept</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ── 6 · Statuses & rules ─────────────────────────────────────────────── */
function StatusesSlide({ slide }) {
  const chips = [
    { label: 'Waiting', className: 'border-status-waiting/40 bg-status-waiting/15 text-status-waiting' },
    { label: 'Processing', className: 'border-status-processing/40 bg-status-processing/15 text-status-processing' },
    { label: 'Ready', className: 'border-status-ready/40 bg-status-ready/15 text-status-ready' },
    { label: 'Completed', className: 'border-status-completed/40 bg-status-completed/15 text-status-completed' },
    { label: 'Cancelled', className: 'border-status-cancelled/40 bg-status-cancelled/15 text-status-cancelled' },
  ]
  const rules = [
    ['User', 'waiting → cancelled  ·  ready → completed', 'may NOT cancel while the milk is steaming'],
    ['Owner', 'waiting/processing → cancelled  ·  waiting → processing  ·  processing → ready  ·  ready → completed', 'full control — validated again on the server'],
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <motion.div {...rise(0.2)} className="mt-7 flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <span key={chip.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${chip.className}`}>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
            {chip.label}
          </span>
        ))}
      </motion.div>

      <motion.div {...rise(0.32)} className="mt-6 text-2xl" aria-hidden="true">
        waiting <span className="text-caramel-deep">→</span> processing <span className="text-caramel-deep">→</span> ready <span className="text-caramel-deep">→</span> completed
      </motion.div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-espresso/12 dark:border-milk/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-espresso/5 text-[11px] uppercase tracking-widest dark:bg-milk/10">
            <tr>
              <th className="px-4 py-2.5">Who</th>
              <th className="px-4 py-2.5">May move</th>
              <th className="px-4 py-2.5">Rule nuance</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(([who, allow, note], i) => (
              <motion.tr
                key={who}
                {...rise(0.42 + i * 0.1)}
                className="border-t border-espresso/10 bg-white/60 dark:border-milk/10 dark:bg-espresso/60"
              >
                <td className="px-4 py-3 font-bold">{who}</td>
                <td className="px-4 py-3 font-mono text-xs leading-relaxed">{allow}</td>
                <td className="px-4 py-3 opacity-80">{note}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <motion.p {...rise(0.6)} className="mt-4 text-sm opacity-70">
        Illegal jumps return <code className="font-mono">409</code> — the transitions matrix lives in the server, not in the buttons.
      </motion.p>
    </div>
  )
}

/* ── 7 · Owner menu management ────────────────────────────────────────── */
function OwnerMenuSlide({ slide }) {
  const sources = [
    { name: 'Library', body: '12 photos bundled with the app — demo works fully offline' },
    { name: 'Upload', body: 'multer on the server · 5 MB · JPG/PNG/WebP only → /uploads/' },
    { name: 'URL', body: 'paste an external image link — validated to http(s):// server-side' },
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <motion.div {...rise(0.2)} className="mt-6 rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">PhotoField · 3 sources, one field</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {sources.map((s) => (
            <div key={s.name} className="rounded-xl border border-espresso/12 p-4 dark:border-milk/10">
              <p className="font-display text-lg">{s.name}</p>
              <p className="mt-1 text-xs leading-relaxed opacity-70">{s.body}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <motion.div {...rise(0.35)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-display text-xl">Soft-retire, not delete</p>
          <p className="mt-2 text-sm leading-relaxed opacity-80">
            <code className="font-mono">DELETE /api/menu/:id</code> only sets <code className="font-mono">retired: true</code>.
            Old orders keep their item snapshots — receipts never rot — and one click restores a retired item.
          </p>
        </motion.div>
        <motion.div {...rise(0.45)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-display text-xl">Edits are forward-only</p>
          <p className="mt-2 text-sm leading-relaxed opacity-80">
            A price change applies to <strong>new</strong> orders only. Placed orders carry the price they were sold at,
            because the server keeps its own records instead of trusting the browser.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ── 8 · Owner orders dashboard ───────────────────────────────────────── */
function OwnerOrdersSlide({ slide }) {
  const moves = [
    ['waiting', '→ processing (Accept) · → cancelled'],
    ['processing', '→ ready (Mark Ready) · → cancelled'],
    ['ready', '→ completed (Hand out)'],
    ['completed / cancelled', 'terminal — no buttons'],
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-7 grid items-start gap-5 md:grid-cols-[1fr,1.2fr]">
        <motion.div {...riseX(0.2)} className="rounded-2xl border border-caramel/40 bg-caramel/10 p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-espresso dark:text-caramel">One queue · 5s polling</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Active orders highlighted, finished ones dimmed</li>
            <li>Claim contacts shown <strong>server-decrypted</strong> — the owner must call you</li>
            <li>Every transition re-validated <em>inside</em> the API</li>
          </ul>
        </motion.div>

        <motion.div {...rise(0.32)} className="overflow-hidden rounded-2xl border border-espresso/12 dark:border-milk/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-espresso/5 text-[11px] uppercase tracking-widest dark:bg-milk/10">
              <tr>
                <th className="px-4 py-2.5">From</th>
                <th className="px-4 py-2.5">Owner may</th>
              </tr>
            </thead>
            <tbody>
              {moves.map(([from, action], i) => (
                <motion.tr
                  key={from}
                  {...rise(0.44 + i * 0.08)}
                  className="border-t border-espresso/10 bg-white/60 dark:border-milk/10 dark:bg-espresso/60"
                >
                  <td className="px-4 py-2.5 font-bold">{from}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">{action}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      <motion.p {...rise(0.72)} className="mt-5 text-sm opacity-70">
        The dashboard only <em>asks</em> — the state machine on the server <strong>decides</strong>.
      </motion.p>
    </div>
  )
}

/* ── 9 · What we protect ──────────────────────────────────────────────── */
function ProtectsSlide({ slide }) {
  const rows = [
    ['Password', 'bcrypt hash + salt', 'must never be recoverable — not even by us', 'green'],
    ['User name', 'AES-256-GCM ciphertext', 'must come back for claims — key held server-side', 'caramel'],
    ['Phone', 'AES-256-GCM ciphertext', 'call-backs need it — owner sees it decrypted', 'caramel'],
    ['Order contact (per order)', 'AES-256-GCM snapshot', 'every claim ticket carries its own encrypted copy', 'caramel'],
    ['Email', 'plaintext', 'login needs exact-match lookup + unique index — chosen, documented', 'blue'],
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-7 overflow-hidden rounded-2xl border border-espresso/12 dark:border-milk/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-espresso/5 text-[11px] uppercase tracking-widest dark:bg-milk/10">
            <tr>
              <th className="px-4 py-2.5">Data</th>
              <th className="px-4 py-2.5">Stored as</th>
              <th className="px-4 py-2.5">Why</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([data, how, why, tone], i) => (
              <motion.tr
                key={data}
                {...rise(0.22 + i * 0.07)}
                className="border-t border-espresso/10 bg-white/60 dark:border-milk/10 dark:bg-espresso/60"
              >
                <td className="px-4 py-3 font-semibold">{data}</td>
                <td className={`px-4 py-3 font-mono text-xs ${
                  tone === 'green' ? 'text-status-ready' : tone === 'caramel' ? 'text-caramel-deep dark:text-caramel' : 'text-status-processing'
                }`}>{how}</td>
                <td className="px-4 py-3 opacity-80">{why}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <motion.p {...rise(0.65)} className="mt-5 text-sm opacity-75">
        Design principle: protect <strong>per data type</strong> — not one giant padlock over everything.
      </motion.p>
    </div>
  )
}

/* ── 10 · Encrypted vs bcrypt vs plaintext ────────────────────────────── */
function TableSlide({ slide }) {
  const cols = [
    {
      title: 'AES-256-GCM',
      tone: 'caramel',
      headline: 'Data we must get BACK',
      lines: ['Reversible — with the key', 'Authenticated: tampering detected', 'Fresh IV every time', 'names · phones · claim snapshots'],
    },
    {
      title: 'bcrypt',
      tone: 'green',
      headline: 'Data we must NEVER get back',
      lines: ['One-way hash + per-user salt', 'Deliberately slow (brute-force tax)', 'Not encryptions — hashes', 'passwords only'],
    },
    {
      title: 'plaintext',
      tone: 'blue',
      headline: 'Data that is public by choice',
      lines: ['Exact-match login lookup', 'Indexable + unique constraints', 'Honest about the trade-off', 'email addresses'],
    },
  ]
  const toneClass = {
    caramel: 'text-caramel-deep dark:text-caramel',
    green: 'text-status-ready',
    blue: 'text-status-processing',
  }
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cols.map((col, i) => (
          <motion.div
            key={col.title}
            {...rise(0.2 + i * 0.12)}
            className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60"
          >
            <p className={`font-mono text-base font-bold ${toneClass[col.tone]}`}>{col.title}</p>
            <p className="mt-1 font-display text-lg leading-snug">{col.headline}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.lines.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                  <span className="opacity-85">{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.p {...rise(0.55)} className="mt-6 rounded-xl bg-espresso/5 px-5 py-3 text-center text-sm dark:bg-milk/10">
        Every column is a <strong>documented decision</strong> — and the code agrees with the slides.
      </motion.p>
    </div>
  )
}

/* ── 11 · Keys & limitations ──────────────────────────────────────────── */
function KeysSlide({ slide }) {
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-7 grid items-start gap-5 md:grid-cols-[1.1fr,1fr]">
        <motion.div {...riseX(0.2)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">server/.env — the only home of the key</p>
          <div className="mt-3 space-y-2 font-mono text-xs">
            <p className="rounded-lg bg-espresso/80 px-3 py-2.5 text-milk dark:bg-espresso/70">
              AES_KEY=<span className="text-status-waiting">4f2a9b…(64 hex chars)</span><span className="opacity-60"> // private</span>
            </p>
            <p className="rounded-lg bg-espresso/80 px-3 py-2.5 text-milk dark:bg-espresso/70">
              JWT_SECRET=<span className="text-status-waiting">b1f7…(private)</span>
            </p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>.env is <strong>gitignored</strong> — never in history, never in the client bundle</li>
            <li>Payloads are versioned (<code className="font-mono">v1.</code>) so a future key rotation is a planned upgrade</li>
          </ul>
        </motion.div>

        <motion.div {...rise(0.35)} className="rounded-2xl border border-status-cancelled/40 bg-status-cancelled/10 p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-status-cancelled">Honest limitations — said out loud</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed">
            <li>Single school-scale node: key is on one laptop — <strong>lost key = data stays v1-locked</strong></li>
            <li>safeDecrypt surfaces <code className="font-mono text-xs">“[unreadable — wrong key or tampered]”</code>, never fake data</li>
            <li>JWT repo keeps the demo simple; rotating secrets is manual</li>
          </ul>
          <p className="mt-4 text-xs opacity-75">
            A real café would add KMS-managed keys, automated rotation and off-site backups. Named here so the instructor knows we know.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ── 12 · Meet the file ───────────────────────────────────────────────── */
function MeetSlide() {
  const bullets = [
    ['encrypt(text, key)', '→ "v1.<ivB64>.<tagB64>.<cipherB64>" — fresh 12-byte IV every call'],
    ['decrypt(text, key)', '→ original plaintext — or THROWS (never returns garbage)'],
    ['algorithm: frozen', 'AES-256-GCM is hardcoded — callers cannot downgrade it'],
    ['one gatekeeper', 'nothing else in the project is allowed to encrypt or decrypt'],
  ]
  return (
    <div className="grid items-center gap-8 md:grid-cols-[auto,1fr]">
      <motion.div {...rise(0.1)} className="flex justify-center text-caramel-deep dark:text-caramel">
        <LockSketch size={140} />
      </motion.div>
      <div>
        <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">Meet the file</motion.h2>
        <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
          One module. Two functions. The entire data-security policy.
        </motion.p>
        <motion.p {...rise(0.16)} className="mt-2 font-mono text-sm text-caramel-deep dark:text-caramel">
          server/src/utils/aescrypt.js
        </motion.p>
        <ul className="mt-5 space-y-3">
          {bullets.map(([sig, body], i) => (
            <motion.li key={sig} {...riseX(0.28 + i * 0.09)} className="text-sm leading-relaxed">
              <span className="font-mono font-bold text-caramel-deep dark:text-caramel">{sig}</span>
              <span className="opacity-80"> — {body}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ── 13 · The REAL code ───────────────────────────────────────────────── */
function CodeSlide() {
  return (
    <div className="min-h-0 flex-1">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <motion.h2 {...rise()} className="font-display text-3xl sm:text-4xl">The REAL code</motion.h2>
        <motion.p {...rise(0.1)} className="text-sm opacity-70">
          bundled via <code className="font-mono">aescrypt.js?raw</code> — no copy, no drift
        </motion.p>
      </div>
      <motion.div {...rise(0.18)} className="mt-4">
        <CodeWindow maxHeight="46vh" />
      </motion.div>
    </div>
  )
}

/* ── 14 · The playground ──────────────────────────────────────────────── */
function PlaygroundSlide() {
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-3xl sm:text-4xl">Live: encrypt · decrypt · tamper</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
        Real endpoints, real crypto: <code className="font-mono">POST /api/security/demo-encrypt</code> · <code className="font-mono">demo-decrypt</code> — the key never leaves the server.
      </motion.p>
      <motion.div {...rise(0.2)} className="mt-6">
        <EncryptPlayground />
      </motion.div>
    </div>
  )
}

/* ── 15 · The Team ────────────────────────────────────────────────────── */
function TeamSlide({ slide }) {
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <motion.div {...rise(0.2)} className="rounded-2xl border border-caramel/50 bg-caramel/10 p-6 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-espresso font-display text-3xl text-milk dark:bg-milk dark:text-espresso">
            UV
          </span>
          <p className="mt-4 font-display text-2xl">Uelmark G. Valdehueza</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-caramel-deep dark:text-caramel">
            AzeuMark
          </p>
          <ul className="mt-4 space-y-1.5 text-sm opacity-85">
            <li>Full-stack: React · Express · MongoDB</li>
            <li>Security design & the AESCrypt module</li>
            <li>Order state machine · owner dashboards · this deck</li>
          </ul>
        </motion.div>

        <motion.div
          {...rise(0.35)}
          className="rounded-2xl border-2 border-dashed border-espresso/25 bg-transparent p-6 text-center dark:border-milk/25"
        >
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border-2 border-dashed border-espresso/25 font-mono text-2xl opacity-50 dark:border-milk/25">
            ?
          </span>
          <p className="mt-4 font-display text-2xl opacity-70">Team member slot</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] opacity-55">
            reserved · name & role to be added
          </p>
          <p className="mx-auto mt-4 max-w-xs text-sm opacity-70">
            Placeholder intentionally kept — the final deck credits both builders of AzeuCafe.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ── 16 · Thank you ───────────────────────────────────────────────────── */
function ThanksSlide() {
  const recap = [
    'Cash-at-counter café ordering: two roles, five-order state machine, claim codes',
    'Passwords → bcrypt (one-way, salted) · names/phones/contacts → AES-256-GCM',
    'The key never pages; payloads are versioned; safeDecrypt never lies',
    'The code you watched run is the code in this repository',
  ]
  return (
    <div className="relative flex min-h-[55vh] flex-col items-center justify-center text-center">
      <motion.h2 {...rise()} className="font-display text-5xl sm:text-6xl">Thank you.</motion.h2>
      <motion.p {...rise(0.12)} className="mt-3 font-display text-2xl text-caramel-deep dark:text-caramel">
        Questions? / Q&A
      </motion.p>

      <motion.ul {...rise(0.28)} className="mt-7 max-w-2xl space-y-2 text-left text-sm leading-relaxed">
        {recap.map((line) => (
          <li key={line} className="flex gap-3">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caramel-deep dark:bg-caramel" />
            <span className="opacity-85">{line}</span>
          </li>
        ))}
      </motion.ul>

      <motion.div {...rise(0.45)} className="mt-9 flex flex-col items-center gap-1">
        <span className="font-mono text-xs uppercase tracking-[0.35em] text-caramel-deep dark:text-caramel">
          AzeuMark · 2026
        </span>
        <span className="text-sm opacity-70">Uelmark G. Valdehueza — and the reserved seat beside him.</span>
      </motion.div>
    </div>
  )
}

function MissingVisual() {
  return <p className="text-lg opacity-70">This slide is missing its visual.</p>
}

const CONTENT = {
  title: TitleSlide,
  roles: RolesSlide,
  auth: AuthSlide,
  menu: MenuSlide,
  checkout: CheckoutSlide,
  statuses: StatusesSlide,
  ownerMenu: OwnerMenuSlide,
  ownerOrders: OwnerOrdersSlide,
  protects: ProtectsSlide,
  table: TableSlide,
  keys: KeysSlide,
  meet: MeetSlide,
  code: CodeSlide,
  playground: PlaygroundSlide,
  team: TeamSlide,
  thanks: ThanksSlide,
}

export default function SlideContent({ slide }) {
  const Content = CONTENT[slide.content] ?? MissingVisual
  return <Content slide={slide} />
}
