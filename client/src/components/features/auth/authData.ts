import type { DemoPersona } from '@/types/auth'

export const DEFAULT_WORKSPACE_ROUTE = '/author-studio'
export const SIGN_IN_DELAY_MS = 700

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    role: 'author',
    roleLabel: 'Author',
    email: 'elena.rostova@example.edu',
    workspaceRoute: '/author-studio',
  },
  {
    role: 'editor',
    roleLabel: 'Editor',
    email: 'julian.vance@example.org',
    workspaceRoute: '/editor-triage',
  },
  {
    role: 'reviewer',
    roleLabel: 'Reviewer',
    email: 'reviewer2@example.edu',
    workspaceRoute: '/reviewer-feedback',
  },
]

export const HERO_HIGHLIGHTS = [
  { id: 'triage', title: '2-Minute Video Triage', description: 'Cut desk screening from hours to minutes.' },
  {
    id: 'anonymization',
    title: 'Double-Blind Anonymization',
    description: 'AI voice modulation and visual face silhouette.',
  },
  {
    id: 'cloud',
    title: 'Cadmore Video Cloud',
    description: 'Automated closed-captioning, HLS streaming, and Crossref Video DOIs.',
  },
] as const
