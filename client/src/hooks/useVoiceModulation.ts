import { useEffect, useState, type RefObject } from 'react'

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

function connectDisguiseChain(audioContext: AudioContext, source: AudioNode, output: AudioNode) {
  const lowShelf = new BiquadFilterNode(audioContext, { type: 'lowshelf', frequency: 260, gain: 7 })
  const highShelf = new BiquadFilterNode(audioContext, { type: 'highshelf', frequency: 2200, gain: -14 })
  const ringModulator = new GainNode(audioContext, { gain: 0 })
  const carrier = new OscillatorNode(audioContext, { frequency: 48 })
  const wetMix = new GainNode(audioContext, { gain: 0.7 })
  const dryMix = new GainNode(audioContext, { gain: 0.45 })

  source.connect(lowShelf).connect(highShelf)
  highShelf.connect(ringModulator).connect(wetMix).connect(output)
  highShelf.connect(dryMix).connect(output)
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
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)

  useEffect(() => {
    const element = mediaRef.current
    if (!element) {
      return
    }
    const audioContext = getSharedAudioContext()
    const source = getElementSource(element)
    const outputAnalyser = new AnalyserNode(audioContext, { fftSize: 1024 })
    outputAnalyser.connect(audioContext.destination)
    const resumeContext = () => void audioContext.resume().catch(() => undefined)
    element.addEventListener('play', resumeContext)

    const disconnectChain = isEnabled ? connectDisguiseChain(audioContext, source, outputAnalyser) : null
    if (!disconnectChain) {
      source.connect(outputAnalyser)
    }
    setAnalyser(outputAnalyser)

    return () => {
      element.removeEventListener('play', resumeContext)
      disconnectChain?.()
      source.disconnect()
      outputAnalyser.disconnect()
    }
  }, [mediaRef, isEnabled])

  return analyser
}
