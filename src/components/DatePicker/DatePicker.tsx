import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/utils'
import { playPickerNav, playPickerSelect, usePickerSoundCtx } from '../../hooks/usePickerSound'

export type DatePickerTone =
  | 'rose' | 'peach' | 'lemon' | 'mint'
  | 'sky'  | 'lavender' | 'lilac' | 'neutral'

export type DatePickerSize = 'default' | 'sm'

export interface DatePickerProps {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  label?: ReactNode
  description?: ReactNode
  tone?: DatePickerTone
  size?: DatePickerSize
  placeholder?: string
  id?: string
  className?: string
  containerClassName?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const TONE_FILL: Record<DatePickerTone, string> = {
  rose:     'var(--color-pastel-rose)',
  peach:    'var(--color-pastel-peach)',
  lemon:    'var(--color-pastel-lemon)',
  mint:     'var(--color-pastel-mint)',
  sky:      'var(--color-pastel-sky)',
  lavender: 'var(--color-pastel-lavender)',
  lilac:    'var(--color-pastel-lilac)',
  neutral:  'var(--color-pastel-neutral)',
}

const TONE_BORDER: Record<DatePickerTone, string> = {
  rose:     'var(--color-pastel-rose-dark)',
  peach:    'var(--color-pastel-peach-dark)',
  lemon:    'var(--color-pastel-lemon-dark)',
  mint:     'var(--color-pastel-mint-dark)',
  sky:      'var(--color-pastel-sky-dark)',
  lavender: 'var(--color-pastel-lavender-dark)',
  lilac:    'var(--color-pastel-lilac-dark)',
  neutral:  'var(--color-pastel-neutral-dark)',
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function isBeforeDay(a: Date, b: Date) {
  return new Date(a.getFullYear(), a.getMonth(), a.getDate()) <
    new Date(b.getFullYear(), b.getMonth(), b.getDate())
}

function isAfterDay(a: Date, b: Date) {
  return new Date(a.getFullYear(), a.getMonth(), a.getDate()) >
    new Date(b.getFullYear(), b.getMonth(), b.getDate())
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  {
    value: valueProp,
    defaultValue = null,
    onChange,
    minDate,
    maxDate,
    disabled = false,
    label,
    description,
    tone = 'lavender',
    size = 'default',
    placeholder = 'Pick a date…',
    id,
    className,
    containerClassName,
  },
  ref,
) {
  const actx = usePickerSoundCtx()
  const autoId = useId()
  const triggerId = id ?? `datepicker-${autoId}`
  const panelId = `${triggerId}-panel`
  const descId = description ? `${triggerId}-desc` : undefined

  const isControlled = valueProp !== undefined
  const [valueUncontrolled, setValueUncontrolled] = useState<Date | null>(defaultValue)
  const value = isControlled ? valueProp ?? null : valueUncontrolled

  const [open, setOpen] = useState(false)
  const today = new Date()
  const [viewYear, setViewYear] = useState((value ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState((value ?? today).getMonth())
  const [focusedDate, setFocusedDate] = useState<Date | null>(value ?? today)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      ;(triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref != null) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    },
    [ref],
  )

  const openPanel = () => {
    if (disabled) return
    const base = value ?? today
    setViewYear(base.getFullYear())
    setViewMonth(base.getMonth())
    setFocusedDate(base)
    setOpen(true)
  }

  const closePanel = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  const selectDate = (date: Date) => {
    if (!isControlled) setValueUncontrolled(date)
    onChange?.(date)
    playPickerSelect(actx)
    closePanel()
  }

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
    playPickerNav(actx, 'prev')
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
    playPickerNav(actx, 'next')
  }

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

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth)

  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d))

  const isDisabled = (d: Date) =>
    (minDate != null && isBeforeDay(d, minDate)) ||
    (maxDate != null && isAfterDay(d, maxDate))

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { closePanel(); return }
    if (!focusedDate) return
    let next = new Date(focusedDate)
    if (e.key === 'ArrowRight') { next.setDate(next.getDate() + 1); e.preventDefault() }
    else if (e.key === 'ArrowLeft') { next.setDate(next.getDate() - 1); e.preventDefault() }
    else if (e.key === 'ArrowDown') { next.setDate(next.getDate() + 7); e.preventDefault() }
    else if (e.key === 'ArrowUp')   { next.setDate(next.getDate() - 7); e.preventDefault() }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (!isDisabled(focusedDate)) selectDate(focusedDate)
      return
    } else return

    if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
      setViewMonth(next.getMonth())
      setViewYear(next.getFullYear())
    }
    setFocusedDate(next)
  }

  const triggerH = size === 'sm' ? 32 : 40
  const triggerPx = size === 'sm' ? 10 : 12
  const triggerFz = size === 'sm' ? 12 : 13

  const fillColor   = TONE_FILL[tone]
  const borderColor = TONE_BORDER[tone]

  const triggerStyle: CSSProperties = {
    height: triggerH,
    paddingInline: triggerPx,
    fontSize: triggerFz,
  }

  const panelStyle: CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    zIndex: 50,
    width: 280,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.94)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow: '0 8px 32px -6px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.07)',
    overflow: 'hidden',
  }

  return (
    <div
      className={cn('w-full font-[system-ui,_-apple-system,_sans-serif]', containerClassName)}
    >
      {label != null && (
        <label
          htmlFor={triggerId}
          className={cn('block mb-[6px] text-[12px] leading-none font-medium', disabled ? 'opacity-60' : 'text-black/70')}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={setRef}
          id={triggerId}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-describedby={descId}
          disabled={!!disabled}
          onClick={() => (open ? closePanel() : openPanel())}
          className={cn(
            'w-full inline-flex items-center justify-between gap-2',
            'bg-white/60 border rounded-[12px] outline-none cursor-pointer select-none',
            'btn-shadow hover:btn-shadow-hover hover:brightness-[1.03]',
            'focus-visible:btn-shadow-hover',
            'transition-[box-shadow,border-color,background-color] duration-150 ease-out',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          )}
          style={{
            ...triggerStyle,
            borderColor: `${borderColor}44`,
          }}
        >
          <span className={cn('text-left truncate', !value && 'text-black/30')}>
            {value ? formatDate(value) : placeholder}
          </span>
          <span className="text-black/40 shrink-0">
            <CalendarIcon />
          </span>
        </button>

        {open && (
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label="Date picker"
            onKeyDown={onPanelKeyDown}
            tabIndex={-1}
            style={panelStyle}
          >
            {/* Month nav */}
            <div className="flex items-center justify-between px-[14px] py-[12px] border-b border-black/[0.06]">
              <button
                type="button"
                aria-label="Previous month"
                onClick={prevMonth}
                className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-black/50 hover:bg-black/[0.06] hover:text-black/70 outline-none focus-visible:ring-2 focus-visible:ring-black/20 cursor-pointer transition-colors duration-100"
              >
                <ChevronLeft />
              </button>

              <span className="text-[13px] font-semibold text-black/70 select-none">
                {MONTHS[viewMonth]} {viewYear}
              </span>

              <button
                type="button"
                aria-label="Next month"
                onClick={nextMonth}
                className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-black/50 hover:bg-black/[0.06] hover:text-black/70 outline-none focus-visible:ring-2 focus-visible:ring-black/20 cursor-pointer transition-colors duration-100"
              >
                <ChevronRight />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 px-[10px] pt-[10px] pb-[4px]">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[11px] font-semibold text-black/30 leading-none py-[2px]">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 px-[10px] pb-[10px] gap-y-[2px]">
              {cells.map((date, idx) => {
                if (date === null) return <div key={`e-${idx}`} />

                const isSelected = value != null && isSameDay(date, value)
                const isFocused  = focusedDate != null && isSameDay(date, focusedDate)
                const isToday    = isSameDay(date, today)
                const isDis      = isDisabled(date)

                const cellStyle: CSSProperties = isSelected
                  ? {
                      background: fillColor,
                      border: `1.5px solid ${borderColor}44`,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
                    }
                  : isFocused && !isDis
                  ? { background: 'rgba(0,0,0,0.06)' }
                  : {}

                return (
                  <button
                    key={date.getTime()}
                    type="button"
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-disabled={isDis}
                    tabIndex={isFocused ? 0 : -1}
                    onClick={() => !isDis && selectDate(date)}
                    onMouseEnter={() => !isDis && setFocusedDate(date)}
                    className={cn(
                      'relative flex items-center justify-center',
                      'text-[12px] leading-none rounded-[8px] aspect-square',
                      'outline-none transition-colors duration-75',
                      !isDis && 'cursor-pointer hover:bg-black/[0.05]',
                      isDis && 'opacity-30 cursor-not-allowed',
                      isSelected && 'font-semibold',
                      isToday && !isSelected && 'font-semibold',
                    )}
                    style={cellStyle}
                  >
                    <span>{date.getDate()}</span>
                    {isToday && !isSelected && (
                      <span
                        className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full"
                        style={{ background: borderColor }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {description != null && (
        <div id={descId} className="mt-[6px] text-[12px] leading-snug text-black/45">
          {description}
        </div>
      )}
    </div>
  )
})
