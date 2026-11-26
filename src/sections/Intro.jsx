import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Reveal, SectionTag, useOnScreen } from '../components/ui.jsx'

const STATEMENT =
  'Tachyon develops AI systems designed to solve real operational problems: the call nobody picked up, the stock that ran out unnoticed, the customer who left without a way to reach you again.'

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return <motion.span style={{ opacity }}>{children} </motion.span>
}

function ScrollStatement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = STATEMENT.split(' ')
  return (
    <p ref={ref} className="max-w-[26ch] text-[clamp(1.7rem,3.6vw,3.2rem)] font-medium leading-[1.16] tracking-[-0.032em]">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

/* ---------------------------------------------------------------- diagrams */
const stroke = { stroke: '#050505', fill: 'none', strokeWidth: 1 }
const text = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', fill: '#050505' }

function Pulse({ d, dur = 2.6, delay = 0 }) {
  return (
    <circle r="3.5" fill="#050505">
      <animateMotion path={d} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  )
}

function Box({ x, y, w = 100, children, solid }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="34" rx="4" fill={solid ? '#050505' : '#fff'} stroke="#050505" />
      <text x={x + w / 2} y={y + 21} textAnchor="middle" {...text} fill={solid ? '#fff' : '#050505'}>
        {children}
      </text>
    </g>
  )
}

function IntelligenceDiagram({ live }) {
  const layers = [[40, [50, 110, 170, 230]], [170, [80, 140, 200]], [300, [50, 110, 170, 230]], [420, [140]]]
  return (
    <svg viewBox="0 0 480 280" role="img" aria-label="Diagram: language signals pass through layers to a single understood intent">
      {layers.slice(0, -1).map(([x, ys], l) =>
        ys.flatMap((y) =>
          layers[l + 1][1].map((y2) => (
            <line key={`${x}-${y}-${y2}`} x1={x} y1={y} x2={layers[l + 1][0]} y2={y2} {...stroke} strokeOpacity="0.16" />
          )),
        ),
      )}
      {['M40 110 L170 80 L300 170 L420 140', 'M40 230 L170 200 L300 110 L420 140', 'M40 50 L170 140 L300 230 L420 140'].map(
        (d, i) => (
          <g key={d}>
            <path d={d} {...stroke} className="flow-line" />
            {live && <Pulse d={d} delay={i * 0.8} />}
          </g>
        ),
      )}
      {layers.slice(0, -1).flatMap(([x, ys]) => ys.map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill="#fff" stroke="#050505" />))}
      <circle cx="420" cy="140" r="16" fill="#050505" />
      <text x="20" y="268" {...text}>SIGNAL</text>
      <text x="170" y="268" textAnchor="middle" {...text}>LANGUAGE</text>
      <text x="300" y="268" textAnchor="middle" {...text}>CONTEXT</text>
      <text x="420" y="268" textAnchor="middle" {...text}>INTENT</text>
    </svg>
  )
}

function AutomationDiagram({ live }) {
  const main = 'M60 60 H240 V140'
  const yes = 'M240 140 H90 V218'
  const no = 'M240 140 H390 V218'
  return (
    <svg viewBox="0 0 480 280" role="img" aria-label="Diagram: an enquiry is routed either to automatic handling or to a person">
      {[main, yes, no].map((d, i) => (
        <g key={d}>
          <path d={d} {...stroke} className="flow-line" />
          {live && <Pulse d={d} delay={i === 0 ? 0 : 1.4 + i * 0.5} />}
        </g>
      ))}
      <Box x={14} y={43} w={110}>ENQUIRY</Box>
      <Box x={185} y={43} w={110}>UNDERSTAND</Box>
      <path d="M240 112 L268 140 L240 168 L212 140 Z" fill="#050505" />
      <Box x={30} y={218} w={120} solid>RESOLVE</Box>
      <Box x={330} y={218} w={120}>HAND OVER</Box>
      <text x="90" y="130" {...text}>ROUTINE</text>
      <text x="330" y="130" {...text}>NEEDS A PERSON</text>
    </svg>
  )
}

function ConnectivityDiagram({ live }) {
  const links = [
    ['M240 140 L96 62', 40, 45, 'PROFILE'],
    ['M240 140 L384 62', 328, 45, 'REVIEWS'],
    ['M240 140 L96 218', 40, 201, 'CONTACTS'],
    ['M240 140 L384 218', 328, 201, 'DATA'],
  ]
  return (
    <svg viewBox="0 0 480 280" role="img" aria-label="Diagram: one NFC tap connects to profile, reviews, contacts and data">
      {links.map(([d], i) => (
        <g key={d}>
          <path d={d} {...stroke} className="flow-line" />
          {live && <Pulse d={d} dur={2} delay={i * 0.5} />}
        </g>
      ))}
      {[34, 54, 76].map((r, i) => (
        <circle key={r} cx="240" cy="140" r={r} {...stroke} strokeOpacity={0.45 - i * 0.13} />
      ))}
      <circle cx="240" cy="140" r="22" fill="#050505" />
      <text x="240" y="144" textAnchor="middle" {...text} fill="#fff">TAP</text>
      {links.map(([, x, y, label]) => (
        <Box key={label} x={x} y={y} w={112}>{label}</Box>
      ))}
    </svg>
  )
}

const PILLARS = [
  {
    n: '01',
    title: 'Intelligence',
    body: 'Systems that read what people actually mean — across languages, accents and half-finished sentences — and keep hold of the context as the conversation moves.',
    items: ['AI models', 'Natural language processing', 'Contextual understanding', 'Voice intelligence'],
    Diagram: IntelligenceDiagram,
  },
  {
    n: '02',
    title: 'Automation',
    body: 'Understanding is only useful when something happens next. We turn intent into completed work, and route the exceptions to a person with the context attached.',
    items: ['Intelligent workflows', 'Customer interaction systems', 'Business process automation'],
    Diagram: AutomationDiagram,
  },
  {
    n: '03',
    title: 'Connectivity',
    body: 'The physical side of a business should be as connected as its software. One tap can open a profile, collect a review or start a relationship.',
    items: ['NFC', 'Digital identity', 'Business data', 'Intelligent infrastructure'],
    Diagram: ConnectivityDiagram,
  },
]

function Pillar({ n, title, body, items, Diagram }) {
  const [ref, live] = useOnScreen('0px')
  return (
    <article
      ref={ref}
      data-offscreen={live ? undefined : ''}
      className="grid gap-10 border-t border-ink/12 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20"
    >
      <Reveal className="lg:col-span-5">
        <p className="label text-slate">{n}</p>
        <h3 className="display mt-4 text-[clamp(2.3rem,4.4vw,4rem)]">{title}</h3>
        <p className="lede mt-5 max-w-[30rem] text-slate">{body}</p>
        <ul className="mt-8 grid gap-x-6 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="border-t border-ink/10 py-3 text-[0.95rem] tracking-tight">{item}</li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1} className="min-w-0 self-center lg:col-span-7 lg:pl-8">
        <div className="scroll-x">
          <div className="diagram min-w-0">
            <Diagram live={live} />
          </div>
        </div>
      </Reveal>
    </article>
  )
}

export default function Intro() {
  return (
    <div id="technology">
      <section id="intro" aria-labelledby="intro-title" className="shell pb-10 pt-28 lg:pt-44">
        <SectionTag index="02">Applied intelligence</SectionTag>
        <Reveal>
          <h2 id="intro-title" className="display h-section mt-8 max-w-[14ch]">
            Beyond Artificial Intelligence. <span className="text-ash">Into Applied Intelligence.</span>
          </h2>
        </Reveal>
        <div className="py-24 lg:ml-auto lg:w-4/5 lg:py-40">
          <ScrollStatement />
        </div>
        {PILLARS.map((p) => (
          <Pillar key={p.n} {...p} />
        ))}
      </section>
    </div>
  )
}
