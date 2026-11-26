import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { RotateCcw, Sparkles } from 'lucide-react'
import { PRODUCTS } from '../../data/inventory.js'
import { analyseAll, answer, days, onHand } from '../../lib/inventory.js'
import StatusTag from '../inventory/StatusTag.jsx'

const initial = () =>
  PRODUCTS.map((p) => ({ sku: p.sku, stock: String(onHand(p, 'all')), last: String(p.sales.at(-1)) }))

const QUESTIONS = [
  ['reorder', 'What should I reorder?'],
  ['trends', 'What is trending?'],
  ['excess', 'Where is stock sitting?'],
]

const toCount = (v) => Math.max(0, Number(v) || 0)

export default function InventoryLab() {
  const [edits, setEdits] = useState(initial)
  const [question, setQuestion] = useState(null)

  const rows = useMemo(
    () =>
      analyseAll(
        PRODUCTS.map((p, i) => ({
          ...p,
          stock: { indiranagar: toCount(edits[i].stock), peenya: 0, mysuru: 0 },
          sales: [...p.sales.slice(0, -1), toCount(edits[i].last)],
        })),
      ),
    [edits],
  )
  const result = question && answer(question, rows)

  const edit = (i, key, value) =>
    setEdits((e) => e.with(i, { ...e[i], [key]: value.replace(/\D/g, '').slice(0, 5) }))

  return (
    <div className="grid lg:grid-cols-[1.35fr_1fr]">
      <div className="min-w-0 p-4 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-medium tracking-tight">Change the data. Ask again.</h3>
            <p className="mt-2 text-slate">Edit stock or last week’s sales and watch cover and status respond.</p>
          </div>
          <button type="button" onClick={() => { setEdits(initial()); setQuestion(null) }} className="btn btn-line !min-h-10 shrink-0 !px-3.5 !text-sm">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <ul className="mt-6">
          {rows.map((r, i) => (
            <li key={r.sku} className="grid grid-cols-2 items-end gap-x-3 gap-y-2 border-t border-ink/10 py-3.5 md:grid-cols-[1.6fr_5rem_5rem_7.5rem] md:items-center">
              <p className="col-span-2 md:col-span-1">
                <span className="block text-[0.95rem]">{r.name}</span>
                <span className="text-xs text-slate">{r.lead}-day lead time</span>
              </p>
              {[['stock', 'On hand'], ['last', 'Sold last week']].map(([key, label]) => (
                <label key={key} className="block text-xs text-slate">
                  {label}
                  <input
                    inputMode="numeric"
                    value={edits[i][key]}
                    onChange={(e) => edit(i, key, e.target.value)}
                    aria-label={`${label}, ${r.name}`}
                    className="mt-1 w-full rounded-md border border-ink/15 px-2.5 py-1.5 text-base tabular-nums text-ink focus:border-ink"
                  />
                </label>
              ))}
              <p className="col-span-2 flex items-center justify-between gap-2 md:col-span-1 md:flex-col md:items-end md:gap-1">
                <StatusTag status={r.status} />
                <span className="text-xs tabular-nums text-slate">{days(r.cover)}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-ink p-5 text-white sm:p-8">
        <h4 className="flex items-center gap-2 font-medium"><Sparkles size={16} /> Ask the inventory</h4>
        <div className="mt-4 flex flex-col gap-2">
          {QUESTIONS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={question === id} onClick={() => setQuestion(id)} className="rounded-lg border border-white/18 px-4 py-3 text-left transition-colors hover:border-white aria-pressed:border-white aria-pressed:bg-white aria-pressed:text-ink">
              {label}
            </button>
          ))}
        </div>
        <div aria-live="polite" className="mt-7">
          {result ? (
            <motion.div key={question} initial="hide" animate="show" variants={{ show: { transition: { staggerChildren: 0.18 } } }}>
              {[
                <p key="h" className="text-xl leading-snug tracking-tight">{result.headline}</p>,
                ...result.points.map((p) => <p key={p} className="mt-3 border-t border-white/12 pt-3 text-sm leading-relaxed text-white/75">{p}</p>),
                <p key="b" className="mt-5 text-xs leading-relaxed text-ash">How this was worked out: {result.basis}</p>,
              ].map((node) => (
                <motion.div key={node.key} variants={{ hide: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>{node}</motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-sm text-ash">Pick a question to generate an insight from the table.</p>
          )}
        </div>
        <p className="mt-8 border-t border-white/12 pt-4 text-xs text-ash">Simulated insight: calculated in your browser with transparent rules on sample data. No AI service is called.</p>
      </div>
    </div>
  )
}
