import qrcode from 'qrcode-generator'
import { loadImage } from './compose'

const FINDER_SIZE = 7

export type ImageQROptions = {
  url: string
  imageDataUrl: string
  size?: number
  dotScale?: number
  darkColor?: string
  lightColor?: string
  imageAlpha?: number
}

export async function renderImageQR(
  opts: ImageQROptions
): Promise<HTMLCanvasElement> {
  const size = opts.size ?? 640
  const dotScale = clamp(opts.dotScale ?? 0.5, 0.1, 1)
  const darkColor = opts.darkColor ?? '#000000'
  const lightColor = opts.lightColor ?? '#ffffff'
  const imageAlpha = clamp(opts.imageAlpha ?? 1, 0, 1)

  const qr = qrcode(0, 'H')
  qr.addData(opts.url || ' ')
  qr.make()
  const count = qr.getModuleCount()
  const cell = size / count

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('no 2d context')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  const img = await loadImage(opts.imageDataUrl)
  const scale = Math.max(size / img.width, size / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  ctx.globalAlpha = imageAlpha
  ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh)
  ctx.globalAlpha = 1

  const dotRadius = (cell * dotScale) / 2

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      const dark = qr.isDark(y, x)
      const finder = inFinderPattern(x, y, count)
      const color = dark ? darkColor : lightColor

      if (finder) {
        ctx.fillStyle = color
        ctx.fillRect(x * cell, y * cell, cell, cell)
      } else {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(
          x * cell + cell / 2,
          y * cell + cell / 2,
          dotRadius,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    }
  }

  return canvas
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
      'image/png'
    )
  })
}

function inFinderPattern(x: number, y: number, count: number): boolean {
  return (
    (x < FINDER_SIZE && y < FINDER_SIZE) ||
    (x >= count - FINDER_SIZE && y < FINDER_SIZE) ||
    (x < FINDER_SIZE && y >= count - FINDER_SIZE)
  )
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v))
}
