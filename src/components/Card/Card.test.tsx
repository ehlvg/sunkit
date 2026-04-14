import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders as div by default', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByTestId('card').tagName).toBe('DIV')
  })

  it('renders as custom element via as prop', () => {
    render(
      <Card as="section" data-testid="card">
        Content
      </Card>,
    )
    expect(screen.getByTestId('card').tagName).toBe('SECTION')
  })

  it('applies custom className', () => {
    render(<Card className="my-card">Content</Card>)
    expect(screen.getByText('Content').closest('.my-card')).toBeInTheDocument()
  })

  it('renders Card.Header', () => {
    render(
      <Card>
        <Card.Header>Header</Card.Header>
      </Card>,
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('renders Card.Body', () => {
    render(
      <Card>
        <Card.Body>Body</Card.Body>
      </Card>,
    )
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('renders Card.Footer', () => {
    render(
      <Card>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    )
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
