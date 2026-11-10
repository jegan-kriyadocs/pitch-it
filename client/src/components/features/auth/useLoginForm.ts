import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import type { LoginErrors } from '@/types/auth'
import { SIGN_IN_DELAY_MS } from './authData'
import { findPersonaByEmail, getWorkspaceRoute, validateLogin } from './authRules'

export function useLoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function changeEmail(nextEmail: string) {
    setEmail(nextEmail)
    setErrors((current) => ({ ...current, email: undefined }))
  }

  function changePassword(nextPassword: string) {
    setPassword(nextPassword)
    setErrors((current) => ({ ...current, password: undefined }))
  }

  function selectPersonaEmail(personaEmail: string) {
    changeEmail(personaEmail)
    passwordRef.current?.focus()
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateLogin({ email, password })
    setErrors(nextErrors)
    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }
    if (nextErrors.password) {
      passwordRef.current?.focus()
      return
    }
    setIsSubmitting(true)
    timeoutRef.current = window.setTimeout(() => {
      navigate(getWorkspaceRoute(email), { replace: true })
    }, SIGN_IN_DELAY_MS)
  }

  return {
    email,
    password,
    isRememberMeChecked,
    errors,
    isSubmitting,
    selectedRole: findPersonaByEmail(email)?.role ?? null,
    emailRef,
    passwordRef,
    changeEmail,
    changePassword,
    setIsRememberMeChecked,
    selectPersonaEmail,
    submit,
  }
}

export type LoginFormState = ReturnType<typeof useLoginForm>
