import type { LoginErrors, LoginValues } from '@/types/auth'
import { DEFAULT_WORKSPACE_ROUTE, DEMO_PERSONAS } from './authData'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string) {
  if (!email.trim()) {
    return 'Enter your email address.'
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Enter an email like name@institution.edu.'
  }
  return null
}

export function validateLogin({ email, password }: LoginValues): LoginErrors {
  const errors: LoginErrors = {}
  const emailError = validateEmail(email)
  if (emailError) {
    errors.email = emailError
  }
  if (!password) {
    errors.password = 'Enter your password.'
  }
  return errors
}

export function findPersonaByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  return DEMO_PERSONAS.find((persona) => persona.email === normalizedEmail) ?? null
}

export function getWorkspaceRoute(email: string) {
  return findPersonaByEmail(email)?.workspaceRoute ?? DEFAULT_WORKSPACE_ROUTE
}
