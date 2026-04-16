import { useState } from 'react'
import Field from './ui/Field'
import ImageCropper from './ImageCropper'

type Props = {
  sourceImage: string
  dotScale: number
  imageAlpha: number
  onImageChange: (dataUrl: string) => void
  onDotScaleChange: (v: number) => void
  onImageAlphaChange: (v: number) => void
}

export default function SourceImageUploader({
  sourceImage,
  dotScale,
  imageAlpha,
  onImageChange,
  onDotScaleChange,
  onImageAlphaChange
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
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-20">码点大小</span>
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.05}
                value={dotScale}
                onChange={(e) => onDotScaleChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-10 text-right">
                {Math.round(dotScale * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-20">图片浓度</span>
              <input
                type="range"
                min={0.3}
                max={1}
                step={0.05}
                value={imageAlpha}
                onChange={(e) => onImageAlphaChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-10 text-right">
                {Math.round(imageAlpha * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-400">
              码点越小图片越清晰，但过小可能影响扫码。建议 40%–60%。
            </p>
          </div>
        )}
      </div>
    </Field>
  )
}
