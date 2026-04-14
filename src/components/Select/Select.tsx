import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import {
  playSelectOpen,
  playSelectChoose,
  useSelectSoundCtx,
} from '../../hooks/useSelectSound'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

const triggerVariants = cva(
  [
    'w-full min-w-0 inline-flex items-center justify-between gap-2',
    'font-[system-ui,_-apple-system,_sans-serif] text-[13px] leading-none',
    'outline-none cursor-pointer select-none',
    'transition-[box-shadow,border-color,background-color,opacity] duration-[150ms] ease-out',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-white/60 border rounded-[var(--field-radius)]',
          'btn-shadow hover:btn-shadow-hover',
          'hover:brightness-[1.03]',
          'focus-visible:btn-shadow-hover',
        ].join(' '),
        filled: [
          'bg-black/[0.055] border border-black/[0.10] rounded-[var(--field-radius)]',
          'shadow-[inset_0_1px_3px_rgba(0,0,0,0.09)]',
          'hover:bg-black/[0.075]',
          'focus-visible:bg-white/70',
        ].join(' '),
        ghost: [
          'bg-transparent border-0 border-b-[1.5px] border-black/25 rounded-none',
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
    defaultVariants: { variant: 'default', tone: 'neutral', size: 'default', invalid: false },
  },
)

export type SelectVariantProps = VariantProps<typeof triggerVariants>

export interface SelectProps extends SelectVariantProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  radius?: number
  id?: string
  'aria-describedby'?: string
  containerClassName?: string
  className?: string
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: 'transform 180ms cubic-bezier(0.34,1.42,0.64,1)',
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      flexShrink: 0,
    }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    disabled = false,
    searchable = false,
    label,
    description,
    error,
    radius = 12,
    id,
    'aria-describedby': ariaDescribedBy,
    containerClassName,
    className,
    variant = 'default',
    tone = 'neutral',
    size = 'default',
    invalid,
  },
  ref,
) {
  const actx = useSelectSoundCtx()
  const autoId = useId()
  const triggerId = id ?? `select-${autoId}`
  const listId = `${triggerId}-list`
  const descriptionId = description ? `${triggerId}-description` : undefined
  const errorId = error ? `${triggerId}-error` : undefined
  const describedBy = [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const isInvalid = invalid ?? Boolean(error)

  const isControlled = valueProp !== undefined
  const [valueUncontrolled, setValueUncontrolled] = useState(defaultValue ?? '')
  const value = isControlled ? valueProp! : valueUncontrolled

  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState<number>(-1)
  const [search, setSearch] = useState('')

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      ;(triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    },
    [ref],
  )

  const filtered = searchable && search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const openPanel = useCallback(() => {
    if (disabled) return
    setOpen(true)
    setSearch('')
    const idx = filtered.findIndex(o => o.value === value)
    setActiveIdx(idx >= 0 ? idx : 0)
    playSelectOpen(actx)
  }, [disabled, filtered, value, actx])

  const closePanel = useCallback(() => {
    setOpen(false)
    setSearch('')
    triggerRef.current?.focus()
  }, [])

  const selectOption = useCallback(
    (opt: SelectOption) => {
      if (opt.disabled) return
      if (!isControlled) setValueUncontrolled(opt.value)
      onChange?.(opt.value)
      playSelectChoose(actx)
      closePanel()
    },
    [isControlled, onChange, actx, closePanel],
  )

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        closePanel()
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, closePanel])

  // Focus search on open
  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => searchRef.current?.focus(), 10)
    }
  }, [open, searchable])

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) openPanel()
      else {
        setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (open) setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Escape') {
      closePanel()
    }
  }

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = filtered[activeIdx]
      if (opt) selectOption(opt)
    } else if (e.key === 'Escape') {
      closePanel()
    }
  }

  const selectedLabel = options.find(o => o.value === value)?.label

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    zIndex: 50,
    borderRadius: radius,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 24px -4px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.07), inset 0 0 0 1px rgba(0,0,0,0.07)',
    overflow: 'hidden',
    maxHeight: 260,
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <div className={cn('w-full', containerClassName)} style={{ '--field-radius': `${radius}px` } as CSSProperties}>
      {label != null && (
        <label
          htmlFor={triggerId}
          className={cn('block mb-[6px] text-[12px] leading-none font-medium', disabled ? 'opacity-60' : 'text-black/70')}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <button
          ref={setRef}
          id={triggerId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          disabled={!!disabled}
          onClick={() => (open ? closePanel() : openPanel())}
          onKeyDown={onTriggerKeyDown}
          className={cn(
            triggerVariants({ variant, tone, size, invalid: isInvalid }),
            className,
          )}
        >
          <span className={cn('truncate', !selectedLabel && 'text-black/30')}>
            {selectedLabel ?? placeholder}
          </span>
          <ChevronIcon open={open} />
        </button>

        {open && (
          <div
            ref={panelRef}
            role="listbox"
            id={listId}
            onKeyDown={onPanelKeyDown}
            style={dropdownStyle}
          >
            {searchable && (
              <div className="p-[6px] border-b border-black/[0.06]">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value)
                    setActiveIdx(0)
                  }}
                  className="w-full outline-none bg-transparent text-[13px] text-black/80 placeholder:text-black/30 px-[6px] py-[4px]"
                />
              </div>
            )}
            <div className="overflow-y-auto p-[4px]" style={{ maxHeight: searchable ? 210 : 252 }}>
              {filtered.length === 0 ? (
                <div className="text-[12px] text-black/35 px-[10px] py-[8px]">No options</div>
              ) : (
                filtered.map((opt, idx) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={opt.value === value}
                    aria-disabled={opt.disabled}
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => selectOption(opt)}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 px-[10px] py-[7px] rounded-[8px]',
                      'text-[13px] leading-none text-left outline-none cursor-pointer',
                      'transition-colors duration-75',
                      idx === activeIdx && !opt.disabled && 'bg-black/[0.055]',
                      opt.value === value && 'font-medium',
                      opt.disabled && 'opacity-40 cursor-not-allowed',
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {opt.value === value && <span className="text-black/50 shrink-0"><CheckIcon /></span>}
                  </button>
                ))
              )}
            </div>
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
