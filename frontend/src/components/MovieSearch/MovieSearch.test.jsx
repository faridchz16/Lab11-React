import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import MovieSearch from './MovieSearch.jsx'

describe('MovieSearch', () => {
  it('shows the value it receives', () => {
    render(<MovieSearch value="marte" onChange={() => {}} onClear={() => {}} />)
    expect(screen.getByRole('searchbox')).toHaveValue('marte')
  })

  it('reports every keystroke through onChange', async () => {
    const onChange = vi.fn()
    render(<MovieSearch value="" onChange={onChange} onClear={() => {}} />)
    await userEvent.type(screen.getByRole('searchbox'), 'abc')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('offers the clear button only when there is text', async () => {
    const onClear = vi.fn()
    const { rerender } = render(
      <MovieSearch value="" onChange={() => {}} onClear={onClear} />,
    )
    expect(screen.queryByRole('button', { name: 'Limpiar' })).not.toBeInTheDocument()

    rerender(<MovieSearch value="marte" onChange={() => {}} onClear={onClear} />)
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(onClear).toHaveBeenCalledOnce()
  })
})
