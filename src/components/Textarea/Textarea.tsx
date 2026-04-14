import React, {
  forwardRef,
  useCallback,
  useId,
  useRef,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { useInputSound } from '../../hooks/useInputSound'

const textareaVariants = cva(
  [
    'w-full min-w-0',
    'font-[system-ui,_-apple-system,_sans-serif] text-[13px] text-black/80 leading-[1.5]',
    'outline-none resize-none',
    'placeholder:text-black/30',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-[box-shadow,border-color,background-color,opacity] duration-[150ms] ease-out',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-white/60 border',
          'rounded-[var(--field-radius)]',
          'btn-shadow hover:btn-shadow-hover',
          'focus-visible:btn-shadow-hover',
          'hover:brightness-[1.03]',
        ].join(' '),
        filled: [
          'bg-black/[0.055] border border-black/[0.10]',
          'rounded-[var(--field-radius)]',
          'shadow-[inset_0_1px_3px_rgba(0,0,0,0.09)]',
          'hover:bg-black/[0.075]',
          'focus-visible:bg-white/70 focus-visible:shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]',
        ].join(' '),
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
      invalid: {
        true:  'border-red-600/50 focus-visible:border-red-600/70',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'ghost', tone: 'rose',     className: 'border-pastel-rose-dark/[0.40]     focus-visible:border-pastel-rose-dark/[0.70]'     },
      { variant: 'ghost', tone: 'peach',    className: 'border-pastel-peach-dark/[0.40]    focus-visible:border-pastel-peach-dark/[0.70]'    },
      { variant: 'ghost', tone: 'lemon',    className: 'border-pastel-lemon-dark/[0.40]    focus-visible:border-pastel-lemon-dark/[0.70]'    },
      { variant: 'ghost', tone: 'mint',     className: 'border-pastel-mint-dark/[0.40]     focus-visible:border-pastel-mint-dark/[0.70]'     },
      { variant: 'ghost', tone: 'sky',      className: 'border-pastel-sky-dark/[0.40]      focus-visible:border-pastel-sky-dark/[0.70]'      },
      { variant: 'ghost', tone: 'lavender', className: 'border-pastel-lavender-dark/[0.40] focus-visible:border-pastel-lavender-dark/[0.70]' },
      { variant: 'ghost', tone: 'lilac',    className: 'border-pastel-lilac-dark/[0.40]    focus-visible:border-pastel-lilac-dark/[0.70]'    },
      { variant: 'ghost', tone: 'neutral',  className: 'border-pastel-neutral-dark/[0.35]  focus-visible:border-pastel-neutral-dark/[0.65]'  },
    ],
    defaultVariants: { variant: 'default', tone: 'neutral', invalid: false },
  },
)

export type TextareaVariantProps = VariantProps<typeof textareaVariants>

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'>,
    TextareaVariantProps {
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  radius?: number
  rows?: number
  autoResize?: boolean
  showCount?: boolean
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    id,
    label,
    description,
    error,
    radius = 12,
    rows = 4,
    autoResize = false,
    showCount = false,
    maxLength,
    className,
    containerClassName,
    variant,
    tone,
    invalid,
    required,
    disabled,
    'aria-describedby': ariaDescribedBy,
    onChange,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLTextAreaElement>(null)
  const autoId = useId()
  const textareaId = id ?? `textarea-${autoId}`
  const descriptionId = description ? `${textareaId}-description` : undefined
  const errorId = error ? `${textareaId}-error` : undefined
  const describedBy = [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const isInvalid = invalid ?? Boolean(error)

  useInputSound(innerRef)

  const setRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      ;(innerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
    },
    [ref],
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize && innerRef.current) {
      innerRef.current.style.height = 'auto'
      innerRef.current.style.height = `${innerRef.current.scrollHeight}px`
    }
    onChange?.(e)
  }

  const currentLength = typeof rest.value === 'string'
    ? rest.value.length
    : typeof rest.defaultValue === 'string'
    ? rest.defaultValue.length
    : 0

  return (
    <div
      className={cn('w-full', containerClassName)}
      style={{ '--field-radius': `${radius}px` } as React.CSSProperties}
    >
      {label != null && (
        <label
          htmlFor={textareaId}
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

      <div className="relative">
        <textarea
          ref={setRef}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            textareaVariants({ variant, tone, invalid: isInvalid }),
            'px-[12px] py-[10px]',
            className,
          )}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
        {showCount && maxLength != null && (
          <div className="absolute bottom-[8px] right-[10px] text-[11px] leading-none text-black/30 pointer-events-none">
            {currentLength}/{maxLength}
          </div>
        )}
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
