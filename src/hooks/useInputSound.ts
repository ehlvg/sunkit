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

function playFocus(actx: ACtx) {
  try {
    const ctx = getCtx(actx)
    const now = ctx.currentTime

    // Soft descending "ting" — gentle chime on focus
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

export function useInputSound(ref: RefObject<HTMLElement | null>) {
  const actx = useRef<AudioContext | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handle = () => playFocus(actx)
    el.addEventListener('focus', handle)
    return () => el.removeEventListener('focus', handle)
  }, [ref])
}
