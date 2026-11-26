import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, Boxes, ChartLine, LayoutGrid, Sparkles, Warehouse,
} from 'lucide-react'
import { LOCATIONS, PRODUCTS } from '../data/inventory.js'
import { analyseAll, answer, days, rupees, sum } from '../lib/inventory.js'
import TrendChart from '../components/inventory/TrendChart.jsx'
import StatusTag from '../components/inventory/StatusTag.jsx'
import { Lines, Reveal, SectionTag, Tabs, useOnScreen } from '../components/ui.jsx'

const MOVEMENTS = [
  { Icon: ArrowUpRight, kind: 'Sale', text: '4 × Engine oil 10W-40', place: 'Indiranagar' },
  { Icon: ArrowDownLeft, kind: 'Received', text: '60 × Spark plug', place: 'Peenya warehouse' },
  { Icon: ArrowLeftRight, kind: 'Transfer', text: '10 × Brake pad set', place: 'Peenya → Mysuru' },
  { Icon: ArrowUpRight, kind: 'Sale', text: '1 × Battery 5 Ah', place: 'Mysuru' },
  { Icon: ArrowUpRight, kind: 'Sale', text: '2 × Air filter', place: 'Indiranagar' },
  { Icon: ArrowDownLeft, kind: 'Received', text: '24 × Engine oil 10W-40', place: 'Peenya warehouse' },
  { Icon: ArrowLeftRight, kind: 'Transfer', text: '3 × Chain and sprocket kit', place: 'Mysuru → Indiranagar' },
]

function MovementFeed({ location }) {
  const [ref, live] = useOnScreen('0px')
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!live || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setTick((t) => t + 1), 2600)
    return () => clearInterval(id)
  }, [live])

  const name = LOCATIONS.find((l) => l.id === location).label.replace(' warehouse', '')
  const pool = location === 'all' ? MOVEMENTS : MOVEMENTS.filter((m) => m.place.includes(name))
  const visible = Array.from({ length: Math.min(4, pool.length) }, (_, i) => {
    const n = tick - i
    return { ...pool[((n % pool.length) + pool.length) % pool.length], key: n }
  })

  return (
    <div ref={ref}>
      <h4 className="text-sm font-medium">Stock movement <span className="font-normal text-slate">· simulated feed</span></h4>
      <ul className="mt-3 h-[14.5rem] overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map(({ key, Icon, kind, text, place }) => (
            <motion.li
              layout
              key={key}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 border-t border-ink/8 py-2.5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-mist"><Icon size={15} /></span>
              <span className="min-w-0">
                <span className="block truncate text-sm">{text}</span>
                <span className="block truncate text-xs text-slate">{kind} · {place}</span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

const RAIL = [
  [LayoutGrid, 'Overview', true], [Boxes, 'Stock'], [ArrowLeftRight, 'Movements'], [ChartLine, 'Forecast'], [Warehouse, 'Locations'],
]

function Dashboard() {
  const [location, setLocation] = useState('all')
  const [selected, setSelected] = useState(PRODUCTS[0].sku)
  const rows = useMemo(() => analyseAll(PRODUCTS, location), [location])
  const row = rows.find((r) => r.sku === selected)
  const alerts = rows.filter((r) => r.status === 'low')
  const insight = useMemo(() => answer('reorder', rows), [rows])
  const maxCover = 45

  const kpis = [
    ['Units on hand', sum(rows.map((r) => r.stock)).toLocaleString('en-IN')],
    ['Stock value', rupees(sum(rows.map((r) => r.stock * r.price)))],
    ['Units sold, last week', Math.round(sum(rows.map((r) => r.sales.at(-1)))).toLocaleString('en-IN')],
    ['Below lead-time cover', `${alerts.length} of ${rows.length}`],
  ]

  return (
    <div className="overflow-hidden rounded-xl border border-ink/12 bg-white shadow-[0_50px_100px_-50px_rgb(0_0_0/0.35)]">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
        <p className="text-sm font-medium">Inventory Intelligence <span className="font-normal text-slate">/ Sample Auto Parts</span></p>
        <div className="flex items-center gap-3">
          <span className="chip text-slate">Sample data</span>
          <span className="relative" aria-label={`${alerts.length} low-stock notifications`} role="img">
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-alert text-[0.6rem] font-semibold text-white">
                {alerts.length}
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="flex">
        <div aria-hidden="true" className="hidden w-44 shrink-0 border-r border-ink/10 p-3 xl:block">
          {RAIL.map(([Icon, label, on]) => (
            <div key={label} className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm ${on ? 'bg-ink text-white' : 'text-slate'}`}>
              <Icon size={15} /> {label}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="scroll-x border-b border-ink/10 px-4 py-2.5">
            <Tabs
              label="Location"
              value={location}
              onChange={setLocation}
              options={LOCATIONS}
              className="flex w-max gap-1"
              itemClass={(on) => `rounded-full px-3.5 py-1.5 text-sm ${on ? 'bg-ink text-white' : 'text-slate hover:text-ink'}`}
            />
          </div>

          <dl className="grid grid-cols-2 border-b border-ink/10 lg:grid-cols-4">
            {kpis.map(([k, v], i) => (
              <div key={k} className={`p-4 ${i % 2 ? 'border-l border-ink/10' : ''} ${i > 1 ? 'border-t border-ink/10 lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}>
                <dt className="text-xs text-slate">{k}</dt>
                <dd className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="grid lg:grid-cols-[1.7fr_1fr]">
            <div className="min-w-0 border-b border-ink/10 p-4 lg:border-r">
              <h4 className="mb-1 text-sm font-medium">{row.name} — weekly sales and demand forecast</h4>
              <TrendChart actual={row.sales} next={row.next} />
            </div>
            <div className="border-b border-ink/10 p-4">
              <MovementFeed key={location} location={location} />
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.7fr_1fr]">
            <div className="scroll-x min-w-0 lg:border-r lg:border-ink/10">
              <table className="w-full text-left text-sm sm:min-w-[34rem]">
                <caption className="sr-only">Stock by product. Select a product to chart it.</caption>
                <thead className="text-xs text-slate">
                  <tr className="border-b border-ink/10">
                    <th className="px-4 py-2.5 font-normal">Product</th>
                    <th className="px-2 py-2.5 text-right font-normal">On hand</th>
                    <th className="px-3 py-2.5 font-normal sm:px-4">Cover</th>
                    <th className="hidden px-4 py-2.5 font-normal sm:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.sku}
                      onClick={() => setSelected(r.sku)}
                      className={`cursor-pointer border-b border-ink/8 last:border-0 ${r.sku === selected ? 'bg-mist' : 'hover:bg-mist/60'}`}
                    >
                      <td className="px-4 py-2.5">
                        <button type="button" onClick={() => setSelected(r.sku)} aria-pressed={r.sku === selected} className="text-left">
                          <span className="block">{r.name}</span>
                          <span className="font-mono text-[0.65rem] text-slate">{r.sku}</span>
                          <span className="mt-1 block sm:hidden"><StatusTag status={r.status} /></span>
                        </button>
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums">{r.stock}</td>
                      <td className="px-3 py-2.5 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="relative hidden h-1.5 w-24 overflow-hidden rounded-full bg-ink/8 sm:block">
                            <motion.span
                              className={`absolute inset-y-0 left-0 rounded-full ${r.status === 'low' || r.status === 'watch' ? 'bg-alert' : 'bg-ink'}`}
                              initial={false}
                              animate={{ width: `${Math.min(100, (r.cover / maxCover) * 100)}%` }}
                              transition={{ duration: 0.7 }}
                            />
                          </span>
                          <span className="whitespace-nowrap text-xs tabular-nums text-slate">{days(r.cover)}</span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-2.5 sm:table-cell"><StatusTag status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-ink/10 bg-ink p-5 text-white lg:border-t-0">
              <h4 className="flex items-center gap-2 text-sm font-medium"><Sparkles size={15} /> Suggested decision</h4>
              <motion.div key={location} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className="mt-4 text-xl leading-snug tracking-tight">{insight.headline}</p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
                  {insight.points.slice(0, 3).map((p) => <li key={p} className="border-t border-white/12 pt-3">{p}</li>)}
                </ul>
              </motion.div>
              <p className="mt-5 text-xs text-ash">Rule-based on sample data. A person approves every order.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CAPABILITIES = [
  'Intelligent inventory tracking', 'Stock movement monitoring', 'Real-time inventory visibility',
  'Low-stock notifications', 'Demand forecasting', 'Sales trend analysis',
  'Inventory insights', 'Multi-location inventory management', 'AI-assisted business decisions',
]

export default function Inventory() {
  return (
    <section id="inventory" className="bg-mist py-28 lg:py-40" aria-labelledby="inventory-title">
      <div className="shell">
        <SectionTag index="04">Inventory intelligence</SectionTag>
        <div className="mt-8 grid items-end gap-8 lg:grid-cols-12">
          <h2 id="inventory-title" className="sr-only">Know Your Inventory. Before It Knows You.</h2>
          <div aria-hidden="true" className="lg:col-span-8">
            <Lines as="p" className="display h-section" lines={['Know Your Inventory.', 'Before It Knows You.']} />
          </div>
          <Reveal className="lede text-slate lg:col-span-4">
            AI-powered inventory management that shows what you hold, where it is moving and what is likely to run short —
            early enough to act.
          </Reveal>
        </div>

        <Reveal className="mt-14 lg:mt-20" y={50}>
          <Dashboard />
        </Reveal>

        <ul className="mt-16 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <Reveal as="li" key={c} delay={(i % 3) * 0.06} className="flex gap-4 border-t border-ink/12 py-5">
              <span className="label pt-1 text-slate">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-lg tracking-tight">{c}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
