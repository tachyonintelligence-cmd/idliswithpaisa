import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, AtSign, Globe, MapPin, Nfc, Phone, Star, UserPlus } from 'lucide-react'

function Row({ Icon, label, value }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-mist px-3 py-2.5">
      <Icon size={15} />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.62rem] text-slate">{label}</span>
        <span className="block truncate text-[0.8rem]">{value}</span>
      </span>
      <ArrowUpRight size={13} className="text-slate" />
    </li>
  )
}

function Profile() {
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <div className="grid size-14 place-items-center rounded-full bg-ink text-lg font-medium text-white">AR</div>
      <p className="mt-3 text-lg font-semibold tracking-tight">Ananya Rao</p>
      <p className="text-xs text-slate">Founder · Sample Studio</p>
      <button type="button" onClick={() => setSaved(true)} className="btn btn-ink mt-3 !min-h-9 w-full !text-xs">
        <UserPlus size={13} /> {saved ? 'Saved (simulated)' : 'Save contact'}
      </button>
      <ul className="mt-3 space-y-1.5">
        <Row Icon={Phone} label="Phone" value="Sample number" />
        <Row Icon={Globe} label="Website" value="samplestudio.example" />
        <Row Icon={AtSign} label="Social" value="@samplestudio" />
        <Row Icon={MapPin} label="Business information" value="Bengaluru · Mon–Sat" />
      </ul>
    </div>
  )
}

function Review() {
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)
  return (
    <div className="text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-ink text-lg font-medium text-white">SC</div>
      <p className="mt-3 text-lg font-semibold tracking-tight">Sample Café</p>
      <p className="text-xs text-slate">How was your visit?</p>
      <div className="mt-3 flex justify-center" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => { setRating(n); setSent(false) }} className="p-1">
            <Star size={26} fill={n <= rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </button>
        ))}
      </div>
      <textarea aria-label="Review text" rows={3} placeholder="Share a few words (optional)" className="mt-3 w-full resize-none rounded-xl bg-mist p-3 text-left text-xs" />
      <button type="button" disabled={!rating} onClick={() => setSent(true)} className="btn btn-ink mt-2 !min-h-9 w-full !text-xs">Post review</button>
      <p role="status" className="mt-2 text-xs text-slate">{sent ? 'Simulation only. Nothing was posted.' : ' '}</p>
    </div>
  )
}

function Portfolio() {
  return (
    <div>
      <p className="text-lg font-semibold tracking-tight">Kiran Shetty</p>
      <p className="text-xs text-slate">Photography · Sample portfolio</p>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {['from-neutral-800 to-neutral-500 row-span-2', 'from-neutral-300 to-neutral-100', 'from-neutral-600 to-neutral-400', 'from-neutral-200 to-neutral-400', 'from-neutral-900 to-neutral-700'].map((c) => (
          <span key={c} className={`min-h-20 rounded-lg bg-linear-to-br ${c}`} />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        <Row Icon={Globe} label="Full portfolio" value="kiranshetty.example" />
        <Row Icon={AtSign} label="Social" value="@kiran.frames" />
      </ul>
    </div>
  )
}

const SCREENS = { business: Profile, review: Review, portfolio: Portfolio }

/** Phone mock-up. `view` is null while waiting for a tap. */
export default function PhoneScreen({ view, tapKey = 0, className = '' }) {
  const Screen = SCREENS[view]
  return (
    <div className={`relative mx-auto w-full max-w-[17rem] rounded-[2.6rem] bg-ink p-2.5 shadow-[0_40px_70px_-30px_rgb(0_0_0/0.55)] ${className}`}>
      <div className="relative h-[33rem] overflow-hidden rounded-[2.05rem] bg-white text-ink">
        <span aria-hidden="true" className="absolute left-1/2 top-2.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        <AnimatePresence mode="wait">
          {Screen ? (
            <motion.div key={`${view}${tapKey}`} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 22 }} className="h-full overflow-y-auto px-4 pb-6 pt-12">
              <Screen />
              <p className="label mt-3 text-center !text-[0.52rem] text-slate">Simulated screen · sample data</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid h-full place-content-center justify-items-center gap-4 px-8 text-center">
              <Nfc size={34} strokeWidth={1.4} />
              <p className="text-sm text-slate">Waiting for a tap</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
