/**
 * Derives a { fill, border } color pair from a hex accent color.
 * fill  = the hex itself (used as the highlight background)
 * border = a visually darker / more saturated version (used for borders/text)
 *
 * The derivation uses HSL math — no external dependencies.
 */
function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let s = 0
  let hue = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: hue = ((b - r) / d + 2) / 6; break
      case b: hue = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(hue * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100
  const ln = l / 100
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * Given any hex accent color, returns:
 *   fill   — the accent itself (used as selection / highlight background)
 *   border — darker, more saturated variant (used for borders / icon tinting)
 */
export function hexToAccentPair(hex: string): { fill: string; border: string } {
  if (!hex || !hex.startsWith('#')) return { fill: hex, border: hex }
  const [h, s, l] = hexToHsl(hex)
  const borderL = Math.max(l - 28, 20)
  const borderS = Math.min(s + 10, 100)
  return {
    fill: hex,
    border: hslToHex(h, borderS, borderL),
  }
}

/**
 * Resolves the effective { fill, border } pair for a component.
 * Priority: explicit accentColor prop > ThemeContext accentColor > predefined tone.
 */
export function resolveAccent(
  tone: string,
  TONE_FILL: Record<string, string>,
  TONE_BORDER: Record<string, string>,
  accentColor?: string,
): { fill: string; border: string } {
  if (accentColor) return hexToAccentPair(accentColor)
  return {
    fill: TONE_FILL[tone] ?? TONE_FILL['neutral'] ?? '#E8E4DC',
    border: TONE_BORDER[tone] ?? TONE_BORDER['neutral'] ?? '#5a5550',
  }
}
