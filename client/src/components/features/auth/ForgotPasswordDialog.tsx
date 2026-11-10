import { Mail, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { showToast } from '@/lib/toastStore'
import { Button } from '@/ui/Button'
import { Dialog } from '@/ui/Dialog'
import { TextField } from '@/ui/TextField'
import { validateEmail } from './authRules'

const FORM_ID = 'forgot-password-form'

interface ForgotPasswordDialogProps {
  initialEmail: string
  onClose: () => void
}

export function ForgotPasswordDialog({ initialEmail, onClose }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState(initialEmail)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function sendResetLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextError = validateEmail(email)
    setErrorMessage(nextError)
    if (nextError) {
      return
    }
    showToast({
      variant: 'success',
      title: 'Reset link sent',
      description: `Check ${email.trim()} for a link to reset your password.`,
    })
    onClose()
  }

  return (
    <Dialog
      title="Reset your password"
      description="Enter your email and we’ll send you a link to reset your password."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            <Send aria-hidden />
            Send reset link
          </Button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={sendResetLink}>
        <TextField
          id="reset-email"
          type="email"
          label="Email"
          placeholder="name@institution.edu"
          autoComplete="email"
          leadingIcon={Mail}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setErrorMessage(null)
          }}
          errorMessage={errorMessage}
          data-autofocus
        />
      </form>
    </Dialog>
  )
}
