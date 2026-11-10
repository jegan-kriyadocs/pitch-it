import { describe, expect, it } from 'vitest'

import { getWorkspaceRoute, validateLogin } from '@/features/auth/authRules'

describe('authRules', () => {
  it('requires a valid email and a password', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'Enter your email address.',
      password: 'Enter your password.',
    })
    expect(validateLogin({ email: 'not-an-email', password: 'x' }).email).toMatch(/name@institution.edu/)
    expect(validateLogin({ email: 'a@b.edu', password: 'x' })).toEqual({})
  })

  it('routes demo personas to their workspace', () => {
    expect(getWorkspaceRoute('julian.vance@example.org')).toBe('/editor-triage')
    expect(getWorkspaceRoute(' Reviewer2@example.edu ')).toBe('/reviewer-feedback')
    expect(getWorkspaceRoute('someone@else.edu')).toBe('/author-studio')
  })
})
