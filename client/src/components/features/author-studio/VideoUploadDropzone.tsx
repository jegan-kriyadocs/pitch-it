import { FileVideo, FolderOpen, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { cn } from '@/lib/cn'
import { formatClock, formatFileSize } from '@/lib/formatTime'
import { Alert } from '@/ui/Alert'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { isStudioLocked } from './authorStudioRules'
import { useAuthorStudioStore } from './authorStudioStore'
import { useVideoUpload } from './useVideoUpload'

const ACCEPT = '.mp4,.webm,.mov,video/mp4,video/webm,video/quicktime'

export function VideoUploadDropzone() {
  const pitchVideo = useAuthorStudioStore((state) => state.pitchVideo)
  const recordingState = useAuthorStudioStore((state) => state.recordingState)
  const { errorMessage, warnings, isReading, selectFile, removeVideo } = useVideoUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const uploadedVideo = pitchVideo?.source === 'upload_video' ? pitchVideo : null
  const isLocked = isStudioLocked(recordingState)

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      className="hidden"
      tabIndex={-1}
      aria-hidden
      onChange={(event) => {
        void selectFile(event.target.files?.[0])
        event.target.value = ''
      }}
    />
  )

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-5">
      {uploadedVideo ? (
        <>
          <video
            src={uploadedVideo.url}
            controls
            playsInline
            aria-label="Uploaded pitch video"
            className="aspect-video w-full rounded-lg bg-gray-900"
          />
          <div className="flex flex-wrap items-center gap-3">
            <FileVideo size={18} aria-hidden className="text-brand-600" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-heading">{uploadedVideo.fileName}</span>
              <span className="text-[13px] text-muted">
                {formatClock(uploadedVideo.durationSeconds)} · {formatFileSize(uploadedVideo.blob.size)}
              </span>
            </div>
            <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()} disabled={isLocked}>
              <FolderOpen aria-hidden />
              Replace
            </Button>
            <Button variant="ghost" size="sm" onClick={removeVideo} disabled={isLocked}>
              <Trash2 aria-hidden />
              Remove
            </Button>
          </div>
          <p className="text-[13px] text-body">
            Play the video and step through the slides on the left to check they line up.
          </p>
        </>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            void selectFile(event.dataTransfer.files[0])
          }}
          className={cn(
            'flex flex-col items-center gap-3 rounded-xl border-[1.5px] border-dashed px-5 py-10 text-center transition-colors',
            isDragging ? 'border-brand-600 bg-brand-50' : 'border-gray-300 bg-white',
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Upload size={22} aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-heading">
              Drag and drop your pitch video
            </span>
            <span className="text-[13px] text-body">
              Made with Google Vids, PowerPoint or Canva · MP4, WebM or MOV up to 200 MB
            </span>
          </div>
          <Button variant="secondary" onClick={() => inputRef.current?.click()} isLoading={isReading}>
            {!isReading && <FolderOpen aria-hidden />}
            {isReading ? 'Checking video…' : 'Browse files'}
          </Button>
        </div>
      )}
      {fileInput}
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
      {uploadedVideo &&
        warnings.map((warning) => (
          <Alert key={warning} variant="warning">
            {warning}
          </Alert>
        ))}
    </Card>
  )
}
