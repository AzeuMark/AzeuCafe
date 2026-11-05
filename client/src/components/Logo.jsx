/** AzeuCafe cup-and-bean mark (hand-drawn SVG — no stock icons). */
export default function Logo({ withWordmark = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-9 w-9 text-espresso dark:text-milk"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        {/* cup */}
        <path d="M14 21h18v6.5a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7z" fill="currentColor" />
        {/* handle */}
        <path
          d="M32 23h3a4.5 4.5 0 0 1 0 9H29"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* steam */}
        <path
          d="M19 16q2-2.5.5-5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M25 16q2-2.5.5-5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark && (
        <span className="font-display text-2xl leading-none tracking-tight">AzeuCafe</span>
      )}
    </span>
  )
}
