import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

const HEIGHT = 220
const PAD = { l: 40, r: 14, t: 14, b: 26 }

const niceMax = (v) => {
  const unit = 10 ** Math.floor(Math.log10(v || 1))
  return [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10].map((m) => m * unit).find((m) => m >= v)
}

/** Weekly unit sales: solid line = recorded sample weeks, dashed = forecast. */
export default function TrendChart({ actual, next }) {
  const wrap = useRef(null)
  const [width, setWidth] = useState(560)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])

  const all = [...actual, ...next].map(Math.round)
  const labels = all.map((_, i) => (i < actual.length ? `W${i + 1}` : `F${i - actual.length + 1}`))
  const max = niceMax(Math.max(...all) * 1.08)
  const x = (i) => PAD.l + (i * (width - PAD.l - PAD.r)) / (all.length - 1)
  const y = (v) => PAD.t + (1 - v / max) * (HEIGHT - PAD.t - PAD.b)
  const path = (from, to) =>
    all.slice(from, to).map((v, i) => `${i ? 'L' : 'M'}${x(from + i)} ${y(v)}`).join('')
  const split = actual.length

  const onMove = (e) => {
    const r = wrap.current.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left - PAD.l) / (width - PAD.l - PAD.r)) * (all.length - 1))
    setHover(Math.min(all.length - 1, Math.max(0, i)))
  }

  const onKey = (e) => {
    const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!dir) return
    e.preventDefault()
    setHover((h) => Math.min(all.length - 1, Math.max(0, (h ?? split - 1) + dir)))
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate">
        <span className="flex items-center gap-2"><span className="w-5 border-t-2 border-ink" /> Sales (sample)</span>
        <span className="flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-ink" /> Trend forecast</span>
      </div>
      <div
        ref={wrap}
        className="relative touch-pan-y"
        tabIndex={0}
        role="group"
        aria-label="Weekly units sold with four-week forecast. Use left and right arrow keys to read values."
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
        onBlur={() => setHover(null)}
        onKeyDown={onKey}
      >
        <svg width={width} height={HEIGHT} className="block max-w-full" aria-hidden="true">
          <rect x={x(split - 1)} y={PAD.t} width={Math.max(0, width - PAD.r - x(split - 1))} height={HEIGHT - PAD.t - PAD.b} fill="#f6f6f6" />
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1={PAD.l} x2={width - PAD.r} y1={y(max * f)} y2={y(max * f)} stroke="#050505" strokeOpacity="0.09" />
              <text x={PAD.l - 8} y={y(max * f) + 3.5} textAnchor="end" fontSize="10" fill="#5c5c5c">{Math.round(max * f)}</text>
            </g>
          ))}
          {labels.map((l, i) =>
            width > 420 || i % 2 === 0 ? (
              <text key={l} x={x(i)} y={HEIGHT - 8} textAnchor="middle" fontSize="10" fill="#5c5c5c">{l}</text>
            ) : null,
          )}
          <motion.path
            key={`a${all.join()}`}
            d={path(0, split)}
            fill="none"
            stroke="#050505"
            strokeWidth="2"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
          <path d={path(split - 1, all.length)} fill="none" stroke="#050505" strokeWidth="2" strokeDasharray="5 5" />
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={HEIGHT - PAD.b} stroke="#050505" strokeOpacity="0.35" />
              <circle cx={x(hover)} cy={y(all[hover])} r="5" fill="#050505" stroke="#fff" strokeWidth="2" />
            </g>
          )}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2.5 py-1.5 text-xs text-white"
            style={{ left: Math.min(width - 66, Math.max(66, x(hover))) }}
          >
            <strong className="font-semibold">{all[hover]} units</strong>
            <span className="ml-2 text-white/60">
              {hover < split ? `Week ${hover + 1}` : `Forecast +${hover - split + 1}`}
            </span>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {hover !== null ? `${labels[hover]}: ${all[hover]} units` : ''}
      </p>
      <table className="sr-only">
        <caption>Weekly units sold and forecast</caption>
        <tbody>
          {all.map((v, i) => (
            <tr key={labels[i]}><th>{i < split ? `Week ${i + 1}` : `Forecast week ${i - split + 1}`}</th><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
