import { Reveal, SectionTag } from '../components/ui.jsx'

const PRINCIPLES = [
  ['Indian-language-first intelligence.', 'We start from how people here actually speak — mixed languages, regional rhythm and all — instead of translating an English product afterwards.'],
  ['Speed-driven engineering.', 'Delay is a design flaw. We treat response time as part of the product, from the pipeline architecture to the page you are reading.'],
  ['Real-world AI applications.', 'A system earns its place by finishing a job: an appointment booked, a shortage caught, a follow-up that happens.'],
  ['Modular and scalable systems.', 'Begin with the one problem that hurts most. Add capabilities as they prove useful, without rebuilding what already works.'],
  ['Human-centred technology.', 'People stay in charge. Clear handovers, visible decisions and an easy route to a person when the machine should step aside.'],
  ['Continuous innovation.', 'Models and methods change quickly. We design so that better components can replace older ones.'],
]

export default function Why() {
  return (
    <section id="about" className="py-28 lg:py-40" aria-labelledby="why-title">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionTag index="08">Why Tachyon</SectionTag>
            <Reveal>
              <h2 id="why-title" className="display mt-8 text-[clamp(2.6rem,5.2vw,5rem)]">Built for the Next Generation of Business.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-8 max-w-md text-slate">
                Tachyon Intelligence is an Indian AI technology company. We are building intelligent systems for
                businesses, and these are the principles we hold that work to.
              </p>
            </Reveal>
          </div>
        </div>
        <ol className="lg:col-span-7">
          {PRINCIPLES.map(([title, body], i) => (
            <Reveal as="li" key={title} className="group grid gap-3 border-t border-ink/15 py-10 sm:grid-cols-[4rem_1fr] lg:py-14">
              <span className="label pt-2 text-slate">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="display text-[clamp(1.8rem,3.2vw,3rem)] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">{title}</h3>
                <p className="mt-4 max-w-lg leading-relaxed text-slate">{body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
