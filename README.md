# sunkit

A pastel React component library with soft shadows, spring animations, and Web Audio micro-interactions.

Built with **React 19**, **Tailwind CSS v4**, and **class-variance-authority**. Zero runtime dependencies beyond React.

---

## Installation

```bash
pnpm add sunkit
```

Peer dependencies (install if not already present):

```bash
pnpm add react react-dom
```

---

## Setup

Sunkit ships a CSS file that must be imported once — it registers the Tailwind theme (pastel colour tokens) and the utility classes (`btn-shadow`, keyframe animations, etc.).

### With Tailwind CSS v4 (recommended)

Add the sunkit CSS layer to your global stylesheet:

```css
/* app/globals.css */
@import "tailwindcss";
@import "sunkit/dist/sunkit.css";
```

### Without Tailwind (standalone)

```tsx
// main.tsx or _app.tsx
import 'sunkit/dist/sunkit.css'
```

---

## Components

### Button

A tactile pastel button with shadow, hover brightness, press scale, and Web Audio click sound.

```tsx
import { Button } from 'sunkit'

<Button color="lavender">Click me</Button>
<Button color="mint" size="sm" icon="left">With icon</Button>
<Button color="sky" size="icon-only" icon="only" aria-label="Star" />
```

| Prop        | Type                                                                 | Default      |
|-------------|----------------------------------------------------------------------|--------------|
| `color`     | `'rose'│'peach'│'lemon'│'mint'│'sky'│'lavender'│'lilac'│'neutral'` | `'lavender'` |
| `size`      | `'default'│'sm'│'icon-only'`                                        | `'default'`  |
| `icon`      | `'none'│'left'│'right'│'only'`                                      | `'none'`     |
| `iconLeft`  | `ReactNode`                                                          | —            |
| `iconRight` | `ReactNode`                                                          | —            |
| `iconOnly`  | `ReactNode`                                                          | —            |
| `radius`    | `number` (px)                                                        | `10`         |

---

### Toggle

An iOS-style switch with spring knob animation and squish-on-press. Plays distinct snap sounds on/off.

```tsx
import { Toggle } from 'sunkit'

<Toggle label="Airplane mode" tone="sky" />

// Controlled
const [on, setOn] = useState(false)
<Toggle checked={on} onCheckedChange={setOn} tone="mint" label="Notifications" />
```

| Prop               | Type                    | Default     |
|--------------------|-------------------------|-------------|
| `tone`             | pastel tone             | `'neutral'` |
| `size`             | `'default'│'sm'`        | `'default'` |
| `checked`          | `boolean`               | —           |
| `defaultChecked`   | `boolean`               | `false`     |
| `onCheckedChange`  | `(checked: boolean) =>` | —           |
| `label`            | `ReactNode`             | —           |
| `description`      | `ReactNode`             | —           |
| `disabled`         | `boolean`               | `false`     |

---

### Input

A text input with three visually distinct variants. Plays a gentle focus chime.

```tsx
import { Input } from 'sunkit'

<Input label="Email" placeholder="you@example.com" tone="lavender" />
<Input variant="filled" label="Search" placeholder="Search…" />
<Input variant="ghost" label="Notes" placeholder="Type anything…" />

// With adornments
<Input
  label="Amount"
  leftAdornment={<span>$</span>}
  rightAdornment={<span>USD</span>}
/>

// With error
<Input label="Email" error="Please enter a valid email." tone="rose" />
```

| Prop               | Type                              | Default      |
|--------------------|-----------------------------------|--------------|
| `variant`          | `'default'│'filled'│'ghost'`      | `'default'`  |
| `tone`             | pastel tone                       | `'neutral'`  |
| `size`             | `'default'│'sm'`                  | `'default'`  |
| `label`            | `ReactNode`                       | —            |
| `description`      | `ReactNode`                       | —            |
| `error`            | `ReactNode`                       | —            |
| `leftAdornment`    | `ReactNode`                       | —            |
| `rightAdornment`   | `ReactNode`                       | —            |
| `radius`           | `number` (px)                     | `12`         |
| `invalid`          | `boolean`                         | auto         |

---

### Select

A custom dropdown (no native `<select>`) with keyboard navigation, optional search, and matching Input variants.

```tsx
import { Select } from 'sunkit'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'mango', label: 'Mango' },
  { value: 'lemon', label: 'Lemon', disabled: true },
]

<Select options={options} label="Fruit" placeholder="Pick one…" tone="peach" />
<Select options={options} searchable label="Search & select" />

// Controlled
const [val, setVal] = useState('')
<Select options={options} value={val} onChange={setVal} />
```

| Prop          | Type                         | Default      |
|---------------|------------------------------|--------------|
| `options`     | `SelectOption[]` (required)  | —            |
| `value`       | `string`                     | —            |
| `defaultValue`| `string`                     | —            |
| `onChange`    | `(value: string) => void`    | —            |
| `placeholder` | `string`                     | `'Select…'`  |
| `searchable`  | `boolean`                    | `false`      |
| `variant`     | `'default'│'filled'│'ghost'` | `'default'`  |
| `tone`        | pastel tone                  | `'neutral'`  |
| `size`        | `'default'│'sm'`             | `'default'`  |
| `label`       | `ReactNode`                  | —            |
| `description` | `ReactNode`                  | —            |
| `error`       | `ReactNode`                  | —            |
| `disabled`    | `boolean`                    | `false`      |

---

### Slider

A styled range input with a spring-animated thumb that squishes on press. Emits pitched scrub sounds.

```tsx
import { Slider } from 'sunkit'

<Slider label="Volume" min={0} max={100} defaultValue={50} tone="lavender" showValue />

// With marks
<Slider
  label="Quality"
  min={0} max={100} step={25}
  marks={[
    { value: 0,   label: 'Low'  },
    { value: 50,  label: 'Med'  },
    { value: 100, label: 'High' },
  ]}
/>

// Controlled
const [val, setVal] = useState(40)
<Slider value={val} onValueChange={setVal} tone="mint" />
```

| Prop            | Type                         | Default      |
|-----------------|------------------------------|--------------|
| `min`           | `number`                     | `0`          |
| `max`           | `number`                     | `100`        |
| `step`          | `number`                     | `1`          |
| `value`         | `number`                     | —            |
| `defaultValue`  | `number`                     | `0`          |
| `onValueChange` | `(value: number) => void`    | —            |
| `tone`          | pastel tone                  | `'lavender'` |
| `size`          | `'default'│'sm'`             | `'default'`  |
| `label`         | `ReactNode`                  | —            |
| `description`   | `ReactNode`                  | —            |
| `showValue`     | `boolean`                    | `false`      |
| `marks`         | `{ value: number; label?: string }[]` | — |
| `disabled`      | `boolean`                    | `false`      |

---

### Textarea

A multi-line text input that matches Input's variants and tones. Supports auto-resize and character count.

```tsx
import { Textarea } from 'sunkit'

<Textarea label="Message" rows={4} tone="sky" />
<Textarea variant="filled" autoResize label="Notes" />
<Textarea maxLength={200} showCount label="Bio" />
```

| Prop          | Type                         | Default     |
|---------------|------------------------------|-------------|
| `variant`     | `'default'│'filled'│'ghost'` | `'default'` |
| `tone`        | pastel tone                  | `'neutral'` |
| `label`       | `ReactNode`                  | —           |
| `description` | `ReactNode`                  | —           |
| `error`       | `ReactNode`                  | —           |
| `rows`        | `number`                     | `4`         |
| `autoResize`  | `boolean`                    | `false`     |
| `showCount`   | `boolean`                    | `false`     |
| `maxLength`   | `number`                     | —           |
| `radius`      | `number` (px)                | `12`        |

---

### Progress

A progress bar with determinate and indeterminate states.

```tsx
import { Progress } from 'sunkit'

<Progress value={65} tone="lavender" label="Uploading…" showValue />
<Progress tone="sky" label="Loading…" /> {/* indeterminate */}
```

| Prop        | Type                       | Default      |
|-------------|----------------------------|--------------|
| `value`     | `number` (0–100)           | indeterminate if omitted |
| `tone`      | pastel tone                | `'lavender'` |
| `size`      | `'sm'│'default'│'lg'`      | `'default'`  |
| `label`     | `ReactNode`                | —            |
| `showValue` | `boolean`                  | `false`      |
| `animated`  | `boolean`                  | `true`       |

---

### Card

A versatile container with elevated, filled, and outline variants. Includes `Card.Header`, `Card.Body`, and `Card.Footer`.

```tsx
import { Card } from 'sunkit'

<Card tone="lavender" variant="elevated" style={{ maxWidth: 360 }}>
  <Card.Header>
    <h3>Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Body content here.</p>
  </Card.Body>
  <Card.Footer>
    <Button size="sm" color="lavender">Action</Button>
  </Card.Footer>
</Card>

{/* Simple card with inline padding */}
<Card tone="mint" variant="filled" padding={24}>
  <p>No subcomponents needed.</p>
</Card>
```

| Prop       | Type                              | Default      |
|------------|-----------------------------------|--------------|
| `variant`  | `'elevated'│'filled'│'outline'`   | `'elevated'` |
| `tone`     | pastel tone                       | `'neutral'`  |
| `radius`   | `number` (px)                     | `16`         |
| `padding`  | `number│string`                   | —            |
| `as`       | `ElementType`                     | `'div'`      |

---

### ColorPicker

A swatch palette for picking one of the 8 pastel tones. Each color plays a unique pitched pluck.

```tsx
import { ColorPicker } from 'sunkit'
import type { ButtonColor } from 'sunkit'

<ColorPicker label="Theme colour" defaultValue="lavender" />

// Controlled
const [color, setColor] = useState<ButtonColor>('sky')
<ColorPicker value={color} onChange={setColor} />
```

| Prop           | Type                          | Default     |
|----------------|-------------------------------|-------------|
| `value`        | `ButtonColor`                 | —           |
| `defaultValue` | `ButtonColor`                 | —           |
| `onChange`     | `(value: ButtonColor) => void`| —           |
| `size`         | `'default'│'sm'`              | `'default'` |
| `label`        | `ReactNode`                   | —           |
| `description`  | `ReactNode`                   | —           |
| `disabled`     | `boolean`                     | `false`     |

---

### DatePicker

A fully custom calendar popover — no external dependencies. Full keyboard navigation and min/max date support.

```tsx
import { DatePicker } from 'sunkit'

<DatePicker label="Start date" tone="lavender" />

// Controlled
const [date, setDate] = useState<Date | null>(null)
<DatePicker value={date} onChange={setDate} />

// With constraints
<DatePicker
  minDate={new Date()}
  maxDate={new Date(Date.now() + 30 * 86400000)}
  label="Appointment"
/>
```

| Prop           | Type                          | Default          |
|----------------|-------------------------------|------------------|
| `value`        | `Date│null`                   | —                |
| `defaultValue` | `Date│null`                   | `null`           |
| `onChange`     | `(date: Date│null) => void`   | —                |
| `minDate`      | `Date`                        | —                |
| `maxDate`      | `Date`                        | —                |
| `tone`         | pastel tone                   | `'lavender'`     |
| `size`         | `'default'│'sm'`              | `'default'`      |
| `placeholder`  | `string`                      | `'Pick a date…'` |
| `label`        | `ReactNode`                   | —                |
| `description`  | `ReactNode`                   | —                |
| `disabled`     | `boolean`                     | `false`          |

---

### Alert

An animated feedback strip for info, success, warning, and error states.

```tsx
import { Alert } from 'sunkit'

<Alert variant="success" title="Saved!" dismissable>
  Your changes have been saved.
</Alert>

<Alert variant="error">Something went wrong. Please try again.</Alert>

// Custom icon
<Alert variant="info" icon={<MyIcon />} title="Note">
  Custom icon support.
</Alert>
```

| Prop          | Type                                    | Default    |
|---------------|-----------------------------------------|------------|
| `variant`     | `'info'│'success'│'warning'│'error'`    | `'info'`   |
| `title`       | `ReactNode`                             | —          |
| `children`    | `ReactNode`                             | —          |
| `dismissable` | `boolean`                               | `false`    |
| `onDismiss`   | `() => void`                            | —          |
| `icon`        | `ReactNode`                             | auto       |

---

## Pastel tones

All toned components accept a `tone` prop from this palette:

| Token       | Light              | Dark               |
|-------------|--------------------|--------------------|
| `rose`      | `#F9C5D1`          | `#c2607a`          |
| `peach`     | `#FDDBB4`          | `#b87a3a`          |
| `lemon`     | `#FFF1A8`          | `#8a7820`          |
| `mint`      | `#B8F0D8`          | `#2a7a58`          |
| `sky`       | `#B8DFFE`          | `#2a68a0`          |
| `lavender`  | `#D4C5F9`          | `#5a3eaa`          |
| `lilac`     | `#F0C8F0`          | `#8a3a8a`          |
| `neutral`   | `#E8E4DC`          | `#5a5550`          |

Import the token list directly:

```ts
import { COLORS, COLOR_MAP } from 'sunkit'

COLORS        // ColorToken[]  — array of all tones
COLOR_MAP     // Record<ButtonColor, { hex, darkHex }>
```

---

## Sound design

Every interactive component has its own sonic identity using the Web Audio API. All sounds are synthesised at runtime — no audio files required, and they respect system `prefers-reduced-motion` preferences in future releases.

| Component    | Sound                                           |
|--------------|-------------------------------------------------|
| Button       | Soft sine press + bright triangle release       |
| Toggle       | Ascending double-click (on) / descending (off)  |
| Input        | Descending sine "ting" on focus                 |
| Textarea     | Same as Input                                   |
| Select       | Airy pop on open, crisp tick on select          |
| Slider       | Pitched scrub — frequency maps to value         |
| ColorPicker  | Soft pluck, pitch varies per tone               |
| DatePicker   | Whoosh on month nav, ting on date select        |

---

## Storybook

Browse all components interactively:

```bash
pnpm run storybook
```

Opens at [http://localhost:6006](http://localhost:6006).

---

## Build

```bash
pnpm run build
```

Outputs to `dist/` — an ES module, CJS bundle, and `.d.ts` type declarations.

---

## License

MIT
