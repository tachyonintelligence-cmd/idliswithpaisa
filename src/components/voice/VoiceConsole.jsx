import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Mic, MicOff, Phone, PhoneIncoming, PhoneOutgoing, RotateCcw, Square } from 'lucide-react'
import { voiceProvider } from '../../lib/voice/index.js'
import { LANGUAGES, SCENARIOS, VOICES } from '../../data/voiceScripts.js'
import { Tabs } from '../ui.jsx'
import Waveform from './Waveform.jsx'
import { useMicrophone } from './useMicrophone.js'

const STEPS = [
  { id: 'connecting', label: 'Connect' },
  { id: 'listening', label: 'Listen' },
  { id: 'thinking', label: 'Understand' },
  { id: 'speaking', label: 'Respond' },
]

const STATUS = {
  idle: 'Ready when you are',
  connecting: 'Connecting the call',
  listening: 'Caller is speaking',
  thinking: 'Working out the intent',
  speaking: 'Agent is responding',
  ended: 'Call complete',
}

const EMPTY = { state: 'idle', turns: [], intent: null, details: {}, outcome: null, error: null }

function reduce(call, e) {
  switch (e.type) {
    case 'state':
      return { ...call, state: e.value }
    case 'partial':
    case 'final': {
      const turn = { id: e.id, role: e.role, text: e.text, gloss: e.gloss, done: e.type === 'final' }
      const i = call.turns.findIndex((t) => t.id === e.id)
      return { ...call, turns: i < 0 ? [...call.turns, turn] : call.turns.with(i, turn) }
    }
    case 'insight':
      return { ...call, intent: e.intent, details: { ...call.details, ...e.details } }
    case 'outcome':
      return { ...call, outcome: e.rows }
    case 'error':
      return { ...call, state: 'ended', error: e.message }
    default:
      return call
  }
}

export default function VoiceConsole() {
  const [language, setLanguage] = useState('kn')
  const [voiceId, setVoiceId] = useState(VOICES[0].id)
  const [translate, setTranslate] = useState(true)
  const [call, setCall] = useState(EMPTY)
  const session = useRef(null)
  const logRef = useRef(null)
  const rootRef = useRef(null)
  const mic = useMicrophone()

  const scenario = SCENARIOS[language]
  const busy = !['idle', 'ended'].includes(call.state)
  const reply = call.turns.findLast((t) => t.role === 'agent')

  const hangUp = useCallback(() => {
    session.current?.stop()
    session.current = null
  }, [])

  const reset = useCallback(() => {
    hangUp()
    setCall(EMPTY)
  }, [hangUp])

  const start = () => {
    reset()
    mic.stop()
    session.current = voiceProvider.createSession({
      language,
      voiceId,
      onEvent: (e) => setCall((c) => reduce(c, e)),
    })
    session.current.start()
  }

  const end = () => {
    hangUp()
    setCall((c) => ({ ...c, state: 'ended', turns: c.turns.map((t) => ({ ...t, done: true })) }))
  }

  const changeLanguage = (id) => {
    reset()
    setLanguage(id)
  }

  useEffect(() => hangUp, [hangUp])

  // Release the microphone as soon as the console scrolls out of view.
  const stopMic = mic.stop
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && stopMic())
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [stopMic])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [call.turns, translate])

  const waveState = mic.status === 'on' ? 'mic' : call.state

  return (
    <div ref={rootRef} className="overflow-hidden rounded-xl border border-white/14 bg-[#0d0d0d]">
      {/* header */}
      <div className="flex flex-col gap-3 border-b border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-3">
          {!voiceProvider.isLive && <span className="chip">Simulated demo</span>}
          <span className="text-sm text-ash">Scripted sample calls. No live AI, no real phone call.</span>
        </div>
        <Tabs
          label="Conversation language"
          value={language}
          onChange={changeLanguage}
          options={LANGUAGES.map((l) => ({ id: l.id, label: l.label }))}
          className="grid grid-cols-4 gap-1 rounded-full bg-white/6 p-1"
          itemClass={(on) =>
            `rounded-full px-2 py-2 text-sm transition-colors sm:px-4 ${on ? 'bg-white text-ink' : 'text-white/70 hover:text-white'}`
          }
        />
      </div>

      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        {/* call stage */}
        <div className="flex flex-col p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label flex items-center gap-2 text-ash">
                {scenario.direction.startsWith('Out') ? <PhoneOutgoing size={13} /> : <PhoneIncoming size={13} />}
                {scenario.direction} · sample
              </p>
              <h3 className="mt-2 text-xl font-medium tracking-tight">{scenario.title}</h3>
            </div>
          </div>

          <div className="relative my-6 flex flex-1 items-center">
            <Waveform state={waveState} analyser={mic.analyser} className="h-44 sm:h-56" />
          </div>

          <p role="status" className="text-center text-sm">
            {mic.status === 'on' ? 'Showing your microphone level. Audio stays on this device.' : STATUS[call.state]}
          </p>

          <ol className="mt-5 grid grid-cols-4 gap-1.5" aria-label="Conversation stage">
            {STEPS.map((s) => {
              const on = call.state === s.id
              return (
                <li key={s.id} aria-current={on ? 'step' : undefined}>
                  <span className={`block h-0.5 transition-colors duration-300 ${on ? 'bg-white' : 'bg-white/14'}`} />
                  <span className={`label mt-2 block !text-[0.58rem] !tracking-[0.08em] ${on ? 'text-white' : 'text-ash'}`}>
                    {s.label}
                  </span>
                </li>
              )
            })}
          </ol>

          <fieldset className="mt-7">
            <legend className="label text-ash">Agent voice</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {VOICES.map((v) => (
                <label
                  key={v.id}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-white/12 px-3 py-2.5 transition-colors has-checked:border-white has-checked:bg-white/8 has-focus-visible:outline-2 sm:block"
                >
                  <input
                    type="radio"
                    name="voice"
                    className="sr-only"
                    checked={voiceId === v.id}
                    onChange={() => setVoiceId(v.id)}
                  />
                  <span className="block text-sm font-medium">{v.name}</span>
                  <span className="block text-xs text-ash">{v.style}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-ash">This simulation is silent. Voice choice takes effect once a speech engine is connected.</p>
          </fieldset>

          <div className="mt-6 flex gap-3">
            {busy ? (
              <button type="button" onClick={end} className="btn btn-ghost flex-1">
                <Square size={14} fill="currentColor" /> End conversation
              </button>
            ) : (
              <button type="button" onClick={start} className="btn btn-paper flex-1">
                {call.state === 'ended' ? <RotateCcw size={16} /> : <Phone size={16} />}
                {call.state === 'ended' ? 'Replay conversation' : 'Start conversation'}
              </button>
            )}
            <button
              type="button"
              onClick={mic.status === 'on' || mic.status === 'asking' ? mic.stop : mic.start}
              disabled={busy}
              aria-pressed={mic.status === 'on'}
              aria-label={mic.status === 'on' ? 'Stop microphone preview' : 'Test your microphone'}
              title="Test your microphone (level display only)"
              className={`btn !w-12 !px-0 ${mic.status === 'on' ? 'btn-paper' : 'btn-ghost'}`}
            >
              {mic.status === 'blocked' || mic.status === 'unsupported' ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          <p className="mt-2 min-h-4 text-xs text-ash" role="status">
            {mic.status === 'asking' && 'Waiting for microphone permission…'}
            {mic.status === 'blocked' && 'Microphone access was not granted. The sample calls work without it.'}
            {mic.status === 'unsupported' && 'This browser does not offer microphone access here.'}
            {mic.status === 'off' && 'The mic button only visualises your voice. It does not record or transcribe.'}
          </p>
        </div>

        {/* transcript + response */}
        <div className="flex min-w-0 flex-col border-t border-white/10 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between px-5 pt-5">
            <h4 className="label text-ash">Live transcription</h4>
            {language !== 'en' && (
              <label className="flex cursor-pointer items-center gap-2 text-xs text-white/80">
                <input type="checkbox" checked={translate} onChange={(e) => setTranslate(e.target.checked)} className="accent-white" />
                English meaning
              </label>
            )}
          </div>
          <div ref={logRef} className="h-80 overflow-y-auto overscroll-contain px-5 py-4 [scrollbar-color:#333_transparent] lg:h-0 lg:min-h-80 lg:flex-1">
            {call.turns.length === 0 ? (
              <div className="flex h-full flex-col justify-end text-ash">
                <p className="max-w-xs text-sm">Press “Start conversation” to watch this call unfold turn by turn.</p>
              </div>
            ) : (
              <ol className="space-y-4">
                {call.turns.map((t) => (
                  <motion.li
                    key={t.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`grid grid-cols-[3.75rem_1fr] gap-3 ${t.role === 'agent' ? '' : 'text-white/75'}`}
                  >
                    <span className="label pt-1.5 !text-[0.56rem] text-ash">{t.role === 'agent' ? 'Agent' : 'Caller'}</span>
                    <div>
                      <p lang={language} className="text-[0.98rem] leading-relaxed">
                        {t.text}
                        {!t.done && <span className="blink ml-1 inline-block h-3.5 w-0.5 bg-current align-middle" />}
                      </p>
                      {translate && t.done && t.gloss && <p className="mt-1 text-xs leading-relaxed text-ash">{t.gloss}</p>}
                    </div>
                  </motion.li>
                ))}
              </ol>
            )}
          </div>

          <div className="border-t border-white/10 bg-white/3 p-5">
            <h4 className="label text-ash">AI response</h4>
            <p lang={language} className="mt-3 line-clamp-4 min-h-[3.5rem] text-lg leading-snug tracking-tight">
              {reply?.text ?? <span className="text-ash">The agent’s latest reply appears here.</span>}
            </p>
            <dl className="mt-4 flex min-h-8 flex-wrap gap-2">
              {call.intent && !call.outcome && (
                <div className="flex gap-2 rounded border border-white bg-white px-2.5 py-1 text-xs text-ink">
                  <dt className="opacity-60">Intent</dt>
                  <dd className="font-medium">{call.intent}</dd>
                </div>
              )}
              <AnimatePresence>
                {!call.outcome &&
                  Object.entries(call.details).map(([k, v]) => (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-2 rounded border border-white/18 px-2.5 py-1 text-xs"
                    >
                      <dt className="text-ash">{k}</dt>
                      <dd>{v}</dd>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </dl>
            {call.outcome && (
              <motion.dl initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="-mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/14">
                {call.outcome.map(([k, v]) => (
                  <div key={k} className="bg-[#111] p-3">
                    <dt className="label !text-[0.56rem] text-ash">{k}</dt>
                    <dd className="mt-1 text-sm">{v}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
            {call.error && <p className="mt-3 text-sm">{call.error}</p>}
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 px-5 py-3 text-xs text-ash">{scenario.note} Pacing is scripted and does not represent system latency.</p>
    </div>
  )
}
