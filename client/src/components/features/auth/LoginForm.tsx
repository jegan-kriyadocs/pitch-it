import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/ui/Button'
import { CheckboxField } from '@/ui/CheckboxField'
import { PasswordField } from '@/ui/PasswordField'
import { TextField } from '@/ui/TextField'
import { ForgotPasswordDialog } from './ForgotPasswordDialog'
import type { LoginFormState } from './useLoginForm'

interface LoginFormProps {
  form: LoginFormState
}

export function LoginForm({ form }: LoginFormProps) {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  return (
    <>
      <form noValidate onSubmit={form.submit} className="flex flex-col gap-5">
        <TextField
          ref={form.emailRef}
          id="login-email"
          name="email"
          type="email"
          label="Email"
          placeholder="name@institution.edu"
          autoComplete="email"
          leadingIcon={Mail}
          value={form.email}
          onChange={(event) => form.changeEmail(event.target.value)}
          errorMessage={form.errors.email}
        />
        <PasswordField
          ref={form.passwordRef}
          id="login-password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          leadingIcon={Lock}
          value={form.password}
          onChange={(event) => form.changePassword(event.target.value)}
          errorMessage={form.errors.password}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CheckboxField
            label="Remember me on this workstation"
            isChecked={form.isRememberMeChecked}
            onChange={form.setIsRememberMeChecked}
            className="text-[13px]"
          />
          <Button variant="link" onClick={() => setIsForgotPasswordOpen(true)} className="text-[13px]">
            Forgot password?
          </Button>
        </div>
        <Button type="submit" size="lg" isLoading={form.isSubmitting}>
          {form.isSubmitting ? 'Signing in…' : 'Sign In to Workspace'}
        </Button>
      </form>
      {isForgotPasswordOpen && (
        <ForgotPasswordDialog initialEmail={form.email} onClose={() => setIsForgotPasswordOpen(false)} />
      )}
    </>
  )
}
