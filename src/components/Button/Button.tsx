import { useRef, useCallback } from 'react'
import type { ButtonHTMLAttributes, ReactNode, CSSProperties, Ref } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { useButtonSound } from '../../hooks/useButtonSound'
import type { ButtonColor } from '../../tokens/colors'

export type { ButtonColor }
export type ButtonSize = 'default' | 'sm' | 'icon-only'
export type ButtonIconPosition = 'none' | 'left' | 'right' | 'only'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-[7px]',
    'font-[system-ui,_-apple-system,_sans-serif] font-medium leading-none',
    'cursor-pointer border outline-none select-none relative',
    'rounded-[var(--btn-radius)]',
    'btn-transition',
    'active:scale-[0.972]',
    'hover:brightness-[1.05]',
    'btn-shadow hover:btn-shadow-hover active:btn-shadow-active',
    '[-webkit-tap-highlight-color:transparent]',
  ].join(' '),
  {
    variants: {
      color: {
        rose:     'bg-pastel-rose     text-pastel-rose-dark     border-pastel-rose-dark/[0.22]',
        peach:    'bg-pastel-peach    text-pastel-peach-dark    border-pastel-peach-dark/[0.22]',
        lemon:    'bg-pastel-lemon    text-pastel-lemon-dark    border-pastel-lemon-dark/[0.22]',
        mint:     'bg-pastel-mint     text-pastel-mint-dark     border-pastel-mint-dark/[0.22]',
        sky:      'bg-pastel-sky      text-pastel-sky-dark      border-pastel-sky-dark/[0.22]',
        lavender: 'bg-pastel-lavender text-pastel-lavender-dark border-pastel-lavender-dark/[0.22]',
        lilac:    'bg-pastel-lilac    text-pastel-lilac-dark    border-pastel-lilac-dark/[0.22]',
        neutral:  'bg-pastel-neutral  text-pastel-neutral-dark  border-pastel-neutral-dark/[0.22]',
      },
      size: {
        default:    'px-[18px] py-[10px] text-sm',
        sm:         'px-[13px] py-[7px] text-xs',
        'icon-only': 'p-[10px] w-10 h-10 text-sm',
        'icon-sm':  'p-[7px] w-8 h-8 text-xs',
      },
    },
    defaultVariants: {
      color: 'lavender',
      size: 'default',
    },
  },
)

type CVASize = NonNullable<VariantProps<typeof buttonVariants>['size']>

function resolveSize(size: ButtonSize, icon: ButtonIconPosition): CVASize {
  const isIconOnly = size === 'icon-only' || icon === 'only'
  if (!isIconOnly) return size === 'sm' ? 'sm' : 'default'
  return size === 'sm' ? 'icon-sm' : 'icon-only'
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
  color?: ButtonColor
  size?: ButtonSize
  icon?: ButtonIconPosition
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: ReactNode
  radius?: number
  children?: ReactNode
}

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export function Button({
  ref: externalRef,
  color = 'lavender',
  size = 'default',
  icon = 'none',
  iconLeft,
  iconRight,
  iconOnly,
  radius = 10,
  children,
  className,
  style,
  ...rest
}: ButtonProps) {
  const innerRef = useRef<HTMLButtonElement>(null)

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      ;(innerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof externalRef === 'function') {
        externalRef(node)
      } else if (externalRef != null) {
        ;(externalRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }
    },
    [externalRef],
  )

  useButtonSound(innerRef)

  const isIconOnly = size === 'icon-only' || icon === 'only'

  return (
    <button
      ref={setRef}
      className={cn(buttonVariants({ color, size: resolveSize(size, icon) }), className)}
      style={{ '--btn-radius': `${radius}px`, ...style } as CSSProperties}
      {...rest}
    >
      {isIconOnly ? (
        <span className="flex items-center leading-none shrink-0">
          {iconOnly ?? <StarIcon />}
        </span>
      ) : (
        <>
          {icon === 'left' && (
            <span className="flex items-center leading-none shrink-0">
              {iconLeft ?? <PlayIcon />}
            </span>
          )}
          <span className="[text-shadow:0_1px_0_rgba(255,255,255,0.55)]">{children}</span>
          {icon === 'right' && (
            <span className="flex items-center leading-none shrink-0">
              {iconRight ?? <PlayIcon />}
            </span>
          )}
        </>
      )}
    </button>
  )
}
