import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ReviewerEvaluationStudioPage } from '@/pages/ReviewerEvaluationStudioPage'
import { ToastViewport } from '@/ui/ToastViewport'

const LONG_CRITIQUE =
  'Thank you for a clear and promising trial. The authors should report confidence intervals for every survival estimate and clarify how missing data were handled in the primary analysis.'

function renderPage() {
  return render(
    <>
      <ReviewerEvaluationStudioPage />
      <ToastViewport />
    </>,
  )
}

describe('ReviewerEvaluationStudioPage', () => {
  it('shows the blinded assignment context', () => {
    renderPage()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dual Checkpoint Inhibitors')
    expect(screen.getByText('Reviewer 2 — Biostatistician & Clinical Oncologist')).toBeInTheDocument()
    expect(screen.getByText(/Double-blind/)).toBeInTheDocument()
  })

  it('pins, edits and deletes timestamped notes', async () => {
    const user = userEvent.setup()
    renderPage()
    const notes = screen.getByRole('list', { name: 'Pinned notes' })
    expect(within(notes).getAllByRole('listitem')).toHaveLength(2)

    await user.type(screen.getByPlaceholderText(/Error bars/), 'Check the hypothesis wording')
    await user.click(screen.getByRole('button', { name: /Pin note @ 00:00/ }))
    expect(within(notes).getAllByRole('listitem')).toHaveLength(3)
    expect(within(notes).getByText('Check the hypothesis wording')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete note at 00:42' }))
    expect(within(notes).getAllByRole('listitem')).toHaveLength(2)
  })

  it('updates the weighted score when a criterion changes', () => {
    renderPage()
    expect(screen.getByText('3.0 / 5.0')).toBeInTheDocument()

    const sliders = screen.getAllByRole('slider', { name: /\(\d+%\)/ })
    sliders.forEach((slider) => fireEvent.change(slider, { target: { value: '5' } }))

    expect(screen.getByText('5.0 / 5.0')).toBeInTheDocument()
    expect(screen.getByText('Strong candidate')).toBeInTheDocument()
  })

  it('replaces harsh phrasing with a collegial suggestion', async () => {
    const user = userEvent.setup()
    renderPage()
    const editor = screen.getByRole('textbox', { name: 'Comments for authors' })

    await user.type(editor, 'The authors clearly fail to justify the comparator.')
    await user.click(screen.getByRole('button', { name: 'Analyze tone' }))
    await user.click(await screen.findByRole('button', { name: /Replace with/ }))

    expect(editor).toHaveValue('The authors should consider clarifying justify the comparator.')
  })

  it('submits the review package after confirming the summary', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('radio', { name: /Major revision/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Comments for authors' }), { target: { value: LONG_CRITIQUE } })
    await user.click(screen.getByRole('button', { name: 'Submit peer review package' }))

    const dialog = screen.getByRole('dialog', { name: 'Review your submission' })
    expect(within(dialog).getByText('Major revision')).toBeInTheDocument()
    expect(within(dialog).getByText(/Verified review credit/)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Submit peer review' }))

    expect(await screen.findByRole('dialog', { name: 'Review submitted' }, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Notifications' })).toHaveTextContent('Peer review submitted')
  })
})
