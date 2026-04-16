import { useState } from 'react'
import Field from './ui/Field'
import ImageCropper from './ImageCropper'

type Props = {
  bgImage: string
  onChange: (dataUrl: string) => void
}

// 背景图上传组件：选择图片 → 正方形裁剪 → 作为二维码背景。QR 会以透明底叠加在图片上
export default function BackgroundUploader({ bgImage, onChange }: Props) {
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
    onChange('')
  }

  return (
    <Field label="背景图片（裁剪为正方形）">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="px-4 py-2 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 cursor-pointer transition">
            {rawImage || bgImage ? '更换图片' : '选择图片'}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
          {(rawImage || bgImage) && (
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              移除背景
            </button>
          )}
          {bgImage && !rawImage && (
            <img
              src={bgImage}
              alt="bg preview"
              className="w-10 h-10 rounded object-cover border"
            />
          )}
        </div>
        {rawImage && (
          <ImageCropper src={rawImage} size={240} onCropChange={onChange} />
        )}
      </div>
    </Field>
  )
}
