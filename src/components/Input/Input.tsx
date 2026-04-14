import React, { forwardRef, useCallback, useId, useRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { useInputSound } from '../../hooks/useInputSound'

const inputVariants = cva(
  [
    'w-full min-w-0',
    'font-[system-ui,_-apple-system,_sans-serif] text-[13px] text-black/80 leading-none',
    'outline-none',
    'placeholder:text-black/30',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-[box-shadow,border-color,background-color,opacity] duration-[150ms] ease-out',
  ].join(' '),
  {
    variants: {
      variant: {
        // Elevated — glassy card lifted off the surface
        default: [
          'bg-white/60 border',
          'rounded-[var(--field-radius)]',
          'btn-shadow hover:btn-shadow-hover',
          'focus-visible:btn-shadow-hover',
          'hover:brightness-[1.03]',
        ].join(' '),
        // Filled — recessed/sunken, no elevation shadow
        filled: [
          'bg-black/[0.055] border border-black/[0.10]',
          'rounded-[var(--field-radius)]',
          'shadow-[inset_0_1px_3px_rgba(0,0,0,0.09)]',
          'hover:bg-black/[0.075]',
          'focus-visible:bg-white/70 focus-visible:shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]',
        ].join(' '),
        // Ghost — underline only, no box at all
        ghost: [
          'bg-transparent border-0 border-b-[1.5px] border-black/25',
          'rounded-none',
          'shadow-none',
          'hover:border-black/40',
          'focus-visible:border-b-2 focus-visible:border-black/55 focus-visible:bg-white/30',
        ].join(' '),
      },
      tone: {
        rose:     'border-pastel-rose-dark/[0.25]     focus-visible:border-pastel-rose-dark/[0.55]',
        peach:    'border-pastel-peach-dark/[0.25]    focus-visible:border-pastel-peach-dark/[0.55]',
        lemon:    'border-pastel-lemon-dark/[0.25]    focus-visible:border-pastel-lemon-dark/[0.55]',
        mint:     'border-pastel-mint-dark/[0.25]     focus-visible:border-pastel-mint-dark/[0.55]',
        sky:      'border-pastel-sky-dark/[0.25]      focus-visible:border-pastel-sky-dark/[0.55]',
        lavender: 'border-pastel-lavender-dark/[0.25] focus-visible:border-pastel-lavender-dark/[0.55]',
        lilac:    'border-pastel-lilac-dark/[0.25]    focus-visible:border-pastel-lilac-dark/[0.55]',
        neutral:  'border-pastel-neutral-dark/[0.25]  focus-visible:border-pastel-neutral-dark/[0.55]',
      },
      size: {
        default: 'h-[40px] px-[12px] py-[10px]',
        sm:      'h-[32px] px-[10px] py-[8px] text-[12px]',
      },
      invalid: {
        true:  'border-red-600/50 focus-visible:border-red-600/70',
        false: '',
      },
    },
    compoundVariants: [
      // Ghost ignores tone border overrides — it uses a single bottom border
      { variant: 'ghost', tone: 'rose',     className: 'border-pastel-rose-dark/[0.40]     focus-visible:border-pastel-rose-dark/[0.70]'     },
      { variant: 'ghost', tone: 'peach',    className: 'border-pastel-peach-dark/[0.40]    focus-visible:border-pastel-peach-dark/[0.70]'    },
      { variant: 'ghost', tone: 'lemon',    className: 'border-pastel-lemon-dark/[0.40]    focus-visible:border-pastel-lemon-dark/[0.70]'    },
      { variant: 'ghost', tone: 'mint',     className: 'border-pastel-mint-dark/[0.40]     focus-visible:border-pastel-mint-dark/[0.70]'     },
      { variant: 'ghost', tone: 'sky',      className: 'border-pastel-sky-dark/[0.40]      focus-visible:border-pastel-sky-dark/[0.70]'      },
      { variant: 'ghost', tone: 'lavender', className: 'border-pastel-lavender-dark/[0.40] focus-visible:border-pastel-lavender-dark/[0.70]' },
      { variant: 'ghost', tone: 'lilac',    className: 'border-pastel-lilac-dark/[0.40]    focus-visible:border-pastel-lilac-dark/[0.70]'    },
      { variant: 'ghost', tone: 'neutral',  className: 'border-pastel-neutral-dark/[0.35]  focus-visible:border-pastel-neutral-dark/[0.65]'  },
    ],
    defaultVariants: {
      variant: 'default',
      tone: 'neutral',
      size: 'default',
      invalid: false,
    },
  },
)

export type InputVariantProps = VariantProps<typeof inputVariants>

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    InputVariantProps {
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  radius?: number
  leftAdornment?: ReactNode
  rightAdornment?: ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    description,
    error,
    radius = 12,
    leftAdornment,
    rightAdornment,
    className,
    containerClassName,
    variant,
    tone,
    size,
    invalid,
    required,
    disabled,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null)
  const autoId = useId()
  const inputId = id ?? `input-${autoId}`
  const descriptionId = description ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const isInvalid = invalid ?? Boolean(error)

  useInputSound(innerRef)

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      ;(innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
      }
    },
    [ref],
  )

  return (
    <div className={cn('w-full', containerClassName)}>
      {label != null && (
        <label
          htmlFor={inputId}
          className={cn(
            'block mb-[6px] text-[12px] leading-none font-medium',
            disabled ? 'opacity-60' : 'text-black/70',
          )}
        >
          <span className="inline-flex items-center gap-2">
            {label}
            {required ? <span className="text-black/35">*</span> : null}
          </span>
        </label>
      )}

      <div
        className={cn(
          'relative w-full',
          leftAdornment ? 'pl-[34px]' : '',
          rightAdornment ? 'pr-[34px]' : '',
        )}
        style={{ '--field-radius': `${radius}px` } as React.CSSProperties}
      >
        {leftAdornment ? (
          <div className="absolute left-[10px] top-1/2 -translate-y-1/2 text-black/45 pointer-events-none">
            {leftAdornment}
          </div>
        ) : null}

        <input
          ref={setRef}
          id={inputId}
          className={cn(
            inputVariants({ variant, tone, size, invalid: isInvalid }),
            leftAdornment ? 'pl-[34px]' : '',
            rightAdornment ? 'pr-[34px]' : '',
            className,
          )}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          required={required}
          disabled={disabled}
          {...rest}
        />

        {rightAdornment ? (
          <div className="absolute right-[10px] top-1/2 -translate-y-1/2 text-black/45 pointer-events-none">
            {rightAdornment}
          </div>
        ) : null}
      </div>

      {description != null && (
        <div id={descriptionId} className="mt-[6px] text-[12px] leading-snug text-black/45">
          {description}
        </div>
      )}
      {error != null && (
        <div id={errorId} className="mt-[6px] text-[12px] leading-snug text-red-700/80">
          {error}
        </div>
      )}
    </div>
  )
})

