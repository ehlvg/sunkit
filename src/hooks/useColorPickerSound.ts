import { useRef } from 'react'

type ACtx = React.MutableRefObject<AudioContext | null>

function getCtx(ref: ACtx): AudioContext {
  if (!ref.current) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ref.current = new Ctor()
  }
  return ref.current
}

// Each color maps to a musical note (C4–B4 pentatonic)
const COLOR_FREQ: Record<string, number> = {
  rose:     523.25, // C5
  peach:    587.33, // D5
  lemon:    659.25, // E5
  mint:     698.46, // F5
  sky:      783.99, // G5
  lavender: 880.00, // A5
  lilac:    987.77, // B5
  neutral:  261.63, // C4
}

function playPluck(actx: ACtx, freq: number) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime

    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = freq * 3
    f.Q.value = 0.8

    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)

    o.type = 'sine'
    o.frequency.setValueAtTime(freq, now)
    o.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.15)

    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.08, now + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

    o.start(now)
    o.stop(now + 0.25)
  } catch (_) {}
}

export function useColorPickerSoundCtx() {
  return useRef<AudioContext | null>(null)
}

export function playColorPluck(actx: ACtx, colorId: string) {
  const freq = COLOR_FREQ[colorId] ?? 523.25
  playPluck(actx, freq)
}
