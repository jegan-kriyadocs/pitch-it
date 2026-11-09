import { Bold, Heading3, Italic, List, Quote, type LucideIcon } from 'lucide-react'

import { Button } from '@/ui/Button'
import type { MarkdownSyntax } from './reviewerFeedbackRules'

const TOOLBAR_ACTIONS: { syntax: MarkdownSyntax; label: string; icon: LucideIcon }[] = [
  { syntax: 'bold', label: 'Bold', icon: Bold },
  { syntax: 'italic', label: 'Italic', icon: Italic },
  { syntax: 'heading', label: 'Heading', icon: Heading3 },
  { syntax: 'bullet', label: 'Bulleted list', icon: List },
  { syntax: 'quote', label: 'Quote', icon: Quote },
]

interface MarkdownToolbarProps {
  isDisabled: boolean
  onFormat: (syntax: MarkdownSyntax) => void
}

export function MarkdownToolbar({ isDisabled, onFormat }: MarkdownToolbarProps) {
  return (
    <div role="group" aria-label="Formatting" className="flex flex-wrap gap-1 rounded-base border border-border bg-gray-50 p-1">
      {TOOLBAR_ACTIONS.map(({ syntax, label, icon: Icon }) => (
        <Button key={syntax} variant="ghost" size="sm" aria-label={label} disabled={isDisabled} onClick={() => onFormat(syntax)}>
          <Icon aria-hidden />
        </Button>
      ))}
    </div>
  )
}
