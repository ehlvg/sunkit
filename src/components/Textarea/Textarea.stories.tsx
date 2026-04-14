import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Textarea } from './Textarea'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: COLORS.map(c => c.id) },
    variant: { control: 'select', options: ['default', 'filled', 'ghost'] },
    autoResize: { control: 'boolean' },
    showCount: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    tone: 'neutral',
    variant: 'default',
    rows: 4,
    label: 'Message',
    placeholder: 'Write something…',
    description: 'Be as detailed as you like.',
    autoResize: false,
    showCount: false,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {}

export const Variants: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 400 }}>
      <Textarea {...args} variant="default" label="Default — elevated" description={undefined} />
      <Textarea {...args} variant="filled" label="Filled — recessed" description={undefined} />
      <Textarea {...args} variant="ghost" label="Ghost — underline" description={undefined} />
    </div>
  ),
  args: { tone: 'sky', description: undefined },
}

export const AutoResize: Story = {
  args: {
    autoResize: true,
    rows: 2,
    label: 'Auto-resize',
    tone: 'lavender',
    description: 'Expands as you type.',
  },
}

export const WithCharCount: Story = {
  render: args => {
    const [val, setVal] = useState('')
    return (
      <Textarea
        {...args}
        value={val}
        onChange={e => setVal(e.target.value)}
        label="Bio"
        maxLength={200}
        showCount
        tone="peach"
        description={undefined}
      />
    )
  },
}

export const WithError: Story = {
  args: {
    tone: 'rose',
    label: 'Feedback',
    error: 'This field is required.',
    description: undefined,
    rows: 3,
  },
}
