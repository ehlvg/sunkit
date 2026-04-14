import React, {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'
import { useSliderSound } from '../../hooks/useSliderSound'

const SPRING = 'cubic-bezier(0.34, 1.42, 0.64, 1)'
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)'

export type SliderTone =
  | 'rose' | 'peach' | 'lemon' | 'mint'
  | 'sky'  | 'lavender' | 'lilac' | 'neutral'

export type SliderSize = 'default' | 'sm'

export interface SliderMark {
  value: number
  label?: string
}

export interface SliderProps {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  tone?: SliderTone
  size?: SliderSize
  label?: ReactNode
  description?: ReactNode
  showValue?: boolean
  marks?: SliderMark[]
  disabled?: boolean
  id?: string
  className?: string
}

const TRACK_H: Record<SliderSize, number> = { default: 6, sm: 4 }
const THUMB_D: Record<SliderSize, number> = { default: 20, sm: 15 }

const TONE_BG: Record<SliderTone, string> = {
  rose:     'var(--color-pastel-rose)',
  peach:    'var(--color-pastel-peach)',
  lemon:    'var(--color-pastel-lemon)',
  mint:     'var(--color-pastel-mint)',
  sky:      'var(--color-pastel-sky)',
  lavender: 'var(--color-pastel-lavender)',
  lilac:    'var(--color-pastel-lilac)',
  neutral:  'var(--color-pastel-neutral)',
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    min = 0,
    max = 100,
    step = 1,
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    tone = 'lavender',
    size = 'default',
    label,
    description,
    showValue = false,
    marks,
    disabled = false,
    id,
    className,
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autoId = useId()
  const inputId = id ?? `slider-${autoId}`
  const descId = description ? `${inputId}-desc` : undefined

  const isControlled = valueProp !== undefined
  const [valueUncontrolled, setValueUncontrolled] = useState(defaultValue)
  const value = isControlled ? valueProp! : valueUncontrolled

  const [pressing, setPressing] = useState(false)

  useSliderSound(inputRef, min, max)

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    },
    [ref],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseFloat(e.target.value)
    if (!isControlled) setValueUncontrolled(next)
    onValueChange?.(next)
  }

  const trackH = TRACK_H[size]
  const thumbD = THUMB_D[size]
  const pct = ((value - min) / (max - min || 1)) * 100
  const fillColor = TONE_BG[tone]

  const thumbSize = pressing ? Math.round(thumbD * 1.18) : thumbD

  const trackStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: trackH,
    borderRadius: 999,
    background: 'rgba(0,0,0,0.10)',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.10)',
  }

  const fillStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: `${pct}%`,
    borderRadius: 999,
    background: fillColor,
    boxShadow: `0 0 0 1px ${fillColor}66`,
    transition: 'width 60ms ease-out',
  }

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: `${pct}%`,
    width: thumbSize,
    height: thumbSize,
    borderRadius: 999,
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15), 0 1px 0 rgba(0,0,0,0.08)',
    transform: `translate(-50%, -50%)`,
    transition: pressing
      ? `width 60ms ${EASE_IN}, height 60ms ${EASE_IN}, box-shadow 60ms ease`
      : `width 200ms ${SPRING}, height 200ms ${SPRING}, box-shadow 150ms ease`,
    pointerEvents: 'none',
    border: '1.5px solid rgba(0,0,0,0.07)',
  }

  return (
    <div className={cn('w-full select-none font-[system-ui,_-apple-system,_sans-serif]', disabled && 'opacity-50 cursor-not-allowed', className)}>
      {(label != null || showValue) && (
        <div className="flex items-center justify-between mb-[8px]">
          {label != null && (
            <label
              htmlFor={inputId}
              className={cn('text-[12px] leading-none font-medium', disabled ? 'opacity-60' : 'text-black/70')}
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-[12px] leading-none text-black/50 tabular-nums">{value}</span>
          )}
        </div>
      )}

      <div className="relative" style={{ paddingBlock: thumbD / 2 }}>
        <div style={trackStyle}>
          <div style={fillStyle} />
          <div style={thumbStyle} />
        </div>

        <input
          ref={setRef}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-describedby={descId}
          onChange={handleChange}
          onMouseDown={() => !disabled && setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          onTouchStart={() => !disabled && setPressing(true)}
          onTouchEnd={() => setPressing(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ margin: 0 }}
        />

        {marks && marks.length > 0 && (
          <div className="relative mt-[4px]" style={{ height: 16 }}>
            {marks.map(m => {
              const mPct = ((m.value - min) / (max - min || 1)) * 100
              return (
                <div
                  key={m.value}
                  className="absolute flex flex-col items-center gap-[2px]"
                  style={{ left: `${mPct}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-[1px] h-[4px] bg-black/20 rounded-full" />
                  {m.label && (
                    <span className="text-[10px] leading-none text-black/40">{m.label}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {description != null && (
        <div id={descId} className="mt-[4px] text-[12px] leading-snug text-black/45">
          {description}
        </div>
      )}
    </div>
  )
})
