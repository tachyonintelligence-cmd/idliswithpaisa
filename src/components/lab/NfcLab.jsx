import { useRef, useState } from 'react'
import { motion, useAnimationControls } from 'motion/react'
import { Smartphone } from 'lucide-react'
import Card3D from '../nfc/Card3D.jsx'
import PhoneScreen from '../nfc/PhoneScreen.jsx'
import { Tabs } from '../ui.jsx'

const CARDS = [
  { id: 'business', label: 'Business profile' },
  { id: 'review', label: 'Review page' },
  { id: 'portfolio', label: 'Portfolio' },
]

export default function NfcLab() {
  const [card, setCard] = useState('business')
  const [view, setView] = useState(null)
  const [taps, setTaps] = useState(0)
  const [busy, setBusy] = useState(false)
  const controls = useAnimationControls()
  const cardRef = useRef(null)
  const phoneRef = useRef(null)

  const open = () => {
    setView(card)
    setTaps((t) => t + 1)
    navigator.vibrate?.(25)
  }

  // Offset that carries the card onto the top of the phone, in either layout.
  const flight = () => {
    const c = cardRef.current.getBoundingClientRect()
    const p = phoneRef.current.getBoundingClientRect()
    return { x: p.left + p.width / 2 - (c.left + c.width / 2), y: p.top + 90 - (c.top + c.height / 2) }
  }

  const tap = async () => {
    if (busy) return
    setBusy(true)
    setView(null)
    await controls.start({ ...flight(), scale: 0.72, rotate: -8, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } })
    open()
    await controls.start({ x: 0, y: 0, scale: 1, rotate: 0, transition: { delay: 0.35, duration: 0.6 } })
    setBusy(false)
  }

  const onDragEnd = (_, info) => {
    const p = phoneRef.current.getBoundingClientRect()
    const x = info.point.x - window.scrollX
    const y = info.point.y - window.scrollY
    if (x > p.left && x < p.right && y > p.top && y < p.bottom) open()
  }

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr]">
      <div className="p-5 sm:p-8">
        <h3 className="text-2xl font-medium tracking-tight">Tap a card to a phone.</h3>
        <p className="mt-2 text-slate">Choose a card, then press the button. With a mouse you can also drag it onto the phone.</p>
        <Tabs
          label="Card to tap"
          value={card}
          onChange={(v) => { setCard(v); setView(null) }}
          options={CARDS}
          className="mt-6 flex flex-wrap gap-1.5"
          itemClass={(on) => `rounded-full border px-4 py-2 text-sm ${on ? 'border-ink bg-ink text-white' : 'border-ink/15 hover:border-ink'}`}
        />
        <div className="px-4 py-12 sm:py-16">
          <motion.div
            ref={cardRef}
            animate={controls}
            drag={!busy}
            dragSnapToOrigin
            dragListener={typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches}
            onDragEnd={onDragEnd}
            whileDrag={{ scale: 0.8 }}
            className="relative z-20 mx-auto max-w-[22rem] cursor-grab active:cursor-grabbing"
          >
            <Card3D variant={card} sway={false} interactive={false} />
          </motion.div>
        </div>
        <button type="button" onClick={tap} disabled={busy} className="btn btn-ink w-full">
          <Smartphone size={17} /> Simulate tap
        </button>
        <p className="mt-3 text-xs text-slate">Simulation: no NFC hardware is used and the profiles are fictional.</p>
      </div>
      <div ref={phoneRef} className="relative grid place-items-center bg-mist p-8">
        {taps > 0 && view && (
          <span key={taps} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-24 -ml-16 size-32 rounded-full border-2 border-ink" style={{ animation: 'ring-out 0.9s ease-out 2 both' }} />
        )}
        <PhoneScreen view={view} tapKey={taps} />
        <p className="sr-only" role="status">{view ? `Card tapped. ${CARDS.find((c) => c.id === view).label} opened.` : ''}</p>
      </div>
    </div>
  )
}
