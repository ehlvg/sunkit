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

function playCheck(actx: ACtx) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 1400
    f.Q.value = 6
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.type = 'square'
    o.frequency.setValueAtTime(680, now)
    o.frequency.exponentialRampToValueAtTime(1100, now + 0.03)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.055, now + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.042)
    o.start(now)
    o.stop(now + 0.05)
  } catch (_) {}
}

function playUncheck(actx: ACtx) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 800
    f.Q.value = 5
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.type = 'square'
    o.frequency.setValueAtTime(420, now)
    o.frequency.exponentialRampToValueAtTime(280, now + 0.045)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.05, now + 0.006)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)
    o.start(now)
    o.stop(now + 0.06)
  } catch (_) {}
}

export function useCheckboxSound(
  ref: RefObject<HTMLInputElement | null>,
  checked: boolean,
) {
  const actx = useRef<AudioContext | null>(null)
  const checkedRef = useRef(checked)

  useEffect(() => {
    checkedRef.current = checked
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handle = () => {
      if (!checkedRef.current) playCheck(actx)
      else playUncheck(actx)
    }
    el.addEventListener('change', handle)
    return () => el.removeEventListener('change', handle)
  }, [ref])
}
