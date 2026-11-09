import { ShieldCheck } from 'lucide-react'

import { Alert } from '@/ui/Alert'
import { Card } from '@/ui/Card'
import { ToggleSwitch } from '@/ui/ToggleSwitch'
import { MANUSCRIPT_SESSION } from './authorStudioData'
import { isStudioLocked } from './authorStudioRules'
import { useAuthorStudioStore } from './authorStudioStore'

export function AnonymizationToggleCard() {
  const anonymization = useAuthorStudioStore((state) => state.anonymization)
  const recordingState = useAuthorStudioStore((state) => state.recordingState)
  const setVisualMaskEnabled = useAuthorStudioStore((state) => state.setVisualMaskEnabled)
  const setVoiceModulationEnabled = useAuthorStudioStore((state) => state.setVoiceModulationEnabled)
  const isLocked = isStudioLocked(recordingState)
  const isPolicyBroken =
    anonymization.journalPolicyEnforced &&
    (!anonymization.visualMaskEnabled || !anonymization.voiceModulationEnabled)

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} aria-hidden className="text-brand-600" />
        <h2 className="text-base font-semibold text-heading">Anonymization for reviewers</h2>
      </div>
      <ToggleSwitch
        label="Face silhouette mask"
        description="Pixelates the frame and covers your face with a silhouette."
        isChecked={anonymization.visualMaskEnabled}
        isDisabled={isLocked}
        onChange={setVisualMaskEnabled}
      />
      <ToggleSwitch
        label="Voice disguise"
        description="Filters your voice so reviewers can't recognise it."
        isChecked={anonymization.voiceModulationEnabled}
        isDisabled={isLocked}
        onChange={setVoiceModulationEnabled}
      />
      {isPolicyBroken && (
        <Alert variant="warning">
          {MANUSCRIPT_SESSION.journalName} uses double-blind review. Turning a shield off may reveal
          your identity to reviewers.
        </Alert>
      )}
    </Card>
  )
}
