import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DatePicker, type DateRange } from './DatePicker'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof DatePicker> = {
  title: 'Atoms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: COLORS.map(c => c.id) },
    size: { control: 'select', options: ['default', 'sm'] },
    mode: { control: 'select', options: ['single', 'range'] },
    disabled: { control: 'boolean' },
  },
  args: {
    tone: 'lavender',
    size: 'default',
    mode: 'single',
    label: 'Date of birth',
    placeholder: 'Pick a date…',
    description: 'We use this to personalise your experience.',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {}

export const WithMinMax: Story = {
  args: {
    label: 'Appointment date',
    description: 'Must be in the next 30 days.',
    tone: 'mint',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
}

export const AllTones: Story = {
  render: args => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 580 }}>
      {COLORS.map(c => (
        <DatePicker key={c.id} {...args} tone={c.id} label={c.label} description={undefined} />
      ))}
    </div>
  ),
  args: { size: 'sm', description: undefined },
}

export const Controlled: Story = {
  render: args => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <div style={{ display: 'grid', gap: 10, maxWidth: 320 }}>
        <DatePicker {...args} value={date} onChange={setDate} description={undefined} />
        <div style={{ fontSize: 12, color: '#666' }}>
          Selected: {date ? date.toLocaleDateString() : '(none)'}
        </div>
      </div>
    )
  },
  args: { tone: 'sky', label: 'Controlled' },
}

export const DateRangePicker: Story = {
  render: args => {
    const [range, setRange] = useState<DateRange>([null, null])
    return (
      <div style={{ display: 'grid', gap: 10, maxWidth: 580 }}>
        <DatePicker
          {...args}
          mode="range"
          rangeValue={range}
          onRangeChange={setRange}
          label="Stay dates"
          placeholder="Pick a range…"
          description="Select check-in and check-out dates."
          tone="sky"
        />
        <div style={{ fontSize: 12, color: '#666' }}>
          From: {range[0]?.toLocaleDateString() ?? '—'} &nbsp; To: {range[1]?.toLocaleDateString() ?? '—'}
        </div>
      </div>
    )
  },
}
