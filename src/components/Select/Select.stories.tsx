import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Select } from './Select'
import { COLORS } from '../../tokens/colors'

const FRUITS = [
  { value: 'apple',  label: 'Apple'  },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape',  label: 'Grape'  },
  { value: 'lemon',  label: 'Lemon', disabled: true },
  { value: 'mango',  label: 'Mango'  },
  { value: 'orange', label: 'Orange' },
  { value: 'peach',  label: 'Peach'  },
]

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: COLORS.map(c => c.id) },
    variant: { control: 'select', options: ['default', 'filled', 'ghost'] },
    size: { control: 'select', options: ['default', 'sm'] },
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    tone: 'neutral',
    variant: 'default',
    size: 'default',
    label: 'Favourite fruit',
    placeholder: 'Pick one…',
    description: 'We promise not to judge.',
    options: FRUITS,
    searchable: false,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {}

export const Searchable: Story = {
  args: { searchable: true, label: 'Search fruits', description: undefined },
}

export const Variants: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 320 }}>
      <Select {...args} variant="default" label="Default — elevated" description={undefined} />
      <Select {...args} variant="filled" label="Filled — recessed" description={undefined} />
      <Select {...args} variant="ghost" label="Ghost — underline" description={undefined} />
    </div>
  ),
  args: { tone: 'lavender', description: undefined },
}

export const AllTones: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
      {COLORS.map(c => (
        <Select key={c.id} {...args} tone={c.id} label={c.label} description={undefined} />
      ))}
    </div>
  ),
  args: { size: 'sm', description: undefined },
}

export const WithError: Story = {
  args: {
    tone: 'rose',
    label: 'Country',
    placeholder: 'Select country…',
    error: 'Please select a country.',
    description: undefined,
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
    ],
  },
}

export const Controlled: Story = {
  render: args => {
    const [value, setValue] = useState('')
    return (
      <div style={{ display: 'grid', gap: 10, maxWidth: 320 }}>
        <Select {...args} value={value} onChange={setValue} label="Controlled" description={undefined} />
        <div style={{ fontSize: 12, color: '#666' }}>Value: {value || '(none)'}</div>
      </div>
    )
  },
  args: { tone: 'mint', description: undefined },
}
