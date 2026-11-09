import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ToastViewport } from '@/ui/ToastViewport'
import { EditorTriageDashboardPage } from './EditorTriageDashboardPage'

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
    await user.click(screen.getByRole('button', { name: 'Send request' }))
    expect(screen.getByRole('alert')).toHaveTextContent('at least 15 characters')

    await user.type(screen.getByRole('textbox', { name: 'Question for the author' }), 'Please clarify the dosing schedule.')
    await user.click(screen.getByRole('button', { name: 'Send request' }))

    expect(screen.getByRole('heading', { level: 1 }).parentElement).toHaveTextContent('Re-pitch requested')
  })

  it('accepts for review with the chosen reviewer visibility and shows a toast', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Accept for review' }))
    await user.click(screen.getByRole('radio', { name: /Anonymized video only/ }))
    await user.click(screen.getByRole('button', { name: 'Accept and route' }))

    const notifications = screen.getByRole('list', { name: 'Notifications' })
    expect(notifications).toHaveTextContent('Accepted for peer review')
    expect(notifications).toHaveTextContent('Reviewers will see: Anonymized video only.')
    expect(screen.getByRole('button', { name: 'Invite Prof. Daniel Okafor' })).toBeEnabled()
  })
})
