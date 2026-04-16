// 将任意图片 URL / DataURL 异步加载为 HTMLImageElement，启用跨域以便后续绘制到 canvas 并能导出
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

type ComposeOptions = {
  bgImage?: string
  bgColor?: string
  opacity?: number
  size?: number
}

// 将二维码 Blob 合成到指定背景上（图片 / 纯色 / 透明），并以指定透明度绘制 QR，输出 PNG Blob
export async function composeQR(
  qrBlob: Blob,
  options: ComposeOptions = {}
): Promise<Blob> {
  const { bgImage, bgColor, opacity = 1, size = 640 } = options
  const qrUrl = URL.createObjectURL(qrBlob)
  try {
    const qrImg = await loadImage(qrUrl)
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no 2d context')

    if (bgImage) {
      const bgImg = await loadImage(bgImage)
      ctx.drawImage(bgImg, 0, 0, size, size)
    } else if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)
    }

    ctx.globalAlpha = opacity
    ctx.drawImage(qrImg, 0, 0, size, size)
    ctx.globalAlpha = 1

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

// 触发浏览器下载：把 Blob 包装为临时 URL 并模拟点击 a 标签，结束后立即释放对象 URL 避免内存泄漏
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
