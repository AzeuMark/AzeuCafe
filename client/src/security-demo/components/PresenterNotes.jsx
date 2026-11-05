import { motion, AnimatePresence } from 'framer-motion'
import { ACT_META } from '../data/slides.js'

/**
 * PresenterNotes — the speaker script drawer. Hidden by default (the audience
 * must never see it); toggled by the button bottom-right or the S key.
 */

function ScriptIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5h13.5A2.5 2.5 0 0 0 20 17V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14.5z" />
      <path d="M8 7h6M8 11h6M8 15h3" />
    </svg>
  )
}

export default function PresenterNotes({ slide, open, onToggle, index, total, onPrev, onNext }) {
  const act = slide.act ? ACT_META[slide.act] : null

  return (
    <>
      {/* toggle button — always visible, unobtrusive */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Toggle presenter notes (press S)"
        title="Presenter notes (S)"
        className={`fixed bottom-4 right-4 z-50 grid h-11 w-11 place-items-center rounded-full border shadow-lg transition ${
          open
            ? 'border-caramel bg-caramel text-espresso'
            : 'border-espresso/20 bg-espresso text-milk hover:border-caramel dark:border-milk/20 dark:bg-espresso/80'
        }`}
      >
        <ScriptIcon />
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed bottom-20 right-4 z-50 flex max-h-[68vh] w-[min(460px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-milk/15 bg-[#241811]/97 text-milk shadow-2xl backdrop-blur"
            role="complementary"
            aria-label="Presenter notes — speaker script"
          >
            <div className="h-1.5 w-full shrink-0" style={{ background: act?.color ?? 'var(--color-caramel)' }} />

            <div className="flex items-center gap-3 px-5 pt-4">
              <span className="font-mono text-[11px] text-milk/50">
                slide {String(index + 1).padStart(2, '0')} / {total}
              </span>
              {act && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-espresso"
                  style={{ background: act.color }}
                >
                  {act.label}
                </span>
              )}
              <button
                type="button"
                onClick={onToggle}
                className="ml-auto text-xs text-milk/60 hover:text-milk"
                aria-label="Close presenter notes"
              >
                close ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-2">
              <h3 className="font-display text-xl">{slide.title}</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-milk/85">
                {slide.script}
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-milk/10 px-5 py-3">
              <button
                type="button"
                onClick={onPrev}
                className="rounded-full border border-milk/20 px-4 py-1.5 text-xs font-semibold transition hover:border-caramel"
              >
                ← Prev
              </button>
              <span className="font-mono text-[10px] text-milk/40">audience sees none of this</span>
              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-caramel px-4 py-1.5 text-xs font-bold text-espresso transition hover:bg-caramel-deep hover:text-milk"
              >
                Next →
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
