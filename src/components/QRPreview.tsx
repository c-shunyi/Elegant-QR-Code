import { useRef } from 'react'
import type { FileExtension } from 'qr-code-styling'
import { useQRCode } from '../hooks/useQRCode'
import { composeWithBackground, downloadBlob } from '../lib/compose'
import type { QRStyle } from '../types'

type Props = { style: QRStyle }

const PREVIEW_SIZE = 320
const EXPORT_SIZE = 720

// 二维码预览：始终用 qr-code-styling 渲染 QR；若设置了 bgImage，就把图片作为容器背景、QR 以透明底叠加其上
export default function QRPreview({ style }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useQRCode(containerRef, style, PREVIEW_SIZE)

  // 下载处理：普通场景走库内置 download；背景图场景下把 QR 转 Blob 再用 Canvas 合成图片再导出
  const handleDownload = async (ext: FileExtension) => {
    const qr = qrRef.current
    if (!qr) return

    if (style.bgImage && ext === 'png') {
      const blob = (await qr.getRawData('png')) as Blob | null
      if (!blob) return
      const composed = await composeWithBackground(
        blob,
        style.bgImage,
        EXPORT_SIZE
      )
      downloadBlob(composed, 'elegant-qr.png')
      return
    }

    if (style.bgImage && ext === 'svg') {
      alert('SVG 导出暂不支持背景图片合成，请使用 PNG 下载。')
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
        <div ref={containerRef} className="absolute inset-0" />
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
