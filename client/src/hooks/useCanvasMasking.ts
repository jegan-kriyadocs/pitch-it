import { useEffect, useRef, type RefObject } from 'react'

const PIXEL_BLOCK_SIZE = 28
const SILHOUETTE_COLOR = 'rgba(42, 14, 74, 0.88)'

function drawSilhouette(context: CanvasRenderingContext2D, width: number, height: number) {
  context.fillStyle = 'rgba(255, 255, 255, 0.12)'
  context.fillRect(0, 0, width, height)
  context.fillStyle = SILHOUETTE_COLOR
  context.beginPath()
  context.ellipse(width / 2, height * 0.42, height * 0.17, height * 0.21, 0, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(width / 2, height * 1.02, width * 0.26, height * 0.36, 0, 0, Math.PI * 2)
  context.fill()
}

function drawPixelated(
  context: CanvasRenderingContext2D,
  scratch: HTMLCanvasElement,
  video: HTMLVideoElement,
  width: number,
  height: number,
) {
  scratch.width = Math.max(1, Math.round(width / PIXEL_BLOCK_SIZE))
  scratch.height = Math.max(1, Math.round(height / PIXEL_BLOCK_SIZE))
  scratch.getContext('2d')?.drawImage(video, 0, 0, scratch.width, scratch.height)
  context.imageSmoothingEnabled = false
  context.drawImage(scratch, 0, 0, width, height)
  context.imageSmoothingEnabled = true
}

export function useCanvasMasking(
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  isMaskEnabled: boolean,
) {
  const isMaskEnabledRef = useRef(isMaskEnabled)

  useEffect(() => {
    isMaskEnabledRef.current = isMaskEnabled
  }, [isMaskEnabled])

  useEffect(() => {
    const scratch = document.createElement('canvas')
    let frameId = 0

    const render = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (video && canvas && context && video.videoWidth > 0) {
        const { videoWidth: width, videoHeight: height } = video
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }
        if (isMaskEnabledRef.current) {
          drawPixelated(context, scratch, video, width, height)
          drawSilhouette(context, width, height)
        } else {
          context.drawImage(video, 0, 0, width, height)
        }
      }
      frameId = requestAnimationFrame(render)
    }
    frameId = requestAnimationFrame(render)

    return () => cancelAnimationFrame(frameId)
  }, [videoRef, canvasRef])
}
