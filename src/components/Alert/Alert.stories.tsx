import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Atoms/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    dismissable: { control: 'boolean' },
    title: { control: 'text' },
  },
  args: {
    variant: 'info',
    title: 'Heads up',
    children: 'Your account will be reviewed within 24 hours.',
    dismissable: false,
  },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <Alert variant="info" title="Information" dismissable>
        Your session will expire in 10 minutes.
      </Alert>
      <Alert variant="success" title="Success" dismissable>
        Your changes have been saved.
      </Alert>
      <Alert variant="warning" title="Warning" dismissable>
        You are running low on storage space.
      </Alert>
      <Alert variant="error" title="Error" dismissable>
        Unable to connect to the server. Please try again.
      </Alert>
    </div>
  ),
}

export const WithoutTitle: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <Alert variant="info">This is an informational message without a title.</Alert>
      <Alert variant="success">Changes saved successfully.</Alert>
      <Alert variant="warning">Low disk space warning.</Alert>
      <Alert variant="error">An error occurred during processing.</Alert>
    </div>
  ),
}

export const Dismissable: Story = {
  render: () => {
    const variants = ['info', 'success', 'warning', 'error'] as const
    const [dismissed, setDismissed] = useState<string[]>([])
    const remaining = variants.filter((v) => !dismissed.includes(v))
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
        {remaining.map((v) => (
          <Alert
            key={v}
            variant={v}
            title={v.charAt(0).toUpperCase() + v.slice(1)}
            dismissable
            onDismiss={() => setDismissed((d) => [...d, v])}
          >
            Click × to dismiss this alert.
          </Alert>
        ))}
        {remaining.length === 0 && (
          <div style={{ fontSize: 13, color: '#999' }}>All alerts dismissed.</div>
        )}
      </div>
    )
  },
}
