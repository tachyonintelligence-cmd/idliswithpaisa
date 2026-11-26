import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { LANGUAGES } from '../../data/voiceScripts.js'
import { AGENT, INTENT_LABELS, detectIntent } from '../../lib/intents.js'
import { Tabs } from '../ui.jsx'

export default function VoiceLab() {
  const [language, setLanguage] = useState('kn')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [intent, setIntent] = useState(null)
  const [pending, setPending] = useState(false)
  const timer = useRef()
  const log = useRef(null)
  const agent = AGENT[language]

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    log.current.scrollTop = log.current.scrollHeight
  }, [messages, pending])

  const change = (id) => {
    clearTimeout(timer.current)
    setLanguage(id)
    setMessages([])
    setIntent(null)
    setPending(false)
  }

  const send = (text) => {
    const clean = text.trim()
    if (!clean || pending) return
    setDraft('')
    setPending(true)
    setMessages((m) => [...m, { who: 'you', text: clean }])
    timer.current = setTimeout(() => {
      const result = detectIntent(clean)
      setIntent(result.intent)
      setMessages((m) => [...m, { who: 'agent', text: agent[result.intent] }])
      setPending(false)
    }, 650)
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.35fr]">
      <div className="border-b border-ink/10 p-5 sm:p-8 lg:border-b-0 lg:border-r">
        <h3 className="text-2xl font-medium tracking-tight">Say something to the agent.</h3>
        <p className="mt-2 text-slate">Pick a language, then tap a sample line or type your own.</p>
        <Tabs
          label="Lab language"
          value={language}
          onChange={change}
          options={LANGUAGES.map((l) => ({ id: l.id, label: l.label }))}
          className="mt-6 flex flex-wrap gap-1.5"
          itemClass={(on) => `rounded-full border px-4 py-2 text-sm ${on ? 'border-ink bg-ink text-white' : 'border-ink/15 hover:border-ink'}`}
        />
        <ul className="mt-6">
          {agent.samples.map((s) => (
            <li key={s} className="border-t border-ink/10">
              <button type="button" lang={language} disabled={pending} onClick={() => send(s)} className="group flex w-full items-center justify-between gap-3 py-3 text-left">
                {s} <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            </li>
          ))}
        </ul>
        <dl className="mt-6 rounded-lg bg-mist p-4 text-sm" aria-live="polite">
          <dt className="label text-slate">Detected intent</dt>
          <dd className="mt-1.5 text-lg font-medium">{intent ? INTENT_LABELS[intent] : '—'}</dd>
        </dl>
        <p className="mt-3 text-xs text-slate">Simulation: simple keyword rules in your browser, not a language model. It recognises only a few topics.</p>
      </div>

      <div className="flex min-w-0 flex-col bg-mist/50">
        <ol ref={log} aria-live="polite" className="h-[26rem] space-y-3 overflow-y-auto p-5 sm:p-8 lg:h-0 lg:min-h-[28rem] lg:flex-1">
          {[{ who: 'agent', text: agent.greeting }, ...messages].map((m, i) => (
            <li key={i} className={`flex ${m.who === 'you' ? 'justify-end' : ''}`}>
              <p lang={language} className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${m.who === 'you' ? 'rounded-br-sm bg-ink text-white' : 'rounded-bl-sm border border-ink/10 bg-white'}`}>
                <span className="sr-only">{m.who === 'you' ? 'You: ' : 'Agent: '}</span>
                {m.text}
              </p>
            </li>
          ))}
          {pending && <li className="blink text-sm text-slate">Agent is replying…</li>}
        </ol>
        <form onSubmit={(e) => { e.preventDefault(); send(draft) }} className="flex gap-2 border-t border-ink/10 bg-white p-3">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} lang={language} aria-label="Your message" placeholder="Type a line…" maxLength={200} className="min-w-0 flex-1 rounded-full bg-mist px-4 py-3 text-base" />
          <button type="submit" disabled={!draft.trim() || pending} aria-label="Send" className="btn btn-ink !w-12 !px-0"><ArrowUp size={18} /></button>
        </form>
      </div>
    </div>
  )
}
