import { useEffect, type RefObject } from 'react'

import { getSharedAudioContext } from '@/lib/audioContext'

const elementSources = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>()

function getElementSource(element: HTMLMediaElement) {
  const existing = elementSources.get(element)
  if (existing) {
    return existing
  }
  const source = getSharedAudioContext().createMediaElementSource(element)
  elementSources.set(element, source)
  return source
}

function connectDisguiseChain(audioContext: AudioContext, source: AudioNode) {
  const lowShelf = new BiquadFilterNode(audioContext, { type: 'lowshelf', frequency: 260, gain: 7 })
  const highShelf = new BiquadFilterNode(audioContext, { type: 'highshelf', frequency: 2200, gain: -14 })
  const ringModulator = new GainNode(audioContext, { gain: 0 })
  const carrier = new OscillatorNode(audioContext, { frequency: 48 })
  const wetMix = new GainNode(audioContext, { gain: 0.7 })
  const dryMix = new GainNode(audioContext, { gain: 0.45 })

  source.connect(lowShelf).connect(highShelf)
  highShelf.connect(ringModulator).connect(wetMix).connect(audioContext.destination)
  highShelf.connect(dryMix).connect(audioContext.destination)
  carrier.connect(ringModulator.gain)
  carrier.start()

  return () => {
    carrier.stop()
    ;[lowShelf, highShelf, ringModulator, carrier, wetMix, dryMix].forEach((node) => node.disconnect())
  }
}

export function useVoiceModulation(
  mediaRef: RefObject<HTMLMediaElement | null>,
  isEnabled: boolean,
) {
  useEffect(() => {
    const element = mediaRef.current
    if (!element) {
      return
    }
    const audioContext = getSharedAudioContext()
    const source = getElementSource(element)
    const resumeContext = () => void audioContext.resume().catch(() => undefined)
    element.addEventListener('play', resumeContext)

    const disconnectChain = isEnabled ? connectDisguiseChain(audioContext, source) : null
    if (!disconnectChain) {
      source.connect(audioContext.destination)
    }

    return () => {
      element.removeEventListener('play', resumeContext)
      disconnectChain?.()
      source.disconnect()
    }
  }, [mediaRef, isEnabled])
}
