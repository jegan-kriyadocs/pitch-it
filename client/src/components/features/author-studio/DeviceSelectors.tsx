import type { MediaDeviceOption } from '@/hooks/useMediaDevices'
import { SelectField } from '@/ui/SelectField'

interface DeviceSelectorsProps {
  cameras: MediaDeviceOption[]
  microphones: MediaDeviceOption[]
  cameraId: string
  microphoneId: string
  isDisabled: boolean
  onCameraChange: (cameraId: string) => void
  onMicrophoneChange: (microphoneId: string) => void
}

const DEFAULT_OPTION = { value: '', label: 'Default' }

export function DeviceSelectors({
  cameras,
  microphones,
  cameraId,
  microphoneId,
  isDisabled,
  onCameraChange,
  onMicrophoneChange,
}: DeviceSelectorsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <SelectField
        label="Camera"
        options={[DEFAULT_OPTION, ...cameras]}
        value={cameraId}
        disabled={isDisabled || cameras.length === 0}
        onChange={(event) => onCameraChange(event.target.value)}
      />
      <SelectField
        label="Mic"
        options={[DEFAULT_OPTION, ...microphones]}
        value={microphoneId}
        disabled={isDisabled || microphones.length === 0}
        onChange={(event) => onMicrophoneChange(event.target.value)}
      />
    </div>
  )
}
