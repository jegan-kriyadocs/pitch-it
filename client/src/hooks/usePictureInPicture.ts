import { useEffect, useRef, useState, type RefObject } from 'react'

const FRAME_RATE = 30

export function isPictureInPictureSupported() {
  return (
    typeof document !== 'undefined' &&
    'pictureInPictureEnabled' in document &&
    document.pictureInPictureEnabled &&
    typeof HTMLCanvasElement.prototype.captureStream === 'function'
  )
}

export function usePictureInPicture(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const [isActive, setIsActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  function stopStream() {
    const stream = videoRef.current?.srcObject
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    videoRef.current = null
    setIsActive(false)
  }

  useEffect(() => {
    return () => {
      if (document.pictureInPictureElement && document.pictureInPictureElement === videoRef.current) {
        void document.exitPictureInPicture().catch(() => undefined)
      }
      const stream = videoRef.current?.srcObject
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  async function toggle() {
    if (isActive) {
      await document.exitPictureInPicture().catch(() => undefined)
      return
    }
    const canvas = canvasRef.current
    if (!canvas || !isPictureInPictureSupported()) {
      return
    }
    const video = document.createElement('video')
    video.muted = true
    video.srcObject = canvas.captureStream(FRAME_RATE)
    video.addEventListener('leavepictureinpicture', stopStream, { once: true })
    videoRef.current = video
    try {
      await video.play()
      await video.requestPictureInPicture()
      setIsActive(true)
    } catch {
      stopStream()
    }
  }

  return { isActive, isSupported: isPictureInPictureSupported(), toggle }
}
