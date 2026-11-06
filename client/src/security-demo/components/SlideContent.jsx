import { motion } from 'framer-motion'
import LockSketch from './LockSketch.jsx'
import EncryptPlayground from './EncryptPlayground.jsx'

/**
 * SlideContent — the visual of each of the 16 slides, keyed by `slide.content`
 * (data lives in data/slides.js). Every visual speaks USER language: screens,
 * claim codes, statuses — and plain-words protection. No engineering visuals.
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

      <motion.h1 {...rise(0.15)} className="mt-5 font-display text-7xl leading-none tracking-tight sm:text-8xl">
        AzeuCafe
      </motion.h1>

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
          aka AzeuMark
        </span>
      </motion.div>

      <motion.p {...rise(0.75)} className="mt-10 font-mono text-[11px] opacity-50">
        16 slides · 2 acts ≈ 6 minutes · speaker script hidden (press S)
      </motion.p>
    </div>
  )
}

/* ── 2 · What is AzeuCafe ─────────────────────────────────────────────── */
function IntroSlide({ slide }) {
  const sides = [
    {
      title: 'You — the customer',
      tag: 'one screen',
      lines: ['Browse the menu with photos & peso prices', 'Build your cart · check out in seconds', 'Get a claim code (AZ-000X) · track your order'],
    },
    {
      title: 'The café owner',
      tag: 'behind the counter',
      lines: ['Runs the menu: add, edit, retire sold-out items', 'Sees new orders appear live within seconds', 'Accepts → makes → hands out your order'],
    },
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {sides.map((side, i) => (
          <motion.div
            key={side.title}
            {...rise(0.2 + i * 0.12)}
            className="rounded-2xl border border-espresso/12 bg-white/60 p-6 dark:border-milk/10 dark:bg-espresso/60"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-3xl">{side.title}</h3>
              <span className="font-mono text-[11px] uppercase tracking-widest opacity-55">{side.tag}</span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {side.lines.map((line) => (
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
          No cards, no wallets, no saved payment methods — your money stays yours until your cup is in your hand.
        </p>
      </motion.div>
    </div>
  )
}

/* ── 3 · Create your account ──────────────────────────────────────────── */
function StartSlide({ slide }) {
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">{slide.title}</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">{slide.subtitle}</motion.p>

      <div className="mt-8 grid items-start gap-5 md:grid-cols-2">
        <motion.div {...riseX(0.2)} className="rounded-2xl border border-espresso/12 bg-white/60 p-6 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">The sign-up modal</p>
          <div className="mt-4 space-y-2.5 font-mono text-xs">
            <p className="rounded-lg bg-espresso/5 px-3 py-2.5 dark:bg-milk/10">name · <em>Juan Dela Cruz</em></p>
            <p className="rounded-lg bg-espresso/5 px-3 py-2.5 dark:bg-milk/10">email · <em>juan@cafe.ph</em></p>
            <p className="rounded-lg bg-espresso/5 px-3 py-2.5 dark:bg-milk/10">password · <em>••••••••</em></p>
          </div>
          <p className="mt-4 text-center text-sm opacity-70">…and you are done. No phone codes, no hoops.</p>
        </motion.div>

        <motion.div {...rise(0.35)} className="rounded-2xl border border-espresso/12 bg-white/60 p-6 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-display text-2xl">What you get</p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed">
            <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caramel-deep dark:bg-caramel" />Every order saved to <strong>your</strong> history</li>
            <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caramel-deep dark:bg-caramel" />Log in later — <strong>any device</strong>, everything is still there</li>
            <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caramel-deep dark:bg-caramel" />One promise, kept: your password is stored <strong>unreadable</strong> — the login can check it, nobody can read it</li>
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

      <div className="mt-8 grid items-start gap-5 md:grid-cols-[2fr_1fr]">
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
            …9 more items across espresso · iced · pastries · snacks — served from the café itself.
          </motion.p>
        </div>

        <motion.div {...riseX(0.35)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">Your cart · like a tray</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span>Cappuccino <span className="font-mono opacity-60">× 1</span></span><span className="font-mono">− 1 +</span></li>
            <li className="flex justify-between"><span>Butter Croissant <span className="font-mono opacity-60">× 2</span></span><span className="font-mono">− 2 +</span></li>
          </ul>
          <ul className="mt-4 space-y-2 text-xs opacity-75">
            <li>· change quantities freely — it is coffee, not a contract</li>
            <li>· cart waits for you if you close the site</li>
            <li>· the total you see is the total you pay</li>
          </ul>
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
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">Checkout · asks for 2 things only</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><strong>Claim name</strong> — you, or a friend claiming for you</li>
            <li><strong>Phone</strong> — so the café can reach you if needed</li>
            <li><strong>Note for the barista</strong> — “less sugar please”</li>
          </ul>
          <p className="mt-4 text-sm opacity-75">
            The summary shows the final total — the same amount waiting for you at the cash register.
          </p>
        </motion.div>

        <motion.div {...rise(0.35)} className="rounded-2xl border border-espresso/12 bg-white/60 p-6 text-center dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-55">Your claim code appears</p>
          <p className="mt-2 font-mono text-6xl font-bold tracking-widest">AZ-0001</p>
          <p className="mt-3 text-sm opacity-70">
            Your receipt and your ticket — read it at the counter, or hand it to a friend to claim your order.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ── 6 · Pay cash ─────────────────────────────────────────────────────── */
function CashSlide() {
  const steps = [
    ['1', 'Walk to the counter with your code', 'AZ-0001 — read it, show it, no app to open at the register'],
    ['2', 'The cashier finds your order', 'Items, total and your note already listed on their screen'],
    ['3', 'Pay in pesos — done', 'Cash only: no fees, no saved cards, nothing to charge later'],
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">Pay cash at the counter</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
        The system prepares your order — you pay the way people always pay.
      </motion.p>

      <ol className="mt-8 space-y-4">
        {steps.map(([n, title, body], i) => (
          <motion.li
            key={n}
            {...riseX(0.2 + i * 0.12)}
            className="flex items-start gap-4 rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-espresso font-mono text-lg font-bold text-milk dark:bg-milk dark:text-espresso">{n}</span>
            <div>
              <h3 className="font-display text-xl">{title}</h3>
              <p className="mt-1 text-sm opacity-75">{body}</p>
            </div>
          </motion.li>
        ))}
      </ol>

      <motion.p {...rise(0.6)} className="mt-6 rounded-2xl border border-caramel/40 bg-caramel/10 px-6 py-4 text-center font-display text-2xl">
        Cash only — so the system never holds anything worth stealing about your money.
      </motion.p>
    </div>
  )
}

/* ── 7 · Track & rules ────────────────────────────────────────────────── */
function TrackSlide() {
  const chips = [
    { label: 'Waiting', className: 'border-status-waiting/40 bg-status-waiting/15 text-status-waiting', note: 'you may cancel free' },
    { label: 'Processing', className: 'border-status-processing/40 bg-status-processing/15 text-status-processing', note: 'being made now' },
    { label: 'Ready', className: 'border-status-ready/40 bg-status-ready/15 text-status-ready', note: 'claim it — tap “mark completed”' },
    { label: 'Completed', className: 'border-status-completed/40 bg-status-completed/15 text-status-completed', note: 'enjoyed · closed' },
    { label: 'Cancelled', className: 'border-status-cancelled/40 bg-status-cancelled/15 text-status-cancelled', note: 'agreed by a side' },
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">Track your order — and know the rules</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
        My Orders shows every order live — this line, and the story: what happened, when, and what you can do.
      </motion.p>

      <motion.ul {...rise(0.2)} className="mt-7 space-y-2.5">
        {chips.map((chip) => (
          <li key={chip.label} className="flex flex-wrap items-center gap-3 rounded-xl border border-espresso/10 bg-white/60 px-4 py-2.5 dark:border-milk/10 dark:bg-espresso/60">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${chip.className}`}>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
              {chip.label}
            </span>
            <span className="text-sm opacity-80">{chip.note}</span>
          </li>
        ))}
      </motion.ul>

      <motion.p {...rise(0.55)} className="mt-6 rounded-xl bg-espresso/5 px-5 py-3 text-center text-sm dark:bg-milk/10">
        Cancel freely while <strong>Waiting</strong> — once <strong>Processing</strong>, the milk is already steaming: talk to the counter.
      </motion.p>
    </div>
  )
}

/* ── 8 · Owner · menu room ────────────────────────────────────────────── */
function OwnerMenuSlide() {
  const photos = [
    ['Gallery', 'pick a ready-made photo from a bundled set'],
    ['Upload', 'take a new photo with the item\'s file'],
    ['Link', 'paste an image address'],
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">Behind the counter: the menu room</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
        The café shapes what customers see — and old receipts never change.
      </motion.p>

      <motion.div {...rise(0.2)} className="mt-6 rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">Item form · name, price, description & a picture — 3 convenient options</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {photos.map(([name, body]) => (
            <div key={name} className="rounded-xl border border-espresso/12 p-4 dark:border-milk/10">
              <p className="font-display text-lg">{name}</p>
              <p className="mt-1 text-xs leading-relaxed opacity-70">{body}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <motion.div {...rise(0.35)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-display text-xl">Edit any time</p>
          <p className="mt-2 text-sm leading-relaxed opacity-80">
            Prices, descriptions, photos — the café tunes its board every day, and you always see the freshest version.
          </p>
        </motion.div>
        <motion.div {...rise(0.45)} className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
          <p className="font-display text-xl">Retire, never delete</p>
          <p className="mt-2 text-sm leading-relaxed opacity-80">
            Sold out? The item leaves the menu board but stays honest in history: old orders keep exactly what they bought.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ── 9 · Owner · live queue ───────────────────────────────────────────── */
function QueueSlide() {
  const moves = [
    ['New order lands', 'highlighted card: what to make · claim name · any note'],
    ['Accept', 'the café starts making it — the customer sees “Processing”'],
    ['Ready', 'drink is finished · the “ready” banner is on the customer phone'],
    ['Hand out', 'code verified at the counter · order closed'],
    ['Cancel', 'only for agreed cases — the café may call the claim phone'],
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">Behind the counter: the live queue</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
        Updates every few seconds — the customer sees each change on their own page automatically.
      </motion.p>

      <div className="mt-7 overflow-hidden rounded-2xl border border-espresso/12 dark:border-milk/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-espresso/5 text-[11px] uppercase tracking-widest dark:bg-milk/10">
            <tr>
              <th className="px-4 py-2.5">Step</th>
              <th className="px-4 py-2.5">What happens</th>
            </tr>
          </thead>
          <tbody>
            {moves.map(([step, body], i) => (
              <motion.tr
                key={step}
                {...rise(0.25 + i * 0.08)}
                className="border-t border-espresso/10 bg-white/60 dark:border-milk/10 dark:bg-espresso/60"
              >
                <td className="px-4 py-3 font-display text-lg">{step}</td>
                <td className="px-4 py-3 opacity-85">{body}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.p {...rise(0.7)} className="mt-5 text-sm opacity-70">
        One glance, the whole café: who to call, what to make, what is ready — nothing slips.
      </motion.p>
    </div>
  )
}

/* ── 10 · What we keep ────────────────────────────────────────────────── */
function ProtectsSlide() {
  const rows = [
    ['Name', 'served at the counter — right cup, right hands'],
    ['Phone', 'reach you if the café has a question'],
    ['Order note', 'so it comes out the way you asked'],
    ['Email', 'the way back into your account'],
    ['Password', 'needed for login — gone unreadable'],
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">What we keep — and why</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
        Protection starts with restraint: only what the café truly needs. Nothing else, period.
      </motion.p>

      <div className="mt-7 overflow-hidden rounded-2xl border border-espresso/12 dark:border-milk/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-espresso/5 text-[11px] uppercase tracking-widest dark:bg-milk/10">
            <tr>
              <th className="px-4 py-2.5">Kept</th>
              <th className="px-4 py-2.5">Why it exists</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([what, why], i) => (
              <motion.tr
                key={what}
                {...rise(0.22 + i * 0.07)}
                className="border-t border-espresso/10 bg-white/60 dark:border-milk/10 dark:bg-espresso/60"
              >
                <td className="px-4 py-3 font-semibold">{what}</td>
                <td className="px-4 py-3 opacity-85">{why}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.div {...rise(0.65)} className="mt-6 rounded-2xl border border-caramel/40 bg-caramel/10 px-6 py-4 text-center">
        <p className="text-sm leading-relaxed">
          No address · no birthday · no ID · <strong>zero card or wallet data</strong> — cash at the counter means the system never touches money at all.
        </p>
        <p className="mt-1 text-xs opacity-70">Data you never give out is data nobody can steal. What you DO give — protected from here on.</p>
      </motion.div>
    </div>
  )
}

/* ── 11 · Your data in a vault ────────────────────────────────────────── */
function CipherSlide() {
  const steps = [
    ['You place an order', 'name & phone typed once, like always'],
    ['Locked immediately', 'saved as gibberish — random letters and numbers'],
    ['Opened only for serving', 'the café reads them only to call you, then locks again'],
    ['No key = no peeking', 'a stolen copy of records is just a pile of locked boxes'],
  ]
  return (
    <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
      <motion.div {...rise(0.1)} className="flex justify-center text-caramel-deep dark:text-caramel">
        <LockSketch size={140} />
      </motion.div>
      <div>
        <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">Your name and phone go in a vault</motion.h2>
        <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
          The records never show “Juan Dela Cruz” — they show unreadable scramble.
        </motion.p>
        <ol className="mt-5 space-y-3">
          {steps.map(([title, body], i) => (
            <motion.li key={title} {...riseX(0.25 + i * 0.09)} className="text-sm leading-relaxed">
              <span className="font-display text-lg">{title}</span>
              <span className="opacity-80"> — {body}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ── 12 · Live playground ─────────────────────────────────────────────── */
function PlaygroundSlide() {
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-3xl sm:text-4xl">Watch it work — with your own words</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
        The same protection your orders get every day — live. Encrypt scrambles; decrypt unscrambles; corrupt one letter and it refuses.
      </motion.p>
      <motion.div {...rise(0.2)} className="mt-6">
        <EncryptPlayground />
      </motion.div>
    </div>
  )
}

/* ── 13 · Passwords ───────────────────────────────────────────────────── */
function PasswordsSlide() {
  const cards = [
    ['Not readable', 'the system keeps a fingerprint — never the word itself'],
    ['Not reversible', 'like un-baking a cookie: sharing “what was typed” is not possible'],
    ['Not shared', 'staff cannot reveal it; a leak shows fingerprints, not passwords'],
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">Your password: unreadable, even to us</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
        Login can ask “match or no match” — it can never “read it back”.
      </motion.p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map(([title, body], i) => (
          <motion.div
            key={title}
            {...rise(0.2 + i * 0.12)}
            className="rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60"
          >
            <p className="font-display text-2xl">{title}</p>
            <p className="mt-2 text-sm leading-relaxed opacity-80">{body}</p>
          </motion.div>
        ))}
      </div>

      <motion.div {...rise(0.55)} className="mt-6 rounded-2xl border border-espresso/12 bg-white/60 p-5 dark:border-milk/10 dark:bg-espresso/60">
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-caramel-deep dark:text-caramel">How login works</p>
        <p className="mt-2 text-sm leading-relaxed opacity-85">
          The fingerprint of what you type is compared with the one on file — <strong>match</strong> welcomes you,
          <strong> no match</strong> says so — without anyone ever seeing the actual password.
        </p>
      </motion.div>
    </div>
  )
}

/* ── 14 · Who sees what ───────────────────────────────────────────────── */
function WhoSlide() {
  const rows = [
    ['You', 'your own orders: items, notes, totals, history — nothing of anyone else\'s'],
    ['The café', 'claim details of orders it is serving — name & phone to finish serving you well'],
    ['Everyone else', 'the menu: photos, prices, descriptions — zero personal data anywhere'],
  ]
  return (
    <div>
      <motion.h2 {...rise()} className="font-display text-4xl sm:text-5xl">Who sees what — exactly</motion.h2>
      <motion.p {...rise(0.08)} className="mt-2 text-lg opacity-75">
        Personal data appears only where it must — never one screen wider.
      </motion.p>

      <div className="mt-7 overflow-hidden rounded-2xl border border-espresso/12 dark:border-milk/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-espresso/5 text-[11px] uppercase tracking-widest dark:bg-milk/10">
            <tr>
              <th className="px-4 py-2.5">Who</th>
              <th className="px-4 py-2.5">Sees</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([who, sees], i) => (
              <motion.tr
                key={who}
                {...rise(0.24 + i * 0.09)}
                className="border-t border-espresso/10 bg-white/60 dark:border-milk/10 dark:bg-espresso/60"
              >
                <td className="px-4 py-3 font-display text-xl whitespace-nowrap">{who}</td>
                <td className="px-4 py-3 opacity-85">{sees}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.p {...rise(0.6)} className="mt-6 rounded-xl bg-espresso/5 px-5 py-3 text-center text-sm dark:bg-milk/10">
        At the counter they ask for your <strong>claim code</strong> — not your life story. Even a friend can claim your order.
      </motion.p>
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
            <li>Built AzeuCafe from first sketch to finished product</li>
            <li>Customer experience · owner counter · the protections</li>
            <li>This presentation</li>
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
            A seat kept warm — the final deck credits both builders of AzeuCafe.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ── 16 · Thank you ───────────────────────────────────────────────────── */
function ThanksSlide() {
  const recap = [
    ['Use it', 'menu → cart → claim code (AZ-000X) → cash at counter → track on My Orders'],
    ['Rules you now know', 'cancel freely while Waiting · tap “mark completed” when Ready · Processing = talk to the counter'],
    ['Trust it', 'only needed data kept · zero payment data (cash) · vault-locked name & phone · unreadable password'],
    ['The promise', 'every screen shows each person exactly what they need — nothing wider'],
  ]
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <motion.h2 {...rise()} className="font-display text-5xl sm:text-6xl">Thank you.</motion.h2>
      <motion.p {...rise(0.12)} className="mt-3 font-display text-2xl text-caramel-deep dark:text-caramel">
        Order ahead · pay cash · your data stays yours.
      </motion.p>

      <motion.ul {...rise(0.28)} className="mt-7 max-w-2xl space-y-2 text-left text-sm leading-relaxed">
        {recap.map(([k, v]) => (
          <li key={k} className="flex gap-3">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caramel-deep dark:bg-caramel" />
            <span className="opacity-85"><strong>{k}:</strong> {v}</span>
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

const CONTENT = {
  title: TitleSlide,
  intro: IntroSlide,
  start: StartSlide,
  menu: MenuSlide,
  checkout: CheckoutSlide,
  cash: CashSlide,
  track: TrackSlide,
  ownerMenu: OwnerMenuSlide,
  queue: QueueSlide,
  protects: ProtectsSlide,
  cipher: CipherSlide,
  playground: PlaygroundSlide,
  passwords: PasswordsSlide,
  who: WhoSlide,
  team: TeamSlide,
  thanks: ThanksSlide,
}

function MissingVisual() {
  return <p className="text-lg opacity-70">This slide is missing its visual.</p>
}

export default function SlideContent({ slide }) {
  const Content = CONTENT[slide.content] ?? MissingVisual
  return <Content slide={slide} />
}
