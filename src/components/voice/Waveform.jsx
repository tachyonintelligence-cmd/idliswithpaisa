import { useEffect, useRef } from 'react'

const ENERGY = { idle: 0.1, connecting: 0.16, listening: 0.62, thinking: 0.2, speaking: 1, ended: 0.07, mic: 1 }

/**
 * Centred bar waveform. While `analyser` is supplied it draws the visitor's real
 * microphone level; otherwise the motion is synthetic and keyed to `state`.
 */
export default function Waveform({ state = 'idle', analyser = null, className = '' }) {
  const canvasRef = useRef(null)
  const live = useRef({ state, analyser })
  const redraw = useRef(() => {})
  live.current = { state, analyser }

  useEffect(() => redraw.current(), [state, analyser])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let onScreen = false
    let energy = 0.1
    let t = 0
    let bins
    let levels = []

    const draw = () => {
      const { state: s, analyser: an } = live.current
      energy += ((ENERGY[s] ?? 0.1) - energy) * (reduced ? 1 : 0.08)
      const step = w < 520 ? 6 : 7
      const count = Math.floor(w / step)
      if (levels.length !== count) levels = new Array(count).fill(0)
      if (an) {
        bins ||= new Uint8Array(an.frequencyBinCount)
        an.getByteFrequencyData(bins)
      }
      ctx.clearRect(0, 0, w, h)
      const callerSide = s === 'listening'
      for (let i = 0; i < count; i++) {
        const u = (i / (count - 1)) * 2 - 1
        const shape = Math.exp(-u * u * 2.6)
        let v
        if (an) {
          v = (bins[Math.floor(Math.abs(u) * bins.length * 0.55)] / 255) * (0.55 + shape * 0.45)
        } else if (s === 'thinking') {
          v = 0.07 + Math.exp(-((u - Math.sin(t * 2.6) * 0.75) ** 2) * 28) * 0.4
        } else {
          const noise =
            Math.sin(i * 0.43 + t * 7.1) * Math.sin(i * 0.17 - t * 4.3) + Math.sin(i * 0.91 + t * 11.7) * 0.35
          v = (0.12 + Math.abs(noise) * 0.78) * shape * energy * (0.72 + 0.28 * Math.sin(t * 3.1 + u * 2))
        }
        levels[i] += (v - levels[i]) * (reduced ? 1 : 0.35)
        const bar = Math.max(2, Math.min(1, levels[i]) * h * 0.94)
        const x = i * step + (w - count * step) / 2
        ctx.globalAlpha = 0.28 + shape * 0.72
        ctx.fillStyle = callerSide ? '#9a9a9a' : '#ffffff'
        ctx.beginPath()
        ctx.roundRect(x, (h - bar) / 2, 2.5, bar, 1.25)
        ctx.fill()
      }
    }

    const frame = (now) => {
      t = now / 1000
      draw()
      raf = requestAnimationFrame(frame)
    }
    const play = () => {
      cancelAnimationFrame(raf)
      if (!onScreen) return
      if (reduced && !live.current.analyser) draw()
      else raf = requestAnimationFrame(frame)
    }
    redraw.current = play

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (w) draw()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      play()
    })
    io.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={`block w-full ${className}`} aria-hidden="true" />
}
