import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Input } from './Input'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: COLORS.map(c => c.id),
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    tone: 'neutral',
    variant: 'default',
    size: 'default',
    label: 'Email',
    placeholder: 'you@company.com',
    description: 'We’ll only use this for account recovery.',
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const Variants: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 360 }}>
      <Input
        {...args}
        variant="default"
        label="Default — elevated"
        placeholder="Glassy card, lifted shadow"
        description={undefined}
      />
      <Input
        {...args}
        variant="filled"
        label="Filled — recessed"
        placeholder="Sunken, no elevation"
        description={undefined}
      />
      <Input
        {...args}
        variant="ghost"
        label="Ghost — underline"
        placeholder="Minimal, borderless"
        description={undefined}
      />
    </div>
  ),
  args: { tone: 'lavender', description: undefined },
}

export const Types: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 14, maxWidth: 360 }}>
      <Input {...args} type="text" label="Text" placeholder="Text" description={undefined} />
      <Input {...args} type="email" label="Email" placeholder="you@company.com" description={undefined} />
      <Input {...args} type="password" label="Password" placeholder="••••••••" description={undefined} />
      <Input {...args} type="search" label="Search" placeholder="Search…" description={undefined} />
      <Input {...args} type="url" label="URL" placeholder="https://example.com" description={undefined} />
      <Input {...args} type="tel" label="Phone" placeholder="+1 (555) 555-5555" description={undefined} />
      <Input {...args} type="number" label="Number" placeholder="42" description={undefined} />
    </div>
  ),
  args: { tone: 'lavender' },
}

export const WithError: Story = {
  args: {
    tone: 'rose',
    label: 'Email',
    placeholder: 'you@company.com',
    error: 'Please enter a valid email.',
    description: undefined,
  },
}

export const WithAdornments: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 14, maxWidth: 360 }}>
      <Input
        {...args}
        label="Search"
        placeholder="Search…"
        leftAdornment={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        }
      />
      <Input
        {...args}
        label="Amount"
        placeholder="0.00"
        rightAdornment={<span style={{ fontSize: 12, fontWeight: 600 }}>USD</span>}
      />
    </div>
  ),
  args: { tone: 'sky' },
}

export const Controlled: Story = {
  render: args => {
    const [value, setValue] = useState('hello')
    return (
      <div style={{ display: 'grid', gap: 10, maxWidth: 360 }}>
        <Input {...args} label="Controlled" value={value} onChange={e => setValue(e.target.value)} />
        <div style={{ fontSize: 12, color: '#666' }}>Value: {value}</div>
      </div>
    )
  },
  args: { tone: 'mint', description: undefined },
}

