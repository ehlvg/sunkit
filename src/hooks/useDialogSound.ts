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

function playOpen(actx: ACtx) {
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
    o.frequency.setValueAtTime(420, now)
    o.frequency.exponentialRampToValueAtTime(620, now + 0.09)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.055, now + 0.018)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.11)
    o.start(now)
    o.stop(now + 0.13)
  } catch (_) {}
}

function playClose(actx: ACtx) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 1800
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.type = 'triangle'
    o.frequency.setValueAtTime(580, now)
    o.frequency.exponentialRampToValueAtTime(340, now + 0.07)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.045, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
    o.start(now)
    o.stop(now + 0.09)
  } catch (_) {}
}

export function useDialogSound() {
  const actx = useRef<AudioContext | null>(null)
  return {
    playOpen: () => playOpen(actx),
    playClose: () => playClose(actx),
  }
}
