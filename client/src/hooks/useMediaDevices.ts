import { useEffect, useState } from 'react'

export interface MediaDeviceOption {
  value: string
  label: string
}

interface MediaDeviceLists {
  cameras: MediaDeviceOption[]
  microphones: MediaDeviceOption[]
}

const EMPTY_LISTS: MediaDeviceLists = { cameras: [], microphones: [] }

function toOptions(devices: MediaDeviceInfo[], kind: MediaDeviceKind, fallbackLabel: string) {
  return devices
    .filter((device) => device.kind === kind && device.deviceId)
    .map((device, index) => ({
      value: device.deviceId,
      label: device.label || `${fallbackLabel} ${index + 1}`,
    }))
}

export function useMediaDevices(refreshKey: unknown) {
  const [lists, setLists] = useState<MediaDeviceLists>(EMPTY_LISTS)

  useEffect(() => {
    const mediaDevices = navigator.mediaDevices
    if (!mediaDevices?.enumerateDevices) {
      return
    }
    let isActive = true

    async function loadDevices() {
      const devices = await mediaDevices.enumerateDevices()
      if (isActive) {
        setLists({
          cameras: toOptions(devices, 'videoinput', 'Camera'),
          microphones: toOptions(devices, 'audioinput', 'Microphone'),
        })
      }
    }

    void loadDevices()
    mediaDevices.addEventListener('devicechange', loadDevices)
    return () => {
      isActive = false
      mediaDevices.removeEventListener('devicechange', loadDevices)
    }
  }, [refreshKey])

  return lists
}
