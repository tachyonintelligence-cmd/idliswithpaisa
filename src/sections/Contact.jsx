import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, Copy, Mail, MessageCircle, Phone } from 'lucide-react'
import { SITE } from '../config/site.js'
import { Lines, Reveal, SectionTag } from '../components/ui.jsx'

const REQUIREMENTS = [
  'Voice AI calling', 'Business automation', 'Inventory intelligence', 'NFC products', 'Custom AI solution', 'Something else',
]

const EMPTY = { name: '', email: '', company: '', requirement: '', message: '' }

function validate(v) {
  const errors = {}
  if (!v.name.trim()) errors.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = 'Enter a valid email address.'
  if (!v.company.trim()) errors.company = 'Enter your company or business name.'
  if (!v.requirement) errors.requirement = 'Choose what you need.'
  if (v.message.trim().length < 10) errors.message = 'Tell us a little more (at least 10 characters).'
  return errors
}

const compose = (v) =>
  [
    'New enquiry for Tachyon Intelligence', '',
    `Name: ${v.name.trim()}`, `Email: ${v.email.trim()}`, `Company: ${v.company.trim()}`,
    `Requirement: ${v.requirement}`, '', v.message.trim(),
  ].join('\n')

const waLink = (number, text) => `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="label text-ash">{label}</label>
      {children}
      <p id={`${id}-error`} className="mt-1.5 min-h-4 text-xs text-white">{error && `↑ ${error}`}</p>
    </div>
  )
}

function Form() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('editing') // editing | sending | sent | handoff | failed
  const [copied, setCopied] = useState(false)
  const done = useRef(null)

  useEffect(() => {
    if (status === 'sent' || status === 'handoff') done.current?.focus()
  }, [status])

  const bind = (name) => ({
    id: `f-${name}`,
    name,
    value: values[name],
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': `f-${name}-error`,
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: e.target.value }))
      if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }))
    },
    className:
      'mt-2 w-full border-0 border-b border-white/25 bg-transparent py-2.5 text-base text-white transition-colors placeholder:text-white/30 focus:border-white aria-invalid:border-white aria-invalid:border-b-2',
  })

  const submit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) return document.getElementById(`f-${first}`).focus()
    if (!SITE.contactEndpoint) return setStatus('handoff')
    setStatus('sending')
    try {
      const res = await fetch(SITE.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      setStatus(res.ok ? 'sent' : 'failed')
    } catch {
      setStatus('failed')
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(compose(values))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  if (status === 'sent' || status === 'handoff' || status === 'failed') {
    const sent = status === 'sent'
    return (
      <div className="rounded-xl border border-white/20 p-6 sm:p-8">
        <h3 ref={done} tabIndex={-1} className="text-3xl font-medium tracking-tight outline-none">
          {sent ? 'Enquiry sent.' : status === 'failed' ? 'That did not go through.' : 'One more step: send it.'}
        </h3>
        <p className="mt-3 text-ash">
          {sent
            ? 'Thank you. Our team will get back to you.'
            : 'Your enquiry has not been sent yet. Choose a number to open it in WhatsApp, then press send there.'}
        </p>
        {!sent && (
          <>
            <pre className="mt-6 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white/6 p-4 font-sans text-sm leading-relaxed">{compose(values)}</pre>
            <div className="mt-5 flex flex-col gap-2">
              {SITE.phones.map((p) => (
                <a key={p.wa} href={waLink(p.wa, compose(values))} target="_blank" rel="noopener noreferrer" className="btn btn-paper">
                  <MessageCircle size={17} /> Send on WhatsApp to {p.display}
                </a>
              ))}
              <button type="button" onClick={copy} className="btn btn-ghost">
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy enquiry'}
              </button>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => { if (sent) setValues(EMPTY); setStatus('editing'); setCopied(false) }}
          className="mt-6 text-sm underline underline-offset-4"
        >
          {sent ? 'Send another enquiry' : 'Edit my enquiry'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      <Field id="f-name" label="Name" error={errors.name}>
        <input {...bind('name')} autoComplete="name" required />
      </Field>
      <Field id="f-email" label="Business email" error={errors.email}>
        <input {...bind('email')} type="email" autoComplete="email" required />
      </Field>
      <Field id="f-company" label="Company" error={errors.company}>
        <input {...bind('company')} autoComplete="organization" required />
      </Field>
      <Field id="f-requirement" label="Requirement" error={errors.requirement}>
        <select {...bind('requirement')} required>
          <option value="" className="bg-ink">Select one</option>
          {REQUIREMENTS.map((r) => <option key={r} className="bg-ink">{r}</option>)}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field id="f-message" label="Message" error={errors.message}>
          <textarea {...bind('message')} rows={4} maxLength={1500} required />
        </Field>
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === 'sending'} className="btn btn-paper !min-h-14 !px-8">
          {status === 'sending' ? 'Sending…' : 'Submit enquiry'} <ArrowRight size={17} />
        </button>
        {!SITE.contactEndpoint && (
          <p className="max-w-xs text-xs text-ash">Submitting prepares your enquiry to send through WhatsApp. This site does not store it.</p>
        )}
      </div>
    </form>
  )
}

export default function Contact() {
  return (
    <section id="contact" data-theme="dark" data-surface className="bg-ink py-28 text-white lg:py-40" aria-labelledby="contact-title">
      <div className="shell">
        <SectionTag index="09">Contact</SectionTag>
        <h2 id="contact-title" className="sr-only">Let's Build Something Intelligent.</h2>
        <div aria-hidden="true">
          <Lines as="p" className="display mt-8 text-[clamp(2.9rem,9vw,8.5rem)]" lines={['Let’s Build', 'Something Intelligent.']} />
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="lede max-w-md text-ash">
                Have a business challenge worth solving? Let’s explore what intelligent technology can do for you.
              </p>
            </Reveal>
            <ul className="mt-10">
              {SITE.phones.map((p) => (
                <li key={p.tel} className="border-t border-white/16 py-5">
                  <p className="label text-ash">Phone</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <a href={`tel:${p.tel}`} className="flex items-center gap-3 text-2xl tracking-tight sm:text-3xl">
                      <Phone size={19} aria-hidden="true" /> {p.display}
                    </a>
                    <a href={waLink(p.wa)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-10 !px-4 !text-sm" aria-label={`WhatsApp ${p.display}`}>
                      WhatsApp <ArrowUpRight size={15} />
                    </a>
                  </div>
                </li>
              ))}
              <li className="border-y border-white/16 py-5">
                <p className="label text-ash">Email</p>
                <p className="mt-2 flex items-center gap-3 text-lg">
                  <Mail size={19} aria-hidden="true" />
                  {SITE.email ? <a href={`mailto:${SITE.email}`}>{SITE.email}</a> : <span className="text-ash">[ Official email — to be added ]</span>}
                </p>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Form />
          </div>
        </div>
      </div>
    </section>
  )
}
