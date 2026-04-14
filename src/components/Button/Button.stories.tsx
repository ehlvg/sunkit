import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: COLORS.map(c => c.id),
      description: 'Pastel color variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'icon-only'],
      description: 'Button size',
    },
    icon: {
      control: 'select',
      options: ['none', 'left', 'right', 'only'],
      description: 'Icon position',
    },
    radius: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Border radius in px',
    },
    children: {
      control: 'text',
      description: 'Button label',
    },
  },
  args: {
    color: 'lavender',
    size: 'default',
    icon: 'none',
    radius: 10,
    children: 'Button',
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const AllColors: Story = {
  name: 'All Colors',
  render: args => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end' }}>
      {COLORS.map(c => (
        <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Button {...args} color={c.id}>{c.label}</Button>
          <span style={{ fontSize: 11, color: '#aaa' }}>{c.label}</span>
        </div>
      ))}
    </div>
  ),
  args: { icon: 'none', size: 'default' },
}

export const AllSizes: Story = {
  name: 'All Sizes',
  render: args => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
      {([
        { size: 'default', icon: 'none',   label: 'Default'    },
        { size: 'sm',      icon: 'none',   label: 'Small'      },
        { size: 'default', icon: 'left',   label: 'Icon left'  },
        { size: 'default', icon: 'right',  label: 'Icon right' },
        { size: 'icon-only', icon: 'only', label: 'Icon only'  },
        { size: 'sm',      icon: 'only',   label: 'Icon sm'    },
      ] as const).map(v => (
        <div key={v.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Button {...args} size={v.size} icon={v.icon}>Button</Button>
          <span style={{ fontSize: 11, color: '#aaa' }}>{v.label}</span>
        </div>
      ))}
    </div>
  ),
  args: { color: 'lavender' },
}

export const WithIcons: Story = {
  name: 'With Icons',
  render: args => (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} icon="none">No icon</Button>
      <Button
        {...args}
        icon="left"
        iconLeft={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20" />
            <path d="M2 12h20" />
          </svg>
        }
      >
        Custom left
      </Button>
      <Button
        {...args}
        icon="right"
        iconRight={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        }
      >
        Custom right
      </Button>
    </div>
  ),
  args: { color: 'sky', size: 'default' },
}

export const IconOnly: Story = {
  name: 'Icon Only',
  render: args => (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      {COLORS.map(c => (
        <Button
          key={c.id}
          {...args}
          color={c.id}
          size="icon-only"
          icon="only"
          aria-label={`${c.label} icon button`}
          iconOnly={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 17l-5 3 1.5-5.7L4 9.8l5.8-.4L12 4l2.2 5.4 5.8.4-4.5 4.5L17 20z" />
            </svg>
          }
        />
      ))}
      <div style={{ width: '100%', marginTop: 8, display: 'flex', gap: 14 }}>
        {COLORS.map(c => (
          <Button
            key={c.id}
            {...args}
            color={c.id}
            size="sm"
            icon="only"
            aria-label={`${c.label} small icon button`}
            iconOnly={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17l-5 3 1.5-5.7L4 9.8l5.8-.4L12 4l2.2 5.4 5.8.4-4.5 4.5L17 20z" />
              </svg>
            }
          />
        ))}
      </div>
    </div>
  ),
  args: { radius: 10 },
}

export const SmallVariant: Story = {
  name: 'Small',
  args: {
    size: 'sm',
    color: 'mint',
    children: 'Small Button',
  },
}
