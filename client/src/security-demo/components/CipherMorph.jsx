import { useEffect, useRef, useState } from 'react'

/**
 * CipherMorph — the animated plaintext ⇄ ciphertext scramble used across the
 * deck. Whenever `value` changes it plays a glyph-by-glyph settle: characters
 * slither through random fields and lock in left-to-right, like decryption
 * happening before your eyes.
 */

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789+/=.-'

/** Scrambles into `text` over ~650ms, settling left → right. */
export function useScramble(text, enabled = true) {
  const [display, setDisplay] = useState(text)
  const frame = useRef(0)
  const previous = useRef(text)

  useEffect(() => {
    if (!enabled || text === previous.current) {
      setDisplay(text)
      previous.current = text
      return
    }
    previous.current = text
    const settle = 650
    const start = performance.now()
    let raf

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / settle)
      const locked = Math.floor(progress * text.length)
      let out = text.slice(0, locked)
      for (let i = locked; i < text.length; i += 1) {
        const ch = text[i]
        // keep structural characters (spaces, dots) readable while scrambling
        out += /[\s.]/.test(ch) ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setDisplay(out)
      if (progress < 1) {
        frame.current = raf = requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }
    frame.current = raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, enabled])

  return display
}

export default function CipherMorph({
  value,
  tone = 'cipher', // 'cipher' | 'plain'
  className = '',
  placeholder = '—',
}) {
  const display = useScramble(value)
  if (!value) {
    return <span className={`font-mono opacity-40 ${className}`}>{placeholder}</span>
  }
  return (
    <span
      className={`font-mono break-all transition-colors ${
        tone === 'cipher' ? 'text-caramel-deep dark:text-caramel' : ''
      } ${className}`}
    >
      {display}
    </span>
  )
}
