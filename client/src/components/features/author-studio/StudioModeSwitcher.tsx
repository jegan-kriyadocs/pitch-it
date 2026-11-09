import { Upload, Video } from 'lucide-react'

import type { StudioMode } from '@/types/authorStudio'
import { SegmentedControl } from '@/ui/SegmentedControl'
import { isStudioLocked } from './authorStudioRules'
import { useAuthorStudioStore } from './authorStudioStore'

const MODE_OPTIONS = [
  { value: 'live_record', label: 'Live camera studio', icon: Video },
  { value: 'upload_video', label: 'Upload video', icon: Upload },
] as const

export function StudioModeSwitcher() {
  const mode = useAuthorStudioStore((state) => state.mode)
  const recordingState = useAuthorStudioStore((state) => state.recordingState)
  const setMode = useAuthorStudioStore((state) => state.setMode)

  return (
    <SegmentedControl<StudioMode>
      label="How do you want to create your pitch?"
      options={MODE_OPTIONS}
      value={mode}
      isDisabled={isStudioLocked(recordingState)}
      onChange={setMode}
    />
  )
}
