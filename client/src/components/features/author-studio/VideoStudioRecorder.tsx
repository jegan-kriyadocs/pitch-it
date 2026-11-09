import { isMediaRecorderSupported } from '@/hooks/useMediaRecorder'
import { Alert } from '@/ui/Alert'
import { Card } from '@/ui/Card'
import { ConfirmDialog } from '@/ui/ConfirmDialog'
import { CameraViewfinder } from './CameraViewfinder'
import { DeviceSelectors } from './DeviceSelectors'
import { RecordedPitchPlayback } from './RecordedPitchPlayback'
import { RecordingControls } from './RecordingControls'
import { TeleprompterOverlay } from './TeleprompterOverlay'
import { MANUSCRIPT_SESSION, WARNING_THRESHOLD_SECONDS } from './authorStudioData'
import { useAuthorStudioStore } from './authorStudioStore'
import { useLiveStudioSession } from './useLiveStudioSession'

export function VideoStudioRecorder() {
  const isMaskEnabled = useAuthorStudioStore((state) => state.anonymization.visualMaskEnabled)
  const session = useLiveStudioSession()
  const { media, devices, recorder, countdown, recordedVideo, deviceSelection, actions } = session

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 p-4 sm:p-5">
        {!isMediaRecorderSupported() && (
          <Alert variant="error">This browser can't record video. Use Upload video instead.</Alert>
        )}
        {media.fallbackReason && (
          <Alert variant="info">
            {media.fallbackReason} You're using a simulated camera, so you can still try every
            feature.
          </Alert>
        )}

        {recordedVideo ? (
          <RecordedPitchPlayback
            pitchVideo={recordedVideo}
            isLocked={session.isLocked}
            onRetake={actions.requestRetake}
          />
        ) : (
          <>
            <DeviceSelectors
              cameras={devices.cameras}
              microphones={devices.microphones}
              cameraId={deviceSelection.cameraId}
              microphoneId={deviceSelection.microphoneId}
              isDisabled={session.isLocked || media.status === 'simulated'}
              onCameraChange={deviceSelection.setCameraId}
              onMicrophoneChange={deviceSelection.setMicrophoneId}
            />
            <CameraViewfinder
              stream={media.stream}
              streamStatus={media.status}
              recorderStatus={recorder.status}
              isMaskEnabled={isMaskEnabled}
              countdownSeconds={countdown.remainingSeconds}
            />
            <RecordingControls
              recorderStatus={recorder.status}
              isCountingDown={countdown.remainingSeconds !== null}
              isReady={session.isReady && isMediaRecorderSupported()}
              elapsedSeconds={recorder.elapsedSeconds}
              maxSeconds={MANUSCRIPT_SESSION.maxDurationSeconds}
              warningSeconds={WARNING_THRESHOLD_SECONDS}
              audioLevel={session.audioLevel}
              onStart={actions.startRecording}
              onPause={actions.pauseRecording}
              onResume={actions.resumeRecording}
              onStop={actions.stopRecording}
              onRetake={actions.requestRetake}
            />
          </>
        )}
      </Card>

      {!recordedVideo && <TeleprompterOverlay />}

      {session.isRetakeDialogOpen && (
        <ConfirmDialog
          title="Discard this take?"
          description="Your current recording will be deleted and you can start again."
          confirmLabel="Discard and retake"
          cancelLabel="Keep this take"
          onConfirm={actions.confirmRetake}
          onCancel={actions.cancelRetake}
        />
      )}
    </div>
  )
}
