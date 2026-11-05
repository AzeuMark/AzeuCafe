import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ACT_META, slides } from '../data/slides.js'
import SlideContent from './SlideContent.jsx'
import PresenterNotes from './PresenterNotes.jsx'

/**
 * SlideDeck — the engine of the security presentation.
 *  keyboard: ← → ↑ ↓ / Space / PageUp / PageDown navigate · Home / End jump ·
 *            S toggles the script drawer · F toggles deck-only fullscreen
 *  pointer: swipe, clickable progress dots, prev/next, fullscreen button
 * Every transition is direction-aware; the drawer is hidden by default.
 */

const variants = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 64 : -64, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -64 : 64, scale: 0.985 }),
}

function CupMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <rect x="2" y="2" width="44" height="44" rx="10" fill="var(--color-caramel)" />
      <path d="M14 21h18v6.5a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7z" fill="#1A120C" />
      <path d="M32 23h3a4.5 4.5 0 0 1 0 9H29" fill="none" stroke="#1A120C" strokeWidth="3" strokeLinecap="round" />
      <path d="M19 16q2-2.5.5-5.5" fill="none" stroke="#1A120C" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 16q2-2.5.5-5.5" fill="none" stroke="#1A120C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

function CompressIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

export default function SlideDeck() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const deckRef = useRef(null)
  const [fullscreen, setFullscreen] = useState(false)

  const total = slides.length
  const slide = slides[index]

  /* deck-only fullscreen: the slideshow becomes the screen, nothing else */
  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else if (deckRef.current?.requestFullscreen) {
      deckRef.current.requestFullscreen().catch(() => {})
    }
  }, [])

  const goTo = useCallback(
    (next, direction = 1) => {
      const clamped = Math.max(0, Math.min(total - 1, next))
      if (clamped === index) return
      setDir(direction ?? (clamped > index ? 1 : -1))
      setIndex(clamped)
    },
    [index, total],
  )
  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  /* keyboard controls — ignored while typing in the playground */
  useEffect(() => {
    function onKey(event) {
      const target = event.target
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)
      if (typing || event.ctrlKey || event.metaKey || event.altKey) return

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        next()
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        prev()
      } else if (event.key === 'Home') {
        goTo(0, -1)
      } else if (event.key === 'End') {
        goTo(total - 1, 1)
      } else if (event.key.toLowerCase() === 's') {
        event.preventDefault()
        setNotesOpen((open) => !open)
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goTo, total, toggleFullscreen])

  const act = slide.act ? ACT_META[slide.act] : null

  return (
    <div
      ref={deckRef}
      className="flex min-h-dvh flex-col bg-latte text-bean dark:bg-espresso dark:text-milk"
    >
      {/* top bar */}
      <header className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-caramel-deep dark:text-caramel">
          <CupMark />
          AzeuMark
        </span>
        <span className="hidden h-4 w-px bg-espresso/15 sm:block dark:bg-milk/15" />
        <span className="hidden truncate font-mono text-xs opacity-60 sm:block">
          Security presentation
        </span>
        {act && (
          <span
            className="ml-auto rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-espresso"
            style={{ background: act.color }}
          >
            {act.label}
          </span>
        )}
        {!act && (
          <span className="ml-auto font-mono text-xs opacity-60">{slide.kicker}</span>
        )}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={fullscreen ? 'Exit fullscreen (F)' : 'Present fullscreen (F)'}
          aria-label={fullscreen ? 'Exit fullscreen presentation' : 'Present the slideshow fullscreen'}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${
            fullscreen
              ? 'border-caramel bg-caramel text-espresso'
              : 'border-espresso/15 hover:border-caramel dark:border-milk/15'
          }`}
        >
          {fullscreen ? <CompressIcon /> : <ExpandIcon />}
        </button>
      </header>

      {/* slide canvas */}
      <main
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-4 sm:px-6"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.section
            key={slide.id}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) next()
              else if (info.offset.x > 80) prev()
            }}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-espresso/10 bg-foam p-6 shadow-sm sm:p-10 dark:border-milk/10 dark:bg-roast"
          >
            <div className="mx-auto w-full max-w-4xl">
              <SlideContent slide={slide} />
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      {/* footer: signature · dots · arrows */}
      <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 pb-4 sm:px-6">
        <span className="hidden font-mono text-[11px] text-bean/60 sm:block dark:text-milk/60">
          Uelmark G. Valdehueza
        </span>

        <div className="mx-auto flex flex-wrap items-center justify-center gap-1.5" aria-label="Slides">
          {slides.map((s, i) => {
            const color = s.act ? ACT_META[s.act].color : 'var(--color-caramel-deep)'
            const active = i === index
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                title={`${i + 1}. ${s.title}`}
                aria-current={active}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                className={`h-2.5 rounded-full border-2 transition-all ${
                  active ? 'scale-y-150 px-3' : 'hover:opacity-80'
                }`}
                style={{
                  borderColor: color,
                  background: active ? color : 'transparent',
                  width: active ? undefined : '0.625rem',
                }}
              />
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs opacity-60">
            {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous slide"
            className="grid h-9 w-9 place-items-center rounded-full border border-espresso/20 text-sm transition hover:border-caramel disabled:opacity-30 dark:border-milk/20"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index === total - 1}
            aria-label="Next slide"
            className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-sm text-milk transition hover:bg-caramel-deep disabled:opacity-30 dark:bg-milk dark:text-espresso"
          >
            →
          </button>
        </div>
      </footer>

      <PresenterNotes
        slide={slide}
        open={notesOpen}
        onToggle={() => setNotesOpen((open) => !open)}
        index={index}
        total={total}
        onPrev={prev}
        onNext={next}
      />
    </div>
  )
}
