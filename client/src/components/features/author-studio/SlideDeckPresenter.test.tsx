import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { SlideDeckPresenter } from './SlideDeckPresenter'

describe('SlideDeckPresenter', () => {
  it('moves between slides with the buttons', async () => {
    const user = userEvent.setup()
    render(<SlideDeckPresenter />)

    expect(screen.getByRole('heading', { name: 'The Clinical Gap & Unmet Need' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByRole('heading', { name: 'Novel Methodology & Regimen' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Slide 2 of 4')
  })

  it('moves between slides with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<SlideDeckPresenter />)

    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(screen.getByRole('status')).toHaveTextContent('Slide 3 of 4')

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('status')).toHaveTextContent('Slide 2 of 4')
  })
})
