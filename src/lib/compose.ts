export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function composeWithBackground(
  qrBlob: Blob,
  bgImageDataUrl: string,
  size = 640
): Promise<Blob> {
  const qrUrl = URL.createObjectURL(qrBlob)
  try {
    const [qrImg, bgImg] = await Promise.all([
      loadImage(qrUrl),
      loadImage(bgImageDataUrl)
    ])
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bgImg, 0, 0, size, size)
    ctx.drawImage(qrImg, 0, 0, size, size)
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
        'image/png'
      )
    })
  } finally {
    URL.revokeObjectURL(qrUrl)
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
