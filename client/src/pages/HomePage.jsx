import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { get } from '../api/client.js'
import { peso } from '../utils/format.js'
import MenuItemPhoto from '../components/MenuItemPhoto.jsx'
import heroImg from '../assets/landing-hero.jpg'
import interiorImg from '../assets/landing-interior.jpg'

/*
 * AzeuCafe landing — Warm Espresso Café, editorial layout.
 * Anti-slop rules kept: no gradient icon cards, no emoji soup, real copy,
 * asymmetric sections, one dark hero → light body → dark story rhythm.
 */

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

const HOW_STEPS = [
  {
    title: 'Browse the menu',
    body: 'Photos, prices, no surprises. Everything you see is what the kitchen actually makes that day.',
  },
  {
    title: 'Place your order',
    body: 'Drop items into your cart, confirm your details, and an order code appears — your claim ticket.',
  },
  {
    title: 'Pay cash & take it away',
    body: 'Read your code at the cashier, settle the bill in pesos, and take your seat. Standing orders ready in minutes.',
  },
]

const HOURS = [
  ['Monday – Friday', '08:00 – 21:00'],
  ['Saturday', '09:00 – 22:00'],
  ['Sunday', '09:00 – 20:00'],
]

/** Menu teaser favorites: preferred items first, then whatever the seed gives us. */
const PREFFERED_TEASER = ['Cappuccino', 'Butter Croissant', 'Clubhouse Sandwich']

export default function HomePage() {
  const [teaserItems, setTeaserItems] = useState([])

  useEffect(() => {
    let alive = true
    get('/menu')
      .then(({ items }) => {
        if (!alive) return
        const preferred = PREFFERED_TEASER.map((name) =>
          items.find((it) => it.name === name),
        ).filter(Boolean)
        const rest = items.filter((it) => !preferred.includes(it))
        setTeaserItems([...preferred, ...rest].slice(0, 3))
      })
      .catch(() => {
        /* teaser stays empty — landing still works */
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <>
      {/* ── Hero — moody espresso bar ─────────────────────────────── */}
      <section className="relative isolate flex min-h-[92vh] flex-col overflow-hidden bg-espresso text-milk">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-espresso/85 via-espresso/55 to-espresso/90"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-16 pt-32">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-caramel"
          >
            <span aria-hidden="true" className="h-px w-8 bg-caramel/70" />
            Open daily 8:00–21:00 · Cash at the counter
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.12 }}
            className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] sm:text-7xl"
          >
            Coffee worth{' '}
            <em className="italic text-caramel">slowing down</em> for.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.24 }}
            className="mt-6 max-w-xl leading-relaxed text-milk/85"
          >
            Browse the counter from anywhere in the room — or outside it. Place
            your order, pay cash at the cashier, and your cup is waiting by the
            time you arrive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.36 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/menu"
              className="rounded-full bg-caramel px-7 py-3 text-sm font-semibold text-espresso transition hover:bg-caramel-deep hover:text-milk"
            >
              See what's brewing
            </Link>
            <a
              href="#how"
              className="rounded-full border border-milk/30 px-7 py-3 text-sm font-semibold text-milk/90 transition hover:border-caramel hover:text-caramel"
            >
              How ordering works
            </a>
          </motion.div>
        </div>

        <div className="relative border-t border-milk/15 bg-espresso/50 backdrop-blur">
          <div className="mx-auto grid max-w-6xl gap-2 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-milk/75 sm:grid-cols-3">
            <span>Cash payments — no apps needed</span>
            <span className="sm:text-center">Every checkout AES-encrypted</span>
            <span className="sm:text-right">Order codes at the cashier</span>
          </div>
        </div>
      </section>

      {/* ── How it works — editorial numbered list ────────────────── */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,320px),1fr]">
          <motion.div {...rise()}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
              How it works
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight">
              From craving to cup, in three moves.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-bean/70 dark:text-milk/70">
              No apps to install, no account gymnastics. Just a menu, an order
              code, and the cashier.
            </p>
          </motion.div>

          <ol className="border-y border-espresso/10 dark:border-milk/10">
            {HOW_STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                {...rise(index * 0.08)}
                className="grid items-baseline gap-2 border-b border-espresso/10 py-6 last:border-b-0 sm:grid-cols-[64px,1fr] dark:border-milk/10"
              >
                <span className="font-mono text-sm text-caramel-deep">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-xl">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-bean/70 dark:text-milk/70">
                    {step.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Story — café interior + privacy note ──────────────────── */}
      <section className="bg-espresso py-24 text-milk">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <motion.div {...rise()} className="relative">
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl border border-caramel/40"
            />
            <img
              src={interiorImg}
              alt="Inside the AzeuCafe café — warm lights, wooden counter"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl"
            />
          </motion.div>

          <div>
            <motion.p {...rise(0.05)} className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel">
              The café
            </motion.p>
            <motion.h2 {...rise(0.1)} className="mt-3 font-display text-4xl leading-tight">
              A small counter with a strict idea of quality.
            </motion.h2>
            <motion.div {...rise(0.16)} className="mt-5 space-y-4 leading-relaxed text-milk/80">
              <p>
                AzeuCafe started as a corner counter with one rule: nothing
                leaves the machine that we wouldn't drink ourselves. Beans are
                pulled dark, milk is steamed to order, and the pastry case is
                frank about what it sold out of.
              </p>
              <p>
                Ordering online doesn't change that — it just means the line
                you skip is a line you never had to join.
              </p>
            </motion.div>

            <motion.div {...rise(0.22)} className="mt-8 rounded-2xl border border-milk/15 bg-roast p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel">
                A word on privacy
              </p>
              <p className="mt-2 text-sm leading-relaxed text-milk/80">
                Your name and phone number are encrypted with AES-256-GCM
                before they touch our database — ciphertext in storage,
                plaintext only in your own session. The full technical
                walkthrough, code and all, lives in our security presentation.
              </p>
              <Link
                to="/demo"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-caramel hover:underline"
              >
                See how we protect you
                <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Menu teaser — live items from the API ─────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <motion.div {...rise()}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
              On the counter
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight">Fresh off the machine</h2>
          </motion.div>
          <motion.div {...rise(0.08)}>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-espresso/20 px-5 py-2.5 text-sm font-semibold transition hover:border-caramel-deep hover:text-caramel-deep dark:border-milk/20"
            >
              Full menu
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        <ul className="mt-8 border-y border-espresso/10 dark:border-milk/10">
          {teaserItems.length === 0 && (
            <li className="py-6 text-sm text-bean/60 dark:text-milk/60">
              The counter is being stocked — check back shortly.
            </li>
          )}
          {teaserItems.map((item, index) => (
            <motion.li
              key={item.id}
              {...rise(index * 0.06)}
              className="grid items-center gap-4 border-b border-espresso/10 py-5 last:border-b-0 sm:grid-cols-[56px,1fr,auto] dark:border-milk/10"
            >
              <MenuItemPhoto
                name={item.name}
                image={item.image}
                className="h-14 w-14 shrink-0 rounded-xl"
              />
              <div>
                <h3 className="font-display text-lg">{item.name}</h3>
                <p className="mt-0.5 text-sm text-bean/60 dark:text-milk/60">{item.description}</p>
              </div>
              <span className="font-mono text-sm text-caramel-deep">{peso(item.price)}</span>
            </motion.li>
          ))}
        </ul>

        <motion.p {...rise(0.1)} className="mt-4 text-xs text-bean/50 dark:text-milk/50">
          Hand-crafted espresso drinks, iced favorites, and freshly baked pastries — ready to order ahead.
        </motion.p>
      </section>

      {/* ── Hours & location ──────────────────────────────────────── */}
      <section className="border-y border-espresso/10 bg-foam dark:border-milk/10 dark:bg-roast">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 md:grid-cols-2">
          <div>
            <motion.div {...rise()}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
                Hours &amp; location
              </p>
              <h2 className="mt-3 font-display text-4xl leading-tight">
                Beat the morning rush.
              </h2>
            </motion.div>
            <motion.dl {...rise(0.08)} className="mt-8 space-y-3 text-sm">
              {HOURS.map(([label, time]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between border-b border-espresso/10 pb-3 dark:border-milk/10"
                >
                  <dt className="text-bean/70 dark:text-milk/70">{label}</dt>
                  <dd className="font-mono">{time}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div {...rise(0.12)}>
            <h3 className="font-display text-2xl">The counter</h3>
            <p className="mt-4 leading-relaxed text-bean/75 dark:text-milk/75">
              Ground floor, right beside the pastry case — the cashier on one
              side, the pickup shelf on the other. Order codes are checked at
              the cashier, so have yours ready.
            </p>
            <p className="mt-4 text-sm text-bean/70 dark:text-milk/70">
              Barangay Café District, Davao City
            </p>
            <p className="mt-6 rounded-xl border border-caramel/30 bg-caramel/10 p-4 text-sm">
              Payments are <strong>cash at the counter</strong> — the system
              tracks and prepares your order; your wallet stays where it
              belongs until the cup does.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
