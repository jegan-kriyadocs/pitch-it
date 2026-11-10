import { CircleCheck, Sparkles } from 'lucide-react'

import { useScriptAssist } from '@/hooks/useScriptAssist'
import type { TemplateId } from '@/types/authorStudio'
import { Button } from '@/ui/Button'
import { SelectField } from '@/ui/SelectField'
import { TEMPLATE_OPTIONS } from './authorStudioData'
import { useAuthorStudioStore } from './authorStudioStore'

interface TemplateSelectorProps {
  isLocked: boolean
}

export function TemplateSelector({ isLocked }: TemplateSelectorProps) {
  const templateId = useAuthorStudioStore((state) => state.templateId)
  const isScriptGenerated = useAuthorStudioStore((state) => state.isScriptGenerated)
  const setTemplate = useAuthorStudioStore((state) => state.setTemplate)
  const markScriptGenerated = useAuthorStudioStore((state) => state.markScriptGenerated)
  const { isGenerating, generateScript } = useScriptAssist(markScriptGenerated)

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <SelectField
        label="Template"
        options={TEMPLATE_OPTIONS}
        value={templateId}
        disabled={isLocked || isGenerating}
        onChange={(event) => setTemplate(event.target.value as TemplateId)}
        className="sm:flex-1"
      />
      {/* <Button
        variant={isScriptGenerated ? 'secondary' : 'primary'}
        onClick={generateScript}
        isLoading={isGenerating}
        disabled={isLocked || isScriptGenerated}
        className="h-[38px]"
      >
        {isScriptGenerated ? (
          <CircleCheck aria-hidden />
        ) : (
          !isGenerating && <Sparkles aria-hidden />
        )}
        {isGenerating
          ? 'Generating script…'
          : isScriptGenerated
            ? 'Script ready'
            : 'Generate pitch script with AI'}
      </Button> */}
    </div>
  )
}
