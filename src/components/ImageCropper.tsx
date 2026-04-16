import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  size?: number
  outputSize?: number
  onCropChange: (dataUrl: string) => void
}

export default function ImageCropper({
  src,
  size = 240,
  outputSize = 640,
  onCropChange
}: Props) {
  const [natural, setNatural] = useState({ w: 0, h: 0 })
  const [fitScale, setFitScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{
    x: number
    y: number
    px: number
    py: number
  } | null>(null)
  const [dragging, setDragging] = useState(false)

  const effectiveScale = fitScale * zoom
  const displayW = natural.w * effectiveScale
  const displayH = natural.h * effectiveScale
  const left = (size - displayW) / 2 + pan.x
  const top = (size - displayH) / 2 + pan.y

  const clampPan = useCallback(
    (p: { x: number; y: number }) => {
      const maxX = Math.max(0, (displayW - size) / 2)
      const maxY = Math.max(0, (displayH - size) / 2)
      return {
        x: Math.min(maxX, Math.max(-maxX, p.x)),
        y: Math.min(maxY, Math.max(-maxY, p.y))
      }
    },
    [displayW, displayH, size]
  )

  useEffect(() => {
    setPan((p) => clampPan(p))
  }, [clampPan])

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const w = img.naturalWidth
    const h = img.naturalHeight
    setNatural({ w, h })
    setFitScale(Math.max(size / w, size / h))
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    setPan(
      clampPan({
        x: dragRef.current.px + (e.clientX - dragRef.current.x),
        y: dragRef.current.py + (e.clientY - dragRef.current.y)
      })
    )
  }
  const onPointerUp = () => {
    dragRef.current = null
    setDragging(false)
  }

  useEffect(() => {
    if (!natural.w || !src) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = outputSize
      canvas.height = outputSize
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const ratio = outputSize / size
      ctx.drawImage(
        img,
        left * ratio,
        top * ratio,
        displayW * ratio,
        displayH * ratio
      )
      onCropChange(canvas.toDataURL('image/png'))
    }
    img.src = src
  }, [
    src,
    zoom,
    pan,
    fitScale,
    natural,
    size,
    outputSize,
    left,
    top,
    displayW,
    displayH,
    onCropChange
  ])

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-lg border-2 border-dashed border-violet-300 bg-gray-100 select-none touch-none mx-auto"
        style={{
          width: size,
          height: size,
          cursor: dragging ? 'grabbing' : 'grab'
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={src}
          onLoad={handleImgLoad}
          draggable={false}
          alt="crop source"
          style={{
            position: 'absolute',
            left,
            top,
            width: displayW || 'auto',
            height: displayH || 'auto',
            maxWidth: 'none',
            pointerEvents: 'none'
          }}
        />
        <div className="absolute inset-0 pointer-events-none border border-white/60 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]" />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-gray-500 w-12">缩放</span>
        <input
          type="range"
          min={1}
          max={4}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-xs text-gray-500 w-10 text-right">
          {zoom.toFixed(1)}x
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1 text-center">
        拖动图片调整位置，正方形框内即最终二维码区域
      </p>
    </div>
  )
}
