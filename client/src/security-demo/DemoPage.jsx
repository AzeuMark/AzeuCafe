import SlideDeck from './components/SlideDeck.jsx'

/**
 * DemoPage (deck shell) — mounted at /demo via pages/DemoPage.jsx re-export.
 * The deck lives entirely in security-demo/: 16 slides, 3 acts, hidden
 * presenter notes, and the live AESCrypt playground.
 */
export default function DemoPage() {
  return <SlideDeck />
}
