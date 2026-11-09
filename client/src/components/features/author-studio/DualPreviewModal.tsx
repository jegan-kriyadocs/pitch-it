import { CircleCheck, CircleX, EyeOff, UserRound } from 'lucide-react'
import { useState } from 'react'

import type { AnonymizationConfig, PitchVideo } from '@/types/authorStudio'
import { AnonymizedMediaPlayer } from '@/ui/AnonymizedMediaPlayer'
import { Button } from '@/ui/Button'
import { Dialog } from '@/ui/Dialog'
import { SegmentedControl } from '@/ui/SegmentedControl'

type PreviewTab = 'author' | 'reviewer'

const PREVIEW_TABS = [
  { value: 'author', label: 'Author view (raw)', icon: UserRound },
  { value: 'reviewer', label: 'Reviewer view (blinded)', icon: EyeOff },
] as const

interface DualPreviewModalProps {
  pitchVideo: PitchVideo
  anonymization: AnonymizationConfig
  onClose: () => void
}

function ShieldCheckItem({ label, isOn }: { label: string; isOn: boolean }) {
  const Icon = isOn ? CircleCheck : CircleX
  return (
    <li className={isOn ? 'flex items-center gap-2 text-green-700' : 'flex items-center gap-2 text-red-700'}>
      <Icon size={15} aria-hidden />
      {label}: {isOn ? 'on' : 'off'}
    </li>
  )
}

export function DualPreviewModal({ pitchVideo, anonymization, onClose }: DualPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('author')

  return (
    <Dialog
      title="Preview both versions"
      description="Check what you see and what double-blind reviewers will see."
      onClose={onClose}
      size="xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <SegmentedControl label="Preview version" options={PREVIEW_TABS} value={activeTab} onChange={setActiveTab} />
        {activeTab === 'author' ? (
          <div className="flex flex-col gap-2">
            <video
              src={pitchVideo.url}
              controls
              playsInline
              aria-label="Author view of your pitch"
              className="aspect-video w-full rounded-lg bg-gray-900"
            />
            <p className="text-[13px] text-body">Your original video and natural voice. Only the editor sees this.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnonymizedMediaPlayer
              url={pitchVideo.url}
              durationSeconds={pitchVideo.durationSeconds}
              kind="video"
              isMaskEnabled={anonymization.visualMaskEnabled}
              isVoiceDisguised={anonymization.voiceModulationEnabled}
              label="Reviewer view of your pitch"
            />
            <ul className="flex flex-col gap-1 text-[13px] sm:flex-row sm:gap-5">
              <ShieldCheckItem label="Face silhouette" isOn={anonymization.visualMaskEnabled} />
              <ShieldCheckItem label="Voice disguise" isOn={anonymization.voiceModulationEnabled} />
              <ShieldCheckItem label="File name and metadata removed" isOn />
            </ul>
          </div>
        )}
      </div>
    </Dialog>
  )
}
