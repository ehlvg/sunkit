import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

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

function playOn(actx: ACtx) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime

    // Two ascending micro-clicks — mechanical "snap on"
    for (let i = 0; i < 2; i++) {
      const t = now + i * 0.032
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      const f = ctx.createBiquadFilter()
      f.type = 'bandpass'
      f.frequency.value = 1100 + i * 500
      f.Q.value = 7
      o.connect(f)
      f.connect(g)
      g.connect(ctx.destination)
      o.type = 'square'
      o.frequency.setValueAtTime(500 + i * 180, t)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.065, t + 0.004)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.038)
      o.start(t)
      o.stop(t + 0.045)
    }
  } catch (_) {}
}

function playOff(actx: ACtx) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime

    // Single descending thud — "snap off"
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 700
    f.Q.value = 5
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.type = 'square'
    o.frequency.setValueAtTime(460, now)
    o.frequency.exponentialRampToValueAtTime(260, now + 0.055)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.07, now + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)
    o.start(now)
    o.stop(now + 0.07)
  } catch (_) {}
}

export function useToggleSound(ref: RefObject<HTMLElement | null>, checked: boolean) {
  const actx = useRef<AudioContext | null>(null)
  const checkedRef = useRef(checked)

  useEffect(() => {
    checkedRef.current = checked
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handle = () => {
      if (!checkedRef.current) {
        playOn(actx)
      } else {
        playOff(actx)
      }
    }

    el.addEventListener('click', handle)
    return () => el.removeEventListener('click', handle)
  }, [ref])
}
