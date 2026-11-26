import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { asset } from '../config/site.js'

const EASE = [0.16, 1, 0.3, 1]

export function Logo({ tone = 'black', className = '' }) {
  return (
    <img
      src={asset(`brand/logo-${tone}.png`)}
      width="1329"
      height="228"
      alt="Tachyon Intelligence"
      className={`h-auto ${className}`}
      decoding="async"
    />
  )
}

export function Reveal({ children, delay = 0, y = 28, as = 'div', className, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Headline whose lines rise out of a mask. */
export function Lines({ lines, as = 'h2', className = '', delay = 0, immediate = false }) {
  const Tag = motion[as]
  const trigger = immediate
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
  return (
    <Tag className={className} initial="hide" {...trigger}>
      {lines.map((line, i) => (
        // Padding/negative margin keeps descenders from being clipped by the mask.
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="block"
            variants={{ hide: { y: '112%' }, show: { y: '0%' } }}
            transition={{ duration: 1.1, delay: delay + i * 0.09, ease: EASE }}
          >
            {line}{' '}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function SectionTag({ index, children, className = '' }) {
  return (
    <Reveal className={`label flex items-center gap-3 ${className}`} y={12}>
      <span>{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
      <span>{children}</span>
    </Reveal>
  )
}

/** True while the element is near the viewport. Used to stop off-screen loops. */
export function useOnScreen(margin = '120px') {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, visible]
}

/**
 * Roving-focus tab list: arrow keys move between options, as ARIA tabs expect.
 */
export function Tabs({ options, value, onChange, label, className = '', itemClass, idBase }) {
  const onKeyDown = (e) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!dir) return
    e.preventDefault()
    const i = options.findIndex((o) => o.id === value)
    const next = options[(i + dir + options.length) % options.length]
    onChange(next.id)
    e.currentTarget.querySelector(`[data-id="${next.id}"]`)?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className={className} onKeyDown={onKeyDown}>
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            id={idBase ? `${idBase}-${o.id}` : undefined}
            data-id={o.id}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={itemClass(active)}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
