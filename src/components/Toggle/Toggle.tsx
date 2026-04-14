import React, {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { useToggleSound } from '../../hooks/useToggleSound'

// Spring easing — slight overshoot for a satisfying snap
const SPRING = 'cubic-bezier(0.34, 1.42, 0.64, 1)'
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)'

const TRACK_SIZES = {
  default: { w: 46, h: 28, knob: 22, left: 3, travel: 18 },
  sm:      { w: 38, h: 22, knob: 17, left: 3, travel: 15 },
} as const

const toggleVariants = cva(
  'inline-flex items-center gap-3 font-[system-ui,_-apple-system,_sans-serif] select-none',
  {
    variants: {
      size: { default: '', sm: '' },
      disabled: {
        true:  'opacity-60 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: { size: 'default', disabled: false },
  },
)

const trackTones: Record<string, { off: string; on: string }> = {
  rose:     { off: 'border-pastel-rose-dark/[0.22]',     on: 'bg-pastel-rose/55     border-pastel-rose-dark/[0.30]'     },
  peach:    { off: 'border-pastel-peach-dark/[0.22]',    on: 'bg-pastel-peach/55    border-pastel-peach-dark/[0.30]'    },
  lemon:    { off: 'border-pastel-lemon-dark/[0.22]',    on: 'bg-pastel-lemon/60    border-pastel-lemon-dark/[0.30]'    },
  mint:     { off: 'border-pastel-mint-dark/[0.22]',     on: 'bg-pastel-mint/55     border-pastel-mint-dark/[0.30]'     },
  sky:      { off: 'border-pastel-sky-dark/[0.22]',      on: 'bg-pastel-sky/55      border-pastel-sky-dark/[0.30]'      },
  lavender: { off: 'border-pastel-lavender-dark/[0.22]', on: 'bg-pastel-lavender/55 border-pastel-lavender-dark/[0.30]' },
  lilac:    { off: 'border-pastel-lilac-dark/[0.22]',    on: 'bg-pastel-lilac/55    border-pastel-lilac-dark/[0.30]'    },
  neutral:  { off: 'border-pastel-neutral-dark/[0.22]',  on: 'bg-pastel-neutral/55  border-pastel-neutral-dark/[0.30]'  },
}

export type ToggleTone = keyof typeof trackTones

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof toggleVariants> {
  tone?: ToggleTone
  label?: ReactNode
  description?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    id,
    label,
    description,
    size = 'default',
    tone = 'neutral',
    disabled = false,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    className,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const autoId = useId()
  const switchId = id ?? `toggle-${autoId}`
  const descriptionId = description ? `${switchId}-description` : undefined
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined

  const isControlled = checkedProp != null
  const [checkedUncontrolled, setCheckedUncontrolled] = useState(defaultChecked)
  const checked = isControlled ? Boolean(checkedProp) : checkedUncontrolled

  const [pressing, setPressing] = useState(false)

  const dims = TRACK_SIZES[size ?? 'default']

  const onToggle = useMemo(() => {
    if (disabled) return undefined
    return () => {
      const next = !checked
      if (!isControlled) setCheckedUncontrolled(next)
      onCheckedChange?.(next)
    }
  }, [checked, disabled, isControlled, onCheckedChange])

  useToggleSound(btnRef, checked)

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      ;(btnRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    },
    [ref],
  )

  const toneClasses = trackTones[tone ?? 'neutral']
  const trackCheckedShadow = checked
    ? 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 2px 7px rgba(0,0,0,0.13)'
    : '0 1px 0 0 rgba(0,0,0,0.10), 0 3px 8px -1px rgba(0,0,0,0.09), 0 6px 16px -4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -2px 0 rgba(0,0,0,0.06)'

  // Knob squishes wider when pressing, snaps to position with spring
  const knobW = pressing ? Math.round(dims.knob * 1.22) : dims.knob
  const knobX = checked ? dims.travel - (knobW - dims.knob) : 0

  const knobStyle: CSSProperties = {
    position:   'absolute',
    top:        '50%',
    left:       dims.left,
    width:      knobW,
    height:     dims.knob,
    borderRadius: '999px',
    background: '#fff',
    boxShadow:  '0 2px 10px rgba(0,0,0,0.10), 0 1px 0 rgba(0,0,0,0.10)',
    transform:  `translateX(${knobX}px) translateY(-50%)`,
    transition: pressing
      ? `transform 80ms ${EASE_IN}, width 80ms ${EASE_IN}`
      : `transform 260ms ${SPRING}, width 200ms ${SPRING}`,
  }

  const trackStyle: CSSProperties = {
    width:      dims.w,
    height:     dims.h,
    boxShadow:  trackCheckedShadow,
    transition: 'background-color 180ms ease-out, border-color 180ms ease-out, box-shadow 150ms ease-out',
  }

  return (
    <div className={cn(toggleVariants({ size, disabled }), className)}>
      <button
        {...rest}
        ref={setRef}
        id={switchId}
        type={rest.type ?? 'button'}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-describedby={describedBy}
        disabled={!!disabled}
        onClick={onToggle}
        onMouseDown={() => !disabled && setPressing(true)}
        onMouseUp={() => setPressing(false)}
        onMouseLeave={() => setPressing(false)}
        onTouchStart={() => !disabled && setPressing(true)}
        onTouchEnd={() => setPressing(false)}
        className={cn(
          'relative shrink-0 rounded-full border outline-none',
          'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-black/20',
          'bg-white/55',
          toneClasses.off,
          checked ? toneClasses.on : '',
          disabled ? 'pointer-events-none' : 'cursor-pointer',
        )}
        style={trackStyle}
      >
        <span style={knobStyle} />
      </button>

      {(label != null || description != null) && (
        <div className="min-w-0">
          {label != null && (
            <div className={cn('text-[13px] leading-none font-medium', disabled ? 'opacity-60' : 'text-black/70')}>
              {label}
            </div>
          )}
          {description != null && (
            <div id={descriptionId} className="mt-[6px] text-[12px] leading-snug text-black/45">
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  )
})
