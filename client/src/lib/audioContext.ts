let sharedAudioContext: AudioContext | null = null

export function getSharedAudioContext() {
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new AudioContext()
  }
  if (sharedAudioContext.state === 'suspended') {
    void sharedAudioContext.resume().catch(() => undefined)
  }
  return sharedAudioContext
}
