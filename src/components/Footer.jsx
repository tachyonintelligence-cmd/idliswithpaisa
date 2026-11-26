import { NAV, SITE } from '../config/site.js'
import { Logo } from './ui.jsx'

export default function Footer() {
  return (
    <footer data-theme="dark" data-surface className="bg-ink text-white">
      <div className="shell border-t border-white/10 pb-10 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="white" className="w-56" />
            <p className="mt-6 text-xl tracking-tight text-ash">“{SITE.tagline}”</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="label text-ash">Navigate</h2>
            <ul className="mt-5 space-y-2.5">
              {[...NAV, { id: 'lab', label: 'Technology Lab' }].map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="text-white/80 hover:text-white">{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label text-ash">Contact</h2>
            <ul className="mt-5 space-y-2.5">
              {SITE.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="text-white/80 hover:text-white">{p.display}</a>
                </li>
              ))}
              <li>
                {SITE.email ? (
                  <a href={`mailto:${SITE.email}`} className="text-white/80 hover:text-white">{SITE.email}</a>
                ) : (
                  <span className="text-ash">[ Official email — to be added ]</span>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="label text-ash">Social</h2>
            <ul className="mt-5 space-y-2.5">
              {SITE.socials.map((s) => (
                <li key={s.label}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">{s.label}</a>
                  ) : (
                    <span className="text-ash">{s.label} <span className="label ml-1">soon</span></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="label mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-ash sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Tachyon Intelligence. All rights reserved.</span>
          <span>Product demonstrations on this site use simulated data.</span>
        </div>
      </div>
    </footer>
  )
}
