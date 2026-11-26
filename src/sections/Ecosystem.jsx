import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Reveal, SectionTag, useOnScreen } from '../components/ui.jsx'

const NODES = [
  { id: 'voice', label: 'Voice AI', x: 500, y: 76, links: ['conversational', 'engagement', 'automation'], text: 'Phone conversations in Indian languages: the front door for callers who would rather speak than type.' },
  { id: 'automation', label: 'Business automation', x: 825, y: 172, links: ['voice', 'inventory', 'systems'], text: 'Turns what was understood into completed work: a booking made, a task raised, a person notified.' },
  { id: 'inventory', label: 'Inventory intelligence', x: 872, y: 412, links: ['automation', 'systems'], text: 'Knows what is in stock and what is running short, so other parts of the system can act on it.' },
  { id: 'systems', label: 'AI-powered business systems', x: 668, y: 566, links: ['automation', 'inventory', 'engagement'], text: 'The records and dashboards where a business sees what happened and decides what is next.' },
  { id: 'nfc', label: 'NFC technology', x: 332, y: 566, links: ['engagement'], text: 'Physical touchpoints that bring people from a counter or a handshake into a digital journey.' },
  { id: 'engagement', label: 'Intelligent customer engagement', x: 128, y: 412, links: ['nfc', 'voice', 'conversational', 'systems'], text: 'Reminders, follow-ups and review requests, timed around what the customer actually did.' },
  { id: 'conversational', label: 'Conversational AI', x: 175, y: 172, links: ['voice', 'engagement'], text: 'The shared understanding of language, intent and context behind spoken and written conversations.' },
]
const HUB = { x: 500, y: 320 }
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))

const spoke = (n) => `M${HUB.x} ${HUB.y}L${n.x} ${n.y}`
const arc = (a, b) => {
  // Bow connections away from the hub so they never run through it.
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  return `M${a.x} ${a.y}Q${mx + (mx - HUB.x) * 0.22} ${my + (my - HUB.y) * 0.22} ${b.x} ${b.y}`
}

const edges = [...new Set(NODES.flatMap((n) => n.links.map((l) => [n.id, l].sort().join(':'))))].map((k) => k.split(':'))

export default function Ecosystem() {
  const [active, setActive] = useState('voice')
  const [touched, setTouched] = useState(false)
  const [ref, live] = useOnScreen('0px')
  const node = byId[active]
  const related = new Set([...node.links, ...NODES.filter((n) => n.links.includes(active)).map((n) => n.id)])

  useEffect(() => {
    if (!live || touched || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(
      () => setActive((a) => NODES[(NODES.findIndex((n) => n.id === a) + 1) % NODES.length].id),
      3600,
    )
    return () => clearInterval(id)
  }, [live, touched])

  const pick = (id) => {
    setTouched(true)
    setActive(id)
  }

  return (
    <section id="ecosystem" data-theme="dark" data-surface className="bg-ink py-28 text-white lg:py-40" aria-labelledby="eco-title">
      <div className="shell">
        <SectionTag index="06">Technology ecosystem</SectionTag>
        <Reveal>
          <h2 id="eco-title" className="display h-section mt-8 max-w-[15ch]">
            One Intelligence Layer. <span className="text-ash">Multiple Possibilities.</span>
          </h2>
        </Reveal>
        <p className="lede mt-7 max-w-xl text-ash">
          Our architecture is modular: start with one capability, then connect the next. Select a component to see what it
          exchanges with the rest.
        </p>

        <div ref={ref} data-offscreen={live ? undefined : ''} className="mt-14 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-center">
          <div className="relative hidden aspect-[1000/640] md:block">
            <svg viewBox="0 0 1000 640" className="absolute inset-0 size-full" aria-hidden="true">
              {[120, 215, 300].map((r) => <circle key={r} cx={HUB.x} cy={HUB.y} r={r} fill="none" stroke="#fff" strokeOpacity="0.07" />)}
              {edges.map(([a, b]) => {
                const on = a === active || b === active
                return <path key={a + b} d={arc(byId[a], byId[b])} fill="none" stroke="#fff" strokeOpacity={on ? 0.75 : 0.1} className={on ? 'flow-line' : ''} />
              })}
              {NODES.map((n) => <path key={n.id} d={spoke(n)} stroke="#fff" strokeOpacity={n.id === active ? 0.9 : 0.18} strokeWidth={n.id === active ? 1.5 : 1} />)}
              {live && [node, ...[...related].map((r) => byId[r])].map((n, i) => (
                <circle key={`${active}-${n.id}`} r="4" fill="#fff">
                  <animateMotion path={i === 0 ? spoke(n) : arc(node, n)} dur="1.9s" repeatCount="indefinite" />
                </circle>
              ))}
              <circle cx={HUB.x} cy={HUB.y} r="76" fill="#fff" />
            </svg>
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-ink">
              <p className="text-[clamp(0.7rem,1.25vw,1.05rem)] font-semibold leading-tight tracking-tight">Intelligence<br />layer</p>
            </div>
            {NODES.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => pick(n.id)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && pick(n.id)}
                onFocus={() => pick(n.id)}
                aria-pressed={active === n.id}
                className={`absolute w-max max-w-[11rem] -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2.5 text-center text-[0.8rem] leading-tight transition-colors duration-300 lg:text-sm ${
                  active === n.id ? 'border-white bg-white text-ink' : related.has(n.id) ? 'border-white/80 bg-ink' : 'border-white/20 bg-ink text-white/70'
                }`}
                style={{ left: `${n.x / 10}%`, top: `${n.y / 6.4}%` }}
              >
                {n.label}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <div className="mx-auto grid size-28 place-items-center rounded-full bg-white text-center text-sm font-semibold leading-tight text-ink">Intelligence<br />layer</div>
            <div aria-hidden="true" className="mx-auto h-8 w-px bg-white/40" />
            <div className="grid grid-cols-2 gap-2">
              {NODES.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => pick(n.id)}
                  aria-pressed={active === n.id}
                  className={`min-h-14 rounded-lg border px-3 py-2 text-sm leading-tight last:col-span-2 ${
                    active === n.id ? 'border-white bg-white text-ink' : related.has(n.id) ? 'border-white/80' : 'border-white/18 text-white/65'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[19rem] border-t border-white/30 pt-6" aria-live={touched ? 'polite' : 'off'}>
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-2xl font-medium tracking-tight">{node.label}</h3>
              <p className="mt-3 leading-relaxed text-ash">{node.text}</p>
              <p className="label mt-8 text-ash">Connects with</p>
              <ul className="mt-2">
                {[...related].map((r) => (
                  <li key={r} className="border-b border-white/12 py-2.5 text-sm">{byId[r].label}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        <p className="mt-10 text-xs text-ash">Architecture view. Which components connect depends on each deployment and the systems a business already uses.</p>
      </div>
    </section>
  )
}
