import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { AnonymizationToggleCard } from './AnonymizationToggleCard'
import { useAuthorStudioStore } from './authorStudioStore'

describe('AnonymizationToggleCard', () => {
  it('starts with both shields on and no warning', () => {
    render(<AnonymizationToggleCard />)

    expect(screen.getByRole('switch', { name: 'Face silhouette mask' })).toBeChecked()
    expect(screen.getByRole('switch', { name: 'Voice disguise' })).toBeChecked()
    expect(screen.queryByText(/may reveal your identity/)).not.toBeInTheDocument()
  })

  it('warns when a shield is turned off for a double-blind journal', async () => {
    const user = userEvent.setup()
    render(<AnonymizationToggleCard />)

    await user.click(screen.getByRole('switch', { name: 'Voice disguise' }))

    expect(screen.getByRole('switch', { name: 'Voice disguise' })).not.toBeChecked()
    expect(screen.getByText(/may reveal your identity/)).toBeInTheDocument()
  })

  it('locks the switches while recording', () => {
    useAuthorStudioStore.getState().setRecordingState('recording')
    render(<AnonymizationToggleCard />)

    expect(screen.getByRole('switch', { name: 'Face silhouette mask' })).toBeDisabled()
  })
})
