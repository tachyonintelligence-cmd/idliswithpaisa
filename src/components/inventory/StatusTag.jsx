import { AlertTriangle, Check, Clock, Layers } from 'lucide-react'

const STATUS = {
  low: { label: 'Reorder now', Icon: AlertTriangle, cls: 'border-alert bg-alert text-white' },
  watch: { label: 'Watch', Icon: Clock, cls: 'border-alert/50 text-alert' },
  ok: { label: 'Healthy', Icon: Check, cls: 'border-ink/15 text-ink' },
  excess: { label: 'Excess', Icon: Layers, cls: 'border-dashed border-ink/40 text-slate' },
}

export default function StatusTag({ status }) {
  const { label, Icon, cls } = STATUS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded border px-2 py-0.5 text-[0.72rem] font-medium ${cls}`}>
      <Icon size={11} aria-hidden="true" /> {label}
    </span>
  )
}
