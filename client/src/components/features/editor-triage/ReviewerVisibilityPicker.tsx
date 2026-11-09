import { EyeOff, Lock, Video } from 'lucide-react'

import type { ReviewerVideoAccess } from '@/types/editorTriage'
import { RadioCardGroup } from '@/ui/RadioCardGroup'

export const VIDEO_ACCESS_OPTIONS = [
  {
    value: 'anonymized_stream_only',
    label: 'Anonymized video only',
    description: 'Strict double-blind: face masked and voice disguised.',
    icon: EyeOff,
  },
  {
    value: 'full_video',
    label: 'Full video and slides',
    description: 'Single-blind or open review: reviewers see the author.',
    icon: Video,
  },
  {
    value: 'no_video',
    label: 'Don’t share the video',
    description: 'Editor-only triage. Reviewers get the manuscript only.',
    icon: Lock,
  },
] as const

export function getVideoAccessLabel(access: ReviewerVideoAccess) {
  return VIDEO_ACCESS_OPTIONS.find((option) => option.value === access)?.label ?? access
}

interface ReviewerVisibilityPickerProps {
  value: ReviewerVideoAccess
  onChange: (value: ReviewerVideoAccess) => void
}

export function ReviewerVisibilityPicker({ value, onChange }: ReviewerVisibilityPickerProps) {
  return (
    <RadioCardGroup<ReviewerVideoAccess>
      legend="What should reviewers see?"
      options={VIDEO_ACCESS_OPTIONS}
      value={value}
      onChange={onChange}
    />
  )
}
