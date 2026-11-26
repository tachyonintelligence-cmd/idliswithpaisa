import { useEffect, useRef, useState } from 'react'
import { Nfc, Star } from 'lucide-react'
import { asset } from '../../config/site.js'
import './card.css'

const img = (name) => asset(`brand/${name}.png`)

/** Printed artwork for the front of each product. All people and firms are samples. */
function Face({ variant }) {
  if (variant === 'review') {
    return (
      <>
        <span className="c-top">
          <span className="c-kicker">Sample Café</span>
          <Nfc className="c-nfc" />
        </span>
        <span className="c-mid">
          <span className="c-stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} fill="currentColor" strokeWidth={0} />)}</span>
          <span className="c-big">Tap to leave a review</span>
        </span>
        <span className="c-foot">Hold your phone here</span>
      </>
    )
  }
  if (variant === 'portfolio') {
    return (
      <>
        <span className="c-tiles"><i /><i /><i /><i /><i /><i /></span>
        <span className="c-bottom">
          <span><span className="c-big">Kiran Shetty</span><span className="c-foot">Selected work · Tap to view</span></span>
          <Nfc className="c-nfc" />
        </span>
      </>
    )
  }
  if (variant === 'business') {
    return (
      <>
        <span className="c-top"><img src={img('mark-white')} alt="" className="c-mark" /><Nfc className="c-nfc" /></span>
        <span className="c-bottom"><span><span className="c-big">Ananya Rao</span><span className="c-foot">Founder · Sample Studio</span></span></span>
      </>
    )
  }
  if (variant === 'custom') {
    return (
      <>
        <span className="c-top"><span className="c-kicker">Made to your brand</span><Nfc className="c-nfc" /></span>
        <span className="c-slot">Your logo</span>
        <span className="c-foot">Colour · material · finish · destination</span>
      </>
    )
  }
  const dark = variant === 'metal'
  return (
    <>
      <span className="c-top"><span /><Nfc className="c-nfc" /></span>
      <img src={img(dark ? 'logo-white' : 'logo-black')} alt="" className="c-logo" />
      <span className="c-foot">{variant === 'metal' ? 'Metal edition' : variant === 'acrylic' ? 'Acrylic edition' : 'PVC edition'}</span>
    </>
  )
}

function Back({ variant }) {
  const dark = ['metal', 'business', 'portfolio'].includes(variant)
  return (
    <>
      <span />
      <img src={img(dark ? 'mark-white' : 'mark-black')} alt="" className="c-back-mark" />
      <span className="c-foot c-center">Tap against the back or top of your phone</span>
    </>
  )
}

/**
 * A card with real thickness: stacked slices between two faces, tilted by the
 * pointer, with the specular highlight tracking the same input.
 */
export default function Card3D({ variant = 'metal', flipped = false, sway = true, interactive = true, className = '' }) {
  const ref = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const tilt = (e) => {
    if (!interactive) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    const s = ref.current.style
    s.setProperty('--ry', `${x * 38}deg`)
    s.setProperty('--rx', `${-y * 30}deg`)
    s.setProperty('--gx', `${(x + 0.5) * 100}%`)
    s.setProperty('--gy', `${(y + 0.5) * 100}%`)
    ref.current.dataset.held = 'true'
  }
  const release = () => {
    const el = ref.current
    delete el.dataset.held
    ;['--ry', '--rx', '--gx', '--gy'].forEach((p) => el.style.removeProperty(p))
  }

  return (
    <div
      ref={ref}
      className={`card3d m-${variant} ${className}`}
      data-sway={sway && live ? '' : undefined}
      onPointerMove={tilt}
      onPointerLeave={release}
      onPointerUp={(e) => e.pointerType !== 'mouse' && release()}
      onPointerCancel={release}
      aria-hidden="true"
    >
      <div className="c-sway">
        <div className="c-body" style={{ '--flip': flipped ? '180deg' : '0deg' }}>
          {[-3, -2, -1, 0, 1, 2, 3].map((z) => (
            <span key={z} className="c-slice" style={{ transform: `translateZ(${z * 0.16}cqw)` }} />
          ))}
          <span className="c-face c-front">
            {variant === 'acrylic' && (
              <svg className="c-coil" viewBox="0 0 342 216" preserveAspectRatio="none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect key={i} x={12 + i * 5} y={12 + i * 5} width={318 - i * 10} height={192 - i * 10} rx={14 - i} />
                ))}
                <rect className="c-chip" x="292" y="150" width="14" height="14" rx="2" />
              </svg>
            )}
            <Face variant={variant} />
            <span className="c-glare" />
          </span>
          <span className="c-face c-rear">
            <Back variant={variant} />
            <span className="c-glare" />
          </span>
        </div>
      </div>
      <span className="c-shadow" />
    </div>
  )
}
