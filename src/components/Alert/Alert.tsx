import React, { useState, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../../lib/utils'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  variant?: AlertVariant
  title?: ReactNode
  children?: ReactNode
  dismissable?: boolean
  onDismiss?: () => void
  icon?: ReactNode
  className?: string
}

const VARIANT_MAP: Record<AlertVariant, {
  bg: string
  border: string
  iconColor: string
  title: string
}> = {
  info: {
    bg:        'bg-pastel-sky/45',
    border:    'border-pastel-sky-dark/[0.20]',
    iconColor: 'text-pastel-sky-dark',
    title:     'text-pastel-sky-dark',
  },
  success: {
    bg:        'bg-pastel-mint/45',
    border:    'border-pastel-mint-dark/[0.20]',
    iconColor: 'text-pastel-mint-dark',
    title:     'text-pastel-mint-dark',
  },
  warning: {
    bg:        'bg-pastel-lemon/50',
    border:    'border-pastel-lemon-dark/[0.20]',
    iconColor: 'text-pastel-lemon-dark',
    title:     'text-pastel-lemon-dark',
  },
  error: {
    bg:        'bg-pastel-rose/45',
    border:    'border-pastel-rose-dark/[0.20]',
    iconColor: 'text-pastel-rose-dark',
    title:     'text-pastel-rose-dark',
  },
}

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const SuccessIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const DEFAULT_ICONS: Record<AlertVariant, ReactNode> = {
  info:    <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error:   <ErrorIcon />,
}

export function Alert({
  variant = 'info',
  title,
  children,
  dismissable = false,
  onDismiss,
  icon,
  className,
}: AlertProps) {
  const [state, setState] = useState<'in' | 'out'>('in')
  const map = VARIANT_MAP[variant]

  if (state === 'out') return null

  const handleDismiss = () => {
    setState('out')
    onDismiss?.()
  }

  const alertStyle: CSSProperties = {
    animation: `alert-in 220ms cubic-bezier(0.34, 1.42, 0.64, 1) both`,
  }

  return (
    <div
      role="alert"
      style={alertStyle}
      className={cn(
        'flex gap-[10px] items-start',
        'rounded-[12px] border px-[14px] py-[12px]',
        'font-[system-ui,_-apple-system,_sans-serif]',
        map.bg,
        map.border,
        className,
      )}
    >
      <span className={cn('shrink-0 mt-[1px]', map.iconColor)}>
        {icon ?? DEFAULT_ICONS[variant]}
      </span>

      <div className="flex-1 min-w-0">
        {title != null && (
          <div className={cn('text-[13px] font-semibold leading-none mb-[4px]', map.title)}>
            {title}
          </div>
        )}
        {children != null && (
          <div className="text-[12px] leading-snug text-black/60">
            {children}
          </div>
        )}
      </div>

      {dismissable && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={handleDismiss}
          className="shrink-0 mt-[1px] text-black/35 hover:text-black/60 outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-[4px] cursor-pointer transition-colors duration-100"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
