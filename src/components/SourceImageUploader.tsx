import { useState } from 'react'
import Field from './ui/Field'
import ImageCropper from './ImageCropper'
import type { QRStyle } from '../types'

type Shape = QRStyle['imageDotShape']

const shapes: { value: Shape; label: string }[] = [
  { value: 'dot', label: '圆点' },
  { value: 'rounded', label: '圆角方' },
  { value: 'square', label: '方块' }
]

type Props = {
  sourceImage: string
  dotScale: number
  imageAlpha: number
  dotShape: Shape
  onImageChange: (dataUrl: string) => void
  onDotScaleChange: (v: number) => void
  onImageAlphaChange: (v: number) => void
  onDotShapeChange: (v: Shape) => void
}

export default function SourceImageUploader({
  sourceImage,
  dotScale,
  imageAlpha,
  dotShape,
  onImageChange,
  onDotScaleChange,
  onImageAlphaChange,
  onDotShapeChange
}: Props) {
  const [rawImage, setRawImage] = useState('')

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setRawImage(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleClear = () => {
    setRawImage('')
    onImageChange('')
  }

  return (
    <Field label="图片 → 二维码（图片本身就是码）">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="px-4 py-2 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 cursor-pointer transition">
            {rawImage || sourceImage ? '更换图片' : '选择图片'}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
          {(rawImage || sourceImage) && (
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              清除
            </button>
          )}
          {sourceImage && !rawImage && (
            <img
              src={sourceImage}
              alt="source preview"
              className="w-10 h-10 rounded object-cover border"
            />
          )}
        </div>

        {rawImage && (
          <ImageCropper
            src={rawImage}
            size={240}
            onCropChange={onImageChange}
          />
        )}

        {(rawImage || sourceImage) && (
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              {shapes.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onDotShapeChange(s.value)}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition ${
                    dotShape === s.value
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Slider
              label="码点大小"
              value={dotScale}
              min={0.3}
              max={1}
              onChange={onDotScaleChange}
            />
            <Slider
              label="图片浓度"
              value={imageAlpha}
              min={0.3}
              max={1}
              onChange={onImageAlphaChange}
            />
            <p className="text-xs text-gray-400 leading-relaxed">
              码点越小图片越清晰，过小会影响扫码。
              图片浓度越低、QR 越清晰。
            </p>
          </div>
        )}
      </div>
    </Field>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  onChange
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-20">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
      />
      <span className="text-xs text-gray-500 w-10 text-right">
        {Math.round(value * 100)}%
      </span>
    </div>
  )
}
