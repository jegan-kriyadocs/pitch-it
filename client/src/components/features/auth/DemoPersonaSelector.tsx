import type { PersonaRole } from '@/types/auth'
import { SegmentedControl } from '@/ui/SegmentedControl'
import { DEMO_PERSONAS } from './authData'

const PERSONA_OPTIONS = DEMO_PERSONAS.map((persona) => ({ value: persona.role, label: persona.roleLabel }))

interface DemoPersonaSelectorProps {
  selectedRole: PersonaRole | null
  onSelectEmail: (email: string) => void
}

export function DemoPersonaSelector({ selectedRole, onSelectEmail }: DemoPersonaSelectorProps) {
  function selectRole(role: PersonaRole) {
    const persona = DEMO_PERSONAS.find((item) => item.role === role)
    if (persona) {
      onSelectEmail(persona.email)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-medium text-heading-secondary">Demo: sign in as</p>
      <SegmentedControl<PersonaRole>
        label="Demo: sign in as"
        options={PERSONA_OPTIONS}
        value={selectedRole}
        onChange={selectRole}
      />
      <p className="text-xs text-muted">Any password works in this demo.</p>
    </div>
  )
}
