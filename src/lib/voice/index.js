/**
 * VoiceProvider contract — the only thing the demo UI depends on.
 *
 *   provider.isLive                      false shows the "Simulated" labelling
 *   provider.createSession({ language, voiceId, onEvent }) -> { start(), stop() }
 *
 * Events passed to onEvent:
 *   { type: 'state',   value: 'connecting'|'listening'|'thinking'|'speaking'|'ended' }
 *   { type: 'partial', id, role: 'caller'|'agent', text }        interim transcript
 *   { type: 'final',   id, role, text, gloss? }                  settled transcript
 *   { type: 'insight', intent, details }                         what was understood
 *   { type: 'outcome', rows: [[label, value]] }                  end-of-call summary
 *   { type: 'error',   message }
 *
 * To go live, implement this contract over a backend you control (WebSocket or
 * WebRTC) that runs streaming STT, the LLM and streaming TTS, then export it here.
 * Keep provider API keys on that server; never ship them in this bundle.
 */
import { simulatedProvider } from './simulatedProvider.js'

export const voiceProvider = simulatedProvider
