import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VideoUploadDropzone } from '@/features/author-studio/VideoUploadDropzone'

describe('VideoUploadDropzone', () => {
  it('shows an error when a non-video file is dropped', async () => {
    const { container } = render(<VideoUploadDropzone />)
    const dropzone = container.querySelector('.border-dashed')
    const file = new File(['%PDF'], 'manuscript.pdf', { type: 'application/pdf' })

    fireEvent.drop(dropzone as Element, { dataTransfer: { files: [file] } })

    expect(await screen.findByRole('alert')).toHaveTextContent('Choose an MP4, WebM or MOV video.')
  })

  it('offers a browse button', () => {
    render(<VideoUploadDropzone />)

    expect(screen.getByRole('button', { name: /browse files/i })).toBeEnabled()
  })
})

