import { useState } from 'react'
import { motion } from 'framer-motion'
import { post } from '../../api/client.js'
import CipherMorph from './CipherMorph.jsx'

/**
 * EncryptPlayground — the live demo on the "watch it work" slide. It calls
 * the REAL server crypto so the audience sees the system's actual protection:
 *   POST /api/security/demo-encrypt  { text }   → { cipher }
 *   POST /api/security/demo-decrypt  { cipher } → { text }
 * plus a one-character tamper button: corrupt the scrambled text and
 * decryption refuses — the server never guesses or returns garbage.
 */

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function corruptOneChar(cipher) {
  // find the last segment (the actual ciphertext), flip one of its middle chars
  const parts = cipher.split('.')
  const last = parts.length - 1
  const segment = parts[last]
  const idx = Math.max(0, Math.floor(segment.length / 2))
  let replacement = B64[Math.floor(Math.random() * B64.length)]
  if (replacement === segment[idx]) {
    replacement = B64[(B64.indexOf(segment[idx]) + 7) % B64.length]
  }
  const mutated = segment.slice(0, idx) + replacement + segment.slice(idx + 1)
  return [...parts.slice(0, last), mutated].join('.')
}

const btn =
  'rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40'
const btnPrimary = `${btn} bg-espresso text-milk hover:bg-caramel-deep dark:bg-milk dark:text-espresso dark:hover:bg-caramel`
const btnGhost = `${btn} border border-espresso/25 hover:border-caramel dark:border-milk/25`

export default function EncryptPlayground() {
  const [text, setText] = useState('Uelmark 09123456789')
  const [cipher, setCipher] = useState('')
  const [shownCipher, setShownCipher] = useState('') // what the Decrypt button sends
  const [tampered, setTampered] = useState(false)
  const [plain, setPlain] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('') // '' | 'encrypt' | 'decrypt'

  async function encrypt() {
    setBusy('encrypt')
    setError('')
    setPlain('')
    setTampered(false)
    try {
      const data = await post('/security/demo-encrypt', { text })
      setCipher(data.cipher)
      setShownCipher(data.cipher)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  async function decrypt() {
    setBusy('decrypt')
    setError('')
    setPlain('')
    try {
      const data = await post('/security/demo-decrypt', { cipher: shownCipher })
      setPlain(data.text)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  function tamper() {
    if (!cipher) return
    setShownCipher(corruptOneChar(cipher))
    setTampered(true)
    setPlain('')
    setError('')
  }

  function reset() {
    setCipher('')
    setShownCipher('')
    setPlain('')
    setError('')
    setTampered(false)
  }

  return (
    <div className="w-full text-left">
      {/* input row */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={text}
          maxLength={200}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') encrypt()
          }}
          placeholder="Type anything personal…"
          className="min-w-0 flex-1 rounded-full border border-espresso/20 bg-white/80 px-5 py-2.5 text-sm outline-none transition focus:border-caramel dark:border-milk/20 dark:bg-espresso/70"
        />
        <button type="button" onClick={encrypt} disabled={busy === 'encrypt'} className={btnPrimary}>
          {busy === 'encrypt' ? 'Encrypting…' : 'Encrypt →'}
        </button>
      </div>

      {/* ciphertext */}
      <motion.div
        key={shownCipher || 'empty'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-4 rounded-xl border border-espresso/15 bg-white/70 p-4 dark:border-milk/15 dark:bg-espresso/60"
      >
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest opacity-55">
          <span>{tampered ? 'Scrambled text · corrupted on purpose' : 'Scrambled text · straight from the server'}</span>
        </div>
        <p className="mt-2 min-h-12 text-sm leading-relaxed">
          <CipherMorph value={shownCipher} tone="cipher" placeholder="Press Encrypt — the scrambled version appears here…" />
        </p>
        {tampered && (
          <p className="mt-1 text-[11px] text-status-cancelled">
            One character was destroyed. Decrypting this is supposed to fail.
          </p>
        )}
      </motion.div>

      {/* action row */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={decrypt} disabled={!shownCipher || busy === 'decrypt'} className={btnPrimary}>
          {busy === 'decrypt' ? 'Decrypting…' : '← Decrypt'}
        </button>
        <button type="button" onClick={tamper} disabled={!cipher} className={btnGhost}>
          Corrupt 1 character
        </button>
        <button type="button" onClick={reset} className={btnGhost}>
          Reset
        </button>
      </div>

      {/* result / error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-status-cancelled/40 bg-status-cancelled/10 px-4 py-3 text-sm font-medium text-status-cancelled"
        >
          {error}
        </motion.p>
      )}
      {plain && !error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-status-ready/40 bg-status-ready/10 px-4 py-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-status-ready">
            Decrypted at the server — the scrambled text arrived intact
          </p>
          <p className="mt-1 text-sm">
            <CipherMorph value={plain} tone="plain" />
          </p>
          {tampered && (
            <p className="mt-1 text-[11px] opacity-60">
              (This round used the clean text — the corrupted one was refused above.)
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
