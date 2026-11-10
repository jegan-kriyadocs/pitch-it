import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { LoginPage } from '@/pages/LoginPage'
import { ToastViewport } from '@/ui/ToastViewport'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/editor-triage" element={<h1>Editor triage workspace</h1>} />
      </Routes>
      <ToastViewport />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('fills the email when a demo persona is chosen', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Editor' }))

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('julian.vance@example.org')
    expect(screen.getByRole('button', { name: 'Editor' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows inline errors and focuses the first invalid field', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Sign In to Workspace' }))

    const email = screen.getByRole('textbox', { name: 'Email' })
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription('Enter your email address.')
    expect(email).toHaveFocus()
  })

  it('toggles password visibility with an accessible pressed state', async () => {
    const user = userEvent.setup()
    renderLogin()
    const toggle = screen.getByRole('button', { name: 'Show password' })
    const password = screen.getByLabelText('Password')

    expect(password).toHaveAttribute('type', 'password')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(password).toHaveAttribute('type', 'text')
  })

  it('signs in to the selected persona workspace', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Editor' }))
    await user.type(screen.getByLabelText('Password'), 'demo-password')
    await user.click(screen.getByRole('button', { name: 'Sign In to Workspace' }))

    expect(await screen.findByRole('heading', { name: 'Editor triage workspace' }, { timeout: 2000 })).toBeInTheDocument()
  })

  it('sends a password reset link from the forgot password dialog', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Editor' }))
    await user.click(screen.getByRole('button', { name: 'Forgot password?' }))

    const dialog = screen.getByRole('dialog', { name: 'Reset your password' })
    const email = within(dialog).getByRole('textbox', { name: 'Email' })
    expect(email).toHaveValue('julian.vance@example.org')

    await user.clear(email)
    await user.click(within(dialog).getByRole('button', { name: 'Send reset link' }))
    expect(email).toHaveAccessibleDescription('Enter your email address.')

    await user.type(email, 'someone@example.edu')
    await user.click(within(dialog).getByRole('button', { name: 'Send reset link' }))

    expect(screen.queryByRole('dialog', { name: 'Reset your password' })).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Notifications' })).toHaveTextContent('Check someone@example.edu')
  })
})
