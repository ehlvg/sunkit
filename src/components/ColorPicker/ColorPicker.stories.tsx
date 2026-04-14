import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ColorPicker } from './ColorPicker'
import type { ButtonColor } from '../../tokens/colors'

const meta: Meta<typeof ColorPicker> = {
  title: 'Atoms/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['default', 'sm'] },
    disabled: { control: 'boolean' },
  },
  args: {
    size: 'default',
    label: 'Theme colour',
    description: 'Personalise your workspace.',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof ColorPicker>

export const Default: Story = {
  args: { defaultValue: 'lavender' },
}

export const Small: Story = {
  args: { size: 'sm', defaultValue: 'mint', label: 'Accent', description: undefined },
}

export const Controlled: Story = {
  render: args => {
    const [color, setColor] = useState<ButtonColor>('sky')
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        <ColorPicker {...args} value={color} onChange={setColor} description={undefined} />
        <div style={{ fontSize: 12, color: '#666' }}>Selected: {color}</div>
      </div>
    )
  },
  args: { label: 'Controlled picker' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'peach', description: undefined },
}
