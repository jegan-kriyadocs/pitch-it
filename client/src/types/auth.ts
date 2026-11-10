export type PersonaRole = 'author' | 'editor' | 'reviewer'

export interface DemoPersona {
  role: PersonaRole
  roleLabel: string
  email: string
  workspaceRoute: string
}

export interface LoginValues {
  email: string
  password: string
}

export interface LoginErrors {
  email?: string
  password?: string
}
