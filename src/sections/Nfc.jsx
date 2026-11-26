import { useState } from 'react'
import { ArrowRight, Contact, FolderOpen, Globe, Info, RotateCw, Share2, Star, UserRound } from 'lucide-react'
import Card3D from '../components/nfc/Card3D.jsx'
import { Lines, Reveal, SectionTag, Tabs } from '../components/ui.jsx'

const PRODUCTS = [
  { id: 'business', label: 'NFC Business Cards', text: 'Your introduction, saved to their phone. Update the destination without reprinting the card.' },
  { id: 'review', label: 'Digital Review Cards', text: 'Place it at the counter. A tap opens your Google review page while the experience is still fresh.' },
  { id: 'portfolio', label: 'Digital Portfolio Cards', text: 'Hand over your best work. Designers, photographers and studios can open a portfolio in one tap.' },
  { id: 'acrylic', label: 'Acrylic NFC Cards', text: 'A clear, glass-like body with depth and a polished edge. Made to be noticed on a desk or counter.' },
  { id: 'metal', label: 'Metal NFC Cards', text: 'Brushed finish and real weight in the hand, for introductions that should feel considered.' },
  { id: 'pvc', label: 'PVC NFC Cards', text: 'Light, durable and practical for teams that hand out cards every day.' },
  { id: 'custom', label: 'Custom-branded NFC solutions', text: 'Your identity, material, finish and destination — designed around how your business meets people.' },
]

const ACCESS = [
  [UserRound, 'Digital business profiles'],
  [FolderOpen, 'Websites and portfolios'],
  [Contact, 'Contact information'],
  [Share2, 'Social media'],
  [Star, 'Google review pages'],
  [Info, 'Business information'],
]

const MATERIALS = [
  ['metal', 'Metal', 'Brushed, weighted, reflective'],
  ['acrylic', 'Acrylic', 'Clear, deep, polished edge'],
  ['pvc', 'PVC', 'Matte, light, durable'],
]

export default function Nfc() {
  const [id, setId] = useState('metal')
  const [flipped, setFlipped] = useState(false)
  const product = PRODUCTS.find((p) => p.id === id)

  return (
    <section id="products" className="py-28 lg:py-40" aria-labelledby="nfc-title">
      <div className="shell">
        <SectionTag index="05">NFC intelligence</SectionTag>
        <h2 id="nfc-title" className="sr-only">One Tap. A World of Possibilities.</h2>
        <div aria-hidden="true">
          <Lines as="p" className="display h-section mt-8" lines={['One Tap.', <span className="text-ash">A World of Possibilities.</span>]} />
        </div>
        <Reveal className="lede mt-8 max-w-xl text-slate">
          Tap a card against an NFC-enabled smartphone and the right page opens. No app to install for the person
          receiving it.
        </Reveal>

        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:sticky lg:top-24 lg:order-2 lg:col-span-8 lg:self-start">
            <div className="relative overflow-hidden rounded-xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#ececec_75%)]">
              <div className="grid min-h-[17rem] place-items-center px-[9%] py-14 sm:min-h-[28rem] lg:min-h-[32rem]">
                <Card3D key={id} variant={id} flipped={flipped} className="max-w-[31rem]" />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 pb-4">
                <p className="text-xs text-slate">Digital render · move across the card to tilt it</p>
                <button type="button" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped} className="btn btn-line !min-h-10 shrink-0 !px-4 !text-sm">
                  <RotateCw size={14} /> Flip
                </button>
              </div>
            </div>
            <p aria-live="polite" className="lede mt-5 min-h-[3.2em] max-w-xl">{product.text}</p>
          </div>

          <div className="lg:col-span-4">
            <Tabs
              label="NFC products"
              value={id}
              onChange={(v) => { setId(v); setFlipped(false) }}
              options={PRODUCTS.map((p, i) => ({
                id: p.id,
                label: (
                  <>
                    <span className="label w-6 shrink-0 opacity-60">{i + 1}</span>
                    <span className="flex-1 text-left">{p.label}</span>
                    <ArrowRight size={16} className="shrink-0 opacity-0 transition-opacity group-aria-selected:opacity-100" />
                  </>
                ),
              }))}
              className="grid sm:grid-cols-2 sm:gap-x-6 lg:block"
              itemClass={(on) =>
                `group flex w-full items-center gap-3 border-t border-ink/12 py-4 text-[1.1rem] tracking-tight transition-[color,padding] duration-300 lg:py-5 lg:text-[1.3rem] ${on ? 'pl-2 text-ink' : 'text-slate hover:text-ink'}`
              }
            />
          </div>
        </div>

        <div className="mt-28 lg:mt-40">
          <Reveal>
            <h3 className="display max-w-[16ch] text-[clamp(2rem,4vw,3.4rem)]">Three materials. Three first impressions.</h3>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-3">
            {MATERIALS.map(([variant, name, note], i) => (
              <Reveal key={variant} delay={i * 0.1}>
                <div className="px-3"><Card3D variant={variant} sway={false} /></div>
                <p className="mt-12 border-t border-ink/12 pt-4 text-xl font-medium tracking-tight">{name}</p>
                <p className="text-slate">{note}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-28 grid gap-10 border-t border-ink pt-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h3 className="display text-[clamp(1.9rem,3vw,2.7rem)]">What a tap can open.</h3>
            <a href="#lab-nfc" className="btn btn-ink mt-7"><Globe size={16} /> Try a simulated tap</a>
          </Reveal>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-8">
            {ACCESS.map(([Icon, label], i) => (
              <Reveal as="li" key={label} delay={(i % 2) * 0.07} className="flex items-center gap-4 border-b border-ink/12 py-5 text-lg tracking-tight">
                <Icon size={20} strokeWidth={1.5} /> {label}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
