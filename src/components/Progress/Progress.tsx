import React, { type CSSProperties, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type ProgressTone =
  | 'rose' | 'peach' | 'lemon' | 'mint'
  | 'sky'  | 'lavender' | 'lilac' | 'neutral'

export type ProgressSize = 'sm' | 'default' | 'lg'

export interface ProgressProps {
  value?: number
  tone?: ProgressTone
  size?: ProgressSize
  label?: ReactNode
  showValue?: boolean
  animated?: boolean
  className?: string
}

const TRACK_H: Record<ProgressSize, number> = { sm: 4, default: 8, lg: 12 }

const TONE_BG: Record<ProgressTone, string> = {
  rose:     'var(--color-pastel-rose)',
  peach:    'var(--color-pastel-peach)',
  lemon:    'var(--color-pastel-lemon)',
  mint:     'var(--color-pastel-mint)',
  sky:      'var(--color-pastel-sky)',
  lavender: 'var(--color-pastel-lavender)',
  lilac:    'var(--color-pastel-lilac)',
  neutral:  'var(--color-pastel-neutral)',
}

const TONE_BORDER: Record<ProgressTone, string> = {
  rose:     'var(--color-pastel-rose-dark)',
  peach:    'var(--color-pastel-peach-dark)',
  lemon:    'var(--color-pastel-lemon-dark)',
  mint:     'var(--color-pastel-mint-dark)',
  sky:      'var(--color-pastel-sky-dark)',
  lavender: 'var(--color-pastel-lavender-dark)',
  lilac:    'var(--color-pastel-lilac-dark)',
  neutral:  'var(--color-pastel-neutral-dark)',
}

export function Progress({
  value,
  tone = 'lavender',
  size = 'default',
  label,
  showValue = false,
  animated = true,
  className,
}: ProgressProps) {
  const isIndeterminate = value === undefined
  const clamped = isIndeterminate ? 0 : Math.max(0, Math.min(100, value))
  const trackH = TRACK_H[size]
  const fillColor = TONE_BG[tone]
  const borderColor = TONE_BORDER[tone]

  const trackStyle: CSSProperties = {
    position: 'relative',
    height: trackH,
    borderRadius: 999,
    background: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.07)',
  }

  const fillStyle: CSSProperties = isIndeterminate
    ? {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '40%',
        borderRadius: 999,
        background: fillColor,
        boxShadow: `0 0 0 1px ${borderColor}33`,
        animation: animated ? 'progress-indeterminate 1.6s ease-in-out infinite' : 'none',
      }
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: `${clamped}%`,
        borderRadius: 999,
        background: fillColor,
        boxShadow: `0 0 0 1px ${borderColor}33`,
        transition: animated ? 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }

  return (
    <div className={cn('w-full font-[system-ui,_-apple-system,_sans-serif]', className)}>
      {(label != null || (showValue && !isIndeterminate)) && (
        <div className="flex items-center justify-between mb-[6px]">
          {label != null && (
            <span className="text-[12px] leading-none font-medium text-black/60">{label}</span>
          )}
          {showValue && !isIndeterminate && (
            <span className="text-[12px] leading-none text-black/40 tabular-nums">{clamped}%</span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clamped}
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : 100}
        style={trackStyle}
      >
        <div style={fillStyle} />
      </div>
    </div>
  )
}
