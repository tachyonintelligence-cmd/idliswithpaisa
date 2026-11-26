import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { NAV, SITE } from '../config/site.js'
import { Logo } from './ui.jsx'

const BAR = 68

/** Tracks which section is under the bar, and whether that surface is dark. */
function useNavState() {
  const [state, setState] = useState({ active: 'home', dark: false, scrolled: false })
  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      let active = 'home'
      for (const { id } of NAV) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) active = id
      }
      let dark = false
      for (const el of document.querySelectorAll('[data-theme="dark"][data-surface]')) {
        const r = el.getBoundingClientRect()
        if (r.top <= BAR / 2 && r.bottom > BAR / 2) dark = true
      }
      const scrolled = window.scrollY > 12
      setState((s) =>
        s.active === active && s.dark === dark && s.scrolled === scrolled ? s : { active, dark, scrolled },
      )
    }
    const queue = () => (raf ||= requestAnimationFrame(read))
    read()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      cancelAnimationFrame(raf)
    }
  }, [])
  return state
}

export default function Nav() {
  const { active, dark: overDark, scrolled } = useNavState()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const menuRef = useRef(null)
  const dark = overDark || open

  useEffect(() => {
    if (!open) return
    const others = [document.getElementById('main'), document.querySelector('footer')]
    document.documentElement.style.overflow = 'hidden'
    others.forEach((el) => el && (el.inert = true))
    menuRef.current?.querySelector('a')?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const wide = window.matchMedia('(min-width: 1024px)')
    const onWide = () => wide.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      document.documentElement.style.overflow = ''
      others.forEach((el) => el && (el.inert = false))
      window.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  // Unlock scrolling before the browser performs the anchor jump.
  const follow = (e, id) => {
    if (!open) return
    e.preventDefault()
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView()
      history.replaceState(null, '', `#${id}`)
    }, 40)
  }

  const surface = open
    ? 'bg-ink border-transparent'
    : scrolled
      ? dark
        ? 'bg-ink/80 border-white/10 backdrop-blur-md'
        : 'bg-white/85 border-ink/10 backdrop-blur-md'
      : 'bg-transparent border-transparent'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${surface} ${dark ? 'text-white' : 'text-ink'}`}
      >
        <div className="shell flex items-center justify-between gap-6" style={{ height: BAR }}>
          <a href="#home" onClick={(e) => follow(e, 'home')} className="shrink-0" aria-label="Tachyon Intelligence — home">
            <Logo tone={dark ? 'white' : 'black'} className="w-[148px] sm:w-[164px]" />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active === item.id ? 'location' : undefined}
                    className="relative block px-3.5 py-2 text-[0.875rem] tracking-tight opacity-70 transition-opacity hover:opacity-100 aria-[current]:opacity-100"
                  >
                    {item.label}
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-marker"
                        className="absolute inset-x-3.5 bottom-0.5 h-px bg-current"
                        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a href="#contact" className={`btn hidden !min-h-10 !px-4 !text-sm lg:inline-flex ${dark ? 'btn-paper' : 'btn-ink'}`}>
            Talk to our team
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 grid size-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            data-theme="dark"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink text-white lg:hidden"
            style={{ paddingTop: BAR }}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-between gap-10 pb-10 pt-6">
              <ul>
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.id}
                    className="border-b border-white/10"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.05 }}
                  >
                    <a href={`#${item.id}`} onClick={(e) => follow(e, item.id)} className="flex items-baseline justify-between py-4">
                      <span className="display text-[2.4rem]">{item.label}</span>
                      <span className="label text-ash">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                {SITE.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="flex items-center justify-between text-lg">
                    {p.display} <ArrowUpRight size={18} />
                  </a>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
