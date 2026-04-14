import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Toggle } from './Toggle'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: COLORS.map(c => c.id),
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
    label: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    tone: 'neutral',
    size: 'default',
    label: 'Airplane mode',
    description: 'Turns off cellular and Wi‑Fi.',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {}

export const AllTones: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 14, maxWidth: 420 }}>
      {COLORS.map(c => (
        <Toggle
          key={c.id}
          {...args}
          tone={c.id}
          label={c.label}
          description={undefined}
        />
      ))}
    </div>
  ),
  args: { size: 'sm' },
}

export const Controlled: Story = {
  render: args => {
    const [checked, setChecked] = useState(true)
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Toggle {...args} checked={checked} onCheckedChange={setChecked} label="Controlled" description={undefined} />
        <div style={{ fontSize: 12, color: '#666' }}>Checked: {String(checked)}</div>
      </div>
    )
  },
  args: { tone: 'lavender', description: undefined },
}

