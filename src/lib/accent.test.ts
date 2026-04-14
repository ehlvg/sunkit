import { describe, it, expect } from 'vitest'
import { hexToAccentPair, resolveAccent } from './accent'

describe('hexToAccentPair', () => {
  it('returns fill equal to input hex', () => {
    const { fill } = hexToAccentPair('#D4C5F9')
    expect(fill).toBe('#D4C5F9')
  })

  it('returns darker border color', () => {
    const { border } = hexToAccentPair('#D4C5F9')
    expect(border).not.toBe('#D4C5F9')
    expect(border).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('handles invalid/empty hex gracefully', () => {
    const result = hexToAccentPair('')
    expect(result.fill).toBe('')
    expect(result.border).toBe('')
  })

  it('handles hex without # prefix gracefully', () => {
    const result = hexToAccentPair('D4C5F9')
    expect(result.fill).toBe('D4C5F9')
  })
})

describe('resolveAccent', () => {
  const FILL = { lavender: '#D4C5F9', neutral: '#E8E4DC' }
  const BORDER = { lavender: '#5a3eaa', neutral: '#5a5550' }

  it('returns tone-based colors when no accentColor', () => {
    const result = resolveAccent('lavender', FILL, BORDER)
    expect(result.fill).toBe('#D4C5F9')
    expect(result.border).toBe('#5a3eaa')
  })

  it('returns accent-derived colors when accentColor is provided', () => {
    const result = resolveAccent('lavender', FILL, BORDER, '#B8F0D8')
    expect(result.fill).toBe('#B8F0D8')
    expect(result.border).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('falls back to neutral when tone is unknown', () => {
    const result = resolveAccent('unknown', FILL, BORDER)
    expect(result.fill).toBe('#E8E4DC')
    expect(result.border).toBe('#5a5550')
  })
})
