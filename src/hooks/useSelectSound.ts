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

export function playSelectOpen(actx: ACtx) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 2200
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(820, now)
    o.frequency.exponentialRampToValueAtTime(680, now + 0.06)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.07, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)
    o.start(now)
    o.stop(now + 0.12)
  } catch (_) {}
}

export function playSelectChoose(actx: ACtx) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 1400
    f.Q.value = 3
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.type = 'triangle'
    o.frequency.setValueAtTime(1100, now)
    o.frequency.exponentialRampToValueAtTime(1300, now + 0.025)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.06, now + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)
    o.start(now)
    o.stop(now + 0.05)
  } catch (_) {}
}

export function useSelectSoundCtx() {
  return useRef<AudioContext | null>(null)
}
