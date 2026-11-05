import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button.jsx'

describe('Button', () => {
  it('renders its children with the default variant and size', () => {
    render(<Button>Comprar</Button>)
    const button = screen.getByRole('button', { name: 'Comprar' })
    expect(button).toHaveClass('button--primary', 'button--md')
  })

  it('changes its appearance through props alone', () => {
    render(
      <Button variant="ghost" size="sm">
        Limpiar
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Limpiar' })
    expect(button).toHaveClass('button--ghost', 'button--sm')
  })

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Limpiar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('renders a link when it receives href', () => {
    render(<Button href="#cartelera">Ver cartelera</Button>)
    const link = screen.getByRole('link', { name: 'Ver cartelera' })
    expect(link).toHaveAttribute('href', '#cartelera')
  })

  it('forwards onClick and aria attributes to the element', async () => {
    const onClick = vi.fn()
    render(
      <Button aria-label="Añadir a favoritas" onClick={onClick}>
        ♡
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Añadir a favoritas' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
