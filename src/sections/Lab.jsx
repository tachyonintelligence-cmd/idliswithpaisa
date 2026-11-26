import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import VoiceLab from '../components/lab/VoiceLab.jsx'
import NfcLab from '../components/lab/NfcLab.jsx'
import InventoryLab from '../components/lab/InventoryLab.jsx'
import { Reveal, SectionTag, Tabs } from '../components/ui.jsx'

const MODULES = [
  { id: 'voice', key: 'A', name: 'Voice Intelligence', Panel: VoiceLab },
  { id: 'nfc', key: 'B', name: 'NFC Experience', Panel: NfcLab },
  { id: 'inventory', key: 'C', name: 'Inventory Intelligence', Panel: InventoryLab },
]

export default function Lab() {
  const [id, setId] = useState('voice')
  const section = useRef(null)
  const { Panel } = MODULES.find((m) => m.id === id)

  // Links such as #lab-nfc open the matching module.
  useEffect(() => {
    const open = () => {
      const wanted = window.location.hash.replace('#lab-', '')
      if (!MODULES.some((m) => m.id === wanted)) return
      setId(wanted)
      section.current.scrollIntoView()
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [])

  return (
    <section ref={section} id="lab" className="bg-mist py-28 lg:py-40" aria-labelledby="lab-title">
      <div className="shell">
        <SectionTag index="07">Technology lab</SectionTag>
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <h2 id="lab-title" className="display h-section">Experience Intelligence.</h2>
          </Reveal>
          <p className="max-w-sm text-slate">
            Three working front-end experiences. All run on simulated data in your browser; none is connected to a live
            service.
          </p>
        </div>

        <Tabs
          label="Lab modules"
          idBase="labtab"
          value={id}
          onChange={setId}
          options={MODULES.map((m) => ({
            id: m.id,
            label: (
              <>
                <span className="label opacity-60">{m.key}</span>
                <span className="text-sm leading-tight sm:text-lg">{m.name}</span>
              </>
            ),
          }))}
          className="mt-14 grid grid-cols-3 gap-1"
          itemClass={(on) =>
            `flex min-h-16 flex-col items-start justify-center gap-1 rounded-t-xl px-3 py-3 text-left tracking-tight sm:flex-row sm:items-center sm:justify-start sm:gap-3 sm:px-6 ${on ? 'bg-white' : 'text-slate hover:bg-white/60 hover:text-ink'}`
          }
        />
        <div role="tabpanel" aria-labelledby={`labtab-${id}`} className="overflow-hidden rounded-b-xl bg-white">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Panel />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
