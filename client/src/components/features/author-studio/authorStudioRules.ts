import type { RecordingState } from '@/types/authorStudio'
import type { BadgeVariant } from '@/ui/Badge'
import {
  ACCEPTED_VIDEO_TYPES,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_DURATION_SECONDS,
} from './authorStudioData'

const CAPTURE_STATES: RecordingState[] = ['countdown', 'recording', 'paused']
const MIN_RECOMMENDED_HEIGHT = 720

export function isCaptureInProgress(recordingState: RecordingState) {
  return CAPTURE_STATES.includes(recordingState)
}

export function isStudioBusy(recordingState: RecordingState) {
  return isCaptureInProgress(recordingState) || recordingState === 'uploading'
}

export function isStudioLocked(recordingState: RecordingState) {
  return isStudioBusy(recordingState) || recordingState === 'success'
}

export interface PaceFeedback {
  label: string
  variant: BadgeVariant
}

export function getPaceFeedback(wordsPerMinute: number): PaceFeedback {
  if (wordsPerMinute >= 170) {
    return { label: 'Pacing fast', variant: 'warning' }
  }
  if (wordsPerMinute <= 110) {
    return { label: 'Pacing slow', variant: 'danger' }
  }
  if (wordsPerMinute >= 130 && wordsPerMinute <= 150) {
    return { label: 'Ideal pace', variant: 'success' }
  }
  return { label: 'Comfortable pace', variant: 'info' }
}

export function validateVideoFile(file: File) {
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    return 'Choose an MP4, WebM or MOV video.'
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'This video is larger than 200 MB. Export a shorter or lower-bitrate version.'
  }
  return null
}

export function getVideoWarnings(durationSeconds: number, height: number) {
  const warnings: string[] = []
  if (durationSeconds > MAX_UPLOAD_DURATION_SECONDS) {
    warnings.push('This video is longer than 4 minutes. Editors expect a 2–3 minute pitch.')
  }
  if (height > 0 && height < MIN_RECOMMENDED_HEIGHT) {
    warnings.push(`Resolution is ${height}p. 720p or higher is recommended.`)
  }
  return warnings
}
