import { lazy, Suspense, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Hero from './sections/Hero.jsx'
import Intro from './sections/Intro.jsx'

// Everything below the second screen is split out, then warmed up once the
// browser is idle so anchor navigation lands on real content.
const loaders = [
  () => import('./sections/Voice.jsx'),
  () => import('./sections/Inventory.jsx'),
  () => import('./sections/Nfc.jsx'),
  () => import('./sections/Ecosystem.jsx'),
  () => import('./sections/Lab.jsx'),
  () => import('./sections/Why.jsx'),
  () => import('./sections/Contact.jsx'),
]
const [Voice, Inventory, Nfc, Ecosystem, Lab, Why, Contact] = loaders.map((load) => lazy(load))

function Later({ children, minHeight = '100svh' }) {
  return <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>
}

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })

  useEffect(() => {
    const warm = () => loaders.forEach((load) => load())
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 600))
    idle(warm)
    // Deep links (/#contact) point at content that mounts after first paint.
    const hash = window.location.hash.slice(1)
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView(), 700)
  }, [])

  return (
    <>
      <a
        href="#main"
        className="btn btn-ink fixed left-3 top-3 z-[100] -translate-y-24 focus:translate-y-0"
      >
        Skip to content
      </a>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-white mix-blend-difference"
        style={{ scaleX: progress }}
      />
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <Later minHeight="200svh"><Voice /></Later>
        <Later><Inventory /></Later>
        <Later><Nfc /></Later>
        <Later><Ecosystem /></Later>
        <Later><Lab /></Later>
        <Later><Why /></Later>
        <Later><Contact /></Later>
      </main>
      <Footer />
    </>
  )
}
