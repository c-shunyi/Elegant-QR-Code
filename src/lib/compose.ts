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

// 将二维码 Blob 叠加到背景图上，生成一张最终的 PNG Blob；用于带背景图导出场景
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

// 触发浏览器下载：把 Blob 包装为临时 URL 并模拟点击 a 标签，结束后立即释放对象 URL 避免内存泄漏
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
