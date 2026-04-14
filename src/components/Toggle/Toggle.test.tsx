import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders with label', () => {
    render(<Toggle label="Notifications" />)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(<Toggle label="Sound" description="Enable sound effects" />)
    expect(screen.getByText('Enable sound effects')).toBeInTheDocument()
  })

  it('has role switch', () => {
    render(<Toggle />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('toggles state when clicked (uncontrolled)', async () => {
    render(<Toggle />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onCheckedChange with new value', async () => {
    const handler = vi.fn()
    render(<Toggle onCheckedChange={handler} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('reflects controlled checked state', () => {
    render(<Toggle checked={true} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Toggle disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })
})
