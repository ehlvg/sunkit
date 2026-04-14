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

export function playPickerNav(actx: ACtx, direction: 'prev' | 'next') {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime

    const bufSize = ctx.sampleRate * 0.08
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4

    const source = ctx.createBufferSource()
    source.buffer = buf

    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = direction === 'next' ? 900 : 600
    f.Q.value = 2.5

    const g = ctx.createGain()
    source.connect(f)
    f.connect(g)
    g.connect(ctx.destination)

    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.07, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)

    source.start(now)
  } catch (_) {}
}

export function playPickerSelect(actx: ACtx) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(1600, now)
    o.frequency.exponentialRampToValueAtTime(1050, now + 0.18)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.055, now + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.26)
    o.start(now)
    o.stop(now + 0.28)
  } catch (_) {}
}

export function usePickerSoundCtx() {
  return useRef<AudioContext | null>(null)
}
