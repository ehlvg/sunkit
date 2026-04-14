import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Progress } from './Progress'

describe('Progress', () => {
  it('renders progressbar role', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow correctly', () => {
    render(<Progress value={75} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
  })

  it('clamps value to 0–100', () => {
    render(<Progress value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('renders indeterminate state when no value', () => {
    render(<Progress />)
    const bar = screen.getByRole('progressbar')
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).not.toHaveAttribute('aria-valuemin')
    expect(bar).not.toHaveAttribute('aria-valuemax')
  })

  it('renders label', () => {
    render(<Progress value={40} label="Loading..." />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows percentage when showValue is true', () => {
    render(<Progress value={60} showValue />)
    expect(screen.getByText('60%')).toBeInTheDocument()
  })
})
