/**
 * The 5-status pill used on My Orders and the Owner dashboard.
 * Colors come from the @theme tokens in index.css.
 */
const STATUS_META = {
  waiting: { label: 'Waiting', className: 'border-status-waiting/40 bg-status-waiting/15 text-status-waiting' },
  processing: { label: 'Processing', className: 'border-status-processing/40 bg-status-processing/15 text-status-processing' },
  ready: { label: 'Ready', className: 'border-status-ready/40 bg-status-ready/15 text-status-ready' },
  completed: { label: 'Completed', className: 'border-status-completed/40 bg-status-completed/15 text-status-completed' },
  cancelled: { label: 'Cancelled', className: 'border-status-cancelled/40 bg-status-cancelled/15 text-status-cancelled' },
}

export default function StatusChip({ status }) {
  const meta = STATUS_META[status] ?? { label: status, className: 'border-espresso/20 bg-espresso/5' }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${meta.className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  )
}
