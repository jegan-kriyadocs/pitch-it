import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { EditorTriageDashboardPage } from '@/pages/EditorTriageDashboardPage'
import { ToastViewport } from '@/ui/ToastViewport'

function renderPage() {
  return render(
    <>
      <EditorTriageDashboardPage />
      <ToastViewport />
    </>,
  )
}

describe('EditorTriageDashboardPage', () => {
  it('shows the selected submission when one is clicked in the queue', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Adaptive Immunotherapy')

    await user.click(screen.getByRole('button', { name: /Polygenic Risk/ }))

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Polygenic Risk')
    expect(screen.getByText('Dr. Rohan Mehta')).toBeInTheDocument()
  })

  it('filters the queue by search', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByRole('searchbox', { name: 'Search submissions' }), 'cardiology')

    const queue = screen.getByRole('list', { name: 'Submissions' })
    expect(within(queue).getAllByRole('button')).toHaveLength(1)
  })

  it('jumps the slides when a transcript line is clicked', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /Overall survival improved by 4.1 months/ }))

    expect(screen.getByText('Slide 3 of 4')).toBeInTheDocument()
  })

  it('requires a question before requesting a re-pitch', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Request re-pitch' }))

    const dialog = screen.getByRole('dialog', { name: 'Request a re-pitch' })
    await user.click(within(dialog).getByRole('button', { name: 'Send request' }))

    expect(within(dialog).getByRole('alert')).toHaveTextContent('Write at least 15 characters')
  })

  it('accepts for review and shows a toast with the assigned editor', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Accept for review' }))

    const dialog = screen.getByRole('dialog', { name: 'Accept for peer review' })
    await user.click(within(dialog).getByRole('button', { name: 'Accept and route' }))

    expect(screen.getByText('Accepted for peer review')).toBeInTheDocument()
  })
})
