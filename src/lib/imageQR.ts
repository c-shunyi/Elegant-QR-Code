import qrcode from 'qrcode-generator'
import { loadImage } from './compose'

const FINDER_SIZE = 7

export type DotShape = 'dot' | 'square' | 'rounded'

export type ImageQROptions = {
  url: string
  imageDataUrl: string
  size?: number
  dotScale?: number
  darkColor?: string
  imageAlpha?: number
  shape?: DotShape
}

export async function renderImageQR(
  opts: ImageQROptions
): Promise<HTMLCanvasElement> {
  const size = opts.size ?? 640
  const dotScale = clamp(opts.dotScale ?? 0.6, 0.2, 1)
  const darkColor = opts.darkColor ?? '#111827'
  const imageAlpha = clamp(opts.imageAlpha ?? 0.8, 0.3, 1)
  const shape: DotShape = opts.shape ?? 'dot'

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
  ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh)

  const brighten = 1 - imageAlpha
  if (brighten > 0) {
    ctx.fillStyle = `rgba(255,255,255,${brighten})`
    ctx.fillRect(0, 0, size, size)
  }

  const darkRadius = (cell * dotScale) / 2
  const lightRadius = darkRadius * 0.6

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (isFinderRegion(x, y, count)) continue
      const dark = qr.isDark(y, x)
      const cx = x * cell + cell / 2
      const cy = y * cell + cell / 2

      if (dark) {
        ctx.fillStyle = darkColor
        drawShape(ctx, shape, cx, cy, darkRadius)
      } else {
        ctx.globalAlpha = 0.75
        ctx.fillStyle = '#ffffff'
        drawShape(ctx, shape, cx, cy, lightRadius)
        ctx.globalAlpha = 1
      }
    }
  }

  drawRoundedFinder(ctx, 0, 0, cell, darkColor)
  drawRoundedFinder(ctx, (count - FINDER_SIZE) * cell, 0, cell, darkColor)
  drawRoundedFinder(ctx, 0, (count - FINDER_SIZE) * cell, cell, darkColor)

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

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: DotShape,
  cx: number,
  cy: number,
  r: number
) {
  if (shape === 'dot') {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    return
  }
  const d = r * 2
  const x = cx - r
  const y = cy - r
  if (shape === 'square') {
    ctx.fillRect(x, y, d, d)
    return
  }
  ctx.beginPath()
  roundRectPath(ctx, x, y, d, d, d * 0.3)
  ctx.fill()
}

function drawRoundedFinder(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  cell: number,
  color: string
) {
  const outer = cell * FINDER_SIZE
  const inner = cell * 5
  const center = cell * 3

  ctx.fillStyle = color
  ctx.beginPath()
  roundRectPath(ctx, ox, oy, outer, outer, cell * 1.5)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  roundRectPath(ctx, ox + cell, oy + cell, inner, inner, cell * 1)
  ctx.fill()

  ctx.fillStyle = color
  ctx.beginPath()
  roundRectPath(ctx, ox + 2 * cell, oy + 2 * cell, center, center, cell * 0.6)
  ctx.fill()
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function isFinderRegion(x: number, y: number, count: number): boolean {
  return (
    (x < FINDER_SIZE && y < FINDER_SIZE) ||
    (x >= count - FINDER_SIZE && y < FINDER_SIZE) ||
    (x < FINDER_SIZE && y >= count - FINDER_SIZE)
  )
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v))
}
