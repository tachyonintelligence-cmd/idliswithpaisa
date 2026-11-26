import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import IntelligenceCore, { FORMS } from '../components/IntelligenceCore.jsx'
import { Lines } from '../components/ui.jsx'

const LANGUAGES = [
  { script: 'ಕನ್ನಡ', name: 'Kannada', lang: 'kn' },
  { script: 'हिन्दी', name: 'Hindi', lang: 'hi' },
  { script: 'தமிழ்', name: 'Tamil', lang: 'ta' },
  { script: 'English', name: 'English', lang: 'en' },
]

const fade = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function Hero() {
  const [form, setForm] = useState('intelligence')
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Parallax only where the core sits beside the copy; stacked, it would collide with the strip below.
  const [wide] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  const coreY = useTransform(scrollYProgress, [0, 1], [0, reduced || !wide ? 0 : 60])
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -50])
  const current = FORMS.find((f) => f.id === form)

  return (
    <section id="home" ref={ref} className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="shell relative flex flex-1 flex-col justify-center pb-6 pt-28 lg:pt-24">
        <motion.div style={{ y: textY }} className="relative z-10 lg:max-w-[64%]">
          <motion.p {...fade(0.05)} className="label mb-7 flex items-center gap-3">
            <span aria-hidden="true" className="blink size-1.5 rounded-full bg-ink" />
            AI technology and infrastructure · India
          </motion.p>

          <Lines
            as="h1"
            immediate
            delay={0.12}
            className="display text-[clamp(2.85rem,6.7vw,6.75rem)]"
            lines={['Intelligence,', 'Engineered for', 'the Real World.']}
          />

          <motion.p {...fade(0.55)} className="lede mt-8 max-w-[34rem] text-slate">
            We build intelligent systems that connect businesses, people and possibilities — through advanced voice AI,
            automation and connected technology.
          </motion.p>

          <motion.div {...fade(0.68)} className="mt-9 flex flex-wrap gap-3">
            <a href="#intro" className="btn btn-ink">
              Explore Our Technology <ArrowRight size={17} />
            </a>
            <a href="#contact" className="btn btn-line">
              Talk to Our Team <ArrowRight size={17} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          {...fade(0.35)}
          className="relative mt-8 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[48%]"
        >
          <motion.div style={{ y: coreY }} className="flex h-full flex-col lg:pb-10 lg:pt-20">
            <div className="h-[22rem] sm:h-[28rem] lg:h-auto lg:flex-1">
              <IntelligenceCore form={form} onCycle={setForm} />
            </div>
            <div className="lg:pr-[clamp(1.25rem,4.5vw,4rem)]">
              <div role="group" aria-label="Change the structure shown" className="grid grid-cols-[1.15fr_0.7fr_1fr_1.15fr] gap-x-2 border-t border-ink/12">
                {FORMS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={form === f.id}
                    onClick={() => setForm(f.id)}
                    className="label relative py-3 text-left !text-[0.56rem] !tracking-[0.02em] text-slate transition-colors hover:text-ink aria-pressed:text-ink sm:!text-[0.64rem] sm:!tracking-[0.08em]"
                  >
                    {form === f.id && <motion.span layoutId="core-marker" className="absolute -top-px left-0 h-0.5 w-full bg-ink" />}
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="min-h-10 text-sm text-slate">{current.note}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div {...fade(0.85)} className="relative z-20 border-t border-ink/10 bg-white">
        <div className="shell flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
          <p className="label text-slate">Voice intelligence designed for</p>
          <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-2 sm:gap-x-12">
            {LANGUAGES.map((l) => (
              <li key={l.name} className="flex items-baseline gap-2">
                <span lang={l.lang} className="text-xl font-medium sm:text-2xl">{l.script}</span>
                {l.name !== l.script && <span className="label !text-[0.58rem] text-slate">{l.name}</span>}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  )
}
