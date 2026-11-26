import { SCENARIOS } from '../../data/voiceScripts.js'

/**
 * Plays a scripted call through the VoiceProvider event contract (see ./index.js).
 * No audio is captured, transcribed or synthesised. The delays are presentation
 * pacing and say nothing about the latency of a real system.
 */
export const simulatedProvider = {
  id: 'simulated',
  isLive: false,

  createSession({ language, onEvent }) {
    const script = SCENARIOS[language]
    let cancelled = false
    let timer

    const wait = (ms) =>
      new Promise((resolve) => {
        timer = setTimeout(resolve, ms)
      })
    const emit = (event) => !cancelled && onEvent(event)

    async function stream(turn, index) {
      const words = turn.text.split(' ')
      for (let i = 0; i < words.length && !cancelled; i++) {
        emit({ type: 'partial', id: index, role: turn.role, text: words.slice(0, i + 1).join(' ') })
        await wait(turn.role === 'agent' ? 150 : 185)
      }
      emit({ type: 'final', id: index, role: turn.role, text: turn.text, gloss: turn.gloss })
    }

    async function run() {
      emit({ type: 'state', value: 'connecting' })
      await wait(900)
      for (let i = 0; i < script.turns.length && !cancelled; i++) {
        const turn = script.turns[i]
        emit({ type: 'state', value: turn.role === 'agent' ? 'speaking' : 'listening' })
        await stream(turn, i)
        if (turn.role === 'caller') {
          emit({ type: 'insight', intent: turn.intent, details: turn.details })
          emit({ type: 'state', value: 'thinking' })
          await wait(750)
        } else {
          await wait(650)
        }
      }
      emit({ type: 'outcome', rows: script.outcome })
      emit({ type: 'state', value: 'ended' })
    }

    return {
      start: run,
      stop() {
        cancelled = true
        clearTimeout(timer)
      },
    }
  },
}
