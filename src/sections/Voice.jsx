import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import VoiceConsole from '../components/voice/VoiceConsole.jsx'
import Waveform from '../components/voice/Waveform.jsx'
import { Lines, Reveal, SectionTag, Tabs, useOnScreen } from '../components/ui.jsx'

const SCRIPT_RUN = ['ನಮಸ್ಕಾರ', 'Hello', 'नमस्ते', 'வணக்கம்', 'ಹೇಳಿ', 'बताइए', 'சொல்லுங்க', 'How can I help?']

function ScriptRun() {
  const [ref, live] = useOnScreen('0px')
  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden border-y border-white/10 py-5">
      <div
        className="flex w-max items-baseline"
        style={{ animation: 'marquee 48s linear infinite', animationPlayState: live ? 'running' : 'paused' }}
      >
        {[...SCRIPT_RUN, ...SCRIPT_RUN].map((word, i) => (
          <span key={i} className="flex items-center gap-10 pr-10 text-3xl font-medium tracking-tight sm:text-5xl">
            <span className={i % 2 ? 'text-ash' : ''}>{word}</span>
            <span className="h-px w-12 bg-white/25" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------- kannada focus */
const REGISTERS = [
  {
    ask: 'Offering a booking',
    formal: 'ನಿಮ್ಮ ವಾಹನದ ಸೇವೆಯನ್ನು ನಿಗದಿಪಡಿಸಲು ಇಚ್ಛಿಸುತ್ತೀರಾ?',
    spoken: 'ನಿಮ್ ಗಾಡಿ service ಗೆ slot book ಮಾಡ್ಲಾ?',
    meaning: 'Shall I book a service slot for your vehicle?',
  },
  {
    ask: 'Asking for a moment',
    formal: 'ದಯವಿಟ್ಟು ಒಂದು ಕ್ಷಣ ನಿರೀಕ್ಷಿಸಿ. ನಾನು ಪರಿಶೀಲಿಸುತ್ತೇನೆ.',
    spoken: 'ಒಂದ್ ನಿಮಿಷ, check ಮಾಡಿ ಹೇಳ್ತೀನಿ.',
    meaning: "One minute, I'll check and tell you.",
  },
  {
    ask: 'Confirming details',
    formal: 'ನಿಮ್ಮ ಭೇಟಿಯ ಸಮಯವನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ.',
    spoken: 'ನಿಮ್ appointment confirm ಆಗಿದೆ.',
    meaning: 'Your appointment is confirmed.',
  },
]

function KannadaFocus() {
  const [i, setI] = useState('0')
  const r = REGISTERS[Number(i)]
  return (
    <div className="shell grid gap-12 py-24 lg:grid-cols-12 lg:py-36">
      <Reveal className="lg:col-span-5">
        <p className="label text-ash">Kannada, first</p>
        <h3 className="display mt-5 text-[clamp(2.2rem,4.3vw,4rem)]">Bengaluru doesn’t talk like a textbook.</h3>
        <p className="lede mt-6 max-w-md text-ash">
          Real callers drop syllables and move between Kannada and English mid-sentence. Our design goal is an agent that
          follows that rhythm: service, slot, check and confirm stay in English, because that is how people say them.
        </p>
        <Tabs
          label="Example situation"
          value={i}
          onChange={setI}
          options={REGISTERS.map((x, n) => ({ id: String(n), label: x.ask }))}
          className="mt-8 flex flex-wrap gap-2"
          itemClass={(on) =>
            `rounded-full border px-4 py-2 text-sm transition-colors ${on ? 'border-white bg-white text-ink' : 'border-white/18 text-white/75 hover:border-white/60'}`
          }
        />
      </Reveal>

      <Reveal delay={0.1} className="lg:col-span-7 lg:pl-10">
        <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="border-t border-white/14 py-8">
            <p className="label text-ash">Formal, written register</p>
            <p lang="kn" className="mt-4 text-xl leading-relaxed text-ash sm:text-2xl">{r.formal}</p>
          </div>
          <div className="border-y border-white/50 py-10">
            <p className="label">Conversational Bengaluru register — our target</p>
            <p lang="kn" className="mt-5 text-[clamp(1.9rem,4vw,3.5rem)] font-medium leading-[1.3]">{r.spoken}</p>
            <p className="mt-4 text-ash">“{r.meaning}”</p>
          </div>
        </motion.div>
      </Reveal>
    </div>
  )
}

/* ------------------------------------------------------------- pipeline */
const STAGES = ['Speech to text', 'Understanding', 'Response', 'Speech output']
// [start, width] in arbitrary units. Shapes the idea; these are not timings.
const PLANS = {
  sequential: [[0, 30], [30, 18], [48, 26], [74, 26]],
  streaming: [[0, 30], [10, 24], [24, 24], [32, 28]],
}

function Pipeline() {
  const [mode, setMode] = useState('streaming')
  return (
    <div className="shell border-t border-white/10 py-24 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="label text-ash">Response architecture</p>
          <h3 className="display mt-5 text-[clamp(2rem,3.4vw,3.2rem)]">Designed for low latency.</h3>
          <p className="mt-5 max-w-sm leading-relaxed text-ash">
            A pause that feels fine in text feels broken on a call. In a streaming design each stage starts working before
            the previous one has finished, so the reply can begin sooner.
          </p>
          <Tabs
            label="Compare pipeline designs"
            value={mode}
            onChange={setMode}
            options={[{ id: 'sequential', label: 'Turn by turn' }, { id: 'streaming', label: 'Streaming' }]}
            className="mt-8 inline-flex gap-1 rounded-full bg-white/7 p-1"
            itemClass={(on) => `rounded-full px-4 py-2 text-sm ${on ? 'bg-white text-ink' : 'text-white/70'}`}
          />
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8 lg:pl-8">
          <figure>
            <div className="space-y-5">
              {STAGES.map((stage, i) => {
                const [x, w] = PLANS[mode][i]
                return (
                  <div key={stage} className="grid items-center gap-2 sm:grid-cols-[9rem_1fr]">
                    <span className="text-sm">{stage}</span>
                    <div className="relative h-8 border-l border-white/25 bg-white/4">
                      <motion.span
                        className="absolute inset-y-1 rounded-sm bg-white"
                        initial={false}
                        animate={{ left: `${x}%`, width: `${w}%` }}
                        transition={{ type: 'spring', stiffness: 110, damping: 20, delay: i * 0.05 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="label mt-4 flex justify-between text-ash sm:pl-[9rem]">
              <span>Caller starts</span>
              <span>Time →</span>
            </div>
            <figcaption className="mt-6 max-w-lg text-xs leading-relaxed text-ash">
              Conceptual diagram, not a measurement. Real response time depends on the network, telephony provider, models,
              language and the systems being queried.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </div>
  )
}

/* --------------------------------------------------------- capabilities */
const CAPABILITIES = [
  ['Understand', ['Natural language understanding', 'Context-aware conversations', 'Real-time conversational interaction', 'Low-latency response architecture']],
  ['Languages', ['Kannada voice intelligence', 'Hindi voice intelligence', 'Tamil voice intelligence', 'English voice intelligence']],
  ['Put to work', ['Automated inbound and outbound calling', 'Customer support and appointment handling', 'Sales and lead qualification', 'Service reminders and follow-ups']],
]

export default function Voice() {
  return (
    <section id="solutions" data-theme="dark" data-surface className="bg-ink text-white" aria-labelledby="voice-title">
      <div id="voice" className="shell pb-12 pt-28 lg:pt-40">
        <SectionTag index="03">Flagship technology · Voice AI</SectionTag>
        <h2 id="voice-title" className="sr-only">Conversations Without Boundaries.</h2>
        <div aria-hidden="true">
          <Lines
            as="p"
            className="display mt-8 text-[clamp(2.9rem,10.2vw,9.5rem)]"
            lines={['Conversations', <span className="text-ash">Without Boundaries.</span>]}
          />
        </div>
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="lede max-w-xl">
              Human-like AI voice systems engineered for India’s linguistic diversity.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-ash">
              Our goal is AI conversation that sounds genuinely natural, above all in Indian languages — the way your
              customers actually speak, including the switches into English.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-3">
            <a href="#voice-demo" className="btn btn-paper">Try the demo <ArrowRight size={17} /></a>
            <a href="#contact" className="btn btn-ghost">Discuss your use case <ArrowRight size={17} /></a>
          </Reveal>
        </div>
      </div>

      <Waveform state="speaking" className="h-40 lg:h-64" />
      <ScriptRun />

      <div id="voice-demo" className="shell scroll-mt-4 py-20 lg:py-28">
        <Reveal className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <h3 className="display text-[clamp(2rem,4vw,3.4rem)]">Hear how a call thinks.</h3>
          <p className="max-w-md text-sm leading-relaxed text-ash">
            Choose a language and follow a sample call: what the caller says, what the agent understands, and what it
            gets done.
          </p>
        </Reveal>
        <VoiceConsole />
      </div>

      <div className="border-t border-white/10">
        <KannadaFocus />
      </div>

      <Pipeline />

      <div className="shell grid gap-x-8 gap-y-12 border-t border-white/10 py-20 md:grid-cols-3 lg:py-28">
        {CAPABILITIES.map(([title, items], c) => (
          <Reveal key={title} delay={c * 0.08}>
            <h3 className="label text-ash">{title}</h3>
            <ul className="mt-5">
              {items.map((item) => (
                <li key={item} className="border-t border-white/12 py-4 text-[1.15rem] leading-snug tracking-tight">{item}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
