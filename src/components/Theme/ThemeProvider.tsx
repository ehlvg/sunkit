import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface ThemeContextValue {
  accentColor?: string
  dark?: boolean
}

export const ThemeContext = createContext<ThemeContextValue>({})

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

export interface ThemeProviderProps {
  accentColor?: string
  dark?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export function ThemeProvider({
  accentColor,
  dark,
  className,
  style,
  children,
}: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(() => ({ accentColor, dark }), [accentColor, dark])

  const wrapperStyle: CSSProperties = {
    ...(accentColor ? ({ '--sk-accent': accentColor } as CSSProperties) : {}),
    ...style,
  }

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={cn(dark === true ? 'dark' : dark === false ? 'light' : '', className)}
        data-theme={dark === true ? 'dark' : dark === false ? 'light' : undefined}
        style={wrapperStyle}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
