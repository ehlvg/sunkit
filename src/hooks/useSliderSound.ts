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

function playScrub(actx: ACtx, normalizedValue: number) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime
    const freq = 300 + normalizedValue * 600
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = freq * 1.5
    f.Q.value = 4
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.type = 'triangle'
    o.frequency.setValueAtTime(freq, now)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.04, now + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.028)
    o.start(now)
    o.stop(now + 0.032)
  } catch (_) {}
}

export function useSliderSound(
  ref: RefObject<HTMLInputElement | null>,
  min: number,
  max: number,
) {
  const actx = useRef<AudioContext | null>(null)
  const lastFired = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handle = () => {
      const now = performance.now()
      if (now - lastFired.current < 16) return
      lastFired.current = now
      const raw = parseFloat(el.value)
      const normalized = (raw - min) / (max - min || 1)
      playScrub(actx, Math.max(0, Math.min(1, normalized)))
    }

    el.addEventListener('input', handle)
    return () => el.removeEventListener('input', handle)
  }, [ref, min, max])
}
