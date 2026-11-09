import { AudioLines } from 'lucide-react'

import { AnonymizedMediaPlayer } from '@/ui/AnonymizedMediaPlayer'
import { SectionCard } from '@/ui/SectionCard'
import { ToggleSwitch } from '@/ui/ToggleSwitch'
import { WaveformCanvas } from '@/ui/WaveformCanvas'
import { useReviewerFeedbackStore } from './reviewerFeedbackStore'

export function VoiceDisguisePreviewCard() {
  const feedbackMedia = useReviewerFeedbackStore((state) => state.feedbackMedia)
  const feedbackMode = useReviewerFeedbackStore((state) => state.feedbackMode)
  const isVoiceDisguised = useReviewerFeedbackStore((state) => state.isVoiceDisguised)
  const isFaceMasked = useReviewerFeedbackStore((state) => state.isFaceMasked)
  const setVoiceDisguised = useReviewerFeedbackStore((state) => state.setVoiceDisguised)
  const setFaceMasked = useReviewerFeedbackStore((state) => state.setFaceMasked)
  const isVideo = (feedbackMedia?.mode ?? feedbackMode) === 'video_audio'

  return (
    <SectionCard
      title="Protect your identity"
      icon={AudioLines}
      description="Cadmore applies these shields before the author sees your feedback."
    >
      <ToggleSwitch
        label="Voice disguise"
        description="Filters your voice so the author can't recognise it."
        isChecked={isVoiceDisguised}
        onChange={setVoiceDisguised}
      />
      {isVideo && (
        <ToggleSwitch
          label="Hide my face"
          description="Pixelates the frame and covers your face with a silhouette."
          isChecked={isFaceMasked}
          onChange={setFaceMasked}
        />
      )}
      {feedbackMedia ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-heading">Test anonymized voice</h3>
          <AnonymizedMediaPlayer
            key={feedbackMedia.url}
            url={feedbackMedia.url}
            durationSeconds={feedbackMedia.durationSeconds}
            kind={feedbackMedia.mode === 'video_audio' ? 'video' : 'audio'}
            isMaskEnabled={isFaceMasked}
            isVoiceDisguised={isVoiceDisguised}
            label="Your feedback as the author will see it"
            showWaveform
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <WaveformCanvas analyser={null} label="Waveform preview, no recording yet" />
          <p className="text-[13px] text-muted">Record your feedback to hear how the disguised voice sounds.</p>
        </div>
      )}
    </SectionCard>
  )
}
