import { useEffect, useRef } from 'react'

/**
 * A point structure that reorganises itself into four forms. It is real 3D
 * (rotation + perspective) drawn on a 2D canvas, which avoids shipping a WebGL
 * engine for what is only a few thousand points.
 */
export const FORMS = [
  { id: 'intelligence', label: 'Intelligence', note: 'Context modelled as one connected structure' },
  { id: 'voice', label: 'Voice', note: 'Speech as a continuous signal' },
  { id: 'automation', label: 'Automation', note: 'Process arranged into ordered steps' },
  { id: 'connectivity', label: 'Connectivity', note: 'A tap radiating outward' },
]

const TAU = Math.PI * 2

function buildForm(id, n) {
  const out = new Float32Array(n * 3)
  const put = (i, x, y, z) => {
    out[i * 3] = x
    out[i * 3 + 1] = y
    out[i * 3 + 2] = z
  }
  if (id === 'intelligence') {
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const a = golden * i
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      const fold = 1 + 0.13 * Math.sin(5 * x + 3 * y) * Math.sin(4 * z - 2 * y)
      const inner = i % 7 === 0 ? 0.52 : 1
      put(i, x * fold * inner, y * fold * inner, z * fold * inner)
    }
  } else if (id === 'voice') {
    const rows = 22
    const cols = Math.ceil(n / rows)
    for (let i = 0; i < n; i++) {
      const row = i % rows
      const u = (Math.floor(i / rows) / (cols - 1)) * 2 - 1
      const v = (row / (rows - 1)) * 2 - 1
      const envelope = Math.exp(-u * u * 3.2)
      const wave = Math.sin(u * 13 + v * 2.2) * 0.55 + Math.sin(u * 27 - v * 4) * 0.2
      put(i, u * 1.35, wave * envelope * (1 - Math.abs(v) * 0.45), v * 0.62)
    }
  } else if (id === 'automation') {
    const side = Math.ceil(Math.cbrt(n / 4))
    for (let i = 0; i < n; i++) {
      // Four points strung between neighbouring nodes make the lattice edges legible.
      const node = Math.floor(i / 4)
      const x = node % side
      const y = Math.floor(node / side) % side
      const z = Math.floor(node / (side * side)) % side
      const step = (i % 4) / 4
      const axis = node % 3
      const p = [x, y, z]
      if (p[axis] < side - 1) p[axis] += step
      put(i, ...p.map((c) => (c / (side - 1) - 0.5) * 1.5))
    }
  } else {
    const rings = 7
    for (let i = 0; i < n; i++) {
      const ring = i % rings
      const per = Math.ceil(n / rings)
      const a = (Math.floor(i / rings) / per) * TAU
      const r = 0.18 + ring * 0.185
      put(i, Math.cos(a) * r, Math.sin(ring * 1.05) * 0.14, Math.sin(a) * r)
    }
  }
  return out
}

export default function IntelligenceCore({ form, onCycle }) {
  const canvasRef = useRef(null)
  const formRef = useRef(form)
  const redrawRef = useRef(() => {})
  const cycleRef = useRef(onCycle)
  cycleRef.current = onCycle

  useEffect(() => {
    formRef.current = form
    redrawRef.current()
  }, [form])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 767px)').matches
    const N = small ? 900 : 2000
    const shapes = FORMS.map((f) => buildForm(f.id, N))
    const pos = Float32Array.from(shapes[FORMS.findIndex((f) => f.id === formRef.current)])

    // Fast particles on tilted orbits, drawn as short trails.
    const streaks = Array.from({ length: small ? 4 : 7 }, (_, i) => ({
      radius: 1.22 + (i % 3) * 0.14,
      tilt: -0.9 + i * 0.34,
      yaw: i * 1.7,
      speed: 0.9 + (i % 4) * 0.28,
      phase: i * 2.1,
    }))

    let w = 0
    let h = 0
    let raf = 0
    let last = performance.now()
    let time = 0
    let sinceInput = 0
    let onScreen = true
    const pointer = { x: 0, y: 0, px: -999, py: -999, sx: 0, sy: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      redrawRef.current()
    }

    const draw = (dt) => {
      const target = shapes[Math.max(0, FORMS.findIndex((f) => f.id === formRef.current))]
      const ease = reduced ? 1 : 1 - Math.pow(0.0025, dt)
      pointer.sx += (pointer.x - pointer.sx) * 0.05
      pointer.sy += (pointer.y - pointer.sy) * 0.05
      const flat = formRef.current === 'voice'
      const yaw = (flat ? Math.sin(time * 0.25) * 0.35 : time * 0.14) + pointer.sx * 0.55
      const pitch = 0.38 + pointer.sy * 0.35
      const cy = Math.cos(yaw)
      const sy = Math.sin(yaw)
      const cp = Math.cos(pitch)
      const sp = Math.sin(pitch)
      const scale = Math.min(w, h) * 0.34
      const ox = w / 2
      const oy = h / 2

      const project = (x, y, z) => {
        const x1 = x * cy + z * sy
        const z1 = -x * sy + z * cy
        const y1 = y * cp - z1 * sp
        const z2 = y * sp + z1 * cp
        const k = 3.6 / (3.6 - z2)
        return [ox + x1 * scale * k, oy + y1 * scale * k, z2, k]
      }

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#050505'

      for (let i = 0; i < N; i++) {
        const j = i * 3
        pos[j] += (target[j] - pos[j]) * ease
        pos[j + 1] += (target[j + 1] - pos[j + 1]) * ease
        pos[j + 2] += (target[j + 2] - pos[j + 2]) * ease
        const breathe = 1 + Math.sin(time * 1.3 + i * 0.019) * 0.018
        const lift = flat && !reduced ? Math.sin(time * 3 + pos[j] * 6) * 0.06 * Math.exp(-pos[j] * pos[j] * 2) : 0
        let [x, y, z, k] = project(pos[j] * breathe, pos[j + 1] * breathe + lift, pos[j + 2] * breathe)

        const dx = x - pointer.px
        const dy = y - pointer.py
        const d2 = dx * dx + dy * dy
        if (d2 < 8100 && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const push = ((90 - d) / 90) ** 2 * 26
          x += (dx / d) * push
          y += (dy / d) * push
        }

        const depth = Math.min(1, Math.max(0, (z + 1.3) / 2.6))
        const size = (1 + depth * 1.6) * k * (small ? 0.85 : 1)
        ctx.globalAlpha = 0.26 + depth * depth * 0.72
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
      }

      ctx.strokeStyle = '#050505'
      ctx.lineCap = 'round'
      for (const s of streaks) {
        const head = time * s.speed + s.phase
        const ct = Math.cos(s.tilt)
        const st = Math.sin(s.tilt)
        let prev
        for (let t = 0; t <= 16; t++) {
          const a = head - (16 - t) * 0.045
          const x = Math.cos(a) * s.radius
          const z = Math.sin(a) * s.radius
          const y = z * st
          const zt = z * ct
          const p = project(x * Math.cos(s.yaw) + zt * Math.sin(s.yaw), y, -x * Math.sin(s.yaw) + zt * Math.cos(s.yaw))
          if (prev) {
            ctx.globalAlpha = (t / 16) * 0.55
            ctx.lineWidth = (t / 16) * 1.6
            ctx.beginPath()
            ctx.moveTo(prev[0], prev[1])
            ctx.lineTo(p[0], p[1])
            ctx.stroke()
          }
          prev = p
        }
        ctx.globalAlpha = 1
        ctx.fillRect(prev[0] - 1.5, prev[1] - 1.5, 3, 3)
      }
      ctx.globalAlpha = 1
    }

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      time += dt
      sinceInput += dt
      if (sinceInput > 5.5) {
        sinceInput = 0
        const i = FORMS.findIndex((f) => f.id === formRef.current)
        cycleRef.current(FORMS[(i + 1) % FORMS.length].id)
      }
      draw(dt)
      raf = requestAnimationFrame(frame)
    }

    const play = () => {
      cancelAnimationFrame(raf)
      if (reduced || !onScreen || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    redrawRef.current = () => {
      sinceInput = 0
      if (reduced && w) draw(1)
    }

    const onPointer = (e) => {
      if (!onScreen) return
      const r = canvas.getBoundingClientRect()
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      if (e.pointerType === 'mouse') {
        pointer.px = e.clientX - r.left
        pointer.py = e.clientY - r.top
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      play()
    })
    io.observe(canvas)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', play)
    resize()
    play()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', play)
    }
  }, [])

  return <canvas ref={canvasRef} className="block size-full" aria-hidden="true" />
}
