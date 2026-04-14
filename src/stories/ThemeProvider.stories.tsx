import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ThemeProvider } from '../components/Theme'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Toggle } from '../components/Toggle'
import { Slider } from '../components/Slider'
import { Select } from '../components/Select'
import { Progress } from '../components/Progress'
import { DatePicker } from '../components/DatePicker'
import { Card } from '../components/Card'
import { Alert } from '../components/Alert'
import { ColorPicker } from '../components/ColorPicker'
import type { ButtonColor } from '../components/Button'

const CATEGORY_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'eng', label: 'Engineering' },
  { value: 'ops', label: 'Operations' },
]

function KitchenSink({ accentColor }: { accentColor?: string }) {
  const [toggle, setToggle] = useState(true)
  const [slider, setSlider] = useState(60)
  const [select, setSelect] = useState('')
  const [date, setDate] = useState<Date | null>(null)
  const [color, setColor] = useState<ButtonColor>('lavender')

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 380 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button accentColor={accentColor} size="default">
          Primary
        </Button>
        <Button accentColor={accentColor} size="sm">
          Small
        </Button>
        <Button accentColor={accentColor} size="sm" disabled>
          Disabled
        </Button>
      </div>

      <Input label="Project name" placeholder="Enter name…" accentColor={accentColor} />

      <Select
        label="Category"
        options={CATEGORY_OPTIONS}
        value={select}
        onChange={setSelect}
        placeholder="Select category…"
        accentColor={accentColor}
      />

      <Toggle
        label="Notifications"
        description="Receive email updates"
        checked={toggle}
        onCheckedChange={setToggle}
        accentColor={accentColor}
      />

      <Slider
        label="Priority"
        showValue
        showMinMax
        value={slider}
        onValueChange={setSlider}
        accentColor={accentColor}
      />

      <Progress value={slider} label="Progress" showValue accentColor={accentColor} />

      <DatePicker
        label="Deadline"
        placeholder="Pick a date…"
        value={date}
        onChange={setDate}
        accentColor={accentColor}
      />

      <Card accentColor={accentColor} padding={16}>
        <Card.Body>
          <p style={{ margin: 0, fontSize: 13 }}>This is a card with accent color applied.</p>
        </Card.Body>
      </Card>

      <Alert variant="info" title="Heads up">
        Dark mode and accent colors work throughout the system.
      </Alert>

      <ColorPicker value={color} onChange={setColor} label="Accent preview" />
    </div>
  )
}

const meta: Meta = {
  title: 'Theme/ThemeProvider',
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

export const LightMode: Story = {
  render: () => (
    <ThemeProvider dark={false} style={{ padding: 24, background: '#f7f6f3', borderRadius: 16 }}>
      <KitchenSink />
    </ThemeProvider>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <ThemeProvider dark={true} style={{ padding: 24, background: '#18181c', borderRadius: 16 }}>
      <KitchenSink />
    </ThemeProvider>
  ),
}

export const CustomAccentLight: Story = {
  render: () => (
    <ThemeProvider
      accentColor="#6366f1"
      style={{ padding: 24, background: '#f7f6f3', borderRadius: 16 }}
    >
      <KitchenSink accentColor="#6366f1" />
    </ThemeProvider>
  ),
}

export const CustomAccentDark: Story = {
  render: () => (
    <ThemeProvider
      accentColor="#6366f1"
      dark={true}
      style={{ padding: 24, background: '#18181c', borderRadius: 16 }}
    >
      <KitchenSink accentColor="#6366f1" />
    </ThemeProvider>
  ),
}

export const AccentPicker: Story = {
  render: () => {
    const [accent, setAccent] = useState('#f59e0b')
    const [dark, setDark] = useState(false)

    return (
      <div style={{ display: 'grid', gap: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: 13, fontWeight: 500 }}>
            Accent color:&nbsp;
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              style={{ width: 40, height: 28, border: 'none', cursor: 'pointer' }}
            />
          </label>
          <label
            style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
            Dark mode
          </label>
          <code style={{ fontSize: 12, opacity: 0.6 }}>{accent}</code>
        </div>

        <ThemeProvider
          accentColor={accent}
          dark={dark}
          style={{
            padding: 24,
            background: dark ? '#18181c' : '#f7f6f3',
            borderRadius: 16,
          }}
        >
          <KitchenSink accentColor={accent} />
        </ThemeProvider>
      </div>
    )
  },
}
