import { useEffect, useState } from 'react'
import rawCode from '../../../../server/src/utils/aescrypt.js?raw'

/**
 * CodeWindow — the REAL aescrypt.js, imported raw from the server source tree
 * (`?raw` — zero copies, zero drift: what the class reads is what runs).
 * Editor chrome + typed filename + lightweight line highlighting.
 *
 * NOTE: the import path leaves the Vite root (client/); `server.fs.allow`
 * is configured for this in vite.config.js.
 */

const FILE_PATH = 'server/src/utils/aescrypt.js'

function useTypedFilename(text, speed = 28) {
  const [out, setOut] = useState('')
  useEffect(() => {
    setOut('')
    let i = 0
    const timer = window.setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) window.clearInterval(timer)
    }, speed)
    return () => window.clearInterval(timer)
  }, [text, speed])
  return out
}

/** Lightweight per-line classing — enough to read like an editor. */
function lineClass(line) {
  const t = line.trim()
  if (t.startsWith('/*') || t.startsWith('*') || t.startsWith('//')) return 'text-milk/45 dark:text-milk/40'
  if (t.startsWith('import ')) return 'text-caramel-deep dark:text-caramel'
  if (t.startsWith('export ')) return 'text-status-ready dark:text-status-ready'
  if (t.startsWith('const ') || t.startsWith('function ')) return 'text-bean dark:text-milk'
  return ''
}

export default function CodeWindow({ className = '', maxHeight = '38vh' }) {
  const typedFile = useTypedFilename(FILE_PATH)
  const lines = rawCode.split('\n')

  return (
    <div
      className={`overflow-hidden rounded-xl border border-espresso/25 bg-[#14100B] shadow-xl dark:border-milk/20 ${className}`}
    >
      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-milk/10 bg-[#1D1710] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-status-cancelled/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-status-waiting/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-status-ready/80" />
        </span>
        <span className="min-w-0 truncate font-mono text-xs text-milk/80">
          {typedFile}
          {typedFile.length < FILE_PATH.length && <span className="text-caramel">▍</span>}
        </span>
        <span className="ml-auto shrink-0 font-mono text-[10px] text-milk/40">
          imported with ?raw · the real file
        </span>
      </div>

      {/* code */}
      <div className="overflow-auto" style={{ maxHeight }}>
        <pre className="p-4 pr-2 text-left font-mono text-[12px] leading-[1.55] text-milk/90">
          <code>
            {lines.map((line, i) => (
              <span key={i} className="flex">
                <span
                  aria-hidden="true"
                  className="w-8 shrink-0 select-none pr-3 text-right text-milk/25"
                >
                  {i + 1}
                </span>
                <span className={`whitespace-pre-wrap break-words ${lineClass(line)}`}>
                  {line || ' '}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
