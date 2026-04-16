import { useEffect, useRef } from 'react'
import type { FileExtension } from 'qr-code-styling'
import { useQRCode } from '../hooks/useQRCode'
import { canvasToBlob, renderImageQR } from '../lib/imageQR'
import { downloadBlob } from '../lib/compose'
import type { QRStyle } from '../types'

type Props = { style: QRStyle }

const PREVIEW_SIZE = 320
const EXPORT_SIZE = 720

export default function QRPreview({ style }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
      {style.sourceImage ? (
        <ImageQRView style={style} />
      ) : (
        <StyledQRView style={style} />
      )}
      <p className="text-xs text-gray-400 mt-4 text-center">
        默认 H 级纠错。请用手机试扫确认可读性。
      </p>
    </div>
  )
}

function StyledQRView({ style }: { style: QRStyle }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useQRCode(containerRef, style, PREVIEW_SIZE)

  const handleDownload = (ext: FileExtension) => {
    qrRef.current?.download({ name: 'elegant-qr', extension: ext })
  }

  return (
    <>
      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden"
        style={{
          width: PREVIEW_SIZE,
          height: PREVIEW_SIZE,
          backgroundImage: style.transparentBg
            ? 'linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)'
            : undefined,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
        }}
      />
      <DownloadButtons
        onPng={() => handleDownload('png')}
        onSvg={() => handleDownload('svg')}
      />
    </>
  )
}

function ImageQRView({ style }: { style: QRStyle }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false
    renderImageQR({
      url: style.url,
      imageDataUrl: style.sourceImage,
      size: PREVIEW_SIZE,
      dotScale: style.imageDotScale,
      imageAlpha: style.imageAlpha,
      darkColor: style.dotColor,
      shape: style.imageDotShape
    }).then((c) => {
      if (cancelled || !canvasRef.current) return
      const dest = canvasRef.current
      dest.width = c.width
      dest.height = c.height
      const ctx = dest.getContext('2d')
      ctx?.drawImage(c, 0, 0)
    })
    return () => {
      cancelled = true
    }
  }, [style])

  const handlePng = async () => {
    const canvas = await renderImageQR({
      url: style.url,
      imageDataUrl: style.sourceImage,
      size: EXPORT_SIZE,
      dotScale: style.imageDotScale,
      imageAlpha: style.imageAlpha,
      darkColor: style.dotColor,
      shape: style.imageDotShape
    })
    const blob = await canvasToBlob(canvas)
    downloadBlob(blob, 'elegant-qr.png')
  }

  const handleSvg = () => {
    alert('图片二维码模式下仅支持 PNG 导出。')
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={PREVIEW_SIZE}
        height={PREVIEW_SIZE}
        className="rounded-xl"
        style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
      />
      <DownloadButtons onPng={handlePng} onSvg={handleSvg} />
    </>
  )
}

function DownloadButtons({
  onPng,
  onSvg
}: {
  onPng: () => void
  onSvg: () => void
}) {
  return (
    <div className="mt-6 w-full grid grid-cols-2 gap-3">
      <button
        onClick={onPng}
        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 text-white font-medium shadow hover:shadow-lg transition"
      >
        下载 PNG
      </button>
      <button
        onClick={onSvg}
        className="px-4 py-2.5 rounded-lg bg-gray-900 text-white font-medium shadow hover:shadow-lg transition"
      >
        下载 SVG
      </button>
    </div>
  )
}
