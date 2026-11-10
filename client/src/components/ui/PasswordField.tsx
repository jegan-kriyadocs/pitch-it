import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { TextField, type TextFieldProps } from '@/ui/TextField'

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'endSlot'>

export function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <TextField
      {...props}
      type={isVisible ? 'text' : 'password'}
      endSlot={
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          aria-label="Show password"
          aria-pressed={isVisible}
          title={isVisible ? 'Hide password' : 'Show password'}
          className="flex size-9 cursor-pointer items-center justify-center rounded-sm text-muted hover:bg-gray-100 hover:text-heading focus-visible:outline-2 focus-visible:outline-brand-600"
        >
          {isVisible ? <EyeOff size={17} aria-hidden /> : <Eye size={17} aria-hidden />}
        </button>
      }
    />
  )
}
