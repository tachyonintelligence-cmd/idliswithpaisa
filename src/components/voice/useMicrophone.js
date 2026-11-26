import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Local microphone level meter. Audio goes only into an AnalyserNode: it is not
 * recorded, transcribed, played back or sent anywhere.
 */
export function useMicrophone() {
  const [analyser, setAnalyser] = useState(null)
  const [status, setStatus] = useState('off') // off | asking | on | blocked | unsupported
  const resources = useRef(null)
  const request = useRef(0)

  const stop = useCallback(() => {
    request.current++
    resources.current?.stream.getTracks().forEach((t) => t.stop())
    resources.current?.context.close()
    resources.current = null
    setAnalyser(null)
    setStatus((s) => (s === 'on' || s === 'asking' ? 'off' : s))
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return setStatus('unsupported')
    const id = ++request.current
    setStatus('asking')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (id !== request.current) return stream.getTracks().forEach((t) => t.stop())
      const context = new AudioContext()
      const node = context.createAnalyser()
      node.fftSize = 256
      node.smoothingTimeConstant = 0.75
      context.createMediaStreamSource(stream).connect(node)
      resources.current = { stream, context }
      setAnalyser(node)
      setStatus('on')
    } catch {
      if (id === request.current) setStatus('blocked')
    }
  }, [])

  useEffect(() => stop, [stop])

  return { analyser, status, start, stop }
}
