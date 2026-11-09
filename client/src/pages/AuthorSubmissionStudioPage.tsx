import { AnonymizationToggleCard } from '@/features/author-studio/AnonymizationToggleCard'
import { CadmoreUploadProgress } from '@/features/author-studio/CadmoreUploadProgress'
import { DualPreviewModal } from '@/features/author-studio/DualPreviewModal'
import { HeaderContextBar } from '@/features/author-studio/HeaderContextBar'
import { RecoveryBanner } from '@/features/author-studio/RecoveryBanner'
import { SlideDeckPresenter } from '@/features/author-studio/SlideDeckPresenter'
import { StudioFooterActions } from '@/features/author-studio/StudioFooterActions'
import { StudioModeSwitcher } from '@/features/author-studio/StudioModeSwitcher'
import { TemplateSelector } from '@/features/author-studio/TemplateSelector'
import { VideoStudioRecorder } from '@/features/author-studio/VideoStudioRecorder'
import { VideoUploadDropzone } from '@/features/author-studio/VideoUploadDropzone'
import { MANUSCRIPT_SESSION } from '@/features/author-studio/authorStudioData'
import { isStudioBusy, isStudioLocked } from '@/features/author-studio/authorStudioRules'
import { useAuthorStudioStore } from '@/features/author-studio/authorStudioStore'
import { useStudioPageActions } from '@/features/author-studio/useStudioPageActions'
import { ConfirmDialog } from '@/ui/ConfirmDialog'

export function AuthorSubmissionStudioPage() {
  const mode = useAuthorStudioStore((state) => state.mode)
  const recordingState = useAuthorStudioStore((state) => state.recordingState)
  const pitchVideo = useAuthorStudioStore((state) => state.pitchVideo)
  const anonymization = useAuthorStudioStore((state) => state.anonymization)
  const actions = useStudioPageActions()
  const { recovered } = actions.recovery

  return (
    <div className="flex flex-col gap-5">
      <HeaderContextBar session={MANUSCRIPT_SESSION} />

      {recovered && !pitchVideo && (
        <RecoveryBanner
          durationSeconds={recovered.durationSeconds}
          onRestore={actions.restoreRecording}
          onDiscard={actions.recovery.discard}
        />
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[11fr_9fr]">
        <section aria-label="Slide deck" className="flex flex-col gap-4">
          <TemplateSelector isLocked={isStudioLocked(recordingState)} />
          <SlideDeckPresenter />
        </section>
        <section aria-label="Recording studio" className="flex flex-col gap-4">
          <StudioModeSwitcher />
          {mode === 'live_record' ? <VideoStudioRecorder /> : <VideoUploadDropzone />}
          <AnonymizationToggleCard />
        </section>
      </div>

      <StudioFooterActions
        hasVideo={pitchVideo !== null}
        isLocked={isStudioBusy(recordingState)}
        isSubmitted={recordingState === 'success'}
        onReset={actions.openReset}
        onPreview={actions.openPreview}
        onSubmit={actions.submitToCadmore}
      />

      {actions.openDialog === 'preview' && pitchVideo && (
        <DualPreviewModal pitchVideo={pitchVideo} anonymization={anonymization} onClose={actions.closeDialog} />
      )}
      {actions.openDialog === 'submit' && (
        <CadmoreUploadProgress
          stage={actions.upload.stage}
          progress={actions.upload.progress}
          result={actions.upload.result}
          onClose={actions.closeDialog}
        />
      )}
      {actions.openDialog === 'reset' && (
        <ConfirmDialog
          title="Reset the studio?"
          description="This deletes your recording or uploaded video and resets every setting."
          confirmLabel="Reset all"
          cancelLabel="Cancel"
          onConfirm={actions.confirmReset}
          onCancel={actions.closeDialog}
        />
      )}
    </div>
  )
}
