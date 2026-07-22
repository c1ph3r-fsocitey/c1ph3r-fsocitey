import { createClient } from '@/lib/supabase/client'

const MAX_DIMENSION = 2000 // px
const QUALITY       = 0.85
const MAX_BYTES     = 4 * 1024 * 1024 // 4 MB hard limit before sending

/**
 * Compress and resize an image using the Canvas API.
 * Keeps aspect ratio, caps longest side at MAX_DIMENSION, outputs JPEG.
 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIMENSION)
          width  = MAX_DIMENSION
        } else {
          width  = Math.round((width / height) * MAX_DIMENSION)
          height = MAX_DIMENSION
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        blob => {
          if (!blob) { reject(new Error('Compression failed')); return }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
          })
          resolve(compressed)
        },
        'image/jpeg',
        QUALITY,
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not load image')) }
    img.src = url
  })
}

/**
 * Upload a file to Supabase storage via the server-side API route.
 * Automatically compresses images that are too large.
 * Returns the public URL on success, throws on failure.
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('Not authenticated')

  // Compress if it's an image and over the size limit
  let toUpload = file
  if (file.type.startsWith('image/') && file.size > MAX_BYTES) {
    toUpload = await compressImage(file)
  }

  const formData = new FormData()
  formData.append('file', toUpload)
  formData.append('folder', folder)

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` },
    body: formData,
  })

  // Handle non-JSON responses (e.g. 413 Request Entity Too Large from Vercel)
  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      res.status === 413
        ? 'File is too large even after compression. Please use an image under 4 MB.'
        : `Upload failed (HTTP ${res.status})`
    )
  }

  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Upload failed')
  return json.url
}
