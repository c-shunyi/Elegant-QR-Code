import { useRef } from 'react'
import type { FileExtension } from 'qr-code-styling'
import { useQRCode } from '../hooks/useQRCode'
import { composeQR, downloadBlob } from '../lib/compose'
import type { QRStyle } from '../types'

type Props = { style: QRStyle }

const PREVIEW_SIZE = 320
const EXPORT_SIZE = 720

// 二维码预览：始终用 qr-code-styling 渲染 QR；若设置了 bgImage，就把图片作为容器背景、QR 以透明底叠加其上；
// qrOpacity 通过预览层 CSS opacity + 下载时 Canvas 合成 / SVG opacity 属性双路径实现
export default function QRPreview({ style }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useQRCode(containerRef, style, PREVIEW_SIZE)

  // 是否需要走自定义合成路径：存在背景图 或 透明度 < 1（纯图导出都能直接用库内置下载）
  const needCompose = Boolean(style.bgImage) || style.qrOpacity < 1

  const handleDownload = async (ext: FileExtension) => {
    const qr = qrRef.current
    if (!qr) return

    if (ext === 'png' && needCompose) {
      const blob = (await qr.getRawData('png')) as Blob | null
      if (!blob) return
      const composed = await composeQR(blob, {
        bgImage: style.bgImage || undefined,
        bgColor: style.transparentBg ? undefined : style.bgColor,
        opacity: style.qrOpacity,
        size: EXPORT_SIZE
      })
      downloadBlob(composed, 'elegant-qr.png')
      return
    }

    if (ext === 'svg' && style.bgImage) {
      alert('SVG 导出暂不支持背景图片合成，请使用 PNG 下载。')
      return
    }

    if (ext === 'svg' && style.qrOpacity < 1) {
      const blob = (await qr.getRawData('svg')) as Blob | null
      if (!blob) return
      const text = await blob.text()
      const patched = text.replace(
        /<svg\b/,
        `<svg opacity="${style.qrOpacity}"`
      )
      downloadBlob(
        new Blob([patched], { type: 'image/svg+xml' }),
        'elegant-qr.svg'
      )
      return
    }

    qr.download({ name: 'elegant-qr', extension: ext })
  }

  const checker = style.transparentBg && !style.bgImage
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          width: PREVIEW_SIZE,
          height: PREVIEW_SIZE,
          backgroundImage: style.bgImage
            ? `url(${style.bgImage})`
            : checker
              ? 'linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)'
              : undefined,
          backgroundSize: style.bgImage ? 'cover' : '16px 16px',
          backgroundPosition: style.bgImage
            ? 'center'
            : '0 0, 0 8px, 8px -8px, -8px 0px'
        }}
      >
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{ opacity: style.qrOpacity }}
        />
      </div>
      <div className="mt-6 w-full grid grid-cols-2 gap-3">
        <button
          onClick={() => handleDownload('png')}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 text-white font-medium shadow hover:shadow-lg transition"
        >
          下载 PNG
        </button>
        <button
          onClick={() => handleDownload('svg')}
          className="px-4 py-2.5 rounded-lg bg-gray-900 text-white font-medium shadow hover:shadow-lg transition"
        >
          下载 SVG
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        默认 H 级纠错，带 Logo / 背景图也可稳定扫码
      </p>
    </div>
  )
}
