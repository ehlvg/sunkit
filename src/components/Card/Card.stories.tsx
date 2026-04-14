import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Button } from '../Button/Button'
import { COLORS } from '../../tokens/colors'

const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: COLORS.map(c => c.id) },
    variant: { control: 'select', options: ['elevated', 'filled', 'outline'] },
    radius: { control: { type: 'range', min: 0, max: 32, step: 2 } },
  },
  args: {
    tone: 'neutral',
    variant: 'elevated',
    radius: 16,
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: args => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <Card.Header>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.75)' }}>Card title</h3>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Optional subtitle</p>
      </Card.Header>
      <Card.Body>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.6 }}>
          This is the body content. Cards are great for grouping related information in a clean container.
        </p>
      </Card.Body>
      <Card.Footer>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button size="sm" color="neutral">Cancel</Button>
          <Button size="sm" color="lavender">Confirm</Button>
        </div>
      </Card.Footer>
    </Card>
  ),
}

export const Variants: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 340 }}>
      {(['elevated', 'filled', 'outline'] as const).map(v => (
        <Card key={v} {...args} variant={v}>
          <Card.Body>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
              A card with the {v} variant
            </p>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
  args: { tone: 'lavender' },
}

export const AllTones: Story = {
  render: args => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, maxWidth: 560 }}>
      {COLORS.map(c => (
        <Card key={c.id} {...args} tone={c.id} variant="filled">
          <Card.Body>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>{c.label}</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
}

export const SimpleWithPadding: Story = {
  render: args => (
    <Card {...args} padding={24} style={{ maxWidth: 320 }}>
      <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.6 }}>
        A simple card with direct padding — no subcomponents needed.
      </p>
    </Card>
  ),
  args: { tone: 'sky', variant: 'elevated' },
}
