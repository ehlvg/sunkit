import { useEffect, useRef, useCallback } from 'react'
import type { RefObject } from 'react'

type AudioCtxRef = React.MutableRefObject<AudioContext | null>

function getACtx(ref: AudioCtxRef): AudioContext {
  if (!ref.current) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ref.current = new Ctor()
  }
  return ref.current
}

function playPress(actx: AudioCtxRef) {
  try {
    const ctx = getACtx(actx)
    const now = ctx.currentTime
    const pitch = 340 + Math.random() * 80
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 1800
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(pitch, now)
    o.frequency.exponentialRampToValueAtTime(pitch * 0.72, now + 0.07)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)
    o.start(now)
    o.stop(now + 0.1)
  } catch (_) {}
}

function playRelease(actx: AudioCtxRef) {
  try {
    const ctx = getACtx(actx)
    const now = ctx.currentTime
    const pitch = 480 + Math.random() * 120
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 900
    f.Q.value = 1.2
    o.connect(f)
    f.connect(g)
    g.connect(ctx.destination)
    o.type = 'triangle'
    o.frequency.setValueAtTime(pitch, now)
    o.frequency.exponentialRampToValueAtTime(pitch * 1.25, now + 0.04)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.006)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
    o.start(now)
    o.stop(now + 0.14)
  } catch (_) {}
}

export function useButtonSound(ref: RefObject<HTMLElement | null>) {
  const actx = useRef<AudioContext | null>(null)

  const onMouseDown = useCallback(() => playPress(actx), [])
  const onMouseUp = useCallback(() => {
    playRelease(actx)
  }, [])
  const onMouseLeave = useCallback((e: MouseEvent) => {
    if (e.buttons !== 1) return
    playRelease(actx)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      playPress(actx)
    }
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      playRelease(actx)
    }

    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mouseleave', onMouseLeave as EventListener)
    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mouseleave', onMouseLeave as EventListener)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [ref, onMouseDown, onMouseUp, onMouseLeave])
}
