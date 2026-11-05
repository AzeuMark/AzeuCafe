import { motion } from 'framer-motion'

/**
 * LockSketch — a self-drawing SVG padlock: shackle, body, keyhole, then a
 * satisfying "click" twist. Pure framer-motion pathLength animation.
 */

const shackle = 'M20 26 v-6 a12 12 0 0 1 24 0 v6'
const body = 'M16 26 h32 a4 4 0 0 1 4 4 v22 a4 4 0 0 1 -4 4 H16 a4 4 0 0 1 -4 -4 V30 a4 4 0 0 1 4 -4 z'
const keyhole = 'M32 38 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0'
const keyStem = 'M32 42 v8'

const draw = (delay, duration = 0.5) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { delay, duration, ease: 'easeInOut' },
})

export default function LockSketch({ size = 120, replay = 0 }) {
  return (
    <motion.svg
      key={replay}
      viewBox="0 0 64 80"
      width={size}
      height={size * 1.25}
      fill="none"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, -2.2, 2, 0] }}
      transition={{ delay: 1.35, duration: 0.45, ease: 'easeInOut' }}
      role="img"
      aria-label="Animated padlock drawing itself"
    >
      {/* shackle */}
      <motion.path
        d={shackle}
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        {...draw(0, 0.55)}
      />
      {/* body */}
      <motion.path
        d={body}
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinejoin="round"
        {...draw(0.45, 0.6)}
      />
      {/* keyhole */}
      <motion.path
        d={keyhole}
        stroke="currentColor"
        strokeWidth="3.5"
        {...draw(1.0, 0.35)}
      />
      <motion.path
        d={keyStem}
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        {...draw(1.1, 0.3)}
      />
    </motion.svg>
  )
}
